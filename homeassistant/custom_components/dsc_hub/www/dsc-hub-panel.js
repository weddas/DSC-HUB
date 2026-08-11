var mg = Object.defineProperty;
var hg = (i, u, o) => u in i ? mg(i, u, { enumerable: !0, configurable: !0, writable: !0, value: o }) : i[u] = o;
var zs = (i, u, o) => hg(i, typeof u != "symbol" ? u + "" : u, o);
var mr = { exports: {} }, li = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var qm;
function pg() {
  if (qm) return li;
  qm = 1;
  var i = Symbol.for("react.transitional.element"), u = Symbol.for("react.fragment");
  function o(r, f, m) {
    var g = null;
    if (m !== void 0 && (g = "" + m), f.key !== void 0 && (g = "" + f.key), "key" in f) {
      m = {};
      for (var y in f)
        y !== "key" && (m[y] = f[y]);
    } else m = f;
    return f = m.ref, {
      $$typeof: i,
      type: r,
      key: g,
      ref: f !== void 0 ? f : null,
      props: m
    };
  }
  return li.Fragment = u, li.jsx = o, li.jsxs = o, li;
}
var Ym;
function vg() {
  return Ym || (Ym = 1, mr.exports = pg()), mr.exports;
}
var c = vg(), hr = { exports: {} }, oe = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Gm;
function gg() {
  if (Gm) return oe;
  Gm = 1;
  var i = Symbol.for("react.transitional.element"), u = Symbol.for("react.portal"), o = Symbol.for("react.fragment"), r = Symbol.for("react.strict_mode"), f = Symbol.for("react.profiler"), m = Symbol.for("react.consumer"), g = Symbol.for("react.context"), y = Symbol.for("react.forward_ref"), v = Symbol.for("react.suspense"), h = Symbol.for("react.memo"), b = Symbol.for("react.lazy"), x = Symbol.for("react.activity"), E = Symbol.iterator;
  function Y(j) {
    return j === null || typeof j != "object" ? null : (j = E && j[E] || j["@@iterator"], typeof j == "function" ? j : null);
  }
  var X = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, B = Object.assign, O = {};
  function Q(j, H, Z) {
    this.props = j, this.context = H, this.refs = O, this.updater = Z || X;
  }
  Q.prototype.isReactComponent = {}, Q.prototype.setState = function(j, H) {
    if (typeof j != "object" && typeof j != "function" && j != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, j, H, "setState");
  }, Q.prototype.forceUpdate = function(j) {
    this.updater.enqueueForceUpdate(this, j, "forceUpdate");
  };
  function K() {
  }
  K.prototype = Q.prototype;
  function q(j, H, Z) {
    this.props = j, this.context = H, this.refs = O, this.updater = Z || X;
  }
  var te = q.prototype = new K();
  te.constructor = q, B(te, Q.prototype), te.isPureReactComponent = !0;
  var ie = Array.isArray;
  function ue() {
  }
  var V = { H: null, A: null, T: null, S: null }, se = Object.prototype.hasOwnProperty;
  function _e(j, H, Z) {
    var G = Z.ref;
    return {
      $$typeof: i,
      type: j,
      key: H,
      ref: G !== void 0 ? G : null,
      props: Z
    };
  }
  function Ne(j, H) {
    return _e(j.type, H, j.props);
  }
  function Te(j) {
    return typeof j == "object" && j !== null && j.$$typeof === i;
  }
  function he(j) {
    var H = { "=": "=0", ":": "=2" };
    return "$" + j.replace(/[=:]/g, function(Z) {
      return H[Z];
    });
  }
  var w = /\/+/g;
  function F(j, H) {
    return typeof j == "object" && j !== null && j.key != null ? he("" + j.key) : H.toString(36);
  }
  function P(j) {
    switch (j.status) {
      case "fulfilled":
        return j.value;
      case "rejected":
        throw j.reason;
      default:
        switch (typeof j.status == "string" ? j.then(ue, ue) : (j.status = "pending", j.then(
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
  function C(j, H, Z, G, ae) {
    var de = typeof j;
    (de === "undefined" || de === "boolean") && (j = null);
    var pe = !1;
    if (j === null) pe = !0;
    else
      switch (de) {
        case "bigint":
        case "string":
        case "number":
          pe = !0;
          break;
        case "object":
          switch (j.$$typeof) {
            case i:
            case u:
              pe = !0;
              break;
            case b:
              return pe = j._init, C(
                pe(j._payload),
                H,
                Z,
                G,
                ae
              );
          }
      }
    if (pe)
      return ae = ae(j), pe = G === "" ? "." + F(j, 0) : G, ie(ae) ? (Z = "", pe != null && (Z = pe.replace(w, "$&/") + "/"), C(ae, H, Z, "", function(Dt) {
        return Dt;
      })) : ae != null && (Te(ae) && (ae = Ne(
        ae,
        Z + (ae.key == null || j && j.key === ae.key ? "" : ("" + ae.key).replace(
          w,
          "$&/"
        ) + "/") + pe
      )), H.push(ae)), 1;
    pe = 0;
    var et = G === "" ? "." : G + ":";
    if (ie(j))
      for (var we = 0; we < j.length; we++)
        G = j[we], de = et + F(G, we), pe += C(
          G,
          H,
          Z,
          de,
          ae
        );
    else if (we = Y(j), typeof we == "function")
      for (j = we.call(j), we = 0; !(G = j.next()).done; )
        G = G.value, de = et + F(G, we++), pe += C(
          G,
          H,
          Z,
          de,
          ae
        );
    else if (de === "object") {
      if (typeof j.then == "function")
        return C(
          P(j),
          H,
          Z,
          G,
          ae
        );
      throw H = String(j), Error(
        "Objects are not valid as a React child (found: " + (H === "[object Object]" ? "object with keys {" + Object.keys(j).join(", ") + "}" : H) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return pe;
  }
  function L(j, H, Z) {
    if (j == null) return j;
    var G = [], ae = 0;
    return C(j, G, "", "", function(de) {
      return H.call(Z, de, ae++);
    }), G;
  }
  function $(j) {
    if (j._status === -1) {
      var H = j._result;
      H = H(), H.then(
        function(Z) {
          (j._status === 0 || j._status === -1) && (j._status = 1, j._result = Z);
        },
        function(Z) {
          (j._status === 0 || j._status === -1) && (j._status = 2, j._result = Z);
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
  }, re = {
    map: L,
    forEach: function(j, H, Z) {
      L(
        j,
        function() {
          H.apply(this, arguments);
        },
        Z
      );
    },
    count: function(j) {
      var H = 0;
      return L(j, function() {
        H++;
      }), H;
    },
    toArray: function(j) {
      return L(j, function(H) {
        return H;
      }) || [];
    },
    only: function(j) {
      if (!Te(j))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return j;
    }
  };
  return oe.Activity = x, oe.Children = re, oe.Component = Q, oe.Fragment = o, oe.Profiler = f, oe.PureComponent = q, oe.StrictMode = r, oe.Suspense = v, oe.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = V, oe.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(j) {
      return V.H.useMemoCache(j);
    }
  }, oe.cache = function(j) {
    return function() {
      return j.apply(null, arguments);
    };
  }, oe.cacheSignal = function() {
    return null;
  }, oe.cloneElement = function(j, H, Z) {
    if (j == null)
      throw Error(
        "The argument must be a React element, but you passed " + j + "."
      );
    var G = B({}, j.props), ae = j.key;
    if (H != null)
      for (de in H.key !== void 0 && (ae = "" + H.key), H)
        !se.call(H, de) || de === "key" || de === "__self" || de === "__source" || de === "ref" && H.ref === void 0 || (G[de] = H[de]);
    var de = arguments.length - 2;
    if (de === 1) G.children = Z;
    else if (1 < de) {
      for (var pe = Array(de), et = 0; et < de; et++)
        pe[et] = arguments[et + 2];
      G.children = pe;
    }
    return _e(j.type, ae, G);
  }, oe.createContext = function(j) {
    return j = {
      $$typeof: g,
      _currentValue: j,
      _currentValue2: j,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, j.Provider = j, j.Consumer = {
      $$typeof: m,
      _context: j
    }, j;
  }, oe.createElement = function(j, H, Z) {
    var G, ae = {}, de = null;
    if (H != null)
      for (G in H.key !== void 0 && (de = "" + H.key), H)
        se.call(H, G) && G !== "key" && G !== "__self" && G !== "__source" && (ae[G] = H[G]);
    var pe = arguments.length - 2;
    if (pe === 1) ae.children = Z;
    else if (1 < pe) {
      for (var et = Array(pe), we = 0; we < pe; we++)
        et[we] = arguments[we + 2];
      ae.children = et;
    }
    if (j && j.defaultProps)
      for (G in pe = j.defaultProps, pe)
        ae[G] === void 0 && (ae[G] = pe[G]);
    return _e(j, de, ae);
  }, oe.createRef = function() {
    return { current: null };
  }, oe.forwardRef = function(j) {
    return { $$typeof: y, render: j };
  }, oe.isValidElement = Te, oe.lazy = function(j) {
    return {
      $$typeof: b,
      _payload: { _status: -1, _result: j },
      _init: $
    };
  }, oe.memo = function(j, H) {
    return {
      $$typeof: h,
      type: j,
      compare: H === void 0 ? null : H
    };
  }, oe.startTransition = function(j) {
    var H = V.T, Z = {};
    V.T = Z;
    try {
      var G = j(), ae = V.S;
      ae !== null && ae(Z, G), typeof G == "object" && G !== null && typeof G.then == "function" && G.then(ue, ee);
    } catch (de) {
      ee(de);
    } finally {
      H !== null && Z.types !== null && (H.types = Z.types), V.T = H;
    }
  }, oe.unstable_useCacheRefresh = function() {
    return V.H.useCacheRefresh();
  }, oe.use = function(j) {
    return V.H.use(j);
  }, oe.useActionState = function(j, H, Z) {
    return V.H.useActionState(j, H, Z);
  }, oe.useCallback = function(j, H) {
    return V.H.useCallback(j, H);
  }, oe.useContext = function(j) {
    return V.H.useContext(j);
  }, oe.useDebugValue = function() {
  }, oe.useDeferredValue = function(j, H) {
    return V.H.useDeferredValue(j, H);
  }, oe.useEffect = function(j, H) {
    return V.H.useEffect(j, H);
  }, oe.useEffectEvent = function(j) {
    return V.H.useEffectEvent(j);
  }, oe.useId = function() {
    return V.H.useId();
  }, oe.useImperativeHandle = function(j, H, Z) {
    return V.H.useImperativeHandle(j, H, Z);
  }, oe.useInsertionEffect = function(j, H) {
    return V.H.useInsertionEffect(j, H);
  }, oe.useLayoutEffect = function(j, H) {
    return V.H.useLayoutEffect(j, H);
  }, oe.useMemo = function(j, H) {
    return V.H.useMemo(j, H);
  }, oe.useOptimistic = function(j, H) {
    return V.H.useOptimistic(j, H);
  }, oe.useReducer = function(j, H, Z) {
    return V.H.useReducer(j, H, Z);
  }, oe.useRef = function(j) {
    return V.H.useRef(j);
  }, oe.useState = function(j) {
    return V.H.useState(j);
  }, oe.useSyncExternalStore = function(j, H, Z) {
    return V.H.useSyncExternalStore(
      j,
      H,
      Z
    );
  }, oe.useTransition = function() {
    return V.H.useTransition();
  }, oe.version = "19.2.8", oe;
}
var Xm;
function Tr() {
  return Xm || (Xm = 1, hr.exports = gg()), hr.exports;
}
var S = Tr(), pr = { exports: {} }, ai = {}, vr = { exports: {} }, gr = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Qm;
function yg() {
  return Qm || (Qm = 1, (function(i) {
    function u(C, L) {
      var $ = C.length;
      C.push(L);
      e: for (; 0 < $; ) {
        var ee = $ - 1 >>> 1, re = C[ee];
        if (0 < f(re, L))
          C[ee] = L, C[$] = re, $ = ee;
        else break e;
      }
    }
    function o(C) {
      return C.length === 0 ? null : C[0];
    }
    function r(C) {
      if (C.length === 0) return null;
      var L = C[0], $ = C.pop();
      if ($ !== L) {
        C[0] = $;
        e: for (var ee = 0, re = C.length, j = re >>> 1; ee < j; ) {
          var H = 2 * (ee + 1) - 1, Z = C[H], G = H + 1, ae = C[G];
          if (0 > f(Z, $))
            G < re && 0 > f(ae, Z) ? (C[ee] = ae, C[G] = $, ee = G) : (C[ee] = Z, C[H] = $, ee = H);
          else if (G < re && 0 > f(ae, $))
            C[ee] = ae, C[G] = $, ee = G;
          else break e;
        }
      }
      return L;
    }
    function f(C, L) {
      var $ = C.sortIndex - L.sortIndex;
      return $ !== 0 ? $ : C.id - L.id;
    }
    if (i.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var m = performance;
      i.unstable_now = function() {
        return m.now();
      };
    } else {
      var g = Date, y = g.now();
      i.unstable_now = function() {
        return g.now() - y;
      };
    }
    var v = [], h = [], b = 1, x = null, E = 3, Y = !1, X = !1, B = !1, O = !1, Q = typeof setTimeout == "function" ? setTimeout : null, K = typeof clearTimeout == "function" ? clearTimeout : null, q = typeof setImmediate < "u" ? setImmediate : null;
    function te(C) {
      for (var L = o(h); L !== null; ) {
        if (L.callback === null) r(h);
        else if (L.startTime <= C)
          r(h), L.sortIndex = L.expirationTime, u(v, L);
        else break;
        L = o(h);
      }
    }
    function ie(C) {
      if (B = !1, te(C), !X)
        if (o(v) !== null)
          X = !0, ue || (ue = !0, he());
        else {
          var L = o(h);
          L !== null && P(ie, L.startTime - C);
        }
    }
    var ue = !1, V = -1, se = 5, _e = -1;
    function Ne() {
      return O ? !0 : !(i.unstable_now() - _e < se);
    }
    function Te() {
      if (O = !1, ue) {
        var C = i.unstable_now();
        _e = C;
        var L = !0;
        try {
          e: {
            X = !1, B && (B = !1, K(V), V = -1), Y = !0;
            var $ = E;
            try {
              t: {
                for (te(C), x = o(v); x !== null && !(x.expirationTime > C && Ne()); ) {
                  var ee = x.callback;
                  if (typeof ee == "function") {
                    x.callback = null, E = x.priorityLevel;
                    var re = ee(
                      x.expirationTime <= C
                    );
                    if (C = i.unstable_now(), typeof re == "function") {
                      x.callback = re, te(C), L = !0;
                      break t;
                    }
                    x === o(v) && r(v), te(C);
                  } else r(v);
                  x = o(v);
                }
                if (x !== null) L = !0;
                else {
                  var j = o(h);
                  j !== null && P(
                    ie,
                    j.startTime - C
                  ), L = !1;
                }
              }
              break e;
            } finally {
              x = null, E = $, Y = !1;
            }
            L = void 0;
          }
        } finally {
          L ? he() : ue = !1;
        }
      }
    }
    var he;
    if (typeof q == "function")
      he = function() {
        q(Te);
      };
    else if (typeof MessageChannel < "u") {
      var w = new MessageChannel(), F = w.port2;
      w.port1.onmessage = Te, he = function() {
        F.postMessage(null);
      };
    } else
      he = function() {
        Q(Te, 0);
      };
    function P(C, L) {
      V = Q(function() {
        C(i.unstable_now());
      }, L);
    }
    i.unstable_IdlePriority = 5, i.unstable_ImmediatePriority = 1, i.unstable_LowPriority = 4, i.unstable_NormalPriority = 3, i.unstable_Profiling = null, i.unstable_UserBlockingPriority = 2, i.unstable_cancelCallback = function(C) {
      C.callback = null;
    }, i.unstable_forceFrameRate = function(C) {
      0 > C || 125 < C ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : se = 0 < C ? Math.floor(1e3 / C) : 5;
    }, i.unstable_getCurrentPriorityLevel = function() {
      return E;
    }, i.unstable_next = function(C) {
      switch (E) {
        case 1:
        case 2:
        case 3:
          var L = 3;
          break;
        default:
          L = E;
      }
      var $ = E;
      E = L;
      try {
        return C();
      } finally {
        E = $;
      }
    }, i.unstable_requestPaint = function() {
      O = !0;
    }, i.unstable_runWithPriority = function(C, L) {
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
      var $ = E;
      E = C;
      try {
        return L();
      } finally {
        E = $;
      }
    }, i.unstable_scheduleCallback = function(C, L, $) {
      var ee = i.unstable_now();
      switch (typeof $ == "object" && $ !== null ? ($ = $.delay, $ = typeof $ == "number" && 0 < $ ? ee + $ : ee) : $ = ee, C) {
        case 1:
          var re = -1;
          break;
        case 2:
          re = 250;
          break;
        case 5:
          re = 1073741823;
          break;
        case 4:
          re = 1e4;
          break;
        default:
          re = 5e3;
      }
      return re = $ + re, C = {
        id: b++,
        callback: L,
        priorityLevel: C,
        startTime: $,
        expirationTime: re,
        sortIndex: -1
      }, $ > ee ? (C.sortIndex = $, u(h, C), o(v) === null && C === o(h) && (B ? (K(V), V = -1) : B = !0, P(ie, $ - ee))) : (C.sortIndex = re, u(v, C), X || Y || (X = !0, ue || (ue = !0, he()))), C;
    }, i.unstable_shouldYield = Ne, i.unstable_wrapCallback = function(C) {
      var L = E;
      return function() {
        var $ = E;
        E = L;
        try {
          return C.apply(this, arguments);
        } finally {
          E = $;
        }
      };
    };
  })(gr)), gr;
}
var Zm;
function bg() {
  return Zm || (Zm = 1, vr.exports = yg()), vr.exports;
}
var yr = { exports: {} }, ot = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Vm;
function xg() {
  if (Vm) return ot;
  Vm = 1;
  var i = Tr();
  function u(v) {
    var h = "https://react.dev/errors/" + v;
    if (1 < arguments.length) {
      h += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var b = 2; b < arguments.length; b++)
        h += "&args[]=" + encodeURIComponent(arguments[b]);
    }
    return "Minified React error #" + v + "; visit " + h + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function o() {
  }
  var r = {
    d: {
      f: o,
      r: function() {
        throw Error(u(522));
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
  function m(v, h, b) {
    var x = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: f,
      key: x == null ? null : "" + x,
      children: v,
      containerInfo: h,
      implementation: b
    };
  }
  var g = i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function y(v, h) {
    if (v === "font") return "";
    if (typeof h == "string")
      return h === "use-credentials" ? h : "";
  }
  return ot.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = r, ot.createPortal = function(v, h) {
    var b = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!h || h.nodeType !== 1 && h.nodeType !== 9 && h.nodeType !== 11)
      throw Error(u(299));
    return m(v, h, null, b);
  }, ot.flushSync = function(v) {
    var h = g.T, b = r.p;
    try {
      if (g.T = null, r.p = 2, v) return v();
    } finally {
      g.T = h, r.p = b, r.d.f();
    }
  }, ot.preconnect = function(v, h) {
    typeof v == "string" && (h ? (h = h.crossOrigin, h = typeof h == "string" ? h === "use-credentials" ? h : "" : void 0) : h = null, r.d.C(v, h));
  }, ot.prefetchDNS = function(v) {
    typeof v == "string" && r.d.D(v);
  }, ot.preinit = function(v, h) {
    if (typeof v == "string" && h && typeof h.as == "string") {
      var b = h.as, x = y(b, h.crossOrigin), E = typeof h.integrity == "string" ? h.integrity : void 0, Y = typeof h.fetchPriority == "string" ? h.fetchPriority : void 0;
      b === "style" ? r.d.S(
        v,
        typeof h.precedence == "string" ? h.precedence : void 0,
        {
          crossOrigin: x,
          integrity: E,
          fetchPriority: Y
        }
      ) : b === "script" && r.d.X(v, {
        crossOrigin: x,
        integrity: E,
        fetchPriority: Y,
        nonce: typeof h.nonce == "string" ? h.nonce : void 0
      });
    }
  }, ot.preinitModule = function(v, h) {
    if (typeof v == "string")
      if (typeof h == "object" && h !== null) {
        if (h.as == null || h.as === "script") {
          var b = y(
            h.as,
            h.crossOrigin
          );
          r.d.M(v, {
            crossOrigin: b,
            integrity: typeof h.integrity == "string" ? h.integrity : void 0,
            nonce: typeof h.nonce == "string" ? h.nonce : void 0
          });
        }
      } else h == null && r.d.M(v);
  }, ot.preload = function(v, h) {
    if (typeof v == "string" && typeof h == "object" && h !== null && typeof h.as == "string") {
      var b = h.as, x = y(b, h.crossOrigin);
      r.d.L(v, b, {
        crossOrigin: x,
        integrity: typeof h.integrity == "string" ? h.integrity : void 0,
        nonce: typeof h.nonce == "string" ? h.nonce : void 0,
        type: typeof h.type == "string" ? h.type : void 0,
        fetchPriority: typeof h.fetchPriority == "string" ? h.fetchPriority : void 0,
        referrerPolicy: typeof h.referrerPolicy == "string" ? h.referrerPolicy : void 0,
        imageSrcSet: typeof h.imageSrcSet == "string" ? h.imageSrcSet : void 0,
        imageSizes: typeof h.imageSizes == "string" ? h.imageSizes : void 0,
        media: typeof h.media == "string" ? h.media : void 0
      });
    }
  }, ot.preloadModule = function(v, h) {
    if (typeof v == "string")
      if (h) {
        var b = y(h.as, h.crossOrigin);
        r.d.m(v, {
          as: typeof h.as == "string" && h.as !== "script" ? h.as : void 0,
          crossOrigin: b,
          integrity: typeof h.integrity == "string" ? h.integrity : void 0
        });
      } else r.d.m(v);
  }, ot.requestFormReset = function(v) {
    r.d.r(v);
  }, ot.unstable_batchedUpdates = function(v, h) {
    return v(h);
  }, ot.useFormState = function(v, h, b) {
    return g.H.useFormState(v, h, b);
  }, ot.useFormStatus = function() {
    return g.H.useHostTransitionStatus();
  }, ot.version = "19.2.8", ot;
}
var $m;
function _g() {
  if ($m) return yr.exports;
  $m = 1;
  function i() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i);
      } catch (u) {
        console.error(u);
      }
  }
  return i(), yr.exports = xg(), yr.exports;
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
var Km;
function Sg() {
  if (Km) return ai;
  Km = 1;
  var i = bg(), u = Tr(), o = _g();
  function r(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var l = 2; l < arguments.length; l++)
        t += "&args[]=" + encodeURIComponent(arguments[l]);
    }
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function f(e) {
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
  function g(e) {
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
  function v(e) {
    if (m(e) !== e)
      throw Error(r(188));
  }
  function h(e) {
    var t = e.alternate;
    if (!t) {
      if (t = m(e), t === null) throw Error(r(188));
      return t !== e ? null : e;
    }
    for (var l = e, a = t; ; ) {
      var n = l.return;
      if (n === null) break;
      var s = n.alternate;
      if (s === null) {
        if (a = n.return, a !== null) {
          l = a;
          continue;
        }
        break;
      }
      if (n.child === s.child) {
        for (s = n.child; s; ) {
          if (s === l) return v(n), e;
          if (s === a) return v(n), t;
          s = s.sibling;
        }
        throw Error(r(188));
      }
      if (l.return !== a.return) l = n, a = s;
      else {
        for (var d = !1, p = n.child; p; ) {
          if (p === l) {
            d = !0, l = n, a = s;
            break;
          }
          if (p === a) {
            d = !0, a = n, l = s;
            break;
          }
          p = p.sibling;
        }
        if (!d) {
          for (p = s.child; p; ) {
            if (p === l) {
              d = !0, l = s, a = n;
              break;
            }
            if (p === a) {
              d = !0, a = s, l = n;
              break;
            }
            p = p.sibling;
          }
          if (!d) throw Error(r(189));
        }
      }
      if (l.alternate !== a) throw Error(r(190));
    }
    if (l.tag !== 3) throw Error(r(188));
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
  var x = Object.assign, E = Symbol.for("react.element"), Y = Symbol.for("react.transitional.element"), X = Symbol.for("react.portal"), B = Symbol.for("react.fragment"), O = Symbol.for("react.strict_mode"), Q = Symbol.for("react.profiler"), K = Symbol.for("react.consumer"), q = Symbol.for("react.context"), te = Symbol.for("react.forward_ref"), ie = Symbol.for("react.suspense"), ue = Symbol.for("react.suspense_list"), V = Symbol.for("react.memo"), se = Symbol.for("react.lazy"), _e = Symbol.for("react.activity"), Ne = Symbol.for("react.memo_cache_sentinel"), Te = Symbol.iterator;
  function he(e) {
    return e === null || typeof e != "object" ? null : (e = Te && e[Te] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var w = Symbol.for("react.client.reference");
  function F(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === w ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case B:
        return "Fragment";
      case Q:
        return "Profiler";
      case O:
        return "StrictMode";
      case ie:
        return "Suspense";
      case ue:
        return "SuspenseList";
      case _e:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case X:
          return "Portal";
        case q:
          return e.displayName || "Context";
        case K:
          return (e._context.displayName || "Context") + ".Consumer";
        case te:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case V:
          return t = e.displayName || null, t !== null ? t : F(e.type) || "Memo";
        case se:
          t = e._payload, e = e._init;
          try {
            return F(e(t));
          } catch {
          }
      }
    return null;
  }
  var P = Array.isArray, C = u.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, L = o.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, $ = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, ee = [], re = -1;
  function j(e) {
    return { current: e };
  }
  function H(e) {
    0 > re || (e.current = ee[re], ee[re] = null, re--);
  }
  function Z(e, t) {
    re++, ee[re] = e.current, e.current = t;
  }
  var G = j(null), ae = j(null), de = j(null), pe = j(null);
  function et(e, t) {
    switch (Z(de, t), Z(ae, e), Z(G, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? rm(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = rm(t), e = om(t, e);
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
    H(G), Z(G, e);
  }
  function we() {
    H(G), H(ae), H(de);
  }
  function Dt(e) {
    e.memoizedState !== null && Z(pe, e);
    var t = G.current, l = om(t, e.type);
    t !== l && (Z(ae, e), Z(G, l));
  }
  function Kt(e) {
    ae.current === e && (H(G), H(ae)), pe.current === e && (H(pe), Pn._currentValue = $);
  }
  var Ht, De;
  function il(e) {
    if (Ht === void 0)
      try {
        throw Error();
      } catch (l) {
        var t = l.stack.trim().match(/\n( *(at )?)/);
        Ht = t && t[1] || "", De = -1 < l.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < l.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + Ht + e + De;
  }
  var un = !1;
  function rn(e, t) {
    if (!e || un) return "";
    un = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var k = function() {
                throw Error();
              };
              if (Object.defineProperty(k.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(k, []);
                } catch (z) {
                  var A = z;
                }
                Reflect.construct(e, [], k);
              } else {
                try {
                  k.call();
                } catch (z) {
                  A = z;
                }
                e.call(k.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (z) {
                A = z;
              }
              (k = e()) && typeof k.catch == "function" && k.catch(function() {
              });
            }
          } catch (z) {
            if (z && A && typeof z.stack == "string")
              return [z.stack, A.stack];
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
      var s = a.DetermineComponentFrameRoot(), d = s[0], p = s[1];
      if (d && p) {
        var _ = d.split(`
`), R = p.split(`
`);
        for (n = a = 0; a < _.length && !_[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; n < R.length && !R[n].includes(
          "DetermineComponentFrameRoot"
        ); )
          n++;
        if (a === _.length || n === R.length)
          for (a = _.length - 1, n = R.length - 1; 1 <= a && 0 <= n && _[a] !== R[n]; )
            n--;
        for (; 1 <= a && 0 <= n; a--, n--)
          if (_[a] !== R[n]) {
            if (a !== 1 || n !== 1)
              do
                if (a--, n--, 0 > n || _[a] !== R[n]) {
                  var D = `
` + _[a].replace(" at new ", " at ");
                  return e.displayName && D.includes("<anonymous>") && (D = D.replace("<anonymous>", e.displayName)), D;
                }
              while (1 <= a && 0 <= n);
            break;
          }
      }
    } finally {
      un = !1, Error.prepareStackTrace = l;
    }
    return (l = e ? e.displayName || e.name : "") ? il(l) : "";
  }
  function Qh(e, t) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return il(e.type);
      case 16:
        return il("Lazy");
      case 13:
        return e.child !== t && t !== null ? il("Suspense Fallback") : il("Suspense");
      case 19:
        return il("SuspenseList");
      case 0:
      case 15:
        return rn(e.type, !1);
      case 11:
        return rn(e.type.render, !1);
      case 1:
        return rn(e.type, !0);
      case 31:
        return il("Activity");
      default:
        return "";
    }
  }
  function Lr(e) {
    try {
      var t = "", l = null;
      do
        t += Qh(e, l), l = e, e = e.return;
      while (e);
      return t;
    } catch (a) {
      return `
Error generating stack: ` + a.message + `
` + a.stack;
    }
  }
  var Ps = Object.prototype.hasOwnProperty, Is = i.unstable_scheduleCallback, ec = i.unstable_cancelCallback, Zh = i.unstable_shouldYield, Vh = i.unstable_requestPaint, _t = i.unstable_now, $h = i.unstable_getCurrentPriorityLevel, Br = i.unstable_ImmediatePriority, qr = i.unstable_UserBlockingPriority, hi = i.unstable_NormalPriority, Kh = i.unstable_LowPriority, Yr = i.unstable_IdlePriority, Jh = i.log, Fh = i.unstable_setDisableYieldValue, on = null, St = null;
  function Tl(e) {
    if (typeof Jh == "function" && Fh(e), St && typeof St.setStrictMode == "function")
      try {
        St.setStrictMode(on, e);
      } catch {
      }
  }
  var jt = Math.clz32 ? Math.clz32 : Ih, Wh = Math.log, Ph = Math.LN2;
  function Ih(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Wh(e) / Ph | 0) | 0;
  }
  var pi = 256, vi = 262144, gi = 4194304;
  function Pl(e) {
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
  function yi(e, t, l) {
    var a = e.pendingLanes;
    if (a === 0) return 0;
    var n = 0, s = e.suspendedLanes, d = e.pingedLanes;
    e = e.warmLanes;
    var p = a & 134217727;
    return p !== 0 ? (a = p & ~s, a !== 0 ? n = Pl(a) : (d &= p, d !== 0 ? n = Pl(d) : l || (l = p & ~e, l !== 0 && (n = Pl(l))))) : (p = a & ~s, p !== 0 ? n = Pl(p) : d !== 0 ? n = Pl(d) : l || (l = a & ~e, l !== 0 && (n = Pl(l)))), n === 0 ? 0 : t !== 0 && t !== n && (t & s) === 0 && (s = n & -n, l = t & -t, s >= l || s === 32 && (l & 4194048) !== 0) ? t : n;
  }
  function dn(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function ep(e, t) {
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
  function Gr() {
    var e = gi;
    return gi <<= 1, (gi & 62914560) === 0 && (gi = 4194304), e;
  }
  function tc(e) {
    for (var t = [], l = 0; 31 > l; l++) t.push(e);
    return t;
  }
  function fn(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function tp(e, t, l, a, n, s) {
    var d = e.pendingLanes;
    e.pendingLanes = l, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= l, e.entangledLanes &= l, e.errorRecoveryDisabledLanes &= l, e.shellSuspendCounter = 0;
    var p = e.entanglements, _ = e.expirationTimes, R = e.hiddenUpdates;
    for (l = d & ~l; 0 < l; ) {
      var D = 31 - jt(l), k = 1 << D;
      p[D] = 0, _[D] = -1;
      var A = R[D];
      if (A !== null)
        for (R[D] = null, D = 0; D < A.length; D++) {
          var z = A[D];
          z !== null && (z.lane &= -536870913);
        }
      l &= ~k;
    }
    a !== 0 && Xr(e, a, 0), s !== 0 && n === 0 && e.tag !== 0 && (e.suspendedLanes |= s & ~(d & ~t));
  }
  function Xr(e, t, l) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var a = 31 - jt(t);
    e.entangledLanes |= t, e.entanglements[a] = e.entanglements[a] | 1073741824 | l & 261930;
  }
  function Qr(e, t) {
    var l = e.entangledLanes |= t;
    for (e = e.entanglements; l; ) {
      var a = 31 - jt(l), n = 1 << a;
      n & t | e[a] & t && (e[a] |= t), l &= ~n;
    }
  }
  function Zr(e, t) {
    var l = t & -t;
    return l = (l & 42) !== 0 ? 1 : lc(l), (l & (e.suspendedLanes | t)) !== 0 ? 0 : l;
  }
  function lc(e) {
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
  function ac(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Vr() {
    var e = L.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : Om(e.type));
  }
  function $r(e, t) {
    var l = L.p;
    try {
      return L.p = e, t();
    } finally {
      L.p = l;
    }
  }
  var Cl = Math.random().toString(36).slice(2), nt = "__reactFiber$" + Cl, mt = "__reactProps$" + Cl, xa = "__reactContainer$" + Cl, nc = "__reactEvents$" + Cl, lp = "__reactListeners$" + Cl, ap = "__reactHandles$" + Cl, Kr = "__reactResources$" + Cl, mn = "__reactMarker$" + Cl;
  function ic(e) {
    delete e[nt], delete e[mt], delete e[nc], delete e[lp], delete e[ap];
  }
  function _a(e) {
    var t = e[nt];
    if (t) return t;
    for (var l = e.parentNode; l; ) {
      if (t = l[xa] || l[nt]) {
        if (l = t.alternate, t.child !== null || l !== null && l.child !== null)
          for (e = gm(e); e !== null; ) {
            if (l = e[nt]) return l;
            e = gm(e);
          }
        return t;
      }
      e = l, l = e.parentNode;
    }
    return null;
  }
  function Sa(e) {
    if (e = e[nt] || e[xa]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function hn(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(r(33));
  }
  function ja(e) {
    var t = e[Kr];
    return t || (t = e[Kr] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function lt(e) {
    e[mn] = !0;
  }
  var Jr = /* @__PURE__ */ new Set(), Fr = {};
  function Il(e, t) {
    Na(e, t), Na(e + "Capture", t);
  }
  function Na(e, t) {
    for (Fr[e] = t, e = 0; e < t.length; e++)
      Jr.add(t[e]);
  }
  var np = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Wr = {}, Pr = {};
  function ip(e) {
    return Ps.call(Pr, e) ? !0 : Ps.call(Wr, e) ? !1 : np.test(e) ? Pr[e] = !0 : (Wr[e] = !0, !1);
  }
  function bi(e, t, l) {
    if (ip(t))
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
  function xi(e, t, l) {
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
  function sl(e, t, l, a) {
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
  function Ut(e) {
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
  function Ir(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function sp(e, t, l) {
    var a = Object.getOwnPropertyDescriptor(
      e.constructor.prototype,
      t
    );
    if (!e.hasOwnProperty(t) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
      var n = a.get, s = a.set;
      return Object.defineProperty(e, t, {
        configurable: !0,
        get: function() {
          return n.call(this);
        },
        set: function(d) {
          l = "" + d, s.call(this, d);
        }
      }), Object.defineProperty(e, t, {
        enumerable: a.enumerable
      }), {
        getValue: function() {
          return l;
        },
        setValue: function(d) {
          l = "" + d;
        },
        stopTracking: function() {
          e._valueTracker = null, delete e[t];
        }
      };
    }
  }
  function sc(e) {
    if (!e._valueTracker) {
      var t = Ir(e) ? "checked" : "value";
      e._valueTracker = sp(
        e,
        t,
        "" + e[t]
      );
    }
  }
  function eo(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var l = t.getValue(), a = "";
    return e && (a = Ir(e) ? e.checked ? "true" : "false" : e.value), e = a, e !== l ? (t.setValue(e), !0) : !1;
  }
  function _i(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var cp = /[\n"\\]/g;
  function kt(e) {
    return e.replace(
      cp,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function cc(e, t, l, a, n, s, d, p) {
    e.name = "", d != null && typeof d != "function" && typeof d != "symbol" && typeof d != "boolean" ? e.type = d : e.removeAttribute("type"), t != null ? d === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Ut(t)) : e.value !== "" + Ut(t) && (e.value = "" + Ut(t)) : d !== "submit" && d !== "reset" || e.removeAttribute("value"), t != null ? uc(e, d, Ut(t)) : l != null ? uc(e, d, Ut(l)) : a != null && e.removeAttribute("value"), n == null && s != null && (e.defaultChecked = !!s), n != null && (e.checked = n && typeof n != "function" && typeof n != "symbol"), p != null && typeof p != "function" && typeof p != "symbol" && typeof p != "boolean" ? e.name = "" + Ut(p) : e.removeAttribute("name");
  }
  function to(e, t, l, a, n, s, d, p) {
    if (s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" && (e.type = s), t != null || l != null) {
      if (!(s !== "submit" && s !== "reset" || t != null)) {
        sc(e);
        return;
      }
      l = l != null ? "" + Ut(l) : "", t = t != null ? "" + Ut(t) : l, p || t === e.value || (e.value = t), e.defaultValue = t;
    }
    a = a ?? n, a = typeof a != "function" && typeof a != "symbol" && !!a, e.checked = p ? e.checked : !!a, e.defaultChecked = !!a, d != null && typeof d != "function" && typeof d != "symbol" && typeof d != "boolean" && (e.name = d), sc(e);
  }
  function uc(e, t, l) {
    t === "number" && _i(e.ownerDocument) === e || e.defaultValue === "" + l || (e.defaultValue = "" + l);
  }
  function Ea(e, t, l, a) {
    if (e = e.options, t) {
      t = {};
      for (var n = 0; n < l.length; n++)
        t["$" + l[n]] = !0;
      for (l = 0; l < e.length; l++)
        n = t.hasOwnProperty("$" + e[l].value), e[l].selected !== n && (e[l].selected = n), n && a && (e[l].defaultSelected = !0);
    } else {
      for (l = "" + Ut(l), t = null, n = 0; n < e.length; n++) {
        if (e[n].value === l) {
          e[n].selected = !0, a && (e[n].defaultSelected = !0);
          return;
        }
        t !== null || e[n].disabled || (t = e[n]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function lo(e, t, l) {
    if (t != null && (t = "" + Ut(t), t !== e.value && (e.value = t), l == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = l != null ? "" + Ut(l) : "";
  }
  function ao(e, t, l, a) {
    if (t == null) {
      if (a != null) {
        if (l != null) throw Error(r(92));
        if (P(a)) {
          if (1 < a.length) throw Error(r(93));
          a = a[0];
        }
        l = a;
      }
      l == null && (l = ""), t = l;
    }
    l = Ut(t), e.defaultValue = l, a = e.textContent, a === l && a !== "" && a !== null && (e.value = a), sc(e);
  }
  function Ta(e, t) {
    if (t) {
      var l = e.firstChild;
      if (l && l === e.lastChild && l.nodeType === 3) {
        l.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var up = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function no(e, t, l) {
    var a = t.indexOf("--") === 0;
    l == null || typeof l == "boolean" || l === "" ? a ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : a ? e.setProperty(t, l) : typeof l != "number" || l === 0 || up.has(t) ? t === "float" ? e.cssFloat = l : e[t] = ("" + l).trim() : e[t] = l + "px";
  }
  function io(e, t, l) {
    if (t != null && typeof t != "object")
      throw Error(r(62));
    if (e = e.style, l != null) {
      for (var a in l)
        !l.hasOwnProperty(a) || t != null && t.hasOwnProperty(a) || (a.indexOf("--") === 0 ? e.setProperty(a, "") : a === "float" ? e.cssFloat = "" : e[a] = "");
      for (var n in t)
        a = t[n], t.hasOwnProperty(n) && l[n] !== a && no(e, n, a);
    } else
      for (var s in t)
        t.hasOwnProperty(s) && no(e, s, t[s]);
  }
  function rc(e) {
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
  var rp = /* @__PURE__ */ new Map([
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
  ]), op = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Si(e) {
    return op.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  function cl() {
  }
  var oc = null;
  function dc(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Ca = null, Ma = null;
  function so(e) {
    var t = Sa(e);
    if (t && (e = t.stateNode)) {
      var l = e[mt] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (cc(
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
              'input[name="' + kt(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < l.length; t++) {
              var a = l[t];
              if (a !== e && a.form === e.form) {
                var n = a[mt] || null;
                if (!n) throw Error(r(90));
                cc(
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
              a = l[t], a.form === e.form && eo(a);
          }
          break e;
        case "textarea":
          lo(e, l.value, l.defaultValue);
          break e;
        case "select":
          t = l.value, t != null && Ea(e, !!l.multiple, t, !1);
      }
    }
  }
  var fc = !1;
  function co(e, t, l) {
    if (fc) return e(t, l);
    fc = !0;
    try {
      var a = e(t);
      return a;
    } finally {
      if (fc = !1, (Ca !== null || Ma !== null) && (rs(), Ca && (t = Ca, e = Ma, Ma = Ca = null, so(t), e)))
        for (t = 0; t < e.length; t++) so(e[t]);
    }
  }
  function pn(e, t) {
    var l = e.stateNode;
    if (l === null) return null;
    var a = l[mt] || null;
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
        r(231, t, typeof l)
      );
    return l;
  }
  var ul = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), mc = !1;
  if (ul)
    try {
      var vn = {};
      Object.defineProperty(vn, "passive", {
        get: function() {
          mc = !0;
        }
      }), window.addEventListener("test", vn, vn), window.removeEventListener("test", vn, vn);
    } catch {
      mc = !1;
    }
  var Ml = null, hc = null, ji = null;
  function uo() {
    if (ji) return ji;
    var e, t = hc, l = t.length, a, n = "value" in Ml ? Ml.value : Ml.textContent, s = n.length;
    for (e = 0; e < l && t[e] === n[e]; e++) ;
    var d = l - e;
    for (a = 1; a <= d && t[l - a] === n[s - a]; a++) ;
    return ji = n.slice(e, 1 < a ? 1 - a : void 0);
  }
  function Ni(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Ei() {
    return !0;
  }
  function ro() {
    return !1;
  }
  function ht(e) {
    function t(l, a, n, s, d) {
      this._reactName = l, this._targetInst = n, this.type = a, this.nativeEvent = s, this.target = d, this.currentTarget = null;
      for (var p in e)
        e.hasOwnProperty(p) && (l = e[p], this[p] = l ? l(s) : s[p]);
      return this.isDefaultPrevented = (s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1) ? Ei : ro, this.isPropagationStopped = ro, this;
    }
    return x(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var l = this.nativeEvent;
        l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = Ei);
      },
      stopPropagation: function() {
        var l = this.nativeEvent;
        l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = Ei);
      },
      persist: function() {
      },
      isPersistent: Ei
    }), t;
  }
  var ea = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, Ti = ht(ea), gn = x({}, ea, { view: 0, detail: 0 }), dp = ht(gn), pc, vc, yn, Ci = x({}, gn, {
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
    getModifierState: yc,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== yn && (yn && e.type === "mousemove" ? (pc = e.screenX - yn.screenX, vc = e.screenY - yn.screenY) : vc = pc = 0, yn = e), pc);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : vc;
    }
  }), oo = ht(Ci), fp = x({}, Ci, { dataTransfer: 0 }), mp = ht(fp), hp = x({}, gn, { relatedTarget: 0 }), gc = ht(hp), pp = x({}, ea, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), vp = ht(pp), gp = x({}, ea, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), yp = ht(gp), bp = x({}, ea, { data: 0 }), fo = ht(bp), xp = {
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
  }, _p = {
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
  }, Sp = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function jp(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Sp[e]) ? !!t[e] : !1;
  }
  function yc() {
    return jp;
  }
  var Np = x({}, gn, {
    key: function(e) {
      if (e.key) {
        var t = xp[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = Ni(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? _p[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: yc,
    charCode: function(e) {
      return e.type === "keypress" ? Ni(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? Ni(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), Ep = ht(Np), Tp = x({}, Ci, {
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
  }), mo = ht(Tp), Cp = x({}, gn, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: yc
  }), Mp = ht(Cp), Rp = x({}, ea, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Ap = ht(Rp), zp = x({}, Ci, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), wp = ht(zp), Op = x({}, ea, {
    newState: 0,
    oldState: 0
  }), Dp = ht(Op), Hp = [9, 13, 27, 32], bc = ul && "CompositionEvent" in window, bn = null;
  ul && "documentMode" in document && (bn = document.documentMode);
  var Up = ul && "TextEvent" in window && !bn, ho = ul && (!bc || bn && 8 < bn && 11 >= bn), po = " ", vo = !1;
  function go(e, t) {
    switch (e) {
      case "keyup":
        return Hp.indexOf(t.keyCode) !== -1;
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
  function yo(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Ra = !1;
  function kp(e, t) {
    switch (e) {
      case "compositionend":
        return yo(t);
      case "keypress":
        return t.which !== 32 ? null : (vo = !0, po);
      case "textInput":
        return e = t.data, e === po && vo ? null : e;
      default:
        return null;
    }
  }
  function Lp(e, t) {
    if (Ra)
      return e === "compositionend" || !bc && go(e, t) ? (e = uo(), ji = hc = Ml = null, Ra = !1, e) : null;
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
        return ho && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Bp = {
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
  function bo(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Bp[e.type] : t === "textarea";
  }
  function xo(e, t, l, a) {
    Ca ? Ma ? Ma.push(a) : Ma = [a] : Ca = a, t = vs(t, "onChange"), 0 < t.length && (l = new Ti(
      "onChange",
      "change",
      null,
      l,
      a
    ), e.push({ event: l, listeners: t }));
  }
  var xn = null, _n = null;
  function qp(e) {
    am(e, 0);
  }
  function Mi(e) {
    var t = hn(e);
    if (eo(t)) return e;
  }
  function _o(e, t) {
    if (e === "change") return t;
  }
  var So = !1;
  if (ul) {
    var xc;
    if (ul) {
      var _c = "oninput" in document;
      if (!_c) {
        var jo = document.createElement("div");
        jo.setAttribute("oninput", "return;"), _c = typeof jo.oninput == "function";
      }
      xc = _c;
    } else xc = !1;
    So = xc && (!document.documentMode || 9 < document.documentMode);
  }
  function No() {
    xn && (xn.detachEvent("onpropertychange", Eo), _n = xn = null);
  }
  function Eo(e) {
    if (e.propertyName === "value" && Mi(_n)) {
      var t = [];
      xo(
        t,
        _n,
        e,
        dc(e)
      ), co(qp, t);
    }
  }
  function Yp(e, t, l) {
    e === "focusin" ? (No(), xn = t, _n = l, xn.attachEvent("onpropertychange", Eo)) : e === "focusout" && No();
  }
  function Gp(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return Mi(_n);
  }
  function Xp(e, t) {
    if (e === "click") return Mi(t);
  }
  function Qp(e, t) {
    if (e === "input" || e === "change")
      return Mi(t);
  }
  function Zp(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var Nt = typeof Object.is == "function" ? Object.is : Zp;
  function Sn(e, t) {
    if (Nt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var l = Object.keys(e), a = Object.keys(t);
    if (l.length !== a.length) return !1;
    for (a = 0; a < l.length; a++) {
      var n = l[a];
      if (!Ps.call(t, n) || !Nt(e[n], t[n]))
        return !1;
    }
    return !0;
  }
  function To(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Co(e, t) {
    var l = To(e);
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
      l = To(l);
    }
  }
  function Mo(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Mo(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Ro(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = _i(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var l = typeof t.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) e = t.contentWindow;
      else break;
      t = _i(e.document);
    }
    return t;
  }
  function Sc(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var Vp = ul && "documentMode" in document && 11 >= document.documentMode, Aa = null, jc = null, jn = null, Nc = !1;
  function Ao(e, t, l) {
    var a = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    Nc || Aa == null || Aa !== _i(a) || (a = Aa, "selectionStart" in a && Sc(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), jn && Sn(jn, a) || (jn = a, a = vs(jc, "onSelect"), 0 < a.length && (t = new Ti(
      "onSelect",
      "select",
      null,
      t,
      l
    ), e.push({ event: t, listeners: a }), t.target = Aa)));
  }
  function ta(e, t) {
    var l = {};
    return l[e.toLowerCase()] = t.toLowerCase(), l["Webkit" + e] = "webkit" + t, l["Moz" + e] = "moz" + t, l;
  }
  var za = {
    animationend: ta("Animation", "AnimationEnd"),
    animationiteration: ta("Animation", "AnimationIteration"),
    animationstart: ta("Animation", "AnimationStart"),
    transitionrun: ta("Transition", "TransitionRun"),
    transitionstart: ta("Transition", "TransitionStart"),
    transitioncancel: ta("Transition", "TransitionCancel"),
    transitionend: ta("Transition", "TransitionEnd")
  }, Ec = {}, zo = {};
  ul && (zo = document.createElement("div").style, "AnimationEvent" in window || (delete za.animationend.animation, delete za.animationiteration.animation, delete za.animationstart.animation), "TransitionEvent" in window || delete za.transitionend.transition);
  function la(e) {
    if (Ec[e]) return Ec[e];
    if (!za[e]) return e;
    var t = za[e], l;
    for (l in t)
      if (t.hasOwnProperty(l) && l in zo)
        return Ec[e] = t[l];
    return e;
  }
  var wo = la("animationend"), Oo = la("animationiteration"), Do = la("animationstart"), $p = la("transitionrun"), Kp = la("transitionstart"), Jp = la("transitioncancel"), Ho = la("transitionend"), Uo = /* @__PURE__ */ new Map(), Tc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Tc.push("scrollEnd");
  function Jt(e, t) {
    Uo.set(e, t), Il(t, [e]);
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
  }, Lt = [], wa = 0, Cc = 0;
  function Ai() {
    for (var e = wa, t = Cc = wa = 0; t < e; ) {
      var l = Lt[t];
      Lt[t++] = null;
      var a = Lt[t];
      Lt[t++] = null;
      var n = Lt[t];
      Lt[t++] = null;
      var s = Lt[t];
      if (Lt[t++] = null, a !== null && n !== null) {
        var d = a.pending;
        d === null ? n.next = n : (n.next = d.next, d.next = n), a.pending = n;
      }
      s !== 0 && ko(l, n, s);
    }
  }
  function zi(e, t, l, a) {
    Lt[wa++] = e, Lt[wa++] = t, Lt[wa++] = l, Lt[wa++] = a, Cc |= a, e.lanes |= a, e = e.alternate, e !== null && (e.lanes |= a);
  }
  function Mc(e, t, l, a) {
    return zi(e, t, l, a), wi(e);
  }
  function aa(e, t) {
    return zi(e, null, null, t), wi(e);
  }
  function ko(e, t, l) {
    e.lanes |= l;
    var a = e.alternate;
    a !== null && (a.lanes |= l);
    for (var n = !1, s = e.return; s !== null; )
      s.childLanes |= l, a = s.alternate, a !== null && (a.childLanes |= l), s.tag === 22 && (e = s.stateNode, e === null || e._visibility & 1 || (n = !0)), e = s, s = s.return;
    return e.tag === 3 ? (s = e.stateNode, n && t !== null && (n = 31 - jt(l), e = s.hiddenUpdates, a = e[n], a === null ? e[n] = [t] : a.push(t), t.lane = l | 536870912), s) : null;
  }
  function wi(e) {
    if (50 < Zn)
      throw Zn = 0, ku = null, Error(r(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var Oa = {};
  function Fp(e, t, l, a) {
    this.tag = e, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Et(e, t, l, a) {
    return new Fp(e, t, l, a);
  }
  function Rc(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function rl(e, t) {
    var l = e.alternate;
    return l === null ? (l = Et(
      e.tag,
      t,
      e.key,
      e.mode
    ), l.elementType = e.elementType, l.type = e.type, l.stateNode = e.stateNode, l.alternate = e, e.alternate = l) : (l.pendingProps = t, l.type = e.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = e.flags & 65011712, l.childLanes = e.childLanes, l.lanes = e.lanes, l.child = e.child, l.memoizedProps = e.memoizedProps, l.memoizedState = e.memoizedState, l.updateQueue = e.updateQueue, t = e.dependencies, l.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, l.sibling = e.sibling, l.index = e.index, l.ref = e.ref, l.refCleanup = e.refCleanup, l;
  }
  function Lo(e, t) {
    e.flags &= 65011714;
    var l = e.alternate;
    return l === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = l.childLanes, e.lanes = l.lanes, e.child = l.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = l.memoizedProps, e.memoizedState = l.memoizedState, e.updateQueue = l.updateQueue, e.type = l.type, t = l.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function Oi(e, t, l, a, n, s) {
    var d = 0;
    if (a = e, typeof e == "function") Rc(e) && (d = 1);
    else if (typeof e == "string")
      d = tg(
        e,
        l,
        G.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case _e:
          return e = Et(31, l, t, n), e.elementType = _e, e.lanes = s, e;
        case B:
          return na(l.children, n, s, t);
        case O:
          d = 8, n |= 24;
          break;
        case Q:
          return e = Et(12, l, t, n | 2), e.elementType = Q, e.lanes = s, e;
        case ie:
          return e = Et(13, l, t, n), e.elementType = ie, e.lanes = s, e;
        case ue:
          return e = Et(19, l, t, n), e.elementType = ue, e.lanes = s, e;
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case q:
                d = 10;
                break e;
              case K:
                d = 9;
                break e;
              case te:
                d = 11;
                break e;
              case V:
                d = 14;
                break e;
              case se:
                d = 16, a = null;
                break e;
            }
          d = 29, l = Error(
            r(130, e === null ? "null" : typeof e, "")
          ), a = null;
      }
    return t = Et(d, l, t, n), t.elementType = e, t.type = a, t.lanes = s, t;
  }
  function na(e, t, l, a) {
    return e = Et(7, e, a, t), e.lanes = l, e;
  }
  function Ac(e, t, l) {
    return e = Et(6, e, null, t), e.lanes = l, e;
  }
  function Bo(e) {
    var t = Et(18, null, null, 0);
    return t.stateNode = e, t;
  }
  function zc(e, t, l) {
    return t = Et(
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
  var qo = /* @__PURE__ */ new WeakMap();
  function Bt(e, t) {
    if (typeof e == "object" && e !== null) {
      var l = qo.get(e);
      return l !== void 0 ? l : (t = {
        value: e,
        source: t,
        stack: Lr(t)
      }, qo.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: Lr(t)
    };
  }
  var Da = [], Ha = 0, Di = null, Nn = 0, qt = [], Yt = 0, Rl = null, el = 1, tl = "";
  function ol(e, t) {
    Da[Ha++] = Nn, Da[Ha++] = Di, Di = e, Nn = t;
  }
  function Yo(e, t, l) {
    qt[Yt++] = el, qt[Yt++] = tl, qt[Yt++] = Rl, Rl = e;
    var a = el;
    e = tl;
    var n = 32 - jt(a) - 1;
    a &= ~(1 << n), l += 1;
    var s = 32 - jt(t) + n;
    if (30 < s) {
      var d = n - n % 5;
      s = (a & (1 << d) - 1).toString(32), a >>= d, n -= d, el = 1 << 32 - jt(t) + n | l << n | a, tl = s + e;
    } else
      el = 1 << s | l << n | a, tl = e;
  }
  function wc(e) {
    e.return !== null && (ol(e, 1), Yo(e, 1, 0));
  }
  function Oc(e) {
    for (; e === Di; )
      Di = Da[--Ha], Da[Ha] = null, Nn = Da[--Ha], Da[Ha] = null;
    for (; e === Rl; )
      Rl = qt[--Yt], qt[Yt] = null, tl = qt[--Yt], qt[Yt] = null, el = qt[--Yt], qt[Yt] = null;
  }
  function Go(e, t) {
    qt[Yt++] = el, qt[Yt++] = tl, qt[Yt++] = Rl, el = t.id, tl = t.overflow, Rl = e;
  }
  var it = null, ke = null, xe = !1, Al = null, Gt = !1, Dc = Error(r(519));
  function zl(e) {
    var t = Error(
      r(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw En(Bt(t, e)), Dc;
  }
  function Xo(e) {
    var t = e.stateNode, l = e.type, a = e.memoizedProps;
    switch (t[nt] = e, t[mt] = a, l) {
      case "dialog":
        ge("cancel", t), ge("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        ge("load", t);
        break;
      case "video":
      case "audio":
        for (l = 0; l < $n.length; l++)
          ge($n[l], t);
        break;
      case "source":
        ge("error", t);
        break;
      case "img":
      case "image":
      case "link":
        ge("error", t), ge("load", t);
        break;
      case "details":
        ge("toggle", t);
        break;
      case "input":
        ge("invalid", t), to(
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
        ge("invalid", t);
        break;
      case "textarea":
        ge("invalid", t), ao(t, a.value, a.defaultValue, a.children);
    }
    l = a.children, typeof l != "string" && typeof l != "number" && typeof l != "bigint" || t.textContent === "" + l || a.suppressHydrationWarning === !0 || cm(t.textContent, l) ? (a.popover != null && (ge("beforetoggle", t), ge("toggle", t)), a.onScroll != null && ge("scroll", t), a.onScrollEnd != null && ge("scrollend", t), a.onClick != null && (t.onclick = cl), t = !0) : t = !1, t || zl(e, !0);
  }
  function Qo(e) {
    for (it = e.return; it; )
      switch (it.tag) {
        case 5:
        case 31:
        case 13:
          Gt = !1;
          return;
        case 27:
        case 3:
          Gt = !0;
          return;
        default:
          it = it.return;
      }
  }
  function Ua(e) {
    if (e !== it) return !1;
    if (!xe) return Qo(e), xe = !0, !1;
    var t = e.tag, l;
    if ((l = t !== 3 && t !== 27) && ((l = t === 5) && (l = e.type, l = !(l !== "form" && l !== "button") || Pu(e.type, e.memoizedProps)), l = !l), l && ke && zl(e), Qo(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(r(317));
      ke = vm(e);
    } else if (t === 31) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(r(317));
      ke = vm(e);
    } else
      t === 27 ? (t = ke, Zl(e.type) ? (e = ar, ar = null, ke = e) : ke = t) : ke = it ? Qt(e.stateNode.nextSibling) : null;
    return !0;
  }
  function ia() {
    ke = it = null, xe = !1;
  }
  function Hc() {
    var e = Al;
    return e !== null && (yt === null ? yt = e : yt.push.apply(
      yt,
      e
    ), Al = null), e;
  }
  function En(e) {
    Al === null ? Al = [e] : Al.push(e);
  }
  var Uc = j(null), sa = null, dl = null;
  function wl(e, t, l) {
    Z(Uc, t._currentValue), t._currentValue = l;
  }
  function fl(e) {
    e._currentValue = Uc.current, H(Uc);
  }
  function kc(e, t, l) {
    for (; e !== null; ) {
      var a = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, a !== null && (a.childLanes |= t)) : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t), e === l) break;
      e = e.return;
    }
  }
  function Lc(e, t, l, a) {
    var n = e.child;
    for (n !== null && (n.return = e); n !== null; ) {
      var s = n.dependencies;
      if (s !== null) {
        var d = n.child;
        s = s.firstContext;
        e: for (; s !== null; ) {
          var p = s;
          s = n;
          for (var _ = 0; _ < t.length; _++)
            if (p.context === t[_]) {
              s.lanes |= l, p = s.alternate, p !== null && (p.lanes |= l), kc(
                s.return,
                l,
                e
              ), a || (d = null);
              break e;
            }
          s = p.next;
        }
      } else if (n.tag === 18) {
        if (d = n.return, d === null) throw Error(r(341));
        d.lanes |= l, s = d.alternate, s !== null && (s.lanes |= l), kc(d, l, e), d = null;
      } else d = n.child;
      if (d !== null) d.return = n;
      else
        for (d = n; d !== null; ) {
          if (d === e) {
            d = null;
            break;
          }
          if (n = d.sibling, n !== null) {
            n.return = d.return, d = n;
            break;
          }
          d = d.return;
        }
      n = d;
    }
  }
  function ka(e, t, l, a) {
    e = null;
    for (var n = t, s = !1; n !== null; ) {
      if (!s) {
        if ((n.flags & 524288) !== 0) s = !0;
        else if ((n.flags & 262144) !== 0) break;
      }
      if (n.tag === 10) {
        var d = n.alternate;
        if (d === null) throw Error(r(387));
        if (d = d.memoizedProps, d !== null) {
          var p = n.type;
          Nt(n.pendingProps.value, d.value) || (e !== null ? e.push(p) : e = [p]);
        }
      } else if (n === pe.current) {
        if (d = n.alternate, d === null) throw Error(r(387));
        d.memoizedState.memoizedState !== n.memoizedState.memoizedState && (e !== null ? e.push(Pn) : e = [Pn]);
      }
      n = n.return;
    }
    e !== null && Lc(
      t,
      e,
      l,
      a
    ), t.flags |= 262144;
  }
  function Hi(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!Nt(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function ca(e) {
    sa = e, dl = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function st(e) {
    return Zo(sa, e);
  }
  function Ui(e, t) {
    return sa === null && ca(e), Zo(e, t);
  }
  function Zo(e, t) {
    var l = t._currentValue;
    if (t = { context: t, memoizedValue: l, next: null }, dl === null) {
      if (e === null) throw Error(r(308));
      dl = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else dl = dl.next = t;
    return l;
  }
  var Wp = typeof AbortController < "u" ? AbortController : function() {
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
  }, Pp = i.unstable_scheduleCallback, Ip = i.unstable_NormalPriority, Fe = {
    $$typeof: q,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Bc() {
    return {
      controller: new Wp(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Tn(e) {
    e.refCount--, e.refCount === 0 && Pp(Ip, function() {
      e.controller.abort();
    });
  }
  var Cn = null, qc = 0, La = 0, Ba = null;
  function ev(e, t) {
    if (Cn === null) {
      var l = Cn = [];
      qc = 0, La = Xu(), Ba = {
        status: "pending",
        value: void 0,
        then: function(a) {
          l.push(a);
        }
      };
    }
    return qc++, t.then(Vo, Vo), t;
  }
  function Vo() {
    if (--qc === 0 && Cn !== null) {
      Ba !== null && (Ba.status = "fulfilled");
      var e = Cn;
      Cn = null, La = 0, Ba = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function tv(e, t) {
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
  var $o = C.S;
  C.S = function(e, t) {
    zf = _t(), typeof t == "object" && t !== null && typeof t.then == "function" && ev(e, t), $o !== null && $o(e, t);
  };
  var ua = j(null);
  function Yc() {
    var e = ua.current;
    return e !== null ? e : Oe.pooledCache;
  }
  function ki(e, t) {
    t === null ? Z(ua, ua.current) : Z(ua, t.pool);
  }
  function Ko() {
    var e = Yc();
    return e === null ? null : { parent: Fe._currentValue, pool: e };
  }
  var qa = Error(r(460)), Gc = Error(r(474)), Li = Error(r(542)), Bi = { then: function() {
  } };
  function Jo(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function Fo(e, t, l) {
    switch (l = e[l], l === void 0 ? e.push(t) : l !== t && (t.then(cl, cl), t = l), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, Po(e), e;
      default:
        if (typeof t.status == "string") t.then(cl, cl);
        else {
          if (e = Oe, e !== null && 100 < e.shellSuspendCounter)
            throw Error(r(482));
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
            throw e = t.reason, Po(e), e;
        }
        throw oa = t, qa;
    }
  }
  function ra(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (l) {
      throw l !== null && typeof l == "object" && typeof l.then == "function" ? (oa = l, qa) : l;
    }
  }
  var oa = null;
  function Wo() {
    if (oa === null) throw Error(r(459));
    var e = oa;
    return oa = null, e;
  }
  function Po(e) {
    if (e === qa || e === Li)
      throw Error(r(483));
  }
  var Ya = null, Mn = 0;
  function qi(e) {
    var t = Mn;
    return Mn += 1, Ya === null && (Ya = []), Fo(Ya, e, t);
  }
  function Rn(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function Yi(e, t) {
    throw t.$$typeof === E ? Error(r(525)) : (e = Object.prototype.toString.call(t), Error(
      r(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function Io(e) {
    function t(T, N) {
      if (e) {
        var M = T.deletions;
        M === null ? (T.deletions = [N], T.flags |= 16) : M.push(N);
      }
    }
    function l(T, N) {
      if (!e) return null;
      for (; N !== null; )
        t(T, N), N = N.sibling;
      return null;
    }
    function a(T) {
      for (var N = /* @__PURE__ */ new Map(); T !== null; )
        T.key !== null ? N.set(T.key, T) : N.set(T.index, T), T = T.sibling;
      return N;
    }
    function n(T, N) {
      return T = rl(T, N), T.index = 0, T.sibling = null, T;
    }
    function s(T, N, M) {
      return T.index = M, e ? (M = T.alternate, M !== null ? (M = M.index, M < N ? (T.flags |= 67108866, N) : M) : (T.flags |= 67108866, N)) : (T.flags |= 1048576, N);
    }
    function d(T) {
      return e && T.alternate === null && (T.flags |= 67108866), T;
    }
    function p(T, N, M, U) {
      return N === null || N.tag !== 6 ? (N = Ac(M, T.mode, U), N.return = T, N) : (N = n(N, M), N.return = T, N);
    }
    function _(T, N, M, U) {
      var le = M.type;
      return le === B ? D(
        T,
        N,
        M.props.children,
        U,
        M.key
      ) : N !== null && (N.elementType === le || typeof le == "object" && le !== null && le.$$typeof === se && ra(le) === N.type) ? (N = n(N, M.props), Rn(N, M), N.return = T, N) : (N = Oi(
        M.type,
        M.key,
        M.props,
        null,
        T.mode,
        U
      ), Rn(N, M), N.return = T, N);
    }
    function R(T, N, M, U) {
      return N === null || N.tag !== 4 || N.stateNode.containerInfo !== M.containerInfo || N.stateNode.implementation !== M.implementation ? (N = zc(M, T.mode, U), N.return = T, N) : (N = n(N, M.children || []), N.return = T, N);
    }
    function D(T, N, M, U, le) {
      return N === null || N.tag !== 7 ? (N = na(
        M,
        T.mode,
        U,
        le
      ), N.return = T, N) : (N = n(N, M), N.return = T, N);
    }
    function k(T, N, M) {
      if (typeof N == "string" && N !== "" || typeof N == "number" || typeof N == "bigint")
        return N = Ac(
          "" + N,
          T.mode,
          M
        ), N.return = T, N;
      if (typeof N == "object" && N !== null) {
        switch (N.$$typeof) {
          case Y:
            return M = Oi(
              N.type,
              N.key,
              N.props,
              null,
              T.mode,
              M
            ), Rn(M, N), M.return = T, M;
          case X:
            return N = zc(
              N,
              T.mode,
              M
            ), N.return = T, N;
          case se:
            return N = ra(N), k(T, N, M);
        }
        if (P(N) || he(N))
          return N = na(
            N,
            T.mode,
            M,
            null
          ), N.return = T, N;
        if (typeof N.then == "function")
          return k(T, qi(N), M);
        if (N.$$typeof === q)
          return k(
            T,
            Ui(T, N),
            M
          );
        Yi(T, N);
      }
      return null;
    }
    function A(T, N, M, U) {
      var le = N !== null ? N.key : null;
      if (typeof M == "string" && M !== "" || typeof M == "number" || typeof M == "bigint")
        return le !== null ? null : p(T, N, "" + M, U);
      if (typeof M == "object" && M !== null) {
        switch (M.$$typeof) {
          case Y:
            return M.key === le ? _(T, N, M, U) : null;
          case X:
            return M.key === le ? R(T, N, M, U) : null;
          case se:
            return M = ra(M), A(T, N, M, U);
        }
        if (P(M) || he(M))
          return le !== null ? null : D(T, N, M, U, null);
        if (typeof M.then == "function")
          return A(
            T,
            N,
            qi(M),
            U
          );
        if (M.$$typeof === q)
          return A(
            T,
            N,
            Ui(T, M),
            U
          );
        Yi(T, M);
      }
      return null;
    }
    function z(T, N, M, U, le) {
      if (typeof U == "string" && U !== "" || typeof U == "number" || typeof U == "bigint")
        return T = T.get(M) || null, p(N, T, "" + U, le);
      if (typeof U == "object" && U !== null) {
        switch (U.$$typeof) {
          case Y:
            return T = T.get(
              U.key === null ? M : U.key
            ) || null, _(N, T, U, le);
          case X:
            return T = T.get(
              U.key === null ? M : U.key
            ) || null, R(N, T, U, le);
          case se:
            return U = ra(U), z(
              T,
              N,
              M,
              U,
              le
            );
        }
        if (P(U) || he(U))
          return T = T.get(M) || null, D(N, T, U, le, null);
        if (typeof U.then == "function")
          return z(
            T,
            N,
            M,
            qi(U),
            le
          );
        if (U.$$typeof === q)
          return z(
            T,
            N,
            M,
            Ui(N, U),
            le
          );
        Yi(N, U);
      }
      return null;
    }
    function J(T, N, M, U) {
      for (var le = null, Se = null, W = N, me = N = 0, be = null; W !== null && me < M.length; me++) {
        W.index > me ? (be = W, W = null) : be = W.sibling;
        var je = A(
          T,
          W,
          M[me],
          U
        );
        if (je === null) {
          W === null && (W = be);
          break;
        }
        e && W && je.alternate === null && t(T, W), N = s(je, N, me), Se === null ? le = je : Se.sibling = je, Se = je, W = be;
      }
      if (me === M.length)
        return l(T, W), xe && ol(T, me), le;
      if (W === null) {
        for (; me < M.length; me++)
          W = k(T, M[me], U), W !== null && (N = s(
            W,
            N,
            me
          ), Se === null ? le = W : Se.sibling = W, Se = W);
        return xe && ol(T, me), le;
      }
      for (W = a(W); me < M.length; me++)
        be = z(
          W,
          T,
          me,
          M[me],
          U
        ), be !== null && (e && be.alternate !== null && W.delete(
          be.key === null ? me : be.key
        ), N = s(
          be,
          N,
          me
        ), Se === null ? le = be : Se.sibling = be, Se = be);
      return e && W.forEach(function(Fl) {
        return t(T, Fl);
      }), xe && ol(T, me), le;
    }
    function ne(T, N, M, U) {
      if (M == null) throw Error(r(151));
      for (var le = null, Se = null, W = N, me = N = 0, be = null, je = M.next(); W !== null && !je.done; me++, je = M.next()) {
        W.index > me ? (be = W, W = null) : be = W.sibling;
        var Fl = A(T, W, je.value, U);
        if (Fl === null) {
          W === null && (W = be);
          break;
        }
        e && W && Fl.alternate === null && t(T, W), N = s(Fl, N, me), Se === null ? le = Fl : Se.sibling = Fl, Se = Fl, W = be;
      }
      if (je.done)
        return l(T, W), xe && ol(T, me), le;
      if (W === null) {
        for (; !je.done; me++, je = M.next())
          je = k(T, je.value, U), je !== null && (N = s(je, N, me), Se === null ? le = je : Se.sibling = je, Se = je);
        return xe && ol(T, me), le;
      }
      for (W = a(W); !je.done; me++, je = M.next())
        je = z(W, T, me, je.value, U), je !== null && (e && je.alternate !== null && W.delete(je.key === null ? me : je.key), N = s(je, N, me), Se === null ? le = je : Se.sibling = je, Se = je);
      return e && W.forEach(function(fg) {
        return t(T, fg);
      }), xe && ol(T, me), le;
    }
    function ze(T, N, M, U) {
      if (typeof M == "object" && M !== null && M.type === B && M.key === null && (M = M.props.children), typeof M == "object" && M !== null) {
        switch (M.$$typeof) {
          case Y:
            e: {
              for (var le = M.key; N !== null; ) {
                if (N.key === le) {
                  if (le = M.type, le === B) {
                    if (N.tag === 7) {
                      l(
                        T,
                        N.sibling
                      ), U = n(
                        N,
                        M.props.children
                      ), U.return = T, T = U;
                      break e;
                    }
                  } else if (N.elementType === le || typeof le == "object" && le !== null && le.$$typeof === se && ra(le) === N.type) {
                    l(
                      T,
                      N.sibling
                    ), U = n(N, M.props), Rn(U, M), U.return = T, T = U;
                    break e;
                  }
                  l(T, N);
                  break;
                } else t(T, N);
                N = N.sibling;
              }
              M.type === B ? (U = na(
                M.props.children,
                T.mode,
                U,
                M.key
              ), U.return = T, T = U) : (U = Oi(
                M.type,
                M.key,
                M.props,
                null,
                T.mode,
                U
              ), Rn(U, M), U.return = T, T = U);
            }
            return d(T);
          case X:
            e: {
              for (le = M.key; N !== null; ) {
                if (N.key === le)
                  if (N.tag === 4 && N.stateNode.containerInfo === M.containerInfo && N.stateNode.implementation === M.implementation) {
                    l(
                      T,
                      N.sibling
                    ), U = n(N, M.children || []), U.return = T, T = U;
                    break e;
                  } else {
                    l(T, N);
                    break;
                  }
                else t(T, N);
                N = N.sibling;
              }
              U = zc(M, T.mode, U), U.return = T, T = U;
            }
            return d(T);
          case se:
            return M = ra(M), ze(
              T,
              N,
              M,
              U
            );
        }
        if (P(M))
          return J(
            T,
            N,
            M,
            U
          );
        if (he(M)) {
          if (le = he(M), typeof le != "function") throw Error(r(150));
          return M = le.call(M), ne(
            T,
            N,
            M,
            U
          );
        }
        if (typeof M.then == "function")
          return ze(
            T,
            N,
            qi(M),
            U
          );
        if (M.$$typeof === q)
          return ze(
            T,
            N,
            Ui(T, M),
            U
          );
        Yi(T, M);
      }
      return typeof M == "string" && M !== "" || typeof M == "number" || typeof M == "bigint" ? (M = "" + M, N !== null && N.tag === 6 ? (l(T, N.sibling), U = n(N, M), U.return = T, T = U) : (l(T, N), U = Ac(M, T.mode, U), U.return = T, T = U), d(T)) : l(T, N);
    }
    return function(T, N, M, U) {
      try {
        Mn = 0;
        var le = ze(
          T,
          N,
          M,
          U
        );
        return Ya = null, le;
      } catch (W) {
        if (W === qa || W === Li) throw W;
        var Se = Et(29, W, null, T.mode);
        return Se.lanes = U, Se.return = T, Se;
      } finally {
      }
    };
  }
  var da = Io(!0), ed = Io(!1), Ol = !1;
  function Xc(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Qc(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function Dl(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function Hl(e, t, l) {
    var a = e.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (Ee & 2) !== 0) {
      var n = a.pending;
      return n === null ? t.next = t : (t.next = n.next, n.next = t), a.pending = t, t = wi(e), ko(e, null, l), t;
    }
    return zi(e, a, t, l), wi(e);
  }
  function An(e, t, l) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (l & 4194048) !== 0)) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, Qr(e, l);
    }
  }
  function Zc(e, t) {
    var l = e.updateQueue, a = e.alternate;
    if (a !== null && (a = a.updateQueue, l === a)) {
      var n = null, s = null;
      if (l = l.firstBaseUpdate, l !== null) {
        do {
          var d = {
            lane: l.lane,
            tag: l.tag,
            payload: l.payload,
            callback: null,
            next: null
          };
          s === null ? n = s = d : s = s.next = d, l = l.next;
        } while (l !== null);
        s === null ? n = s = t : s = s.next = t;
      } else n = s = t;
      l = {
        baseState: a.baseState,
        firstBaseUpdate: n,
        lastBaseUpdate: s,
        shared: a.shared,
        callbacks: a.callbacks
      }, e.updateQueue = l;
      return;
    }
    e = l.lastBaseUpdate, e === null ? l.firstBaseUpdate = t : e.next = t, l.lastBaseUpdate = t;
  }
  var Vc = !1;
  function zn() {
    if (Vc) {
      var e = Ba;
      if (e !== null) throw e;
    }
  }
  function wn(e, t, l, a) {
    Vc = !1;
    var n = e.updateQueue;
    Ol = !1;
    var s = n.firstBaseUpdate, d = n.lastBaseUpdate, p = n.shared.pending;
    if (p !== null) {
      n.shared.pending = null;
      var _ = p, R = _.next;
      _.next = null, d === null ? s = R : d.next = R, d = _;
      var D = e.alternate;
      D !== null && (D = D.updateQueue, p = D.lastBaseUpdate, p !== d && (p === null ? D.firstBaseUpdate = R : p.next = R, D.lastBaseUpdate = _));
    }
    if (s !== null) {
      var k = n.baseState;
      d = 0, D = R = _ = null, p = s;
      do {
        var A = p.lane & -536870913, z = A !== p.lane;
        if (z ? (ye & A) === A : (a & A) === A) {
          A !== 0 && A === La && (Vc = !0), D !== null && (D = D.next = {
            lane: 0,
            tag: p.tag,
            payload: p.payload,
            callback: null,
            next: null
          });
          e: {
            var J = e, ne = p;
            A = t;
            var ze = l;
            switch (ne.tag) {
              case 1:
                if (J = ne.payload, typeof J == "function") {
                  k = J.call(ze, k, A);
                  break e;
                }
                k = J;
                break e;
              case 3:
                J.flags = J.flags & -65537 | 128;
              case 0:
                if (J = ne.payload, A = typeof J == "function" ? J.call(ze, k, A) : J, A == null) break e;
                k = x({}, k, A);
                break e;
              case 2:
                Ol = !0;
            }
          }
          A = p.callback, A !== null && (e.flags |= 64, z && (e.flags |= 8192), z = n.callbacks, z === null ? n.callbacks = [A] : z.push(A));
        } else
          z = {
            lane: A,
            tag: p.tag,
            payload: p.payload,
            callback: p.callback,
            next: null
          }, D === null ? (R = D = z, _ = k) : D = D.next = z, d |= A;
        if (p = p.next, p === null) {
          if (p = n.shared.pending, p === null)
            break;
          z = p, p = z.next, z.next = null, n.lastBaseUpdate = z, n.shared.pending = null;
        }
      } while (!0);
      D === null && (_ = k), n.baseState = _, n.firstBaseUpdate = R, n.lastBaseUpdate = D, s === null && (n.shared.lanes = 0), ql |= d, e.lanes = d, e.memoizedState = k;
    }
  }
  function td(e, t) {
    if (typeof e != "function")
      throw Error(r(191, e));
    e.call(t);
  }
  function ld(e, t) {
    var l = e.callbacks;
    if (l !== null)
      for (e.callbacks = null, e = 0; e < l.length; e++)
        td(l[e], t);
  }
  var Ga = j(null), Gi = j(0);
  function ad(e, t) {
    e = _l, Z(Gi, e), Z(Ga, t), _l = e | t.baseLanes;
  }
  function $c() {
    Z(Gi, _l), Z(Ga, Ga.current);
  }
  function Kc() {
    _l = Gi.current, H(Ga), H(Gi);
  }
  var Tt = j(null), Xt = null;
  function Ul(e) {
    var t = e.alternate;
    Z($e, $e.current & 1), Z(Tt, e), Xt === null && (t === null || Ga.current !== null || t.memoizedState !== null) && (Xt = e);
  }
  function Jc(e) {
    Z($e, $e.current), Z(Tt, e), Xt === null && (Xt = e);
  }
  function nd(e) {
    e.tag === 22 ? (Z($e, $e.current), Z(Tt, e), Xt === null && (Xt = e)) : kl();
  }
  function kl() {
    Z($e, $e.current), Z(Tt, Tt.current);
  }
  function Ct(e) {
    H(Tt), Xt === e && (Xt = null), H($e);
  }
  var $e = j(0);
  function Xi(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var l = t.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || tr(l) || lr(l)))
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
  var ml = 0, fe = null, Re = null, We = null, Qi = !1, Xa = !1, fa = !1, Zi = 0, On = 0, Qa = null, lv = 0;
  function Ze() {
    throw Error(r(321));
  }
  function Fc(e, t) {
    if (t === null) return !1;
    for (var l = 0; l < t.length && l < e.length; l++)
      if (!Nt(e[l], t[l])) return !1;
    return !0;
  }
  function Wc(e, t, l, a, n, s) {
    return ml = s, fe = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, C.H = e === null || e.memoizedState === null ? Yd : fu, fa = !1, s = l(a, n), fa = !1, Xa && (s = sd(
      t,
      l,
      a,
      n
    )), id(e), s;
  }
  function id(e) {
    C.H = Un;
    var t = Re !== null && Re.next !== null;
    if (ml = 0, We = Re = fe = null, Qi = !1, On = 0, Qa = null, t) throw Error(r(300));
    e === null || Pe || (e = e.dependencies, e !== null && Hi(e) && (Pe = !0));
  }
  function sd(e, t, l, a) {
    fe = e;
    var n = 0;
    do {
      if (Xa && (Qa = null), On = 0, Xa = !1, 25 <= n) throw Error(r(301));
      if (n += 1, We = Re = null, e.updateQueue != null) {
        var s = e.updateQueue;
        s.lastEffect = null, s.events = null, s.stores = null, s.memoCache != null && (s.memoCache.index = 0);
      }
      C.H = Gd, s = t(l, a);
    } while (Xa);
    return s;
  }
  function av() {
    var e = C.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? Dn(t) : t, e = e.useState()[0], (Re !== null ? Re.memoizedState : null) !== e && (fe.flags |= 1024), t;
  }
  function Pc() {
    var e = Zi !== 0;
    return Zi = 0, e;
  }
  function Ic(e, t, l) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l;
  }
  function eu(e) {
    if (Qi) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      Qi = !1;
    }
    ml = 0, We = Re = fe = null, Xa = !1, On = Zi = 0, Qa = null;
  }
  function ft() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return We === null ? fe.memoizedState = We = e : We = We.next = e, We;
  }
  function Ke() {
    if (Re === null) {
      var e = fe.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Re.next;
    var t = We === null ? fe.memoizedState : We.next;
    if (t !== null)
      We = t, Re = e;
    else {
      if (e === null)
        throw fe.alternate === null ? Error(r(467)) : Error(r(310));
      Re = e, e = {
        memoizedState: Re.memoizedState,
        baseState: Re.baseState,
        baseQueue: Re.baseQueue,
        queue: Re.queue,
        next: null
      }, We === null ? fe.memoizedState = We = e : We = We.next = e;
    }
    return We;
  }
  function Vi() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Dn(e) {
    var t = On;
    return On += 1, Qa === null && (Qa = []), e = Fo(Qa, e, t), t = fe, (We === null ? t.memoizedState : We.next) === null && (t = t.alternate, C.H = t === null || t.memoizedState === null ? Yd : fu), e;
  }
  function $i(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return Dn(e);
      if (e.$$typeof === q) return st(e);
    }
    throw Error(r(438, String(e)));
  }
  function tu(e) {
    var t = null, l = fe.updateQueue;
    if (l !== null && (t = l.memoCache), t == null) {
      var a = fe.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (t = {
        data: a.data.map(function(n) {
          return n.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), l === null && (l = Vi(), fe.updateQueue = l), l.memoCache = t, l = t.data[t.index], l === void 0)
      for (l = t.data[t.index] = Array(e), a = 0; a < e; a++)
        l[a] = Ne;
    return t.index++, l;
  }
  function hl(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function Ki(e) {
    var t = Ke();
    return lu(t, Re, e);
  }
  function lu(e, t, l) {
    var a = e.queue;
    if (a === null) throw Error(r(311));
    a.lastRenderedReducer = l;
    var n = e.baseQueue, s = a.pending;
    if (s !== null) {
      if (n !== null) {
        var d = n.next;
        n.next = s.next, s.next = d;
      }
      t.baseQueue = n = s, a.pending = null;
    }
    if (s = e.baseState, n === null) e.memoizedState = s;
    else {
      t = n.next;
      var p = d = null, _ = null, R = t, D = !1;
      do {
        var k = R.lane & -536870913;
        if (k !== R.lane ? (ye & k) === k : (ml & k) === k) {
          var A = R.revertLane;
          if (A === 0)
            _ !== null && (_ = _.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: R.action,
              hasEagerState: R.hasEagerState,
              eagerState: R.eagerState,
              next: null
            }), k === La && (D = !0);
          else if ((ml & A) === A) {
            R = R.next, A === La && (D = !0);
            continue;
          } else
            k = {
              lane: 0,
              revertLane: R.revertLane,
              gesture: null,
              action: R.action,
              hasEagerState: R.hasEagerState,
              eagerState: R.eagerState,
              next: null
            }, _ === null ? (p = _ = k, d = s) : _ = _.next = k, fe.lanes |= A, ql |= A;
          k = R.action, fa && l(s, k), s = R.hasEagerState ? R.eagerState : l(s, k);
        } else
          A = {
            lane: k,
            revertLane: R.revertLane,
            gesture: R.gesture,
            action: R.action,
            hasEagerState: R.hasEagerState,
            eagerState: R.eagerState,
            next: null
          }, _ === null ? (p = _ = A, d = s) : _ = _.next = A, fe.lanes |= k, ql |= k;
        R = R.next;
      } while (R !== null && R !== t);
      if (_ === null ? d = s : _.next = p, !Nt(s, e.memoizedState) && (Pe = !0, D && (l = Ba, l !== null)))
        throw l;
      e.memoizedState = s, e.baseState = d, e.baseQueue = _, a.lastRenderedState = s;
    }
    return n === null && (a.lanes = 0), [e.memoizedState, a.dispatch];
  }
  function au(e) {
    var t = Ke(), l = t.queue;
    if (l === null) throw Error(r(311));
    l.lastRenderedReducer = e;
    var a = l.dispatch, n = l.pending, s = t.memoizedState;
    if (n !== null) {
      l.pending = null;
      var d = n = n.next;
      do
        s = e(s, d.action), d = d.next;
      while (d !== n);
      Nt(s, t.memoizedState) || (Pe = !0), t.memoizedState = s, t.baseQueue === null && (t.baseState = s), l.lastRenderedState = s;
    }
    return [s, a];
  }
  function cd(e, t, l) {
    var a = fe, n = Ke(), s = xe;
    if (s) {
      if (l === void 0) throw Error(r(407));
      l = l();
    } else l = t();
    var d = !Nt(
      (Re || n).memoizedState,
      l
    );
    if (d && (n.memoizedState = l, Pe = !0), n = n.queue, su(od.bind(null, a, n, e), [
      e
    ]), n.getSnapshot !== t || d || We !== null && We.memoizedState.tag & 1) {
      if (a.flags |= 2048, Za(
        9,
        { destroy: void 0 },
        rd.bind(
          null,
          a,
          n,
          l,
          t
        ),
        null
      ), Oe === null) throw Error(r(349));
      s || (ml & 127) !== 0 || ud(a, t, l);
    }
    return l;
  }
  function ud(e, t, l) {
    e.flags |= 16384, e = { getSnapshot: t, value: l }, t = fe.updateQueue, t === null ? (t = Vi(), fe.updateQueue = t, t.stores = [e]) : (l = t.stores, l === null ? t.stores = [e] : l.push(e));
  }
  function rd(e, t, l, a) {
    t.value = l, t.getSnapshot = a, dd(t) && fd(e);
  }
  function od(e, t, l) {
    return l(function() {
      dd(t) && fd(e);
    });
  }
  function dd(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var l = t();
      return !Nt(e, l);
    } catch {
      return !0;
    }
  }
  function fd(e) {
    var t = aa(e, 2);
    t !== null && bt(t, e, 2);
  }
  function nu(e) {
    var t = ft();
    if (typeof e == "function") {
      var l = e;
      if (e = l(), fa) {
        Tl(!0);
        try {
          l();
        } finally {
          Tl(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = e, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: hl,
      lastRenderedState: e
    }, t;
  }
  function md(e, t, l, a) {
    return e.baseState = l, lu(
      e,
      Re,
      typeof a == "function" ? a : hl
    );
  }
  function nv(e, t, l, a, n) {
    if (Wi(e)) throw Error(r(485));
    if (e = t.action, e !== null) {
      var s = {
        payload: n,
        action: e,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(d) {
          s.listeners.push(d);
        }
      };
      C.T !== null ? l(!0) : s.isTransition = !1, a(s), l = t.pending, l === null ? (s.next = t.pending = s, hd(t, s)) : (s.next = l.next, t.pending = l.next = s);
    }
  }
  function hd(e, t) {
    var l = t.action, a = t.payload, n = e.state;
    if (t.isTransition) {
      var s = C.T, d = {};
      C.T = d;
      try {
        var p = l(n, a), _ = C.S;
        _ !== null && _(d, p), pd(e, t, p);
      } catch (R) {
        iu(e, t, R);
      } finally {
        s !== null && d.types !== null && (s.types = d.types), C.T = s;
      }
    } else
      try {
        s = l(n, a), pd(e, t, s);
      } catch (R) {
        iu(e, t, R);
      }
  }
  function pd(e, t, l) {
    l !== null && typeof l == "object" && typeof l.then == "function" ? l.then(
      function(a) {
        vd(e, t, a);
      },
      function(a) {
        return iu(e, t, a);
      }
    ) : vd(e, t, l);
  }
  function vd(e, t, l) {
    t.status = "fulfilled", t.value = l, gd(t), e.state = l, t = e.pending, t !== null && (l = t.next, l === t ? e.pending = null : (l = l.next, t.next = l, hd(e, l)));
  }
  function iu(e, t, l) {
    var a = e.pending;
    if (e.pending = null, a !== null) {
      a = a.next;
      do
        t.status = "rejected", t.reason = l, gd(t), t = t.next;
      while (t !== a);
    }
    e.action = null;
  }
  function gd(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function yd(e, t) {
    return t;
  }
  function bd(e, t) {
    if (xe) {
      var l = Oe.formState;
      if (l !== null) {
        e: {
          var a = fe;
          if (xe) {
            if (ke) {
              t: {
                for (var n = ke, s = Gt; n.nodeType !== 8; ) {
                  if (!s) {
                    n = null;
                    break t;
                  }
                  if (n = Qt(
                    n.nextSibling
                  ), n === null) {
                    n = null;
                    break t;
                  }
                }
                s = n.data, n = s === "F!" || s === "F" ? n : null;
              }
              if (n) {
                ke = Qt(
                  n.nextSibling
                ), a = n.data === "F!";
                break e;
              }
            }
            zl(a);
          }
          a = !1;
        }
        a && (t = l[0]);
      }
    }
    return l = ft(), l.memoizedState = l.baseState = t, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: yd,
      lastRenderedState: t
    }, l.queue = a, l = Ld.bind(
      null,
      fe,
      a
    ), a.dispatch = l, a = nu(!1), s = du.bind(
      null,
      fe,
      !1,
      a.queue
    ), a = ft(), n = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, a.queue = n, l = nv.bind(
      null,
      fe,
      n,
      s,
      l
    ), n.dispatch = l, a.memoizedState = e, [t, l, !1];
  }
  function xd(e) {
    var t = Ke();
    return _d(t, Re, e);
  }
  function _d(e, t, l) {
    if (t = lu(
      e,
      t,
      yd
    )[0], e = Ki(hl)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var a = Dn(t);
      } catch (d) {
        throw d === qa ? Li : d;
      }
    else a = t;
    t = Ke();
    var n = t.queue, s = n.dispatch;
    return l !== t.memoizedState && (fe.flags |= 2048, Za(
      9,
      { destroy: void 0 },
      iv.bind(null, n, l),
      null
    )), [a, s, e];
  }
  function iv(e, t) {
    e.action = t;
  }
  function Sd(e) {
    var t = Ke(), l = Re;
    if (l !== null)
      return _d(t, l, e);
    Ke(), t = t.memoizedState, l = Ke();
    var a = l.queue.dispatch;
    return l.memoizedState = e, [t, a, !1];
  }
  function Za(e, t, l, a) {
    return e = { tag: e, create: l, deps: a, inst: t, next: null }, t = fe.updateQueue, t === null && (t = Vi(), fe.updateQueue = t), l = t.lastEffect, l === null ? t.lastEffect = e.next = e : (a = l.next, l.next = e, e.next = a, t.lastEffect = e), e;
  }
  function jd() {
    return Ke().memoizedState;
  }
  function Ji(e, t, l, a) {
    var n = ft();
    fe.flags |= e, n.memoizedState = Za(
      1 | t,
      { destroy: void 0 },
      l,
      a === void 0 ? null : a
    );
  }
  function Fi(e, t, l, a) {
    var n = Ke();
    a = a === void 0 ? null : a;
    var s = n.memoizedState.inst;
    Re !== null && a !== null && Fc(a, Re.memoizedState.deps) ? n.memoizedState = Za(t, s, l, a) : (fe.flags |= e, n.memoizedState = Za(
      1 | t,
      s,
      l,
      a
    ));
  }
  function Nd(e, t) {
    Ji(8390656, 8, e, t);
  }
  function su(e, t) {
    Fi(2048, 8, e, t);
  }
  function sv(e) {
    fe.flags |= 4;
    var t = fe.updateQueue;
    if (t === null)
      t = Vi(), fe.updateQueue = t, t.events = [e];
    else {
      var l = t.events;
      l === null ? t.events = [e] : l.push(e);
    }
  }
  function Ed(e) {
    var t = Ke().memoizedState;
    return sv({ ref: t, nextImpl: e }), function() {
      if ((Ee & 2) !== 0) throw Error(r(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function Td(e, t) {
    return Fi(4, 2, e, t);
  }
  function Cd(e, t) {
    return Fi(4, 4, e, t);
  }
  function Md(e, t) {
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
  function Rd(e, t, l) {
    l = l != null ? l.concat([e]) : null, Fi(4, 4, Md.bind(null, t, e), l);
  }
  function cu() {
  }
  function Ad(e, t) {
    var l = Ke();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    return t !== null && Fc(t, a[1]) ? a[0] : (l.memoizedState = [e, t], e);
  }
  function zd(e, t) {
    var l = Ke();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    if (t !== null && Fc(t, a[1]))
      return a[0];
    if (a = e(), fa) {
      Tl(!0);
      try {
        e();
      } finally {
        Tl(!1);
      }
    }
    return l.memoizedState = [a, t], a;
  }
  function uu(e, t, l) {
    return l === void 0 || (ml & 1073741824) !== 0 && (ye & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = l, e = Of(), fe.lanes |= e, ql |= e, l);
  }
  function wd(e, t, l, a) {
    return Nt(l, t) ? l : Ga.current !== null ? (e = uu(e, l, a), Nt(e, t) || (Pe = !0), e) : (ml & 42) === 0 || (ml & 1073741824) !== 0 && (ye & 261930) === 0 ? (Pe = !0, e.memoizedState = l) : (e = Of(), fe.lanes |= e, ql |= e, t);
  }
  function Od(e, t, l, a, n) {
    var s = L.p;
    L.p = s !== 0 && 8 > s ? s : 8;
    var d = C.T, p = {};
    C.T = p, du(e, !1, t, l);
    try {
      var _ = n(), R = C.S;
      if (R !== null && R(p, _), _ !== null && typeof _ == "object" && typeof _.then == "function") {
        var D = tv(
          _,
          a
        );
        Hn(
          e,
          t,
          D,
          At(e)
        );
      } else
        Hn(
          e,
          t,
          a,
          At(e)
        );
    } catch (k) {
      Hn(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: k },
        At()
      );
    } finally {
      L.p = s, d !== null && p.types !== null && (d.types = p.types), C.T = d;
    }
  }
  function cv() {
  }
  function ru(e, t, l, a) {
    if (e.tag !== 5) throw Error(r(476));
    var n = Dd(e).queue;
    Od(
      e,
      n,
      t,
      $,
      l === null ? cv : function() {
        return Hd(e), l(a);
      }
    );
  }
  function Dd(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: $,
      baseState: $,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: hl,
        lastRenderedState: $
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
        lastRenderedReducer: hl,
        lastRenderedState: l
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function Hd(e) {
    var t = Dd(e);
    t.next === null && (t = e.alternate.memoizedState), Hn(
      e,
      t.next.queue,
      {},
      At()
    );
  }
  function ou() {
    return st(Pn);
  }
  function Ud() {
    return Ke().memoizedState;
  }
  function kd() {
    return Ke().memoizedState;
  }
  function uv(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var l = At();
          e = Dl(l);
          var a = Hl(t, e, l);
          a !== null && (bt(a, t, l), An(a, t, l)), t = { cache: Bc() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function rv(e, t, l) {
    var a = At();
    l = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Wi(e) ? Bd(t, l) : (l = Mc(e, t, l, a), l !== null && (bt(l, e, a), qd(l, t, a)));
  }
  function Ld(e, t, l) {
    var a = At();
    Hn(e, t, l, a);
  }
  function Hn(e, t, l, a) {
    var n = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (Wi(e)) Bd(t, n);
    else {
      var s = e.alternate;
      if (e.lanes === 0 && (s === null || s.lanes === 0) && (s = t.lastRenderedReducer, s !== null))
        try {
          var d = t.lastRenderedState, p = s(d, l);
          if (n.hasEagerState = !0, n.eagerState = p, Nt(p, d))
            return zi(e, t, n, 0), Oe === null && Ai(), !1;
        } catch {
        } finally {
        }
      if (l = Mc(e, t, n, a), l !== null)
        return bt(l, e, a), qd(l, t, a), !0;
    }
    return !1;
  }
  function du(e, t, l, a) {
    if (a = {
      lane: 2,
      revertLane: Xu(),
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Wi(e)) {
      if (t) throw Error(r(479));
    } else
      t = Mc(
        e,
        l,
        a,
        2
      ), t !== null && bt(t, e, 2);
  }
  function Wi(e) {
    var t = e.alternate;
    return e === fe || t !== null && t === fe;
  }
  function Bd(e, t) {
    Xa = Qi = !0;
    var l = e.pending;
    l === null ? t.next = t : (t.next = l.next, l.next = t), e.pending = t;
  }
  function qd(e, t, l) {
    if ((l & 4194048) !== 0) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, Qr(e, l);
    }
  }
  var Un = {
    readContext: st,
    use: $i,
    useCallback: Ze,
    useContext: Ze,
    useEffect: Ze,
    useImperativeHandle: Ze,
    useLayoutEffect: Ze,
    useInsertionEffect: Ze,
    useMemo: Ze,
    useReducer: Ze,
    useRef: Ze,
    useState: Ze,
    useDebugValue: Ze,
    useDeferredValue: Ze,
    useTransition: Ze,
    useSyncExternalStore: Ze,
    useId: Ze,
    useHostTransitionStatus: Ze,
    useFormState: Ze,
    useActionState: Ze,
    useOptimistic: Ze,
    useMemoCache: Ze,
    useCacheRefresh: Ze
  };
  Un.useEffectEvent = Ze;
  var Yd = {
    readContext: st,
    use: $i,
    useCallback: function(e, t) {
      return ft().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: st,
    useEffect: Nd,
    useImperativeHandle: function(e, t, l) {
      l = l != null ? l.concat([e]) : null, Ji(
        4194308,
        4,
        Md.bind(null, t, e),
        l
      );
    },
    useLayoutEffect: function(e, t) {
      return Ji(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      Ji(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var l = ft();
      t = t === void 0 ? null : t;
      var a = e();
      if (fa) {
        Tl(!0);
        try {
          e();
        } finally {
          Tl(!1);
        }
      }
      return l.memoizedState = [a, t], a;
    },
    useReducer: function(e, t, l) {
      var a = ft();
      if (l !== void 0) {
        var n = l(t);
        if (fa) {
          Tl(!0);
          try {
            l(t);
          } finally {
            Tl(!1);
          }
        }
      } else n = t;
      return a.memoizedState = a.baseState = n, e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: n
      }, a.queue = e, e = e.dispatch = rv.bind(
        null,
        fe,
        e
      ), [a.memoizedState, e];
    },
    useRef: function(e) {
      var t = ft();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = nu(e);
      var t = e.queue, l = Ld.bind(null, fe, t);
      return t.dispatch = l, [e.memoizedState, l];
    },
    useDebugValue: cu,
    useDeferredValue: function(e, t) {
      var l = ft();
      return uu(l, e, t);
    },
    useTransition: function() {
      var e = nu(!1);
      return e = Od.bind(
        null,
        fe,
        e.queue,
        !0,
        !1
      ), ft().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, l) {
      var a = fe, n = ft();
      if (xe) {
        if (l === void 0)
          throw Error(r(407));
        l = l();
      } else {
        if (l = t(), Oe === null)
          throw Error(r(349));
        (ye & 127) !== 0 || ud(a, t, l);
      }
      n.memoizedState = l;
      var s = { value: l, getSnapshot: t };
      return n.queue = s, Nd(od.bind(null, a, s, e), [
        e
      ]), a.flags |= 2048, Za(
        9,
        { destroy: void 0 },
        rd.bind(
          null,
          a,
          s,
          l,
          t
        ),
        null
      ), l;
    },
    useId: function() {
      var e = ft(), t = Oe.identifierPrefix;
      if (xe) {
        var l = tl, a = el;
        l = (a & ~(1 << 32 - jt(a) - 1)).toString(32) + l, t = "_" + t + "R_" + l, l = Zi++, 0 < l && (t += "H" + l.toString(32)), t += "_";
      } else
        l = lv++, t = "_" + t + "r_" + l.toString(32) + "_";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: ou,
    useFormState: bd,
    useActionState: bd,
    useOptimistic: function(e) {
      var t = ft();
      t.memoizedState = t.baseState = e;
      var l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = l, t = du.bind(
        null,
        fe,
        !0,
        l
      ), l.dispatch = t, [e, t];
    },
    useMemoCache: tu,
    useCacheRefresh: function() {
      return ft().memoizedState = uv.bind(
        null,
        fe
      );
    },
    useEffectEvent: function(e) {
      var t = ft(), l = { impl: e };
      return t.memoizedState = l, function() {
        if ((Ee & 2) !== 0)
          throw Error(r(440));
        return l.impl.apply(void 0, arguments);
      };
    }
  }, fu = {
    readContext: st,
    use: $i,
    useCallback: Ad,
    useContext: st,
    useEffect: su,
    useImperativeHandle: Rd,
    useInsertionEffect: Td,
    useLayoutEffect: Cd,
    useMemo: zd,
    useReducer: Ki,
    useRef: jd,
    useState: function() {
      return Ki(hl);
    },
    useDebugValue: cu,
    useDeferredValue: function(e, t) {
      var l = Ke();
      return wd(
        l,
        Re.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = Ki(hl)[0], t = Ke().memoizedState;
      return [
        typeof e == "boolean" ? e : Dn(e),
        t
      ];
    },
    useSyncExternalStore: cd,
    useId: Ud,
    useHostTransitionStatus: ou,
    useFormState: xd,
    useActionState: xd,
    useOptimistic: function(e, t) {
      var l = Ke();
      return md(l, Re, e, t);
    },
    useMemoCache: tu,
    useCacheRefresh: kd
  };
  fu.useEffectEvent = Ed;
  var Gd = {
    readContext: st,
    use: $i,
    useCallback: Ad,
    useContext: st,
    useEffect: su,
    useImperativeHandle: Rd,
    useInsertionEffect: Td,
    useLayoutEffect: Cd,
    useMemo: zd,
    useReducer: au,
    useRef: jd,
    useState: function() {
      return au(hl);
    },
    useDebugValue: cu,
    useDeferredValue: function(e, t) {
      var l = Ke();
      return Re === null ? uu(l, e, t) : wd(
        l,
        Re.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = au(hl)[0], t = Ke().memoizedState;
      return [
        typeof e == "boolean" ? e : Dn(e),
        t
      ];
    },
    useSyncExternalStore: cd,
    useId: Ud,
    useHostTransitionStatus: ou,
    useFormState: Sd,
    useActionState: Sd,
    useOptimistic: function(e, t) {
      var l = Ke();
      return Re !== null ? md(l, Re, e, t) : (l.baseState = e, [e, l.queue.dispatch]);
    },
    useMemoCache: tu,
    useCacheRefresh: kd
  };
  Gd.useEffectEvent = Ed;
  function mu(e, t, l, a) {
    t = e.memoizedState, l = l(a, t), l = l == null ? t : x({}, t, l), e.memoizedState = l, e.lanes === 0 && (e.updateQueue.baseState = l);
  }
  var hu = {
    enqueueSetState: function(e, t, l) {
      e = e._reactInternals;
      var a = At(), n = Dl(a);
      n.payload = t, l != null && (n.callback = l), t = Hl(e, n, a), t !== null && (bt(t, e, a), An(t, e, a));
    },
    enqueueReplaceState: function(e, t, l) {
      e = e._reactInternals;
      var a = At(), n = Dl(a);
      n.tag = 1, n.payload = t, l != null && (n.callback = l), t = Hl(e, n, a), t !== null && (bt(t, e, a), An(t, e, a));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var l = At(), a = Dl(l);
      a.tag = 2, t != null && (a.callback = t), t = Hl(e, a, l), t !== null && (bt(t, e, l), An(t, e, l));
    }
  };
  function Xd(e, t, l, a, n, s, d) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(a, s, d) : t.prototype && t.prototype.isPureReactComponent ? !Sn(l, a) || !Sn(n, s) : !0;
  }
  function Qd(e, t, l, a) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(l, a), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(l, a), t.state !== e && hu.enqueueReplaceState(t, t.state, null);
  }
  function ma(e, t) {
    var l = t;
    if ("ref" in t) {
      l = {};
      for (var a in t)
        a !== "ref" && (l[a] = t[a]);
    }
    if (e = e.defaultProps) {
      l === t && (l = x({}, l));
      for (var n in e)
        l[n] === void 0 && (l[n] = e[n]);
    }
    return l;
  }
  function Zd(e) {
    Ri(e);
  }
  function Vd(e) {
    console.error(e);
  }
  function $d(e) {
    Ri(e);
  }
  function Pi(e, t) {
    try {
      var l = e.onUncaughtError;
      l(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function Kd(e, t, l) {
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
  function pu(e, t, l) {
    return l = Dl(l), l.tag = 3, l.payload = { element: null }, l.callback = function() {
      Pi(e, t);
    }, l;
  }
  function Jd(e) {
    return e = Dl(e), e.tag = 3, e;
  }
  function Fd(e, t, l, a) {
    var n = l.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var s = a.value;
      e.payload = function() {
        return n(s);
      }, e.callback = function() {
        Kd(t, l, a);
      };
    }
    var d = l.stateNode;
    d !== null && typeof d.componentDidCatch == "function" && (e.callback = function() {
      Kd(t, l, a), typeof n != "function" && (Yl === null ? Yl = /* @__PURE__ */ new Set([this]) : Yl.add(this));
      var p = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: p !== null ? p : ""
      });
    });
  }
  function ov(e, t, l, a, n) {
    if (l.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (t = l.alternate, t !== null && ka(
        t,
        l,
        n,
        !0
      ), l = Tt.current, l !== null) {
        switch (l.tag) {
          case 31:
          case 13:
            return Xt === null ? os() : l.alternate === null && Ve === 0 && (Ve = 3), l.flags &= -257, l.flags |= 65536, l.lanes = n, a === Bi ? l.flags |= 16384 : (t = l.updateQueue, t === null ? l.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), qu(e, a, n)), !1;
          case 22:
            return l.flags |= 65536, a === Bi ? l.flags |= 16384 : (t = l.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, l.updateQueue = t) : (l = t.retryQueue, l === null ? t.retryQueue = /* @__PURE__ */ new Set([a]) : l.add(a)), qu(e, a, n)), !1;
        }
        throw Error(r(435, l.tag));
      }
      return qu(e, a, n), os(), !1;
    }
    if (xe)
      return t = Tt.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = n, a !== Dc && (e = Error(r(422), { cause: a }), En(Bt(e, l)))) : (a !== Dc && (t = Error(r(423), {
        cause: a
      }), En(
        Bt(t, l)
      )), e = e.current.alternate, e.flags |= 65536, n &= -n, e.lanes |= n, a = Bt(a, l), n = pu(
        e.stateNode,
        a,
        n
      ), Zc(e, n), Ve !== 4 && (Ve = 2)), !1;
    var s = Error(r(520), { cause: a });
    if (s = Bt(s, l), Qn === null ? Qn = [s] : Qn.push(s), Ve !== 4 && (Ve = 2), t === null) return !0;
    a = Bt(a, l), l = t;
    do {
      switch (l.tag) {
        case 3:
          return l.flags |= 65536, e = n & -n, l.lanes |= e, e = pu(l.stateNode, a, e), Zc(l, e), !1;
        case 1:
          if (t = l.type, s = l.stateNode, (l.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || s !== null && typeof s.componentDidCatch == "function" && (Yl === null || !Yl.has(s))))
            return l.flags |= 65536, n &= -n, l.lanes |= n, n = Jd(n), Fd(
              n,
              e,
              l,
              a
            ), Zc(l, n), !1;
      }
      l = l.return;
    } while (l !== null);
    return !1;
  }
  var vu = Error(r(461)), Pe = !1;
  function ct(e, t, l, a) {
    t.child = e === null ? ed(t, null, l, a) : da(
      t,
      e.child,
      l,
      a
    );
  }
  function Wd(e, t, l, a, n) {
    l = l.render;
    var s = t.ref;
    if ("ref" in a) {
      var d = {};
      for (var p in a)
        p !== "ref" && (d[p] = a[p]);
    } else d = a;
    return ca(t), a = Wc(
      e,
      t,
      l,
      d,
      s,
      n
    ), p = Pc(), e !== null && !Pe ? (Ic(e, t, n), pl(e, t, n)) : (xe && p && wc(t), t.flags |= 1, ct(e, t, a, n), t.child);
  }
  function Pd(e, t, l, a, n) {
    if (e === null) {
      var s = l.type;
      return typeof s == "function" && !Rc(s) && s.defaultProps === void 0 && l.compare === null ? (t.tag = 15, t.type = s, Id(
        e,
        t,
        s,
        a,
        n
      )) : (e = Oi(
        l.type,
        null,
        a,
        t,
        t.mode,
        n
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (s = e.child, !Nu(e, n)) {
      var d = s.memoizedProps;
      if (l = l.compare, l = l !== null ? l : Sn, l(d, a) && e.ref === t.ref)
        return pl(e, t, n);
    }
    return t.flags |= 1, e = rl(s, a), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Id(e, t, l, a, n) {
    if (e !== null) {
      var s = e.memoizedProps;
      if (Sn(s, a) && e.ref === t.ref)
        if (Pe = !1, t.pendingProps = a = s, Nu(e, n))
          (e.flags & 131072) !== 0 && (Pe = !0);
        else
          return t.lanes = e.lanes, pl(e, t, n);
    }
    return gu(
      e,
      t,
      l,
      a,
      n
    );
  }
  function ef(e, t, l, a) {
    var n = a.children, s = e !== null ? e.memoizedState : null;
    if (e === null && t.stateNode === null && (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), a.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (s = s !== null ? s.baseLanes | l : l, e !== null) {
          for (a = t.child = e.child, n = 0; a !== null; )
            n = n | a.lanes | a.childLanes, a = a.sibling;
          a = n & ~s;
        } else a = 0, t.child = null;
        return tf(
          e,
          t,
          s,
          l,
          a
        );
      }
      if ((l & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && ki(
          t,
          s !== null ? s.cachePool : null
        ), s !== null ? ad(t, s) : $c(), nd(t);
      else
        return a = t.lanes = 536870912, tf(
          e,
          t,
          s !== null ? s.baseLanes | l : l,
          l,
          a
        );
    } else
      s !== null ? (ki(t, s.cachePool), ad(t, s), kl(), t.memoizedState = null) : (e !== null && ki(t, null), $c(), kl());
    return ct(e, t, n, l), t.child;
  }
  function kn(e, t) {
    return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function tf(e, t, l, a, n) {
    var s = Yc();
    return s = s === null ? null : { parent: Fe._currentValue, pool: s }, t.memoizedState = {
      baseLanes: l,
      cachePool: s
    }, e !== null && ki(t, null), $c(), nd(t), e !== null && ka(e, t, a, !0), t.childLanes = n, null;
  }
  function Ii(e, t) {
    return t = ts(
      { mode: t.mode, children: t.children },
      e.mode
    ), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function lf(e, t, l) {
    return da(t, e.child, null, l), e = Ii(t, t.pendingProps), e.flags |= 2, Ct(t), t.memoizedState = null, e;
  }
  function dv(e, t, l) {
    var a = t.pendingProps, n = (t.flags & 128) !== 0;
    if (t.flags &= -129, e === null) {
      if (xe) {
        if (a.mode === "hidden")
          return e = Ii(t, a), t.lanes = 536870912, kn(null, e);
        if (Jc(t), (e = ke) ? (e = pm(
          e,
          Gt
        ), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: Rl !== null ? { id: el, overflow: tl } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, l = Bo(e), l.return = t, t.child = l, it = t, ke = null)) : e = null, e === null) throw zl(t);
        return t.lanes = 536870912, null;
      }
      return Ii(t, a);
    }
    var s = e.memoizedState;
    if (s !== null) {
      var d = s.dehydrated;
      if (Jc(t), n)
        if (t.flags & 256)
          t.flags &= -257, t = lf(
            e,
            t,
            l
          );
        else if (t.memoizedState !== null)
          t.child = e.child, t.flags |= 128, t = null;
        else throw Error(r(558));
      else if (Pe || ka(e, t, l, !1), n = (l & e.childLanes) !== 0, Pe || n) {
        if (a = Oe, a !== null && (d = Zr(a, l), d !== 0 && d !== s.retryLane))
          throw s.retryLane = d, aa(e, d), bt(a, e, d), vu;
        os(), t = lf(
          e,
          t,
          l
        );
      } else
        e = s.treeContext, ke = Qt(d.nextSibling), it = t, xe = !0, Al = null, Gt = !1, e !== null && Go(t, e), t = Ii(t, a), t.flags |= 4096;
      return t;
    }
    return e = rl(e.child, {
      mode: a.mode,
      children: a.children
    }), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function es(e, t) {
    var l = t.ref;
    if (l === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof l != "function" && typeof l != "object")
        throw Error(r(284));
      (e === null || e.ref !== l) && (t.flags |= 4194816);
    }
  }
  function gu(e, t, l, a, n) {
    return ca(t), l = Wc(
      e,
      t,
      l,
      a,
      void 0,
      n
    ), a = Pc(), e !== null && !Pe ? (Ic(e, t, n), pl(e, t, n)) : (xe && a && wc(t), t.flags |= 1, ct(e, t, l, n), t.child);
  }
  function af(e, t, l, a, n, s) {
    return ca(t), t.updateQueue = null, l = sd(
      t,
      a,
      l,
      n
    ), id(e), a = Pc(), e !== null && !Pe ? (Ic(e, t, s), pl(e, t, s)) : (xe && a && wc(t), t.flags |= 1, ct(e, t, l, s), t.child);
  }
  function nf(e, t, l, a, n) {
    if (ca(t), t.stateNode === null) {
      var s = Oa, d = l.contextType;
      typeof d == "object" && d !== null && (s = st(d)), s = new l(a, s), t.memoizedState = s.state !== null && s.state !== void 0 ? s.state : null, s.updater = hu, t.stateNode = s, s._reactInternals = t, s = t.stateNode, s.props = a, s.state = t.memoizedState, s.refs = {}, Xc(t), d = l.contextType, s.context = typeof d == "object" && d !== null ? st(d) : Oa, s.state = t.memoizedState, d = l.getDerivedStateFromProps, typeof d == "function" && (mu(
        t,
        l,
        d,
        a
      ), s.state = t.memoizedState), typeof l.getDerivedStateFromProps == "function" || typeof s.getSnapshotBeforeUpdate == "function" || typeof s.UNSAFE_componentWillMount != "function" && typeof s.componentWillMount != "function" || (d = s.state, typeof s.componentWillMount == "function" && s.componentWillMount(), typeof s.UNSAFE_componentWillMount == "function" && s.UNSAFE_componentWillMount(), d !== s.state && hu.enqueueReplaceState(s, s.state, null), wn(t, a, s, n), zn(), s.state = t.memoizedState), typeof s.componentDidMount == "function" && (t.flags |= 4194308), a = !0;
    } else if (e === null) {
      s = t.stateNode;
      var p = t.memoizedProps, _ = ma(l, p);
      s.props = _;
      var R = s.context, D = l.contextType;
      d = Oa, typeof D == "object" && D !== null && (d = st(D));
      var k = l.getDerivedStateFromProps;
      D = typeof k == "function" || typeof s.getSnapshotBeforeUpdate == "function", p = t.pendingProps !== p, D || typeof s.UNSAFE_componentWillReceiveProps != "function" && typeof s.componentWillReceiveProps != "function" || (p || R !== d) && Qd(
        t,
        s,
        a,
        d
      ), Ol = !1;
      var A = t.memoizedState;
      s.state = A, wn(t, a, s, n), zn(), R = t.memoizedState, p || A !== R || Ol ? (typeof k == "function" && (mu(
        t,
        l,
        k,
        a
      ), R = t.memoizedState), (_ = Ol || Xd(
        t,
        l,
        _,
        a,
        A,
        R,
        d
      )) ? (D || typeof s.UNSAFE_componentWillMount != "function" && typeof s.componentWillMount != "function" || (typeof s.componentWillMount == "function" && s.componentWillMount(), typeof s.UNSAFE_componentWillMount == "function" && s.UNSAFE_componentWillMount()), typeof s.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof s.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = R), s.props = a, s.state = R, s.context = d, a = _) : (typeof s.componentDidMount == "function" && (t.flags |= 4194308), a = !1);
    } else {
      s = t.stateNode, Qc(e, t), d = t.memoizedProps, D = ma(l, d), s.props = D, k = t.pendingProps, A = s.context, R = l.contextType, _ = Oa, typeof R == "object" && R !== null && (_ = st(R)), p = l.getDerivedStateFromProps, (R = typeof p == "function" || typeof s.getSnapshotBeforeUpdate == "function") || typeof s.UNSAFE_componentWillReceiveProps != "function" && typeof s.componentWillReceiveProps != "function" || (d !== k || A !== _) && Qd(
        t,
        s,
        a,
        _
      ), Ol = !1, A = t.memoizedState, s.state = A, wn(t, a, s, n), zn();
      var z = t.memoizedState;
      d !== k || A !== z || Ol || e !== null && e.dependencies !== null && Hi(e.dependencies) ? (typeof p == "function" && (mu(
        t,
        l,
        p,
        a
      ), z = t.memoizedState), (D = Ol || Xd(
        t,
        l,
        D,
        a,
        A,
        z,
        _
      ) || e !== null && e.dependencies !== null && Hi(e.dependencies)) ? (R || typeof s.UNSAFE_componentWillUpdate != "function" && typeof s.componentWillUpdate != "function" || (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(a, z, _), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(
        a,
        z,
        _
      )), typeof s.componentDidUpdate == "function" && (t.flags |= 4), typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof s.componentDidUpdate != "function" || d === e.memoizedProps && A === e.memoizedState || (t.flags |= 4), typeof s.getSnapshotBeforeUpdate != "function" || d === e.memoizedProps && A === e.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = z), s.props = a, s.state = z, s.context = _, a = D) : (typeof s.componentDidUpdate != "function" || d === e.memoizedProps && A === e.memoizedState || (t.flags |= 4), typeof s.getSnapshotBeforeUpdate != "function" || d === e.memoizedProps && A === e.memoizedState || (t.flags |= 1024), a = !1);
    }
    return s = a, es(e, t), a = (t.flags & 128) !== 0, s || a ? (s = t.stateNode, l = a && typeof l.getDerivedStateFromError != "function" ? null : s.render(), t.flags |= 1, e !== null && a ? (t.child = da(
      t,
      e.child,
      null,
      n
    ), t.child = da(
      t,
      null,
      l,
      n
    )) : ct(e, t, l, n), t.memoizedState = s.state, e = t.child) : e = pl(
      e,
      t,
      n
    ), e;
  }
  function sf(e, t, l, a) {
    return ia(), t.flags |= 256, ct(e, t, l, a), t.child;
  }
  var yu = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function bu(e) {
    return { baseLanes: e, cachePool: Ko() };
  }
  function xu(e, t, l) {
    return e = e !== null ? e.childLanes & ~l : 0, t && (e |= Rt), e;
  }
  function cf(e, t, l) {
    var a = t.pendingProps, n = !1, s = (t.flags & 128) !== 0, d;
    if ((d = s) || (d = e !== null && e.memoizedState === null ? !1 : ($e.current & 2) !== 0), d && (n = !0, t.flags &= -129), d = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (xe) {
        if (n ? Ul(t) : kl(), (e = ke) ? (e = pm(
          e,
          Gt
        ), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: Rl !== null ? { id: el, overflow: tl } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, l = Bo(e), l.return = t, t.child = l, it = t, ke = null)) : e = null, e === null) throw zl(t);
        return lr(e) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      var p = a.children;
      return a = a.fallback, n ? (kl(), n = t.mode, p = ts(
        { mode: "hidden", children: p },
        n
      ), a = na(
        a,
        n,
        l,
        null
      ), p.return = t, a.return = t, p.sibling = a, t.child = p, a = t.child, a.memoizedState = bu(l), a.childLanes = xu(
        e,
        d,
        l
      ), t.memoizedState = yu, kn(null, a)) : (Ul(t), _u(t, p));
    }
    var _ = e.memoizedState;
    if (_ !== null && (p = _.dehydrated, p !== null)) {
      if (s)
        t.flags & 256 ? (Ul(t), t.flags &= -257, t = Su(
          e,
          t,
          l
        )) : t.memoizedState !== null ? (kl(), t.child = e.child, t.flags |= 128, t = null) : (kl(), p = a.fallback, n = t.mode, a = ts(
          { mode: "visible", children: a.children },
          n
        ), p = na(
          p,
          n,
          l,
          null
        ), p.flags |= 2, a.return = t, p.return = t, a.sibling = p, t.child = a, da(
          t,
          e.child,
          null,
          l
        ), a = t.child, a.memoizedState = bu(l), a.childLanes = xu(
          e,
          d,
          l
        ), t.memoizedState = yu, t = kn(null, a));
      else if (Ul(t), lr(p)) {
        if (d = p.nextSibling && p.nextSibling.dataset, d) var R = d.dgst;
        d = R, a = Error(r(419)), a.stack = "", a.digest = d, En({ value: a, source: null, stack: null }), t = Su(
          e,
          t,
          l
        );
      } else if (Pe || ka(e, t, l, !1), d = (l & e.childLanes) !== 0, Pe || d) {
        if (d = Oe, d !== null && (a = Zr(d, l), a !== 0 && a !== _.retryLane))
          throw _.retryLane = a, aa(e, a), bt(d, e, a), vu;
        tr(p) || os(), t = Su(
          e,
          t,
          l
        );
      } else
        tr(p) ? (t.flags |= 192, t.child = e.child, t = null) : (e = _.treeContext, ke = Qt(
          p.nextSibling
        ), it = t, xe = !0, Al = null, Gt = !1, e !== null && Go(t, e), t = _u(
          t,
          a.children
        ), t.flags |= 4096);
      return t;
    }
    return n ? (kl(), p = a.fallback, n = t.mode, _ = e.child, R = _.sibling, a = rl(_, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = _.subtreeFlags & 65011712, R !== null ? p = rl(
      R,
      p
    ) : (p = na(
      p,
      n,
      l,
      null
    ), p.flags |= 2), p.return = t, a.return = t, a.sibling = p, t.child = a, kn(null, a), a = t.child, p = e.child.memoizedState, p === null ? p = bu(l) : (n = p.cachePool, n !== null ? (_ = Fe._currentValue, n = n.parent !== _ ? { parent: _, pool: _ } : n) : n = Ko(), p = {
      baseLanes: p.baseLanes | l,
      cachePool: n
    }), a.memoizedState = p, a.childLanes = xu(
      e,
      d,
      l
    ), t.memoizedState = yu, kn(e.child, a)) : (Ul(t), l = e.child, e = l.sibling, l = rl(l, {
      mode: "visible",
      children: a.children
    }), l.return = t, l.sibling = null, e !== null && (d = t.deletions, d === null ? (t.deletions = [e], t.flags |= 16) : d.push(e)), t.child = l, t.memoizedState = null, l);
  }
  function _u(e, t) {
    return t = ts(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function ts(e, t) {
    return e = Et(22, e, null, t), e.lanes = 0, e;
  }
  function Su(e, t, l) {
    return da(t, e.child, null, l), e = _u(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function uf(e, t, l) {
    e.lanes |= t;
    var a = e.alternate;
    a !== null && (a.lanes |= t), kc(e.return, t, l);
  }
  function ju(e, t, l, a, n, s) {
    var d = e.memoizedState;
    d === null ? e.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: a,
      tail: l,
      tailMode: n,
      treeForkCount: s
    } : (d.isBackwards = t, d.rendering = null, d.renderingStartTime = 0, d.last = a, d.tail = l, d.tailMode = n, d.treeForkCount = s);
  }
  function rf(e, t, l) {
    var a = t.pendingProps, n = a.revealOrder, s = a.tail;
    a = a.children;
    var d = $e.current, p = (d & 2) !== 0;
    if (p ? (d = d & 1 | 2, t.flags |= 128) : d &= 1, Z($e, d), ct(e, t, a, l), a = xe ? Nn : 0, !p && e !== null && (e.flags & 128) !== 0)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13)
          e.memoizedState !== null && uf(e, l, t);
        else if (e.tag === 19)
          uf(e, l, t);
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
          e = l.alternate, e !== null && Xi(e) === null && (n = l), l = l.sibling;
        l = n, l === null ? (n = t.child, t.child = null) : (n = l.sibling, l.sibling = null), ju(
          t,
          !1,
          n,
          l,
          s,
          a
        );
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (l = null, n = t.child, t.child = null; n !== null; ) {
          if (e = n.alternate, e !== null && Xi(e) === null) {
            t.child = n;
            break;
          }
          e = n.sibling, n.sibling = l, l = n, n = e;
        }
        ju(
          t,
          !0,
          l,
          null,
          s,
          a
        );
        break;
      case "together":
        ju(
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
  function pl(e, t, l) {
    if (e !== null && (t.dependencies = e.dependencies), ql |= t.lanes, (l & t.childLanes) === 0)
      if (e !== null) {
        if (ka(
          e,
          t,
          l,
          !1
        ), (l & t.childLanes) === 0)
          return null;
      } else return null;
    if (e !== null && t.child !== e.child)
      throw Error(r(153));
    if (t.child !== null) {
      for (e = t.child, l = rl(e, e.pendingProps), t.child = l, l.return = t; e.sibling !== null; )
        e = e.sibling, l = l.sibling = rl(e, e.pendingProps), l.return = t;
      l.sibling = null;
    }
    return t.child;
  }
  function Nu(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && Hi(e)));
  }
  function fv(e, t, l) {
    switch (t.tag) {
      case 3:
        et(t, t.stateNode.containerInfo), wl(t, Fe, e.memoizedState.cache), ia();
        break;
      case 27:
      case 5:
        Dt(t);
        break;
      case 4:
        et(t, t.stateNode.containerInfo);
        break;
      case 10:
        wl(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 31:
        if (t.memoizedState !== null)
          return t.flags |= 128, Jc(t), null;
        break;
      case 13:
        var a = t.memoizedState;
        if (a !== null)
          return a.dehydrated !== null ? (Ul(t), t.flags |= 128, null) : (l & t.child.childLanes) !== 0 ? cf(e, t, l) : (Ul(t), e = pl(
            e,
            t,
            l
          ), e !== null ? e.sibling : null);
        Ul(t);
        break;
      case 19:
        var n = (e.flags & 128) !== 0;
        if (a = (l & t.childLanes) !== 0, a || (ka(
          e,
          t,
          l,
          !1
        ), a = (l & t.childLanes) !== 0), n) {
          if (a)
            return rf(
              e,
              t,
              l
            );
          t.flags |= 128;
        }
        if (n = t.memoizedState, n !== null && (n.rendering = null, n.tail = null, n.lastEffect = null), Z($e, $e.current), a) break;
        return null;
      case 22:
        return t.lanes = 0, ef(
          e,
          t,
          l,
          t.pendingProps
        );
      case 24:
        wl(t, Fe, e.memoizedState.cache);
    }
    return pl(e, t, l);
  }
  function of(e, t, l) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        Pe = !0;
      else {
        if (!Nu(e, l) && (t.flags & 128) === 0)
          return Pe = !1, fv(
            e,
            t,
            l
          );
        Pe = (e.flags & 131072) !== 0;
      }
    else
      Pe = !1, xe && (t.flags & 1048576) !== 0 && Yo(t, Nn, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          var a = t.pendingProps;
          if (e = ra(t.elementType), t.type = e, typeof e == "function")
            Rc(e) ? (a = ma(e, a), t.tag = 1, t = nf(
              null,
              t,
              e,
              a,
              l
            )) : (t.tag = 0, t = gu(
              null,
              t,
              e,
              a,
              l
            ));
          else {
            if (e != null) {
              var n = e.$$typeof;
              if (n === te) {
                t.tag = 11, t = Wd(
                  null,
                  t,
                  e,
                  a,
                  l
                );
                break e;
              } else if (n === V) {
                t.tag = 14, t = Pd(
                  null,
                  t,
                  e,
                  a,
                  l
                );
                break e;
              }
            }
            throw t = F(e) || e, Error(r(306, t, ""));
          }
        }
        return t;
      case 0:
        return gu(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 1:
        return a = t.type, n = ma(
          a,
          t.pendingProps
        ), nf(
          e,
          t,
          a,
          n,
          l
        );
      case 3:
        e: {
          if (et(
            t,
            t.stateNode.containerInfo
          ), e === null) throw Error(r(387));
          a = t.pendingProps;
          var s = t.memoizedState;
          n = s.element, Qc(e, t), wn(t, a, null, l);
          var d = t.memoizedState;
          if (a = d.cache, wl(t, Fe, a), a !== s.cache && Lc(
            t,
            [Fe],
            l,
            !0
          ), zn(), a = d.element, s.isDehydrated)
            if (s = {
              element: a,
              isDehydrated: !1,
              cache: d.cache
            }, t.updateQueue.baseState = s, t.memoizedState = s, t.flags & 256) {
              t = sf(
                e,
                t,
                a,
                l
              );
              break e;
            } else if (a !== n) {
              n = Bt(
                Error(r(424)),
                t
              ), En(n), t = sf(
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
              for (ke = Qt(e.firstChild), it = t, xe = !0, Al = null, Gt = !0, l = ed(
                t,
                null,
                a,
                l
              ), t.child = l; l; )
                l.flags = l.flags & -3 | 4096, l = l.sibling;
            }
          else {
            if (ia(), a === n) {
              t = pl(
                e,
                t,
                l
              );
              break e;
            }
            ct(e, t, a, l);
          }
          t = t.child;
        }
        return t;
      case 26:
        return es(e, t), e === null ? (l = _m(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = l : xe || (l = t.type, e = t.pendingProps, a = gs(
          de.current
        ).createElement(l), a[nt] = t, a[mt] = e, ut(a, l, e), lt(a), t.stateNode = a) : t.memoizedState = _m(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return Dt(t), e === null && xe && (a = t.stateNode = ym(
          t.type,
          t.pendingProps,
          de.current
        ), it = t, Gt = !0, n = ke, Zl(t.type) ? (ar = n, ke = Qt(a.firstChild)) : ke = n), ct(
          e,
          t,
          t.pendingProps.children,
          l
        ), es(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && xe && ((n = a = ke) && (a = Gv(
          a,
          t.type,
          t.pendingProps,
          Gt
        ), a !== null ? (t.stateNode = a, it = t, ke = Qt(a.firstChild), Gt = !1, n = !0) : n = !1), n || zl(t)), Dt(t), n = t.type, s = t.pendingProps, d = e !== null ? e.memoizedProps : null, a = s.children, Pu(n, s) ? a = null : d !== null && Pu(n, d) && (t.flags |= 32), t.memoizedState !== null && (n = Wc(
          e,
          t,
          av,
          null,
          null,
          l
        ), Pn._currentValue = n), es(e, t), ct(e, t, a, l), t.child;
      case 6:
        return e === null && xe && ((e = l = ke) && (l = Xv(
          l,
          t.pendingProps,
          Gt
        ), l !== null ? (t.stateNode = l, it = t, ke = null, e = !0) : e = !1), e || zl(t)), null;
      case 13:
        return cf(e, t, l);
      case 4:
        return et(
          t,
          t.stateNode.containerInfo
        ), a = t.pendingProps, e === null ? t.child = da(
          t,
          null,
          a,
          l
        ) : ct(e, t, a, l), t.child;
      case 11:
        return Wd(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 7:
        return ct(
          e,
          t,
          t.pendingProps,
          l
        ), t.child;
      case 8:
        return ct(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 12:
        return ct(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 10:
        return a = t.pendingProps, wl(t, t.type, a.value), ct(e, t, a.children, l), t.child;
      case 9:
        return n = t.type._context, a = t.pendingProps.children, ca(t), n = st(n), a = a(n), t.flags |= 1, ct(e, t, a, l), t.child;
      case 14:
        return Pd(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 15:
        return Id(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 19:
        return rf(e, t, l);
      case 31:
        return dv(e, t, l);
      case 22:
        return ef(
          e,
          t,
          l,
          t.pendingProps
        );
      case 24:
        return ca(t), a = st(Fe), e === null ? (n = Yc(), n === null && (n = Oe, s = Bc(), n.pooledCache = s, s.refCount++, s !== null && (n.pooledCacheLanes |= l), n = s), t.memoizedState = { parent: a, cache: n }, Xc(t), wl(t, Fe, n)) : ((e.lanes & l) !== 0 && (Qc(e, t), wn(t, null, null, l), zn()), n = e.memoizedState, s = t.memoizedState, n.parent !== a ? (n = { parent: a, cache: a }, t.memoizedState = n, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = n), wl(t, Fe, a)) : (a = s.cache, wl(t, Fe, a), a !== n.cache && Lc(
          t,
          [Fe],
          l,
          !0
        ))), ct(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(r(156, t.tag));
  }
  function vl(e) {
    e.flags |= 4;
  }
  function Eu(e, t, l, a, n) {
    if ((t = (e.mode & 32) !== 0) && (t = !1), t) {
      if (e.flags |= 16777216, (n & 335544128) === n)
        if (e.stateNode.complete) e.flags |= 8192;
        else if (kf()) e.flags |= 8192;
        else
          throw oa = Bi, Gc;
    } else e.flags &= -16777217;
  }
  function df(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !Tm(t))
      if (kf()) e.flags |= 8192;
      else
        throw oa = Bi, Gc;
  }
  function ls(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? Gr() : 536870912, e.lanes |= t, Ja |= t);
  }
  function Ln(e, t) {
    if (!xe)
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
  function Le(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, l = 0, a = 0;
    if (t)
      for (var n = e.child; n !== null; )
        l |= n.lanes | n.childLanes, a |= n.subtreeFlags & 65011712, a |= n.flags & 65011712, n.return = e, n = n.sibling;
    else
      for (n = e.child; n !== null; )
        l |= n.lanes | n.childLanes, a |= n.subtreeFlags, a |= n.flags, n.return = e, n = n.sibling;
    return e.subtreeFlags |= a, e.childLanes = l, t;
  }
  function mv(e, t, l) {
    var a = t.pendingProps;
    switch (Oc(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Le(t), null;
      case 1:
        return Le(t), null;
      case 3:
        return l = t.stateNode, a = null, e !== null && (a = e.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), fl(Fe), we(), l.pendingContext && (l.context = l.pendingContext, l.pendingContext = null), (e === null || e.child === null) && (Ua(t) ? vl(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Hc())), Le(t), null;
      case 26:
        var n = t.type, s = t.memoizedState;
        return e === null ? (vl(t), s !== null ? (Le(t), df(t, s)) : (Le(t), Eu(
          t,
          n,
          null,
          a,
          l
        ))) : s ? s !== e.memoizedState ? (vl(t), Le(t), df(t, s)) : (Le(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== a && vl(t), Le(t), Eu(
          t,
          n,
          e,
          a,
          l
        )), null;
      case 27:
        if (Kt(t), l = de.current, n = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && vl(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(r(166));
            return Le(t), null;
          }
          e = G.current, Ua(t) ? Xo(t) : (e = ym(n, a, l), t.stateNode = e, vl(t));
        }
        return Le(t), null;
      case 5:
        if (Kt(t), n = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && vl(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(r(166));
            return Le(t), null;
          }
          if (s = G.current, Ua(t))
            Xo(t);
          else {
            var d = gs(
              de.current
            );
            switch (s) {
              case 1:
                s = d.createElementNS(
                  "http://www.w3.org/2000/svg",
                  n
                );
                break;
              case 2:
                s = d.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  n
                );
                break;
              default:
                switch (n) {
                  case "svg":
                    s = d.createElementNS(
                      "http://www.w3.org/2000/svg",
                      n
                    );
                    break;
                  case "math":
                    s = d.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      n
                    );
                    break;
                  case "script":
                    s = d.createElement("div"), s.innerHTML = "<script><\/script>", s = s.removeChild(
                      s.firstChild
                    );
                    break;
                  case "select":
                    s = typeof a.is == "string" ? d.createElement("select", {
                      is: a.is
                    }) : d.createElement("select"), a.multiple ? s.multiple = !0 : a.size && (s.size = a.size);
                    break;
                  default:
                    s = typeof a.is == "string" ? d.createElement(n, { is: a.is }) : d.createElement(n);
                }
            }
            s[nt] = t, s[mt] = a;
            e: for (d = t.child; d !== null; ) {
              if (d.tag === 5 || d.tag === 6)
                s.appendChild(d.stateNode);
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
            t.stateNode = s;
            e: switch (ut(s, n, a), n) {
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
            a && vl(t);
          }
        }
        return Le(t), Eu(
          t,
          t.type,
          e === null ? null : e.memoizedProps,
          t.pendingProps,
          l
        ), null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== a && vl(t);
        else {
          if (typeof a != "string" && t.stateNode === null)
            throw Error(r(166));
          if (e = de.current, Ua(t)) {
            if (e = t.stateNode, l = t.memoizedProps, a = null, n = it, n !== null)
              switch (n.tag) {
                case 27:
                case 5:
                  a = n.memoizedProps;
              }
            e[nt] = t, e = !!(e.nodeValue === l || a !== null && a.suppressHydrationWarning === !0 || cm(e.nodeValue, l)), e || zl(t, !0);
          } else
            e = gs(e).createTextNode(
              a
            ), e[nt] = t, t.stateNode = e;
        }
        return Le(t), null;
      case 31:
        if (l = t.memoizedState, e === null || e.memoizedState !== null) {
          if (a = Ua(t), l !== null) {
            if (e === null) {
              if (!a) throw Error(r(318));
              if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(r(557));
              e[nt] = t;
            } else
              ia(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Le(t), e = !1;
          } else
            l = Hc(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = l), e = !0;
          if (!e)
            return t.flags & 256 ? (Ct(t), t) : (Ct(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(r(558));
        }
        return Le(t), null;
      case 13:
        if (a = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (n = Ua(t), a !== null && a.dehydrated !== null) {
            if (e === null) {
              if (!n) throw Error(r(318));
              if (n = t.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(r(317));
              n[nt] = t;
            } else
              ia(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Le(t), n = !1;
          } else
            n = Hc(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), n = !0;
          if (!n)
            return t.flags & 256 ? (Ct(t), t) : (Ct(t), null);
        }
        return Ct(t), (t.flags & 128) !== 0 ? (t.lanes = l, t) : (l = a !== null, e = e !== null && e.memoizedState !== null, l && (a = t.child, n = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (n = a.alternate.memoizedState.cachePool.pool), s = null, a.memoizedState !== null && a.memoizedState.cachePool !== null && (s = a.memoizedState.cachePool.pool), s !== n && (a.flags |= 2048)), l !== e && l && (t.child.flags |= 8192), ls(t, t.updateQueue), Le(t), null);
      case 4:
        return we(), e === null && $u(t.stateNode.containerInfo), Le(t), null;
      case 10:
        return fl(t.type), Le(t), null;
      case 19:
        if (H($e), a = t.memoizedState, a === null) return Le(t), null;
        if (n = (t.flags & 128) !== 0, s = a.rendering, s === null)
          if (n) Ln(a, !1);
          else {
            if (Ve !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (s = Xi(e), s !== null) {
                  for (t.flags |= 128, Ln(a, !1), e = s.updateQueue, t.updateQueue = e, ls(t, e), t.subtreeFlags = 0, e = l, l = t.child; l !== null; )
                    Lo(l, e), l = l.sibling;
                  return Z(
                    $e,
                    $e.current & 1 | 2
                  ), xe && ol(t, a.treeForkCount), t.child;
                }
                e = e.sibling;
              }
            a.tail !== null && _t() > cs && (t.flags |= 128, n = !0, Ln(a, !1), t.lanes = 4194304);
          }
        else {
          if (!n)
            if (e = Xi(s), e !== null) {
              if (t.flags |= 128, n = !0, e = e.updateQueue, t.updateQueue = e, ls(t, e), Ln(a, !0), a.tail === null && a.tailMode === "hidden" && !s.alternate && !xe)
                return Le(t), null;
            } else
              2 * _t() - a.renderingStartTime > cs && l !== 536870912 && (t.flags |= 128, n = !0, Ln(a, !1), t.lanes = 4194304);
          a.isBackwards ? (s.sibling = t.child, t.child = s) : (e = a.last, e !== null ? e.sibling = s : t.child = s, a.last = s);
        }
        return a.tail !== null ? (e = a.tail, a.rendering = e, a.tail = e.sibling, a.renderingStartTime = _t(), e.sibling = null, l = $e.current, Z(
          $e,
          n ? l & 1 | 2 : l & 1
        ), xe && ol(t, a.treeForkCount), e) : (Le(t), null);
      case 22:
      case 23:
        return Ct(t), Kc(), a = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? (l & 536870912) !== 0 && (t.flags & 128) === 0 && (Le(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Le(t), l = t.updateQueue, l !== null && ls(t, l.retryQueue), l = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== l && (t.flags |= 2048), e !== null && H(ua), null;
      case 24:
        return l = null, e !== null && (l = e.memoizedState.cache), t.memoizedState.cache !== l && (t.flags |= 2048), fl(Fe), Le(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(r(156, t.tag));
  }
  function hv(e, t) {
    switch (Oc(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return fl(Fe), we(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return Kt(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (Ct(t), t.alternate === null)
            throw Error(r(340));
          ia();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 13:
        if (Ct(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(r(340));
          ia();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return H($e), null;
      case 4:
        return we(), null;
      case 10:
        return fl(t.type), null;
      case 22:
      case 23:
        return Ct(t), Kc(), e !== null && H(ua), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return fl(Fe), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function ff(e, t) {
    switch (Oc(t), t.tag) {
      case 3:
        fl(Fe), we();
        break;
      case 26:
      case 27:
      case 5:
        Kt(t);
        break;
      case 4:
        we();
        break;
      case 31:
        t.memoizedState !== null && Ct(t);
        break;
      case 13:
        Ct(t);
        break;
      case 19:
        H($e);
        break;
      case 10:
        fl(t.type);
        break;
      case 22:
      case 23:
        Ct(t), Kc(), e !== null && H(ua);
        break;
      case 24:
        fl(Fe);
    }
  }
  function Bn(e, t) {
    try {
      var l = t.updateQueue, a = l !== null ? l.lastEffect : null;
      if (a !== null) {
        var n = a.next;
        l = n;
        do {
          if ((l.tag & e) === e) {
            a = void 0;
            var s = l.create, d = l.inst;
            a = s(), d.destroy = a;
          }
          l = l.next;
        } while (l !== n);
      }
    } catch (p) {
      Me(t, t.return, p);
    }
  }
  function Ll(e, t, l) {
    try {
      var a = t.updateQueue, n = a !== null ? a.lastEffect : null;
      if (n !== null) {
        var s = n.next;
        a = s;
        do {
          if ((a.tag & e) === e) {
            var d = a.inst, p = d.destroy;
            if (p !== void 0) {
              d.destroy = void 0, n = t;
              var _ = l, R = p;
              try {
                R();
              } catch (D) {
                Me(
                  n,
                  _,
                  D
                );
              }
            }
          }
          a = a.next;
        } while (a !== s);
      }
    } catch (D) {
      Me(t, t.return, D);
    }
  }
  function mf(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var l = e.stateNode;
      try {
        ld(t, l);
      } catch (a) {
        Me(e, e.return, a);
      }
    }
  }
  function hf(e, t, l) {
    l.props = ma(
      e.type,
      e.memoizedProps
    ), l.state = e.memoizedState;
    try {
      l.componentWillUnmount();
    } catch (a) {
      Me(e, t, a);
    }
  }
  function qn(e, t) {
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
      Me(e, t, n);
    }
  }
  function ll(e, t) {
    var l = e.ref, a = e.refCleanup;
    if (l !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (n) {
          Me(e, t, n);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof l == "function")
        try {
          l(null);
        } catch (n) {
          Me(e, t, n);
        }
      else l.current = null;
  }
  function pf(e) {
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
      Me(e, e.return, n);
    }
  }
  function Tu(e, t, l) {
    try {
      var a = e.stateNode;
      Uv(a, e.type, l, t), a[mt] = t;
    } catch (n) {
      Me(e, e.return, n);
    }
  }
  function vf(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Zl(e.type) || e.tag === 4;
  }
  function Cu(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || vf(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && Zl(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Mu(e, t, l) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? (l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l).insertBefore(e, t) : (t = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, t.appendChild(e), l = l._reactRootContainer, l != null || t.onclick !== null || (t.onclick = cl));
    else if (a !== 4 && (a === 27 && Zl(e.type) && (l = e.stateNode, t = null), e = e.child, e !== null))
      for (Mu(e, t, l), e = e.sibling; e !== null; )
        Mu(e, t, l), e = e.sibling;
  }
  function as(e, t, l) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? l.insertBefore(e, t) : l.appendChild(e);
    else if (a !== 4 && (a === 27 && Zl(e.type) && (l = e.stateNode), e = e.child, e !== null))
      for (as(e, t, l), e = e.sibling; e !== null; )
        as(e, t, l), e = e.sibling;
  }
  function gf(e) {
    var t = e.stateNode, l = e.memoizedProps;
    try {
      for (var a = e.type, n = t.attributes; n.length; )
        t.removeAttributeNode(n[0]);
      ut(t, a, l), t[nt] = e, t[mt] = l;
    } catch (s) {
      Me(e, e.return, s);
    }
  }
  var gl = !1, Ie = !1, Ru = !1, yf = typeof WeakSet == "function" ? WeakSet : Set, at = null;
  function pv(e, t) {
    if (e = e.containerInfo, Fu = Ns, e = Ro(e), Sc(e)) {
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
            var n = a.anchorOffset, s = a.focusNode;
            a = a.focusOffset;
            try {
              l.nodeType, s.nodeType;
            } catch {
              l = null;
              break e;
            }
            var d = 0, p = -1, _ = -1, R = 0, D = 0, k = e, A = null;
            t: for (; ; ) {
              for (var z; k !== l || n !== 0 && k.nodeType !== 3 || (p = d + n), k !== s || a !== 0 && k.nodeType !== 3 || (_ = d + a), k.nodeType === 3 && (d += k.nodeValue.length), (z = k.firstChild) !== null; )
                A = k, k = z;
              for (; ; ) {
                if (k === e) break t;
                if (A === l && ++R === n && (p = d), A === s && ++D === a && (_ = d), (z = k.nextSibling) !== null) break;
                k = A, A = k.parentNode;
              }
              k = z;
            }
            l = p === -1 || _ === -1 ? null : { start: p, end: _ };
          } else l = null;
        }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (Wu = { focusedElem: e, selectionRange: l }, Ns = !1, at = t; at !== null; )
      if (t = at, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null)
        e.return = t, at = e;
      else
        for (; at !== null; ) {
          switch (t = at, s = t.alternate, e = t.flags, t.tag) {
            case 0:
              if ((e & 4) !== 0 && (e = t.updateQueue, e = e !== null ? e.events : null, e !== null))
                for (l = 0; l < e.length; l++)
                  n = e[l], n.ref.impl = n.nextImpl;
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && s !== null) {
                e = void 0, l = t, n = s.memoizedProps, s = s.memoizedState, a = l.stateNode;
                try {
                  var J = ma(
                    l.type,
                    n
                  );
                  e = a.getSnapshotBeforeUpdate(
                    J,
                    s
                  ), a.__reactInternalSnapshotBeforeUpdate = e;
                } catch (ne) {
                  Me(
                    l,
                    l.return,
                    ne
                  );
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (e = t.stateNode.containerInfo, l = e.nodeType, l === 9)
                  er(e);
                else if (l === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      er(e);
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
              if ((e & 1024) !== 0) throw Error(r(163));
          }
          if (e = t.sibling, e !== null) {
            e.return = t.return, at = e;
            break;
          }
          at = t.return;
        }
  }
  function bf(e, t, l) {
    var a = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        bl(e, l), a & 4 && Bn(5, l);
        break;
      case 1:
        if (bl(e, l), a & 4)
          if (e = l.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (d) {
              Me(l, l.return, d);
            }
          else {
            var n = ma(
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
            } catch (d) {
              Me(
                l,
                l.return,
                d
              );
            }
          }
        a & 64 && mf(l), a & 512 && qn(l, l.return);
        break;
      case 3:
        if (bl(e, l), a & 64 && (e = l.updateQueue, e !== null)) {
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
            ld(e, t);
          } catch (d) {
            Me(l, l.return, d);
          }
        }
        break;
      case 27:
        t === null && a & 4 && gf(l);
      case 26:
      case 5:
        bl(e, l), t === null && a & 4 && pf(l), a & 512 && qn(l, l.return);
        break;
      case 12:
        bl(e, l);
        break;
      case 31:
        bl(e, l), a & 4 && Sf(e, l);
        break;
      case 13:
        bl(e, l), a & 4 && jf(e, l), a & 64 && (e = l.memoizedState, e !== null && (e = e.dehydrated, e !== null && (l = Nv.bind(
          null,
          l
        ), Qv(e, l))));
        break;
      case 22:
        if (a = l.memoizedState !== null || gl, !a) {
          t = t !== null && t.memoizedState !== null || Ie, n = gl;
          var s = Ie;
          gl = a, (Ie = t) && !s ? xl(
            e,
            l,
            (l.subtreeFlags & 8772) !== 0
          ) : bl(e, l), gl = n, Ie = s;
        }
        break;
      case 30:
        break;
      default:
        bl(e, l);
    }
  }
  function xf(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, xf(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && ic(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var Ye = null, pt = !1;
  function yl(e, t, l) {
    for (l = l.child; l !== null; )
      _f(e, t, l), l = l.sibling;
  }
  function _f(e, t, l) {
    if (St && typeof St.onCommitFiberUnmount == "function")
      try {
        St.onCommitFiberUnmount(on, l);
      } catch {
      }
    switch (l.tag) {
      case 26:
        Ie || ll(l, t), yl(
          e,
          t,
          l
        ), l.memoizedState ? l.memoizedState.count-- : l.stateNode && (l = l.stateNode, l.parentNode.removeChild(l));
        break;
      case 27:
        Ie || ll(l, t);
        var a = Ye, n = pt;
        Zl(l.type) && (Ye = l.stateNode, pt = !1), yl(
          e,
          t,
          l
        ), Jn(l.stateNode), Ye = a, pt = n;
        break;
      case 5:
        Ie || ll(l, t);
      case 6:
        if (a = Ye, n = pt, Ye = null, yl(
          e,
          t,
          l
        ), Ye = a, pt = n, Ye !== null)
          if (pt)
            try {
              (Ye.nodeType === 9 ? Ye.body : Ye.nodeName === "HTML" ? Ye.ownerDocument.body : Ye).removeChild(l.stateNode);
            } catch (s) {
              Me(
                l,
                t,
                s
              );
            }
          else
            try {
              Ye.removeChild(l.stateNode);
            } catch (s) {
              Me(
                l,
                t,
                s
              );
            }
        break;
      case 18:
        Ye !== null && (pt ? (e = Ye, mm(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          l.stateNode
        ), an(e)) : mm(Ye, l.stateNode));
        break;
      case 4:
        a = Ye, n = pt, Ye = l.stateNode.containerInfo, pt = !0, yl(
          e,
          t,
          l
        ), Ye = a, pt = n;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Ll(2, l, t), Ie || Ll(4, l, t), yl(
          e,
          t,
          l
        );
        break;
      case 1:
        Ie || (ll(l, t), a = l.stateNode, typeof a.componentWillUnmount == "function" && hf(
          l,
          t,
          a
        )), yl(
          e,
          t,
          l
        );
        break;
      case 21:
        yl(
          e,
          t,
          l
        );
        break;
      case 22:
        Ie = (a = Ie) || l.memoizedState !== null, yl(
          e,
          t,
          l
        ), Ie = a;
        break;
      default:
        yl(
          e,
          t,
          l
        );
    }
  }
  function Sf(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
      e = e.dehydrated;
      try {
        an(e);
      } catch (l) {
        Me(t, t.return, l);
      }
    }
  }
  function jf(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        an(e);
      } catch (l) {
        Me(t, t.return, l);
      }
  }
  function vv(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new yf()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new yf()), t;
      default:
        throw Error(r(435, e.tag));
    }
  }
  function ns(e, t) {
    var l = vv(e);
    t.forEach(function(a) {
      if (!l.has(a)) {
        l.add(a);
        var n = Ev.bind(null, e, a);
        a.then(n, n);
      }
    });
  }
  function vt(e, t) {
    var l = t.deletions;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var n = l[a], s = e, d = t, p = d;
        e: for (; p !== null; ) {
          switch (p.tag) {
            case 27:
              if (Zl(p.type)) {
                Ye = p.stateNode, pt = !1;
                break e;
              }
              break;
            case 5:
              Ye = p.stateNode, pt = !1;
              break e;
            case 3:
            case 4:
              Ye = p.stateNode.containerInfo, pt = !0;
              break e;
          }
          p = p.return;
        }
        if (Ye === null) throw Error(r(160));
        _f(s, d, n), Ye = null, pt = !1, s = n.alternate, s !== null && (s.return = null), n.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        Nf(t, e), t = t.sibling;
  }
  var Ft = null;
  function Nf(e, t) {
    var l = e.alternate, a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        vt(t, e), gt(e), a & 4 && (Ll(3, e, e.return), Bn(3, e), Ll(5, e, e.return));
        break;
      case 1:
        vt(t, e), gt(e), a & 512 && (Ie || l === null || ll(l, l.return)), a & 64 && gl && (e = e.updateQueue, e !== null && (a = e.callbacks, a !== null && (l = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = l === null ? a : l.concat(a))));
        break;
      case 26:
        var n = Ft;
        if (vt(t, e), gt(e), a & 512 && (Ie || l === null || ll(l, l.return)), a & 4) {
          var s = l !== null ? l.memoizedState : null;
          if (a = e.memoizedState, l === null)
            if (a === null)
              if (e.stateNode === null) {
                e: {
                  a = e.type, l = e.memoizedProps, n = n.ownerDocument || n;
                  t: switch (a) {
                    case "title":
                      s = n.getElementsByTagName("title")[0], (!s || s[mn] || s[nt] || s.namespaceURI === "http://www.w3.org/2000/svg" || s.hasAttribute("itemprop")) && (s = n.createElement(a), n.head.insertBefore(
                        s,
                        n.querySelector("head > title")
                      )), ut(s, a, l), s[nt] = e, lt(s), a = s;
                      break e;
                    case "link":
                      var d = Nm(
                        "link",
                        "href",
                        n
                      ).get(a + (l.href || ""));
                      if (d) {
                        for (var p = 0; p < d.length; p++)
                          if (s = d[p], s.getAttribute("href") === (l.href == null || l.href === "" ? null : l.href) && s.getAttribute("rel") === (l.rel == null ? null : l.rel) && s.getAttribute("title") === (l.title == null ? null : l.title) && s.getAttribute("crossorigin") === (l.crossOrigin == null ? null : l.crossOrigin)) {
                            d.splice(p, 1);
                            break t;
                          }
                      }
                      s = n.createElement(a), ut(s, a, l), n.head.appendChild(s);
                      break;
                    case "meta":
                      if (d = Nm(
                        "meta",
                        "content",
                        n
                      ).get(a + (l.content || ""))) {
                        for (p = 0; p < d.length; p++)
                          if (s = d[p], s.getAttribute("content") === (l.content == null ? null : "" + l.content) && s.getAttribute("name") === (l.name == null ? null : l.name) && s.getAttribute("property") === (l.property == null ? null : l.property) && s.getAttribute("http-equiv") === (l.httpEquiv == null ? null : l.httpEquiv) && s.getAttribute("charset") === (l.charSet == null ? null : l.charSet)) {
                            d.splice(p, 1);
                            break t;
                          }
                      }
                      s = n.createElement(a), ut(s, a, l), n.head.appendChild(s);
                      break;
                    default:
                      throw Error(r(468, a));
                  }
                  s[nt] = e, lt(s), a = s;
                }
                e.stateNode = a;
              } else
                Em(
                  n,
                  e.type,
                  e.stateNode
                );
            else
              e.stateNode = jm(
                n,
                a,
                e.memoizedProps
              );
          else
            s !== a ? (s === null ? l.stateNode !== null && (l = l.stateNode, l.parentNode.removeChild(l)) : s.count--, a === null ? Em(
              n,
              e.type,
              e.stateNode
            ) : jm(
              n,
              a,
              e.memoizedProps
            )) : a === null && e.stateNode !== null && Tu(
              e,
              e.memoizedProps,
              l.memoizedProps
            );
        }
        break;
      case 27:
        vt(t, e), gt(e), a & 512 && (Ie || l === null || ll(l, l.return)), l !== null && a & 4 && Tu(
          e,
          e.memoizedProps,
          l.memoizedProps
        );
        break;
      case 5:
        if (vt(t, e), gt(e), a & 512 && (Ie || l === null || ll(l, l.return)), e.flags & 32) {
          n = e.stateNode;
          try {
            Ta(n, "");
          } catch (J) {
            Me(e, e.return, J);
          }
        }
        a & 4 && e.stateNode != null && (n = e.memoizedProps, Tu(
          e,
          n,
          l !== null ? l.memoizedProps : n
        )), a & 1024 && (Ru = !0);
        break;
      case 6:
        if (vt(t, e), gt(e), a & 4) {
          if (e.stateNode === null)
            throw Error(r(162));
          a = e.memoizedProps, l = e.stateNode;
          try {
            l.nodeValue = a;
          } catch (J) {
            Me(e, e.return, J);
          }
        }
        break;
      case 3:
        if (xs = null, n = Ft, Ft = ys(t.containerInfo), vt(t, e), Ft = n, gt(e), a & 4 && l !== null && l.memoizedState.isDehydrated)
          try {
            an(t.containerInfo);
          } catch (J) {
            Me(e, e.return, J);
          }
        Ru && (Ru = !1, Ef(e));
        break;
      case 4:
        a = Ft, Ft = ys(
          e.stateNode.containerInfo
        ), vt(t, e), gt(e), Ft = a;
        break;
      case 12:
        vt(t, e), gt(e);
        break;
      case 31:
        vt(t, e), gt(e), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, ns(e, a)));
        break;
      case 13:
        vt(t, e), gt(e), e.child.flags & 8192 && e.memoizedState !== null != (l !== null && l.memoizedState !== null) && (ss = _t()), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, ns(e, a)));
        break;
      case 22:
        n = e.memoizedState !== null;
        var _ = l !== null && l.memoizedState !== null, R = gl, D = Ie;
        if (gl = R || n, Ie = D || _, vt(t, e), Ie = D, gl = R, gt(e), a & 8192)
          e: for (t = e.stateNode, t._visibility = n ? t._visibility & -2 : t._visibility | 1, n && (l === null || _ || gl || Ie || ha(e)), l = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (l === null) {
                _ = l = t;
                try {
                  if (s = _.stateNode, n)
                    d = s.style, typeof d.setProperty == "function" ? d.setProperty("display", "none", "important") : d.display = "none";
                  else {
                    p = _.stateNode;
                    var k = _.memoizedProps.style, A = k != null && k.hasOwnProperty("display") ? k.display : null;
                    p.style.display = A == null || typeof A == "boolean" ? "" : ("" + A).trim();
                  }
                } catch (J) {
                  Me(_, _.return, J);
                }
              }
            } else if (t.tag === 6) {
              if (l === null) {
                _ = t;
                try {
                  _.stateNode.nodeValue = n ? "" : _.memoizedProps;
                } catch (J) {
                  Me(_, _.return, J);
                }
              }
            } else if (t.tag === 18) {
              if (l === null) {
                _ = t;
                try {
                  var z = _.stateNode;
                  n ? hm(z, !0) : hm(_.stateNode, !1);
                } catch (J) {
                  Me(_, _.return, J);
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
        a & 4 && (a = e.updateQueue, a !== null && (l = a.retryQueue, l !== null && (a.retryQueue = null, ns(e, l))));
        break;
      case 19:
        vt(t, e), gt(e), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, ns(e, a)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        vt(t, e), gt(e);
    }
  }
  function gt(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var l, a = e.return; a !== null; ) {
          if (vf(a)) {
            l = a;
            break;
          }
          a = a.return;
        }
        if (l == null) throw Error(r(160));
        switch (l.tag) {
          case 27:
            var n = l.stateNode, s = Cu(e);
            as(e, s, n);
            break;
          case 5:
            var d = l.stateNode;
            l.flags & 32 && (Ta(d, ""), l.flags &= -33);
            var p = Cu(e);
            as(e, p, d);
            break;
          case 3:
          case 4:
            var _ = l.stateNode.containerInfo, R = Cu(e);
            Mu(
              e,
              R,
              _
            );
            break;
          default:
            throw Error(r(161));
        }
      } catch (D) {
        Me(e, e.return, D);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function Ef(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        Ef(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
  }
  function bl(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        bf(e, t.alternate, t), t = t.sibling;
  }
  function ha(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Ll(4, t, t.return), ha(t);
          break;
        case 1:
          ll(t, t.return);
          var l = t.stateNode;
          typeof l.componentWillUnmount == "function" && hf(
            t,
            t.return,
            l
          ), ha(t);
          break;
        case 27:
          Jn(t.stateNode);
        case 26:
        case 5:
          ll(t, t.return), ha(t);
          break;
        case 22:
          t.memoizedState === null && ha(t);
          break;
        case 30:
          ha(t);
          break;
        default:
          ha(t);
      }
      e = e.sibling;
    }
  }
  function xl(e, t, l) {
    for (l = l && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var a = t.alternate, n = e, s = t, d = s.flags;
      switch (s.tag) {
        case 0:
        case 11:
        case 15:
          xl(
            n,
            s,
            l
          ), Bn(4, s);
          break;
        case 1:
          if (xl(
            n,
            s,
            l
          ), a = s, n = a.stateNode, typeof n.componentDidMount == "function")
            try {
              n.componentDidMount();
            } catch (R) {
              Me(a, a.return, R);
            }
          if (a = s, n = a.updateQueue, n !== null) {
            var p = a.stateNode;
            try {
              var _ = n.shared.hiddenCallbacks;
              if (_ !== null)
                for (n.shared.hiddenCallbacks = null, n = 0; n < _.length; n++)
                  td(_[n], p);
            } catch (R) {
              Me(a, a.return, R);
            }
          }
          l && d & 64 && mf(s), qn(s, s.return);
          break;
        case 27:
          gf(s);
        case 26:
        case 5:
          xl(
            n,
            s,
            l
          ), l && a === null && d & 4 && pf(s), qn(s, s.return);
          break;
        case 12:
          xl(
            n,
            s,
            l
          );
          break;
        case 31:
          xl(
            n,
            s,
            l
          ), l && d & 4 && Sf(n, s);
          break;
        case 13:
          xl(
            n,
            s,
            l
          ), l && d & 4 && jf(n, s);
          break;
        case 22:
          s.memoizedState === null && xl(
            n,
            s,
            l
          ), qn(s, s.return);
          break;
        case 30:
          break;
        default:
          xl(
            n,
            s,
            l
          );
      }
      t = t.sibling;
    }
  }
  function Au(e, t) {
    var l = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== l && (e != null && e.refCount++, l != null && Tn(l));
  }
  function zu(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Tn(e));
  }
  function Wt(e, t, l, a) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        Tf(
          e,
          t,
          l,
          a
        ), t = t.sibling;
  }
  function Tf(e, t, l, a) {
    var n = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Wt(
          e,
          t,
          l,
          a
        ), n & 2048 && Bn(9, t);
        break;
      case 1:
        Wt(
          e,
          t,
          l,
          a
        );
        break;
      case 3:
        Wt(
          e,
          t,
          l,
          a
        ), n & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Tn(e)));
        break;
      case 12:
        if (n & 2048) {
          Wt(
            e,
            t,
            l,
            a
          ), e = t.stateNode;
          try {
            var s = t.memoizedProps, d = s.id, p = s.onPostCommit;
            typeof p == "function" && p(
              d,
              t.alternate === null ? "mount" : "update",
              e.passiveEffectDuration,
              -0
            );
          } catch (_) {
            Me(t, t.return, _);
          }
        } else
          Wt(
            e,
            t,
            l,
            a
          );
        break;
      case 31:
        Wt(
          e,
          t,
          l,
          a
        );
        break;
      case 13:
        Wt(
          e,
          t,
          l,
          a
        );
        break;
      case 23:
        break;
      case 22:
        s = t.stateNode, d = t.alternate, t.memoizedState !== null ? s._visibility & 2 ? Wt(
          e,
          t,
          l,
          a
        ) : Yn(e, t) : s._visibility & 2 ? Wt(
          e,
          t,
          l,
          a
        ) : (s._visibility |= 2, Va(
          e,
          t,
          l,
          a,
          (t.subtreeFlags & 10256) !== 0 || !1
        )), n & 2048 && Au(d, t);
        break;
      case 24:
        Wt(
          e,
          t,
          l,
          a
        ), n & 2048 && zu(t.alternate, t);
        break;
      default:
        Wt(
          e,
          t,
          l,
          a
        );
    }
  }
  function Va(e, t, l, a, n) {
    for (n = n && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var s = e, d = t, p = l, _ = a, R = d.flags;
      switch (d.tag) {
        case 0:
        case 11:
        case 15:
          Va(
            s,
            d,
            p,
            _,
            n
          ), Bn(8, d);
          break;
        case 23:
          break;
        case 22:
          var D = d.stateNode;
          d.memoizedState !== null ? D._visibility & 2 ? Va(
            s,
            d,
            p,
            _,
            n
          ) : Yn(
            s,
            d
          ) : (D._visibility |= 2, Va(
            s,
            d,
            p,
            _,
            n
          )), n && R & 2048 && Au(
            d.alternate,
            d
          );
          break;
        case 24:
          Va(
            s,
            d,
            p,
            _,
            n
          ), n && R & 2048 && zu(d.alternate, d);
          break;
        default:
          Va(
            s,
            d,
            p,
            _,
            n
          );
      }
      t = t.sibling;
    }
  }
  function Yn(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var l = e, a = t, n = a.flags;
        switch (a.tag) {
          case 22:
            Yn(l, a), n & 2048 && Au(
              a.alternate,
              a
            );
            break;
          case 24:
            Yn(l, a), n & 2048 && zu(a.alternate, a);
            break;
          default:
            Yn(l, a);
        }
        t = t.sibling;
      }
  }
  var Gn = 8192;
  function $a(e, t, l) {
    if (e.subtreeFlags & Gn)
      for (e = e.child; e !== null; )
        Cf(
          e,
          t,
          l
        ), e = e.sibling;
  }
  function Cf(e, t, l) {
    switch (e.tag) {
      case 26:
        $a(
          e,
          t,
          l
        ), e.flags & Gn && e.memoizedState !== null && lg(
          l,
          Ft,
          e.memoizedState,
          e.memoizedProps
        );
        break;
      case 5:
        $a(
          e,
          t,
          l
        );
        break;
      case 3:
      case 4:
        var a = Ft;
        Ft = ys(e.stateNode.containerInfo), $a(
          e,
          t,
          l
        ), Ft = a;
        break;
      case 22:
        e.memoizedState === null && (a = e.alternate, a !== null && a.memoizedState !== null ? (a = Gn, Gn = 16777216, $a(
          e,
          t,
          l
        ), Gn = a) : $a(
          e,
          t,
          l
        ));
        break;
      default:
        $a(
          e,
          t,
          l
        );
    }
  }
  function Mf(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function Xn(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          at = a, Af(
            a,
            e
          );
        }
      Mf(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        Rf(e), e = e.sibling;
  }
  function Rf(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        Xn(e), e.flags & 2048 && Ll(9, e, e.return);
        break;
      case 3:
        Xn(e);
        break;
      case 12:
        Xn(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, is(e)) : Xn(e);
        break;
      default:
        Xn(e);
    }
  }
  function is(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          at = a, Af(
            a,
            e
          );
        }
      Mf(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          Ll(8, t, t.return), is(t);
          break;
        case 22:
          l = t.stateNode, l._visibility & 2 && (l._visibility &= -3, is(t));
          break;
        default:
          is(t);
      }
      e = e.sibling;
    }
  }
  function Af(e, t) {
    for (; at !== null; ) {
      var l = at;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          Ll(8, l, t);
          break;
        case 23:
        case 22:
          if (l.memoizedState !== null && l.memoizedState.cachePool !== null) {
            var a = l.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          Tn(l.memoizedState.cache);
      }
      if (a = l.child, a !== null) a.return = l, at = a;
      else
        e: for (l = e; at !== null; ) {
          a = at;
          var n = a.sibling, s = a.return;
          if (xf(a), a === l) {
            at = null;
            break e;
          }
          if (n !== null) {
            n.return = s, at = n;
            break e;
          }
          at = s;
        }
    }
  }
  var gv = {
    getCacheForType: function(e) {
      var t = st(Fe), l = t.data.get(e);
      return l === void 0 && (l = e(), t.data.set(e, l)), l;
    },
    cacheSignal: function() {
      return st(Fe).controller.signal;
    }
  }, yv = typeof WeakMap == "function" ? WeakMap : Map, Ee = 0, Oe = null, ve = null, ye = 0, Ce = 0, Mt = null, Bl = !1, Ka = !1, wu = !1, _l = 0, Ve = 0, ql = 0, pa = 0, Ou = 0, Rt = 0, Ja = 0, Qn = null, yt = null, Du = !1, ss = 0, zf = 0, cs = 1 / 0, us = null, Yl = null, tt = 0, Gl = null, Fa = null, Sl = 0, Hu = 0, Uu = null, wf = null, Zn = 0, ku = null;
  function At() {
    return (Ee & 2) !== 0 && ye !== 0 ? ye & -ye : C.T !== null ? Xu() : Vr();
  }
  function Of() {
    if (Rt === 0)
      if ((ye & 536870912) === 0 || xe) {
        var e = vi;
        vi <<= 1, (vi & 3932160) === 0 && (vi = 262144), Rt = e;
      } else Rt = 536870912;
    return e = Tt.current, e !== null && (e.flags |= 32), Rt;
  }
  function bt(e, t, l) {
    (e === Oe && (Ce === 2 || Ce === 9) || e.cancelPendingCommit !== null) && (Wa(e, 0), Xl(
      e,
      ye,
      Rt,
      !1
    )), fn(e, l), ((Ee & 2) === 0 || e !== Oe) && (e === Oe && ((Ee & 2) === 0 && (pa |= l), Ve === 4 && Xl(
      e,
      ye,
      Rt,
      !1
    )), al(e));
  }
  function Df(e, t, l) {
    if ((Ee & 6) !== 0) throw Error(r(327));
    var a = !l && (t & 127) === 0 && (t & e.expiredLanes) === 0 || dn(e, t), n = a ? _v(e, t) : Bu(e, t, !0), s = a;
    do {
      if (n === 0) {
        Ka && !a && Xl(e, t, 0, !1);
        break;
      } else {
        if (l = e.current.alternate, s && !bv(l)) {
          n = Bu(e, t, !1), s = !1;
          continue;
        }
        if (n === 2) {
          if (s = t, e.errorRecoveryDisabledLanes & s)
            var d = 0;
          else
            d = e.pendingLanes & -536870913, d = d !== 0 ? d : d & 536870912 ? 536870912 : 0;
          if (d !== 0) {
            t = d;
            e: {
              var p = e;
              n = Qn;
              var _ = p.current.memoizedState.isDehydrated;
              if (_ && (Wa(p, d).flags |= 256), d = Bu(
                p,
                d,
                !1
              ), d !== 2) {
                if (wu && !_) {
                  p.errorRecoveryDisabledLanes |= s, pa |= s, n = 4;
                  break e;
                }
                s = yt, yt = n, s !== null && (yt === null ? yt = s : yt.push.apply(
                  yt,
                  s
                ));
              }
              n = d;
            }
            if (s = !1, n !== 2) continue;
          }
        }
        if (n === 1) {
          Wa(e, 0), Xl(e, t, 0, !0);
          break;
        }
        e: {
          switch (a = e, s = n, s) {
            case 0:
            case 1:
              throw Error(r(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              Xl(
                a,
                t,
                Rt,
                !Bl
              );
              break e;
            case 2:
              yt = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(r(329));
          }
          if ((t & 62914560) === t && (n = ss + 300 - _t(), 10 < n)) {
            if (Xl(
              a,
              t,
              Rt,
              !Bl
            ), yi(a, 0, !0) !== 0) break e;
            Sl = t, a.timeoutHandle = dm(
              Hf.bind(
                null,
                a,
                l,
                yt,
                us,
                Du,
                t,
                Rt,
                pa,
                Ja,
                Bl,
                s,
                "Throttled",
                -0,
                0
              ),
              n
            );
            break e;
          }
          Hf(
            a,
            l,
            yt,
            us,
            Du,
            t,
            Rt,
            pa,
            Ja,
            Bl,
            s,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    al(e);
  }
  function Hf(e, t, l, a, n, s, d, p, _, R, D, k, A, z) {
    if (e.timeoutHandle = -1, k = t.subtreeFlags, k & 8192 || (k & 16785408) === 16785408) {
      k = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: cl
      }, Cf(
        t,
        s,
        k
      );
      var J = (s & 62914560) === s ? ss - _t() : (s & 4194048) === s ? zf - _t() : 0;
      if (J = ag(
        k,
        J
      ), J !== null) {
        Sl = s, e.cancelPendingCommit = J(
          Xf.bind(
            null,
            e,
            t,
            s,
            l,
            a,
            n,
            d,
            p,
            _,
            D,
            k,
            null,
            A,
            z
          )
        ), Xl(e, s, d, !R);
        return;
      }
    }
    Xf(
      e,
      t,
      s,
      l,
      a,
      n,
      d,
      p,
      _
    );
  }
  function bv(e) {
    for (var t = e; ; ) {
      var l = t.tag;
      if ((l === 0 || l === 11 || l === 15) && t.flags & 16384 && (l = t.updateQueue, l !== null && (l = l.stores, l !== null)))
        for (var a = 0; a < l.length; a++) {
          var n = l[a], s = n.getSnapshot;
          n = n.value;
          try {
            if (!Nt(s(), n)) return !1;
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
  function Xl(e, t, l, a) {
    t &= ~Ou, t &= ~pa, e.suspendedLanes |= t, e.pingedLanes &= ~t, a && (e.warmLanes |= t), a = e.expirationTimes;
    for (var n = t; 0 < n; ) {
      var s = 31 - jt(n), d = 1 << s;
      a[s] = -1, n &= ~d;
    }
    l !== 0 && Xr(e, l, t);
  }
  function rs() {
    return (Ee & 6) === 0 ? (Vn(0), !1) : !0;
  }
  function Lu() {
    if (ve !== null) {
      if (Ce === 0)
        var e = ve.return;
      else
        e = ve, dl = sa = null, eu(e), Ya = null, Mn = 0, e = ve;
      for (; e !== null; )
        ff(e.alternate, e), e = e.return;
      ve = null;
    }
  }
  function Wa(e, t) {
    var l = e.timeoutHandle;
    l !== -1 && (e.timeoutHandle = -1, Bv(l)), l = e.cancelPendingCommit, l !== null && (e.cancelPendingCommit = null, l()), Sl = 0, Lu(), Oe = e, ve = l = rl(e.current, null), ye = t, Ce = 0, Mt = null, Bl = !1, Ka = dn(e, t), wu = !1, Ja = Rt = Ou = pa = ql = Ve = 0, yt = Qn = null, Du = !1, (t & 8) !== 0 && (t |= t & 32);
    var a = e.entangledLanes;
    if (a !== 0)
      for (e = e.entanglements, a &= t; 0 < a; ) {
        var n = 31 - jt(a), s = 1 << n;
        t |= e[n], a &= ~s;
      }
    return _l = t, Ai(), l;
  }
  function Uf(e, t) {
    fe = null, C.H = Un, t === qa || t === Li ? (t = Wo(), Ce = 3) : t === Gc ? (t = Wo(), Ce = 4) : Ce = t === vu ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, Mt = t, ve === null && (Ve = 1, Pi(
      e,
      Bt(t, e.current)
    ));
  }
  function kf() {
    var e = Tt.current;
    return e === null ? !0 : (ye & 4194048) === ye ? Xt === null : (ye & 62914560) === ye || (ye & 536870912) !== 0 ? e === Xt : !1;
  }
  function Lf() {
    var e = C.H;
    return C.H = Un, e === null ? Un : e;
  }
  function Bf() {
    var e = C.A;
    return C.A = gv, e;
  }
  function os() {
    Ve = 4, Bl || (ye & 4194048) !== ye && Tt.current !== null || (Ka = !0), (ql & 134217727) === 0 && (pa & 134217727) === 0 || Oe === null || Xl(
      Oe,
      ye,
      Rt,
      !1
    );
  }
  function Bu(e, t, l) {
    var a = Ee;
    Ee |= 2;
    var n = Lf(), s = Bf();
    (Oe !== e || ye !== t) && (us = null, Wa(e, t)), t = !1;
    var d = Ve;
    e: do
      try {
        if (Ce !== 0 && ve !== null) {
          var p = ve, _ = Mt;
          switch (Ce) {
            case 8:
              Lu(), d = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              Tt.current === null && (t = !0);
              var R = Ce;
              if (Ce = 0, Mt = null, Pa(e, p, _, R), l && Ka) {
                d = 0;
                break e;
              }
              break;
            default:
              R = Ce, Ce = 0, Mt = null, Pa(e, p, _, R);
          }
        }
        xv(), d = Ve;
        break;
      } catch (D) {
        Uf(e, D);
      }
    while (!0);
    return t && e.shellSuspendCounter++, dl = sa = null, Ee = a, C.H = n, C.A = s, ve === null && (Oe = null, ye = 0, Ai()), d;
  }
  function xv() {
    for (; ve !== null; ) qf(ve);
  }
  function _v(e, t) {
    var l = Ee;
    Ee |= 2;
    var a = Lf(), n = Bf();
    Oe !== e || ye !== t ? (us = null, cs = _t() + 500, Wa(e, t)) : Ka = dn(
      e,
      t
    );
    e: do
      try {
        if (Ce !== 0 && ve !== null) {
          t = ve;
          var s = Mt;
          t: switch (Ce) {
            case 1:
              Ce = 0, Mt = null, Pa(e, t, s, 1);
              break;
            case 2:
            case 9:
              if (Jo(s)) {
                Ce = 0, Mt = null, Yf(t);
                break;
              }
              t = function() {
                Ce !== 2 && Ce !== 9 || Oe !== e || (Ce = 7), al(e);
              }, s.then(t, t);
              break e;
            case 3:
              Ce = 7;
              break e;
            case 4:
              Ce = 5;
              break e;
            case 7:
              Jo(s) ? (Ce = 0, Mt = null, Yf(t)) : (Ce = 0, Mt = null, Pa(e, t, s, 7));
              break;
            case 5:
              var d = null;
              switch (ve.tag) {
                case 26:
                  d = ve.memoizedState;
                case 5:
                case 27:
                  var p = ve;
                  if (d ? Tm(d) : p.stateNode.complete) {
                    Ce = 0, Mt = null;
                    var _ = p.sibling;
                    if (_ !== null) ve = _;
                    else {
                      var R = p.return;
                      R !== null ? (ve = R, ds(R)) : ve = null;
                    }
                    break t;
                  }
              }
              Ce = 0, Mt = null, Pa(e, t, s, 5);
              break;
            case 6:
              Ce = 0, Mt = null, Pa(e, t, s, 6);
              break;
            case 8:
              Lu(), Ve = 6;
              break e;
            default:
              throw Error(r(462));
          }
        }
        Sv();
        break;
      } catch (D) {
        Uf(e, D);
      }
    while (!0);
    return dl = sa = null, C.H = a, C.A = n, Ee = l, ve !== null ? 0 : (Oe = null, ye = 0, Ai(), Ve);
  }
  function Sv() {
    for (; ve !== null && !Zh(); )
      qf(ve);
  }
  function qf(e) {
    var t = of(e.alternate, e, _l);
    e.memoizedProps = e.pendingProps, t === null ? ds(e) : ve = t;
  }
  function Yf(e) {
    var t = e, l = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = af(
          l,
          t,
          t.pendingProps,
          t.type,
          void 0,
          ye
        );
        break;
      case 11:
        t = af(
          l,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          ye
        );
        break;
      case 5:
        eu(t);
      default:
        ff(l, t), t = ve = Lo(t, _l), t = of(l, t, _l);
    }
    e.memoizedProps = e.pendingProps, t === null ? ds(e) : ve = t;
  }
  function Pa(e, t, l, a) {
    dl = sa = null, eu(t), Ya = null, Mn = 0;
    var n = t.return;
    try {
      if (ov(
        e,
        n,
        t,
        l,
        ye
      )) {
        Ve = 1, Pi(
          e,
          Bt(l, e.current)
        ), ve = null;
        return;
      }
    } catch (s) {
      if (n !== null) throw ve = n, s;
      Ve = 1, Pi(
        e,
        Bt(l, e.current)
      ), ve = null;
      return;
    }
    t.flags & 32768 ? (xe || a === 1 ? e = !0 : Ka || (ye & 536870912) !== 0 ? e = !1 : (Bl = e = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = Tt.current, a !== null && a.tag === 13 && (a.flags |= 16384))), Gf(t, e)) : ds(t);
  }
  function ds(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        Gf(
          t,
          Bl
        );
        return;
      }
      e = t.return;
      var l = mv(
        t.alternate,
        t,
        _l
      );
      if (l !== null) {
        ve = l;
        return;
      }
      if (t = t.sibling, t !== null) {
        ve = t;
        return;
      }
      ve = t = e;
    } while (t !== null);
    Ve === 0 && (Ve = 5);
  }
  function Gf(e, t) {
    do {
      var l = hv(e.alternate, e);
      if (l !== null) {
        l.flags &= 32767, ve = l;
        return;
      }
      if (l = e.return, l !== null && (l.flags |= 32768, l.subtreeFlags = 0, l.deletions = null), !t && (e = e.sibling, e !== null)) {
        ve = e;
        return;
      }
      ve = e = l;
    } while (e !== null);
    Ve = 6, ve = null;
  }
  function Xf(e, t, l, a, n, s, d, p, _) {
    e.cancelPendingCommit = null;
    do
      fs();
    while (tt !== 0);
    if ((Ee & 6) !== 0) throw Error(r(327));
    if (t !== null) {
      if (t === e.current) throw Error(r(177));
      if (s = t.lanes | t.childLanes, s |= Cc, tp(
        e,
        l,
        s,
        d,
        p,
        _
      ), e === Oe && (ve = Oe = null, ye = 0), Fa = t, Gl = e, Sl = l, Hu = s, Uu = n, wf = a, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, Tv(hi, function() {
        return Kf(), null;
      })) : (e.callbackNode = null, e.callbackPriority = 0), a = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || a) {
        a = C.T, C.T = null, n = L.p, L.p = 2, d = Ee, Ee |= 4;
        try {
          pv(e, t, l);
        } finally {
          Ee = d, L.p = n, C.T = a;
        }
      }
      tt = 1, Qf(), Zf(), Vf();
    }
  }
  function Qf() {
    if (tt === 1) {
      tt = 0;
      var e = Gl, t = Fa, l = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || l) {
        l = C.T, C.T = null;
        var a = L.p;
        L.p = 2;
        var n = Ee;
        Ee |= 4;
        try {
          Nf(t, e);
          var s = Wu, d = Ro(e.containerInfo), p = s.focusedElem, _ = s.selectionRange;
          if (d !== p && p && p.ownerDocument && Mo(
            p.ownerDocument.documentElement,
            p
          )) {
            if (_ !== null && Sc(p)) {
              var R = _.start, D = _.end;
              if (D === void 0 && (D = R), "selectionStart" in p)
                p.selectionStart = R, p.selectionEnd = Math.min(
                  D,
                  p.value.length
                );
              else {
                var k = p.ownerDocument || document, A = k && k.defaultView || window;
                if (A.getSelection) {
                  var z = A.getSelection(), J = p.textContent.length, ne = Math.min(_.start, J), ze = _.end === void 0 ? ne : Math.min(_.end, J);
                  !z.extend && ne > ze && (d = ze, ze = ne, ne = d);
                  var T = Co(
                    p,
                    ne
                  ), N = Co(
                    p,
                    ze
                  );
                  if (T && N && (z.rangeCount !== 1 || z.anchorNode !== T.node || z.anchorOffset !== T.offset || z.focusNode !== N.node || z.focusOffset !== N.offset)) {
                    var M = k.createRange();
                    M.setStart(T.node, T.offset), z.removeAllRanges(), ne > ze ? (z.addRange(M), z.extend(N.node, N.offset)) : (M.setEnd(N.node, N.offset), z.addRange(M));
                  }
                }
              }
            }
            for (k = [], z = p; z = z.parentNode; )
              z.nodeType === 1 && k.push({
                element: z,
                left: z.scrollLeft,
                top: z.scrollTop
              });
            for (typeof p.focus == "function" && p.focus(), p = 0; p < k.length; p++) {
              var U = k[p];
              U.element.scrollLeft = U.left, U.element.scrollTop = U.top;
            }
          }
          Ns = !!Fu, Wu = Fu = null;
        } finally {
          Ee = n, L.p = a, C.T = l;
        }
      }
      e.current = t, tt = 2;
    }
  }
  function Zf() {
    if (tt === 2) {
      tt = 0;
      var e = Gl, t = Fa, l = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || l) {
        l = C.T, C.T = null;
        var a = L.p;
        L.p = 2;
        var n = Ee;
        Ee |= 4;
        try {
          bf(e, t.alternate, t);
        } finally {
          Ee = n, L.p = a, C.T = l;
        }
      }
      tt = 3;
    }
  }
  function Vf() {
    if (tt === 4 || tt === 3) {
      tt = 0, Vh();
      var e = Gl, t = Fa, l = Sl, a = wf;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? tt = 5 : (tt = 0, Fa = Gl = null, $f(e, e.pendingLanes));
      var n = e.pendingLanes;
      if (n === 0 && (Yl = null), ac(l), t = t.stateNode, St && typeof St.onCommitFiberRoot == "function")
        try {
          St.onCommitFiberRoot(
            on,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (a !== null) {
        t = C.T, n = L.p, L.p = 2, C.T = null;
        try {
          for (var s = e.onRecoverableError, d = 0; d < a.length; d++) {
            var p = a[d];
            s(p.value, {
              componentStack: p.stack
            });
          }
        } finally {
          C.T = t, L.p = n;
        }
      }
      (Sl & 3) !== 0 && fs(), al(e), n = e.pendingLanes, (l & 261930) !== 0 && (n & 42) !== 0 ? e === ku ? Zn++ : (Zn = 0, ku = e) : Zn = 0, Vn(0);
    }
  }
  function $f(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Tn(t)));
  }
  function fs() {
    return Qf(), Zf(), Vf(), Kf();
  }
  function Kf() {
    if (tt !== 5) return !1;
    var e = Gl, t = Hu;
    Hu = 0;
    var l = ac(Sl), a = C.T, n = L.p;
    try {
      L.p = 32 > l ? 32 : l, C.T = null, l = Uu, Uu = null;
      var s = Gl, d = Sl;
      if (tt = 0, Fa = Gl = null, Sl = 0, (Ee & 6) !== 0) throw Error(r(331));
      var p = Ee;
      if (Ee |= 4, Rf(s.current), Tf(
        s,
        s.current,
        d,
        l
      ), Ee = p, Vn(0, !1), St && typeof St.onPostCommitFiberRoot == "function")
        try {
          St.onPostCommitFiberRoot(on, s);
        } catch {
        }
      return !0;
    } finally {
      L.p = n, C.T = a, $f(e, t);
    }
  }
  function Jf(e, t, l) {
    t = Bt(l, t), t = pu(e.stateNode, t, 2), e = Hl(e, t, 2), e !== null && (fn(e, 2), al(e));
  }
  function Me(e, t, l) {
    if (e.tag === 3)
      Jf(e, e, l);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Jf(
            t,
            e,
            l
          );
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (Yl === null || !Yl.has(a))) {
            e = Bt(l, e), l = Jd(2), a = Hl(t, l, 2), a !== null && (Fd(
              l,
              a,
              t,
              e
            ), fn(a, 2), al(a));
            break;
          }
        }
        t = t.return;
      }
  }
  function qu(e, t, l) {
    var a = e.pingCache;
    if (a === null) {
      a = e.pingCache = new yv();
      var n = /* @__PURE__ */ new Set();
      a.set(t, n);
    } else
      n = a.get(t), n === void 0 && (n = /* @__PURE__ */ new Set(), a.set(t, n));
    n.has(l) || (wu = !0, n.add(l), e = jv.bind(null, e, t, l), t.then(e, e));
  }
  function jv(e, t, l) {
    var a = e.pingCache;
    a !== null && a.delete(t), e.pingedLanes |= e.suspendedLanes & l, e.warmLanes &= ~l, Oe === e && (ye & l) === l && (Ve === 4 || Ve === 3 && (ye & 62914560) === ye && 300 > _t() - ss ? (Ee & 2) === 0 && Wa(e, 0) : Ou |= l, Ja === ye && (Ja = 0)), al(e);
  }
  function Ff(e, t) {
    t === 0 && (t = Gr()), e = aa(e, t), e !== null && (fn(e, t), al(e));
  }
  function Nv(e) {
    var t = e.memoizedState, l = 0;
    t !== null && (l = t.retryLane), Ff(e, l);
  }
  function Ev(e, t) {
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
        throw Error(r(314));
    }
    a !== null && a.delete(t), Ff(e, l);
  }
  function Tv(e, t) {
    return Is(e, t);
  }
  var ms = null, Ia = null, Yu = !1, hs = !1, Gu = !1, Ql = 0;
  function al(e) {
    e !== Ia && e.next === null && (Ia === null ? ms = Ia = e : Ia = Ia.next = e), hs = !0, Yu || (Yu = !0, Mv());
  }
  function Vn(e, t) {
    if (!Gu && hs) {
      Gu = !0;
      do
        for (var l = !1, a = ms; a !== null; ) {
          if (e !== 0) {
            var n = a.pendingLanes;
            if (n === 0) var s = 0;
            else {
              var d = a.suspendedLanes, p = a.pingedLanes;
              s = (1 << 31 - jt(42 | e) + 1) - 1, s &= n & ~(d & ~p), s = s & 201326741 ? s & 201326741 | 1 : s ? s | 2 : 0;
            }
            s !== 0 && (l = !0, em(a, s));
          } else
            s = ye, s = yi(
              a,
              a === Oe ? s : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (s & 3) === 0 || dn(a, s) || (l = !0, em(a, s));
          a = a.next;
        }
      while (l);
      Gu = !1;
    }
  }
  function Cv() {
    Wf();
  }
  function Wf() {
    hs = Yu = !1;
    var e = 0;
    Ql !== 0 && Lv() && (e = Ql);
    for (var t = _t(), l = null, a = ms; a !== null; ) {
      var n = a.next, s = Pf(a, t);
      s === 0 ? (a.next = null, l === null ? ms = n : l.next = n, n === null && (Ia = l)) : (l = a, (e !== 0 || (s & 3) !== 0) && (hs = !0)), a = n;
    }
    tt !== 0 && tt !== 5 || Vn(e), Ql !== 0 && (Ql = 0);
  }
  function Pf(e, t) {
    for (var l = e.suspendedLanes, a = e.pingedLanes, n = e.expirationTimes, s = e.pendingLanes & -62914561; 0 < s; ) {
      var d = 31 - jt(s), p = 1 << d, _ = n[d];
      _ === -1 ? ((p & l) === 0 || (p & a) !== 0) && (n[d] = ep(p, t)) : _ <= t && (e.expiredLanes |= p), s &= ~p;
    }
    if (t = Oe, l = ye, l = yi(
      e,
      e === t ? l : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a = e.callbackNode, l === 0 || e === t && (Ce === 2 || Ce === 9) || e.cancelPendingCommit !== null)
      return a !== null && a !== null && ec(a), e.callbackNode = null, e.callbackPriority = 0;
    if ((l & 3) === 0 || dn(e, l)) {
      if (t = l & -l, t === e.callbackPriority) return t;
      switch (a !== null && ec(a), ac(l)) {
        case 2:
        case 8:
          l = qr;
          break;
        case 32:
          l = hi;
          break;
        case 268435456:
          l = Yr;
          break;
        default:
          l = hi;
      }
      return a = If.bind(null, e), l = Is(l, a), e.callbackPriority = t, e.callbackNode = l, t;
    }
    return a !== null && a !== null && ec(a), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function If(e, t) {
    if (tt !== 0 && tt !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var l = e.callbackNode;
    if (fs() && e.callbackNode !== l)
      return null;
    var a = ye;
    return a = yi(
      e,
      e === Oe ? a : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a === 0 ? null : (Df(e, a, t), Pf(e, _t()), e.callbackNode != null && e.callbackNode === l ? If.bind(null, e) : null);
  }
  function em(e, t) {
    if (fs()) return null;
    Df(e, t, !0);
  }
  function Mv() {
    qv(function() {
      (Ee & 6) !== 0 ? Is(
        Br,
        Cv
      ) : Wf();
    });
  }
  function Xu() {
    if (Ql === 0) {
      var e = La;
      e === 0 && (e = pi, pi <<= 1, (pi & 261888) === 0 && (pi = 256)), Ql = e;
    }
    return Ql;
  }
  function tm(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Si("" + e);
  }
  function lm(e, t) {
    var l = t.ownerDocument.createElement("input");
    return l.name = t.name, l.value = t.value, e.id && l.setAttribute("form", e.id), t.parentNode.insertBefore(l, t), e = new FormData(e), l.parentNode.removeChild(l), e;
  }
  function Rv(e, t, l, a, n) {
    if (t === "submit" && l && l.stateNode === n) {
      var s = tm(
        (n[mt] || null).action
      ), d = a.submitter;
      d && (t = (t = d[mt] || null) ? tm(t.formAction) : d.getAttribute("formAction"), t !== null && (s = t, d = null));
      var p = new Ti(
        "action",
        "action",
        null,
        a,
        n
      );
      e.push({
        event: p,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (Ql !== 0) {
                  var _ = d ? lm(n, d) : new FormData(n);
                  ru(
                    l,
                    {
                      pending: !0,
                      data: _,
                      method: n.method,
                      action: s
                    },
                    null,
                    _
                  );
                }
              } else
                typeof s == "function" && (p.preventDefault(), _ = d ? lm(n, d) : new FormData(n), ru(
                  l,
                  {
                    pending: !0,
                    data: _,
                    method: n.method,
                    action: s
                  },
                  s,
                  _
                ));
            },
            currentTarget: n
          }
        ]
      });
    }
  }
  for (var Qu = 0; Qu < Tc.length; Qu++) {
    var Zu = Tc[Qu], Av = Zu.toLowerCase(), zv = Zu[0].toUpperCase() + Zu.slice(1);
    Jt(
      Av,
      "on" + zv
    );
  }
  Jt(wo, "onAnimationEnd"), Jt(Oo, "onAnimationIteration"), Jt(Do, "onAnimationStart"), Jt("dblclick", "onDoubleClick"), Jt("focusin", "onFocus"), Jt("focusout", "onBlur"), Jt($p, "onTransitionRun"), Jt(Kp, "onTransitionStart"), Jt(Jp, "onTransitionCancel"), Jt(Ho, "onTransitionEnd"), Na("onMouseEnter", ["mouseout", "mouseover"]), Na("onMouseLeave", ["mouseout", "mouseover"]), Na("onPointerEnter", ["pointerout", "pointerover"]), Na("onPointerLeave", ["pointerout", "pointerover"]), Il(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), Il(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), Il("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), Il(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), Il(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), Il(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var $n = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), wv = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat($n)
  );
  function am(e, t) {
    t = (t & 4) !== 0;
    for (var l = 0; l < e.length; l++) {
      var a = e[l], n = a.event;
      a = a.listeners;
      e: {
        var s = void 0;
        if (t)
          for (var d = a.length - 1; 0 <= d; d--) {
            var p = a[d], _ = p.instance, R = p.currentTarget;
            if (p = p.listener, _ !== s && n.isPropagationStopped())
              break e;
            s = p, n.currentTarget = R;
            try {
              s(n);
            } catch (D) {
              Ri(D);
            }
            n.currentTarget = null, s = _;
          }
        else
          for (d = 0; d < a.length; d++) {
            if (p = a[d], _ = p.instance, R = p.currentTarget, p = p.listener, _ !== s && n.isPropagationStopped())
              break e;
            s = p, n.currentTarget = R;
            try {
              s(n);
            } catch (D) {
              Ri(D);
            }
            n.currentTarget = null, s = _;
          }
      }
    }
  }
  function ge(e, t) {
    var l = t[nc];
    l === void 0 && (l = t[nc] = /* @__PURE__ */ new Set());
    var a = e + "__bubble";
    l.has(a) || (nm(t, e, 2, !1), l.add(a));
  }
  function Vu(e, t, l) {
    var a = 0;
    t && (a |= 4), nm(
      l,
      e,
      a,
      t
    );
  }
  var ps = "_reactListening" + Math.random().toString(36).slice(2);
  function $u(e) {
    if (!e[ps]) {
      e[ps] = !0, Jr.forEach(function(l) {
        l !== "selectionchange" && (wv.has(l) || Vu(l, !1, e), Vu(l, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[ps] || (t[ps] = !0, Vu("selectionchange", !1, t));
    }
  }
  function nm(e, t, l, a) {
    switch (Om(t)) {
      case 2:
        var n = sg;
        break;
      case 8:
        n = cg;
        break;
      default:
        n = ur;
    }
    l = n.bind(
      null,
      t,
      l,
      e
    ), n = void 0, !mc || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (n = !0), a ? n !== void 0 ? e.addEventListener(t, l, {
      capture: !0,
      passive: n
    }) : e.addEventListener(t, l, !0) : n !== void 0 ? e.addEventListener(t, l, {
      passive: n
    }) : e.addEventListener(t, l, !1);
  }
  function Ku(e, t, l, a, n) {
    var s = a;
    if ((t & 1) === 0 && (t & 2) === 0 && a !== null)
      e: for (; ; ) {
        if (a === null) return;
        var d = a.tag;
        if (d === 3 || d === 4) {
          var p = a.stateNode.containerInfo;
          if (p === n) break;
          if (d === 4)
            for (d = a.return; d !== null; ) {
              var _ = d.tag;
              if ((_ === 3 || _ === 4) && d.stateNode.containerInfo === n)
                return;
              d = d.return;
            }
          for (; p !== null; ) {
            if (d = _a(p), d === null) return;
            if (_ = d.tag, _ === 5 || _ === 6 || _ === 26 || _ === 27) {
              a = s = d;
              continue e;
            }
            p = p.parentNode;
          }
        }
        a = a.return;
      }
    co(function() {
      var R = s, D = dc(l), k = [];
      e: {
        var A = Uo.get(e);
        if (A !== void 0) {
          var z = Ti, J = e;
          switch (e) {
            case "keypress":
              if (Ni(l) === 0) break e;
            case "keydown":
            case "keyup":
              z = Ep;
              break;
            case "focusin":
              J = "focus", z = gc;
              break;
            case "focusout":
              J = "blur", z = gc;
              break;
            case "beforeblur":
            case "afterblur":
              z = gc;
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
              z = oo;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              z = mp;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              z = Mp;
              break;
            case wo:
            case Oo:
            case Do:
              z = vp;
              break;
            case Ho:
              z = Ap;
              break;
            case "scroll":
            case "scrollend":
              z = dp;
              break;
            case "wheel":
              z = wp;
              break;
            case "copy":
            case "cut":
            case "paste":
              z = yp;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              z = mo;
              break;
            case "toggle":
            case "beforetoggle":
              z = Dp;
          }
          var ne = (t & 4) !== 0, ze = !ne && (e === "scroll" || e === "scrollend"), T = ne ? A !== null ? A + "Capture" : null : A;
          ne = [];
          for (var N = R, M; N !== null; ) {
            var U = N;
            if (M = U.stateNode, U = U.tag, U !== 5 && U !== 26 && U !== 27 || M === null || T === null || (U = pn(N, T), U != null && ne.push(
              Kn(N, U, M)
            )), ze) break;
            N = N.return;
          }
          0 < ne.length && (A = new z(
            A,
            J,
            null,
            l,
            D
          ), k.push({ event: A, listeners: ne }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (A = e === "mouseover" || e === "pointerover", z = e === "mouseout" || e === "pointerout", A && l !== oc && (J = l.relatedTarget || l.fromElement) && (_a(J) || J[xa]))
            break e;
          if ((z || A) && (A = D.window === D ? D : (A = D.ownerDocument) ? A.defaultView || A.parentWindow : window, z ? (J = l.relatedTarget || l.toElement, z = R, J = J ? _a(J) : null, J !== null && (ze = m(J), ne = J.tag, J !== ze || ne !== 5 && ne !== 27 && ne !== 6) && (J = null)) : (z = null, J = R), z !== J)) {
            if (ne = oo, U = "onMouseLeave", T = "onMouseEnter", N = "mouse", (e === "pointerout" || e === "pointerover") && (ne = mo, U = "onPointerLeave", T = "onPointerEnter", N = "pointer"), ze = z == null ? A : hn(z), M = J == null ? A : hn(J), A = new ne(
              U,
              N + "leave",
              z,
              l,
              D
            ), A.target = ze, A.relatedTarget = M, U = null, _a(D) === R && (ne = new ne(
              T,
              N + "enter",
              J,
              l,
              D
            ), ne.target = M, ne.relatedTarget = ze, U = ne), ze = U, z && J)
              t: {
                for (ne = Ov, T = z, N = J, M = 0, U = T; U; U = ne(U))
                  M++;
                U = 0;
                for (var le = N; le; le = ne(le))
                  U++;
                for (; 0 < M - U; )
                  T = ne(T), M--;
                for (; 0 < U - M; )
                  N = ne(N), U--;
                for (; M--; ) {
                  if (T === N || N !== null && T === N.alternate) {
                    ne = T;
                    break t;
                  }
                  T = ne(T), N = ne(N);
                }
                ne = null;
              }
            else ne = null;
            z !== null && im(
              k,
              A,
              z,
              ne,
              !1
            ), J !== null && ze !== null && im(
              k,
              ze,
              J,
              ne,
              !0
            );
          }
        }
        e: {
          if (A = R ? hn(R) : window, z = A.nodeName && A.nodeName.toLowerCase(), z === "select" || z === "input" && A.type === "file")
            var Se = _o;
          else if (bo(A))
            if (So)
              Se = Qp;
            else {
              Se = Gp;
              var W = Yp;
            }
          else
            z = A.nodeName, !z || z.toLowerCase() !== "input" || A.type !== "checkbox" && A.type !== "radio" ? R && rc(R.elementType) && (Se = _o) : Se = Xp;
          if (Se && (Se = Se(e, R))) {
            xo(
              k,
              Se,
              l,
              D
            );
            break e;
          }
          W && W(e, A, R), e === "focusout" && R && A.type === "number" && R.memoizedProps.value != null && uc(A, "number", A.value);
        }
        switch (W = R ? hn(R) : window, e) {
          case "focusin":
            (bo(W) || W.contentEditable === "true") && (Aa = W, jc = R, jn = null);
            break;
          case "focusout":
            jn = jc = Aa = null;
            break;
          case "mousedown":
            Nc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Nc = !1, Ao(k, l, D);
            break;
          case "selectionchange":
            if (Vp) break;
          case "keydown":
          case "keyup":
            Ao(k, l, D);
        }
        var me;
        if (bc)
          e: {
            switch (e) {
              case "compositionstart":
                var be = "onCompositionStart";
                break e;
              case "compositionend":
                be = "onCompositionEnd";
                break e;
              case "compositionupdate":
                be = "onCompositionUpdate";
                break e;
            }
            be = void 0;
          }
        else
          Ra ? go(e, l) && (be = "onCompositionEnd") : e === "keydown" && l.keyCode === 229 && (be = "onCompositionStart");
        be && (ho && l.locale !== "ko" && (Ra || be !== "onCompositionStart" ? be === "onCompositionEnd" && Ra && (me = uo()) : (Ml = D, hc = "value" in Ml ? Ml.value : Ml.textContent, Ra = !0)), W = vs(R, be), 0 < W.length && (be = new fo(
          be,
          e,
          null,
          l,
          D
        ), k.push({ event: be, listeners: W }), me ? be.data = me : (me = yo(l), me !== null && (be.data = me)))), (me = Up ? kp(e, l) : Lp(e, l)) && (be = vs(R, "onBeforeInput"), 0 < be.length && (W = new fo(
          "onBeforeInput",
          "beforeinput",
          null,
          l,
          D
        ), k.push({
          event: W,
          listeners: be
        }), W.data = me)), Rv(
          k,
          e,
          R,
          l,
          D
        );
      }
      am(k, t);
    });
  }
  function Kn(e, t, l) {
    return {
      instance: e,
      listener: t,
      currentTarget: l
    };
  }
  function vs(e, t) {
    for (var l = t + "Capture", a = []; e !== null; ) {
      var n = e, s = n.stateNode;
      if (n = n.tag, n !== 5 && n !== 26 && n !== 27 || s === null || (n = pn(e, l), n != null && a.unshift(
        Kn(e, n, s)
      ), n = pn(e, t), n != null && a.push(
        Kn(e, n, s)
      )), e.tag === 3) return a;
      e = e.return;
    }
    return [];
  }
  function Ov(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function im(e, t, l, a, n) {
    for (var s = t._reactName, d = []; l !== null && l !== a; ) {
      var p = l, _ = p.alternate, R = p.stateNode;
      if (p = p.tag, _ !== null && _ === a) break;
      p !== 5 && p !== 26 && p !== 27 || R === null || (_ = R, n ? (R = pn(l, s), R != null && d.unshift(
        Kn(l, R, _)
      )) : n || (R = pn(l, s), R != null && d.push(
        Kn(l, R, _)
      ))), l = l.return;
    }
    d.length !== 0 && e.push({ event: t, listeners: d });
  }
  var Dv = /\r\n?/g, Hv = /\u0000|\uFFFD/g;
  function sm(e) {
    return (typeof e == "string" ? e : "" + e).replace(Dv, `
`).replace(Hv, "");
  }
  function cm(e, t) {
    return t = sm(t), sm(e) === t;
  }
  function Ae(e, t, l, a, n, s) {
    switch (l) {
      case "children":
        typeof a == "string" ? t === "body" || t === "textarea" && a === "" || Ta(e, a) : (typeof a == "number" || typeof a == "bigint") && t !== "body" && Ta(e, "" + a);
        break;
      case "className":
        xi(e, "class", a);
        break;
      case "tabIndex":
        xi(e, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        xi(e, l, a);
        break;
      case "style":
        io(e, a, s);
        break;
      case "data":
        if (t !== "object") {
          xi(e, "data", a);
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
        a = Si("" + a), e.setAttribute(l, a);
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
          typeof s == "function" && (l === "formAction" ? (t !== "input" && Ae(e, t, "name", n.name, n, null), Ae(
            e,
            t,
            "formEncType",
            n.formEncType,
            n,
            null
          ), Ae(
            e,
            t,
            "formMethod",
            n.formMethod,
            n,
            null
          ), Ae(
            e,
            t,
            "formTarget",
            n.formTarget,
            n,
            null
          )) : (Ae(e, t, "encType", n.encType, n, null), Ae(e, t, "method", n.method, n, null), Ae(e, t, "target", n.target, n, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(l);
          break;
        }
        a = Si("" + a), e.setAttribute(l, a);
        break;
      case "onClick":
        a != null && (e.onclick = cl);
        break;
      case "onScroll":
        a != null && ge("scroll", e);
        break;
      case "onScrollEnd":
        a != null && ge("scrollend", e);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(r(61));
          if (l = a.__html, l != null) {
            if (n.children != null) throw Error(r(60));
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
        l = Si("" + a), e.setAttributeNS(
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
        ge("beforetoggle", e), ge("toggle", e), bi(e, "popover", a);
        break;
      case "xlinkActuate":
        sl(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        sl(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        sl(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        sl(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        sl(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        sl(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        sl(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        sl(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        sl(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          a
        );
        break;
      case "is":
        bi(e, "is", a);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < l.length) || l[0] !== "o" && l[0] !== "O" || l[1] !== "n" && l[1] !== "N") && (l = rp.get(l) || l, bi(e, l, a));
    }
  }
  function Ju(e, t, l, a, n, s) {
    switch (l) {
      case "style":
        io(e, a, s);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(r(61));
          if (l = a.__html, l != null) {
            if (n.children != null) throw Error(r(60));
            e.innerHTML = l;
          }
        }
        break;
      case "children":
        typeof a == "string" ? Ta(e, a) : (typeof a == "number" || typeof a == "bigint") && Ta(e, "" + a);
        break;
      case "onScroll":
        a != null && ge("scroll", e);
        break;
      case "onScrollEnd":
        a != null && ge("scrollend", e);
        break;
      case "onClick":
        a != null && (e.onclick = cl);
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
        if (!Fr.hasOwnProperty(l))
          e: {
            if (l[0] === "o" && l[1] === "n" && (n = l.endsWith("Capture"), t = l.slice(2, n ? l.length - 7 : void 0), s = e[mt] || null, s = s != null ? s[l] : null, typeof s == "function" && e.removeEventListener(t, s, n), typeof a == "function")) {
              typeof s != "function" && s !== null && (l in e ? e[l] = null : e.hasAttribute(l) && e.removeAttribute(l)), e.addEventListener(t, a, n);
              break e;
            }
            l in e ? e[l] = a : a === !0 ? e.setAttribute(l, "") : bi(e, l, a);
          }
    }
  }
  function ut(e, t, l) {
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
        ge("error", e), ge("load", e);
        var a = !1, n = !1, s;
        for (s in l)
          if (l.hasOwnProperty(s)) {
            var d = l[s];
            if (d != null)
              switch (s) {
                case "src":
                  a = !0;
                  break;
                case "srcSet":
                  n = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(r(137, t));
                default:
                  Ae(e, t, s, d, l, null);
              }
          }
        n && Ae(e, t, "srcSet", l.srcSet, l, null), a && Ae(e, t, "src", l.src, l, null);
        return;
      case "input":
        ge("invalid", e);
        var p = s = d = n = null, _ = null, R = null;
        for (a in l)
          if (l.hasOwnProperty(a)) {
            var D = l[a];
            if (D != null)
              switch (a) {
                case "name":
                  n = D;
                  break;
                case "type":
                  d = D;
                  break;
                case "checked":
                  _ = D;
                  break;
                case "defaultChecked":
                  R = D;
                  break;
                case "value":
                  s = D;
                  break;
                case "defaultValue":
                  p = D;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (D != null)
                    throw Error(r(137, t));
                  break;
                default:
                  Ae(e, t, a, D, l, null);
              }
          }
        to(
          e,
          s,
          p,
          _,
          R,
          d,
          n,
          !1
        );
        return;
      case "select":
        ge("invalid", e), a = d = s = null;
        for (n in l)
          if (l.hasOwnProperty(n) && (p = l[n], p != null))
            switch (n) {
              case "value":
                s = p;
                break;
              case "defaultValue":
                d = p;
                break;
              case "multiple":
                a = p;
              default:
                Ae(e, t, n, p, l, null);
            }
        t = s, l = d, e.multiple = !!a, t != null ? Ea(e, !!a, t, !1) : l != null && Ea(e, !!a, l, !0);
        return;
      case "textarea":
        ge("invalid", e), s = n = a = null;
        for (d in l)
          if (l.hasOwnProperty(d) && (p = l[d], p != null))
            switch (d) {
              case "value":
                a = p;
                break;
              case "defaultValue":
                n = p;
                break;
              case "children":
                s = p;
                break;
              case "dangerouslySetInnerHTML":
                if (p != null) throw Error(r(91));
                break;
              default:
                Ae(e, t, d, p, l, null);
            }
        ao(e, a, n, s);
        return;
      case "option":
        for (_ in l)
          if (l.hasOwnProperty(_) && (a = l[_], a != null))
            switch (_) {
              case "selected":
                e.selected = a && typeof a != "function" && typeof a != "symbol";
                break;
              default:
                Ae(e, t, _, a, l, null);
            }
        return;
      case "dialog":
        ge("beforetoggle", e), ge("toggle", e), ge("cancel", e), ge("close", e);
        break;
      case "iframe":
      case "object":
        ge("load", e);
        break;
      case "video":
      case "audio":
        for (a = 0; a < $n.length; a++)
          ge($n[a], e);
        break;
      case "image":
        ge("error", e), ge("load", e);
        break;
      case "details":
        ge("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        ge("error", e), ge("load", e);
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
        for (R in l)
          if (l.hasOwnProperty(R) && (a = l[R], a != null))
            switch (R) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(r(137, t));
              default:
                Ae(e, t, R, a, l, null);
            }
        return;
      default:
        if (rc(t)) {
          for (D in l)
            l.hasOwnProperty(D) && (a = l[D], a !== void 0 && Ju(
              e,
              t,
              D,
              a,
              l,
              void 0
            ));
          return;
        }
    }
    for (p in l)
      l.hasOwnProperty(p) && (a = l[p], a != null && Ae(e, t, p, a, l, null));
  }
  function Uv(e, t, l, a) {
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
        var n = null, s = null, d = null, p = null, _ = null, R = null, D = null;
        for (z in l) {
          var k = l[z];
          if (l.hasOwnProperty(z) && k != null)
            switch (z) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                _ = k;
              default:
                a.hasOwnProperty(z) || Ae(e, t, z, null, a, k);
            }
        }
        for (var A in a) {
          var z = a[A];
          if (k = l[A], a.hasOwnProperty(A) && (z != null || k != null))
            switch (A) {
              case "type":
                s = z;
                break;
              case "name":
                n = z;
                break;
              case "checked":
                R = z;
                break;
              case "defaultChecked":
                D = z;
                break;
              case "value":
                d = z;
                break;
              case "defaultValue":
                p = z;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (z != null)
                  throw Error(r(137, t));
                break;
              default:
                z !== k && Ae(
                  e,
                  t,
                  A,
                  z,
                  a,
                  k
                );
            }
        }
        cc(
          e,
          d,
          p,
          _,
          R,
          D,
          s,
          n
        );
        return;
      case "select":
        z = d = p = A = null;
        for (s in l)
          if (_ = l[s], l.hasOwnProperty(s) && _ != null)
            switch (s) {
              case "value":
                break;
              case "multiple":
                z = _;
              default:
                a.hasOwnProperty(s) || Ae(
                  e,
                  t,
                  s,
                  null,
                  a,
                  _
                );
            }
        for (n in a)
          if (s = a[n], _ = l[n], a.hasOwnProperty(n) && (s != null || _ != null))
            switch (n) {
              case "value":
                A = s;
                break;
              case "defaultValue":
                p = s;
                break;
              case "multiple":
                d = s;
              default:
                s !== _ && Ae(
                  e,
                  t,
                  n,
                  s,
                  a,
                  _
                );
            }
        t = p, l = d, a = z, A != null ? Ea(e, !!l, A, !1) : !!a != !!l && (t != null ? Ea(e, !!l, t, !0) : Ea(e, !!l, l ? [] : "", !1));
        return;
      case "textarea":
        z = A = null;
        for (p in l)
          if (n = l[p], l.hasOwnProperty(p) && n != null && !a.hasOwnProperty(p))
            switch (p) {
              case "value":
                break;
              case "children":
                break;
              default:
                Ae(e, t, p, null, a, n);
            }
        for (d in a)
          if (n = a[d], s = l[d], a.hasOwnProperty(d) && (n != null || s != null))
            switch (d) {
              case "value":
                A = n;
                break;
              case "defaultValue":
                z = n;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (n != null) throw Error(r(91));
                break;
              default:
                n !== s && Ae(e, t, d, n, a, s);
            }
        lo(e, A, z);
        return;
      case "option":
        for (var J in l)
          if (A = l[J], l.hasOwnProperty(J) && A != null && !a.hasOwnProperty(J))
            switch (J) {
              case "selected":
                e.selected = !1;
                break;
              default:
                Ae(
                  e,
                  t,
                  J,
                  null,
                  a,
                  A
                );
            }
        for (_ in a)
          if (A = a[_], z = l[_], a.hasOwnProperty(_) && A !== z && (A != null || z != null))
            switch (_) {
              case "selected":
                e.selected = A && typeof A != "function" && typeof A != "symbol";
                break;
              default:
                Ae(
                  e,
                  t,
                  _,
                  A,
                  a,
                  z
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
        for (var ne in l)
          A = l[ne], l.hasOwnProperty(ne) && A != null && !a.hasOwnProperty(ne) && Ae(e, t, ne, null, a, A);
        for (R in a)
          if (A = a[R], z = l[R], a.hasOwnProperty(R) && A !== z && (A != null || z != null))
            switch (R) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (A != null)
                  throw Error(r(137, t));
                break;
              default:
                Ae(
                  e,
                  t,
                  R,
                  A,
                  a,
                  z
                );
            }
        return;
      default:
        if (rc(t)) {
          for (var ze in l)
            A = l[ze], l.hasOwnProperty(ze) && A !== void 0 && !a.hasOwnProperty(ze) && Ju(
              e,
              t,
              ze,
              void 0,
              a,
              A
            );
          for (D in a)
            A = a[D], z = l[D], !a.hasOwnProperty(D) || A === z || A === void 0 && z === void 0 || Ju(
              e,
              t,
              D,
              A,
              a,
              z
            );
          return;
        }
    }
    for (var T in l)
      A = l[T], l.hasOwnProperty(T) && A != null && !a.hasOwnProperty(T) && Ae(e, t, T, null, a, A);
    for (k in a)
      A = a[k], z = l[k], !a.hasOwnProperty(k) || A === z || A == null && z == null || Ae(e, t, k, A, a, z);
  }
  function um(e) {
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
  function kv() {
    if (typeof performance.getEntriesByType == "function") {
      for (var e = 0, t = 0, l = performance.getEntriesByType("resource"), a = 0; a < l.length; a++) {
        var n = l[a], s = n.transferSize, d = n.initiatorType, p = n.duration;
        if (s && p && um(d)) {
          for (d = 0, p = n.responseEnd, a += 1; a < l.length; a++) {
            var _ = l[a], R = _.startTime;
            if (R > p) break;
            var D = _.transferSize, k = _.initiatorType;
            D && um(k) && (_ = _.responseEnd, d += D * (_ < p ? 1 : (p - R) / (_ - R)));
          }
          if (--a, t += 8 * (s + d) / (n.duration / 1e3), e++, 10 < e) break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
  }
  var Fu = null, Wu = null;
  function gs(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function rm(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function om(e, t) {
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
  function Pu(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Iu = null;
  function Lv() {
    var e = window.event;
    return e && e.type === "popstate" ? e === Iu ? !1 : (Iu = e, !0) : (Iu = null, !1);
  }
  var dm = typeof setTimeout == "function" ? setTimeout : void 0, Bv = typeof clearTimeout == "function" ? clearTimeout : void 0, fm = typeof Promise == "function" ? Promise : void 0, qv = typeof queueMicrotask == "function" ? queueMicrotask : typeof fm < "u" ? function(e) {
    return fm.resolve(null).then(e).catch(Yv);
  } : dm;
  function Yv(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Zl(e) {
    return e === "head";
  }
  function mm(e, t) {
    var l = t, a = 0;
    do {
      var n = l.nextSibling;
      if (e.removeChild(l), n && n.nodeType === 8)
        if (l = n.data, l === "/$" || l === "/&") {
          if (a === 0) {
            e.removeChild(n), an(t);
            return;
          }
          a--;
        } else if (l === "$" || l === "$?" || l === "$~" || l === "$!" || l === "&")
          a++;
        else if (l === "html")
          Jn(e.ownerDocument.documentElement);
        else if (l === "head") {
          l = e.ownerDocument.head, Jn(l);
          for (var s = l.firstChild; s; ) {
            var d = s.nextSibling, p = s.nodeName;
            s[mn] || p === "SCRIPT" || p === "STYLE" || p === "LINK" && s.rel.toLowerCase() === "stylesheet" || l.removeChild(s), s = d;
          }
        } else
          l === "body" && Jn(e.ownerDocument.body);
      l = n;
    } while (l);
    an(t);
  }
  function hm(e, t) {
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
  function er(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var l = t;
      switch (t = t.nextSibling, l.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          er(l), ic(l);
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
  function Gv(e, t, l, a) {
    for (; e.nodeType === 1; ) {
      var n = l;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!a && (e.nodeName !== "INPUT" || e.type !== "hidden"))
          break;
      } else if (a) {
        if (!e[mn])
          switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (s = e.getAttribute("rel"), s === "stylesheet" && e.hasAttribute("data-precedence"))
                break;
              if (s !== n.rel || e.getAttribute("href") !== (n.href == null || n.href === "" ? null : n.href) || e.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin) || e.getAttribute("title") !== (n.title == null ? null : n.title))
                break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (s = e.getAttribute("src"), (s !== (n.src == null ? null : n.src) || e.getAttribute("type") !== (n.type == null ? null : n.type) || e.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin)) && s && e.hasAttribute("async") && !e.hasAttribute("itemprop"))
                break;
              return e;
            default:
              return e;
          }
      } else if (t === "input" && e.type === "hidden") {
        var s = n.name == null ? null : "" + n.name;
        if (n.type === "hidden" && e.getAttribute("name") === s)
          return e;
      } else return e;
      if (e = Qt(e.nextSibling), e === null) break;
    }
    return null;
  }
  function Xv(e, t, l) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !l || (e = Qt(e.nextSibling), e === null)) return null;
    return e;
  }
  function pm(e, t) {
    for (; e.nodeType !== 8; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = Qt(e.nextSibling), e === null)) return null;
    return e;
  }
  function tr(e) {
    return e.data === "$?" || e.data === "$~";
  }
  function lr(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
  }
  function Qv(e, t) {
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
  function Qt(e) {
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
  var ar = null;
  function vm(e) {
    e = e.nextSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var l = e.data;
        if (l === "/$" || l === "/&") {
          if (t === 0)
            return Qt(e.nextSibling);
          t--;
        } else
          l !== "$" && l !== "$!" && l !== "$?" && l !== "$~" && l !== "&" || t++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function gm(e) {
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
  function ym(e, t, l) {
    switch (t = gs(l), e) {
      case "html":
        if (e = t.documentElement, !e) throw Error(r(452));
        return e;
      case "head":
        if (e = t.head, !e) throw Error(r(453));
        return e;
      case "body":
        if (e = t.body, !e) throw Error(r(454));
        return e;
      default:
        throw Error(r(451));
    }
  }
  function Jn(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    ic(e);
  }
  var Zt = /* @__PURE__ */ new Map(), bm = /* @__PURE__ */ new Set();
  function ys(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
  }
  var jl = L.d;
  L.d = {
    f: Zv,
    r: Vv,
    D: $v,
    C: Kv,
    L: Jv,
    m: Fv,
    X: Pv,
    S: Wv,
    M: Iv
  };
  function Zv() {
    var e = jl.f(), t = rs();
    return e || t;
  }
  function Vv(e) {
    var t = Sa(e);
    t !== null && t.tag === 5 && t.type === "form" ? Hd(t) : jl.r(e);
  }
  var en = typeof document > "u" ? null : document;
  function xm(e, t, l) {
    var a = en;
    if (a && typeof t == "string" && t) {
      var n = kt(t);
      n = 'link[rel="' + e + '"][href="' + n + '"]', typeof l == "string" && (n += '[crossorigin="' + l + '"]'), bm.has(n) || (bm.add(n), e = { rel: e, crossOrigin: l, href: t }, a.querySelector(n) === null && (t = a.createElement("link"), ut(t, "link", e), lt(t), a.head.appendChild(t)));
    }
  }
  function $v(e) {
    jl.D(e), xm("dns-prefetch", e, null);
  }
  function Kv(e, t) {
    jl.C(e, t), xm("preconnect", e, t);
  }
  function Jv(e, t, l) {
    jl.L(e, t, l);
    var a = en;
    if (a && e && t) {
      var n = 'link[rel="preload"][as="' + kt(t) + '"]';
      t === "image" && l && l.imageSrcSet ? (n += '[imagesrcset="' + kt(
        l.imageSrcSet
      ) + '"]', typeof l.imageSizes == "string" && (n += '[imagesizes="' + kt(
        l.imageSizes
      ) + '"]')) : n += '[href="' + kt(e) + '"]';
      var s = n;
      switch (t) {
        case "style":
          s = tn(e);
          break;
        case "script":
          s = ln(e);
      }
      Zt.has(s) || (e = x(
        {
          rel: "preload",
          href: t === "image" && l && l.imageSrcSet ? void 0 : e,
          as: t
        },
        l
      ), Zt.set(s, e), a.querySelector(n) !== null || t === "style" && a.querySelector(Fn(s)) || t === "script" && a.querySelector(Wn(s)) || (t = a.createElement("link"), ut(t, "link", e), lt(t), a.head.appendChild(t)));
    }
  }
  function Fv(e, t) {
    jl.m(e, t);
    var l = en;
    if (l && e) {
      var a = t && typeof t.as == "string" ? t.as : "script", n = 'link[rel="modulepreload"][as="' + kt(a) + '"][href="' + kt(e) + '"]', s = n;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          s = ln(e);
      }
      if (!Zt.has(s) && (e = x({ rel: "modulepreload", href: e }, t), Zt.set(s, e), l.querySelector(n) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (l.querySelector(Wn(s)))
              return;
        }
        a = l.createElement("link"), ut(a, "link", e), lt(a), l.head.appendChild(a);
      }
    }
  }
  function Wv(e, t, l) {
    jl.S(e, t, l);
    var a = en;
    if (a && e) {
      var n = ja(a).hoistableStyles, s = tn(e);
      t = t || "default";
      var d = n.get(s);
      if (!d) {
        var p = { loading: 0, preload: null };
        if (d = a.querySelector(
          Fn(s)
        ))
          p.loading = 5;
        else {
          e = x(
            { rel: "stylesheet", href: e, "data-precedence": t },
            l
          ), (l = Zt.get(s)) && nr(e, l);
          var _ = d = a.createElement("link");
          lt(_), ut(_, "link", e), _._p = new Promise(function(R, D) {
            _.onload = R, _.onerror = D;
          }), _.addEventListener("load", function() {
            p.loading |= 1;
          }), _.addEventListener("error", function() {
            p.loading |= 2;
          }), p.loading |= 4, bs(d, t, a);
        }
        d = {
          type: "stylesheet",
          instance: d,
          count: 1,
          state: p
        }, n.set(s, d);
      }
    }
  }
  function Pv(e, t) {
    jl.X(e, t);
    var l = en;
    if (l && e) {
      var a = ja(l).hoistableScripts, n = ln(e), s = a.get(n);
      s || (s = l.querySelector(Wn(n)), s || (e = x({ src: e, async: !0 }, t), (t = Zt.get(n)) && ir(e, t), s = l.createElement("script"), lt(s), ut(s, "link", e), l.head.appendChild(s)), s = {
        type: "script",
        instance: s,
        count: 1,
        state: null
      }, a.set(n, s));
    }
  }
  function Iv(e, t) {
    jl.M(e, t);
    var l = en;
    if (l && e) {
      var a = ja(l).hoistableScripts, n = ln(e), s = a.get(n);
      s || (s = l.querySelector(Wn(n)), s || (e = x({ src: e, async: !0, type: "module" }, t), (t = Zt.get(n)) && ir(e, t), s = l.createElement("script"), lt(s), ut(s, "link", e), l.head.appendChild(s)), s = {
        type: "script",
        instance: s,
        count: 1,
        state: null
      }, a.set(n, s));
    }
  }
  function _m(e, t, l, a) {
    var n = (n = de.current) ? ys(n) : null;
    if (!n) throw Error(r(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof l.precedence == "string" && typeof l.href == "string" ? (t = tn(l.href), l = ja(
          n
        ).hoistableStyles, a = l.get(t), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, l.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (l.rel === "stylesheet" && typeof l.href == "string" && typeof l.precedence == "string") {
          e = tn(l.href);
          var s = ja(
            n
          ).hoistableStyles, d = s.get(e);
          if (d || (n = n.ownerDocument || n, d = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, s.set(e, d), (s = n.querySelector(
            Fn(e)
          )) && !s._p && (d.instance = s, d.state.loading = 5), Zt.has(e) || (l = {
            rel: "preload",
            as: "style",
            href: l.href,
            crossOrigin: l.crossOrigin,
            integrity: l.integrity,
            media: l.media,
            hrefLang: l.hrefLang,
            referrerPolicy: l.referrerPolicy
          }, Zt.set(e, l), s || eg(
            n,
            e,
            l,
            d.state
          ))), t && a === null)
            throw Error(r(528, ""));
          return d;
        }
        if (t && a !== null)
          throw Error(r(529, ""));
        return null;
      case "script":
        return t = l.async, l = l.src, typeof l == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = ln(l), l = ja(
          n
        ).hoistableScripts, a = l.get(t), a || (a = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, l.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(r(444, e));
    }
  }
  function tn(e) {
    return 'href="' + kt(e) + '"';
  }
  function Fn(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function Sm(e) {
    return x({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function eg(e, t, l, a) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? a.loading = 1 : (t = e.createElement("link"), a.preload = t, t.addEventListener("load", function() {
      return a.loading |= 1;
    }), t.addEventListener("error", function() {
      return a.loading |= 2;
    }), ut(t, "link", l), lt(t), e.head.appendChild(t));
  }
  function ln(e) {
    return '[src="' + kt(e) + '"]';
  }
  function Wn(e) {
    return "script[async]" + e;
  }
  function jm(e, t, l) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var a = e.querySelector(
            'style[data-href~="' + kt(l.href) + '"]'
          );
          if (a)
            return t.instance = a, lt(a), a;
          var n = x({}, l, {
            "data-href": l.href,
            "data-precedence": l.precedence,
            href: null,
            precedence: null
          });
          return a = (e.ownerDocument || e).createElement(
            "style"
          ), lt(a), ut(a, "style", n), bs(a, l.precedence, e), t.instance = a;
        case "stylesheet":
          n = tn(l.href);
          var s = e.querySelector(
            Fn(n)
          );
          if (s)
            return t.state.loading |= 4, t.instance = s, lt(s), s;
          a = Sm(l), (n = Zt.get(n)) && nr(a, n), s = (e.ownerDocument || e).createElement("link"), lt(s);
          var d = s;
          return d._p = new Promise(function(p, _) {
            d.onload = p, d.onerror = _;
          }), ut(s, "link", a), t.state.loading |= 4, bs(s, l.precedence, e), t.instance = s;
        case "script":
          return s = ln(l.src), (n = e.querySelector(
            Wn(s)
          )) ? (t.instance = n, lt(n), n) : (a = l, (n = Zt.get(s)) && (a = x({}, l), ir(a, n)), e = e.ownerDocument || e, n = e.createElement("script"), lt(n), ut(n, "link", a), e.head.appendChild(n), t.instance = n);
        case "void":
          return null;
        default:
          throw Error(r(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (a = t.instance, t.state.loading |= 4, bs(a, l.precedence, e));
    return t.instance;
  }
  function bs(e, t, l) {
    for (var a = l.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), n = a.length ? a[a.length - 1] : null, s = n, d = 0; d < a.length; d++) {
      var p = a[d];
      if (p.dataset.precedence === t) s = p;
      else if (s !== n) break;
    }
    s ? s.parentNode.insertBefore(e, s.nextSibling) : (t = l.nodeType === 9 ? l.head : l, t.insertBefore(e, t.firstChild));
  }
  function nr(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function ir(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var xs = null;
  function Nm(e, t, l) {
    if (xs === null) {
      var a = /* @__PURE__ */ new Map(), n = xs = /* @__PURE__ */ new Map();
      n.set(l, a);
    } else
      n = xs, a = n.get(l), a || (a = /* @__PURE__ */ new Map(), n.set(l, a));
    if (a.has(e)) return a;
    for (a.set(e, null), l = l.getElementsByTagName(e), n = 0; n < l.length; n++) {
      var s = l[n];
      if (!(s[mn] || s[nt] || e === "link" && s.getAttribute("rel") === "stylesheet") && s.namespaceURI !== "http://www.w3.org/2000/svg") {
        var d = s.getAttribute(t) || "";
        d = e + d;
        var p = a.get(d);
        p ? p.push(s) : a.set(d, [s]);
      }
    }
    return a;
  }
  function Em(e, t, l) {
    e = e.ownerDocument || e, e.head.insertBefore(
      l,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function tg(e, t, l) {
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
  function Tm(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  function lg(e, t, l, a) {
    if (l.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && (l.state.loading & 4) === 0) {
      if (l.instance === null) {
        var n = tn(a.href), s = t.querySelector(
          Fn(n)
        );
        if (s) {
          t = s._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = _s.bind(e), t.then(e, e)), l.state.loading |= 4, l.instance = s, lt(s);
          return;
        }
        s = t.ownerDocument || t, a = Sm(a), (n = Zt.get(n)) && nr(a, n), s = s.createElement("link"), lt(s);
        var d = s;
        d._p = new Promise(function(p, _) {
          d.onload = p, d.onerror = _;
        }), ut(s, "link", a), l.instance = s;
      }
      e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(l, t), (t = l.state.preload) && (l.state.loading & 3) === 0 && (e.count++, l = _s.bind(e), t.addEventListener("load", l), t.addEventListener("error", l));
    }
  }
  var sr = 0;
  function ag(e, t) {
    return e.stylesheets && e.count === 0 && js(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(l) {
      var a = setTimeout(function() {
        if (e.stylesheets && js(e, e.stylesheets), e.unsuspend) {
          var s = e.unsuspend;
          e.unsuspend = null, s();
        }
      }, 6e4 + t);
      0 < e.imgBytes && sr === 0 && (sr = 62500 * kv());
      var n = setTimeout(
        function() {
          if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && js(e, e.stylesheets), e.unsuspend)) {
            var s = e.unsuspend;
            e.unsuspend = null, s();
          }
        },
        (e.imgBytes > sr ? 50 : 800) + t
      );
      return e.unsuspend = l, function() {
        e.unsuspend = null, clearTimeout(a), clearTimeout(n);
      };
    } : null;
  }
  function _s() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) js(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var Ss = null;
  function js(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, Ss = /* @__PURE__ */ new Map(), t.forEach(ng, e), Ss = null, _s.call(e));
  }
  function ng(e, t) {
    if (!(t.state.loading & 4)) {
      var l = Ss.get(e);
      if (l) var a = l.get(null);
      else {
        l = /* @__PURE__ */ new Map(), Ss.set(e, l);
        for (var n = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), s = 0; s < n.length; s++) {
          var d = n[s];
          (d.nodeName === "LINK" || d.getAttribute("media") !== "not all") && (l.set(d.dataset.precedence, d), a = d);
        }
        a && l.set(null, a);
      }
      n = t.instance, d = n.getAttribute("data-precedence"), s = l.get(d) || a, s === a && l.set(null, n), l.set(d, n), this.count++, a = _s.bind(this), n.addEventListener("load", a), n.addEventListener("error", a), s ? s.parentNode.insertBefore(n, s.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(n, e.firstChild)), t.state.loading |= 4;
    }
  }
  var Pn = {
    $$typeof: q,
    Provider: null,
    Consumer: null,
    _currentValue: $,
    _currentValue2: $,
    _threadCount: 0
  };
  function ig(e, t, l, a, n, s, d, p, _) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = tc(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = tc(0), this.hiddenUpdates = tc(null), this.identifierPrefix = a, this.onUncaughtError = n, this.onCaughtError = s, this.onRecoverableError = d, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = _, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function Cm(e, t, l, a, n, s, d, p, _, R, D, k) {
    return e = new ig(
      e,
      t,
      l,
      d,
      _,
      R,
      D,
      k,
      p
    ), t = 1, s === !0 && (t |= 24), s = Et(3, null, null, t), e.current = s, s.stateNode = e, t = Bc(), t.refCount++, e.pooledCache = t, t.refCount++, s.memoizedState = {
      element: a,
      isDehydrated: l,
      cache: t
    }, Xc(s), e;
  }
  function Mm(e) {
    return e ? (e = Oa, e) : Oa;
  }
  function Rm(e, t, l, a, n, s) {
    n = Mm(n), a.context === null ? a.context = n : a.pendingContext = n, a = Dl(t), a.payload = { element: l }, s = s === void 0 ? null : s, s !== null && (a.callback = s), l = Hl(e, a, t), l !== null && (bt(l, e, t), An(l, e, t));
  }
  function Am(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var l = e.retryLane;
      e.retryLane = l !== 0 && l < t ? l : t;
    }
  }
  function cr(e, t) {
    Am(e, t), (e = e.alternate) && Am(e, t);
  }
  function zm(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = aa(e, 67108864);
      t !== null && bt(t, e, 67108864), cr(e, 67108864);
    }
  }
  function wm(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = At();
      t = lc(t);
      var l = aa(e, t);
      l !== null && bt(l, e, t), cr(e, t);
    }
  }
  var Ns = !0;
  function sg(e, t, l, a) {
    var n = C.T;
    C.T = null;
    var s = L.p;
    try {
      L.p = 2, ur(e, t, l, a);
    } finally {
      L.p = s, C.T = n;
    }
  }
  function cg(e, t, l, a) {
    var n = C.T;
    C.T = null;
    var s = L.p;
    try {
      L.p = 8, ur(e, t, l, a);
    } finally {
      L.p = s, C.T = n;
    }
  }
  function ur(e, t, l, a) {
    if (Ns) {
      var n = rr(a);
      if (n === null)
        Ku(
          e,
          t,
          a,
          Es,
          l
        ), Dm(e, a);
      else if (rg(
        n,
        e,
        t,
        l,
        a
      ))
        a.stopPropagation();
      else if (Dm(e, a), t & 4 && -1 < ug.indexOf(e)) {
        for (; n !== null; ) {
          var s = Sa(n);
          if (s !== null)
            switch (s.tag) {
              case 3:
                if (s = s.stateNode, s.current.memoizedState.isDehydrated) {
                  var d = Pl(s.pendingLanes);
                  if (d !== 0) {
                    var p = s;
                    for (p.pendingLanes |= 2, p.entangledLanes |= 2; d; ) {
                      var _ = 1 << 31 - jt(d);
                      p.entanglements[1] |= _, d &= ~_;
                    }
                    al(s), (Ee & 6) === 0 && (cs = _t() + 500, Vn(0));
                  }
                }
                break;
              case 31:
              case 13:
                p = aa(s, 2), p !== null && bt(p, s, 2), rs(), cr(s, 2);
            }
          if (s = rr(a), s === null && Ku(
            e,
            t,
            a,
            Es,
            l
          ), s === n) break;
          n = s;
        }
        n !== null && a.stopPropagation();
      } else
        Ku(
          e,
          t,
          a,
          null,
          l
        );
    }
  }
  function rr(e) {
    return e = dc(e), or(e);
  }
  var Es = null;
  function or(e) {
    if (Es = null, e = _a(e), e !== null) {
      var t = m(e);
      if (t === null) e = null;
      else {
        var l = t.tag;
        if (l === 13) {
          if (e = g(t), e !== null) return e;
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
    return Es = e, null;
  }
  function Om(e) {
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
        switch ($h()) {
          case Br:
            return 2;
          case qr:
            return 8;
          case hi:
          case Kh:
            return 32;
          case Yr:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var dr = !1, Vl = null, $l = null, Kl = null, In = /* @__PURE__ */ new Map(), ei = /* @__PURE__ */ new Map(), Jl = [], ug = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function Dm(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Vl = null;
        break;
      case "dragenter":
      case "dragleave":
        $l = null;
        break;
      case "mouseover":
      case "mouseout":
        Kl = null;
        break;
      case "pointerover":
      case "pointerout":
        In.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        ei.delete(t.pointerId);
    }
  }
  function ti(e, t, l, a, n, s) {
    return e === null || e.nativeEvent !== s ? (e = {
      blockedOn: t,
      domEventName: l,
      eventSystemFlags: a,
      nativeEvent: s,
      targetContainers: [n]
    }, t !== null && (t = Sa(t), t !== null && zm(t)), e) : (e.eventSystemFlags |= a, t = e.targetContainers, n !== null && t.indexOf(n) === -1 && t.push(n), e);
  }
  function rg(e, t, l, a, n) {
    switch (t) {
      case "focusin":
        return Vl = ti(
          Vl,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "dragenter":
        return $l = ti(
          $l,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "mouseover":
        return Kl = ti(
          Kl,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "pointerover":
        var s = n.pointerId;
        return In.set(
          s,
          ti(
            In.get(s) || null,
            e,
            t,
            l,
            a,
            n
          )
        ), !0;
      case "gotpointercapture":
        return s = n.pointerId, ei.set(
          s,
          ti(
            ei.get(s) || null,
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
  function Hm(e) {
    var t = _a(e.target);
    if (t !== null) {
      var l = m(t);
      if (l !== null) {
        if (t = l.tag, t === 13) {
          if (t = g(l), t !== null) {
            e.blockedOn = t, $r(e.priority, function() {
              wm(l);
            });
            return;
          }
        } else if (t === 31) {
          if (t = y(l), t !== null) {
            e.blockedOn = t, $r(e.priority, function() {
              wm(l);
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
  function Ts(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var l = rr(e.nativeEvent);
      if (l === null) {
        l = e.nativeEvent;
        var a = new l.constructor(
          l.type,
          l
        );
        oc = a, l.target.dispatchEvent(a), oc = null;
      } else
        return t = Sa(l), t !== null && zm(t), e.blockedOn = l, !1;
      t.shift();
    }
    return !0;
  }
  function Um(e, t, l) {
    Ts(e) && l.delete(t);
  }
  function og() {
    dr = !1, Vl !== null && Ts(Vl) && (Vl = null), $l !== null && Ts($l) && ($l = null), Kl !== null && Ts(Kl) && (Kl = null), In.forEach(Um), ei.forEach(Um);
  }
  function Cs(e, t) {
    e.blockedOn === t && (e.blockedOn = null, dr || (dr = !0, i.unstable_scheduleCallback(
      i.unstable_NormalPriority,
      og
    )));
  }
  var Ms = null;
  function km(e) {
    Ms !== e && (Ms = e, i.unstable_scheduleCallback(
      i.unstable_NormalPriority,
      function() {
        Ms === e && (Ms = null);
        for (var t = 0; t < e.length; t += 3) {
          var l = e[t], a = e[t + 1], n = e[t + 2];
          if (typeof a != "function") {
            if (or(a || l) === null)
              continue;
            break;
          }
          var s = Sa(l);
          s !== null && (e.splice(t, 3), t -= 3, ru(
            s,
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
  function an(e) {
    function t(_) {
      return Cs(_, e);
    }
    Vl !== null && Cs(Vl, e), $l !== null && Cs($l, e), Kl !== null && Cs(Kl, e), In.forEach(t), ei.forEach(t);
    for (var l = 0; l < Jl.length; l++) {
      var a = Jl[l];
      a.blockedOn === e && (a.blockedOn = null);
    }
    for (; 0 < Jl.length && (l = Jl[0], l.blockedOn === null); )
      Hm(l), l.blockedOn === null && Jl.shift();
    if (l = (e.ownerDocument || e).$$reactFormReplay, l != null)
      for (a = 0; a < l.length; a += 3) {
        var n = l[a], s = l[a + 1], d = n[mt] || null;
        if (typeof s == "function")
          d || km(l);
        else if (d) {
          var p = null;
          if (s && s.hasAttribute("formAction")) {
            if (n = s, d = s[mt] || null)
              p = d.formAction;
            else if (or(n) !== null) continue;
          } else p = d.action;
          typeof p == "function" ? l[a + 1] = p : (l.splice(a, 3), a -= 3), km(l);
        }
      }
  }
  function Lm() {
    function e(s) {
      s.canIntercept && s.info === "react-transition" && s.intercept({
        handler: function() {
          return new Promise(function(d) {
            return n = d;
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
        var s = navigation.currentEntry;
        s && s.url != null && navigation.navigate(s.url, {
          state: s.getState(),
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
  function fr(e) {
    this._internalRoot = e;
  }
  Rs.prototype.render = fr.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(r(409));
    var l = t.current, a = At();
    Rm(l, a, e, t, null, null);
  }, Rs.prototype.unmount = fr.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      Rm(e.current, 2, null, e, null, null), rs(), t[xa] = null;
    }
  };
  function Rs(e) {
    this._internalRoot = e;
  }
  Rs.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Vr();
      e = { blockedOn: null, target: e, priority: t };
      for (var l = 0; l < Jl.length && t !== 0 && t < Jl[l].priority; l++) ;
      Jl.splice(l, 0, e), l === 0 && Hm(e);
    }
  };
  var Bm = u.version;
  if (Bm !== "19.2.8")
    throw Error(
      r(
        527,
        Bm,
        "19.2.8"
      )
    );
  L.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(r(188)) : (e = Object.keys(e).join(","), Error(r(268, e)));
    return e = h(t), e = e !== null ? b(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var dg = {
    bundleType: 0,
    version: "19.2.8",
    rendererPackageName: "react-dom",
    currentDispatcherRef: C,
    reconcilerVersion: "19.2.8"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var As = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!As.isDisabled && As.supportsFiber)
      try {
        on = As.inject(
          dg
        ), St = As;
      } catch {
      }
  }
  return ai.createRoot = function(e, t) {
    if (!f(e)) throw Error(r(299));
    var l = !1, a = "", n = Zd, s = Vd, d = $d;
    return t != null && (t.unstable_strictMode === !0 && (l = !0), t.identifierPrefix !== void 0 && (a = t.identifierPrefix), t.onUncaughtError !== void 0 && (n = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (d = t.onRecoverableError)), t = Cm(
      e,
      1,
      !1,
      null,
      null,
      l,
      a,
      null,
      n,
      s,
      d,
      Lm
    ), e[xa] = t.current, $u(e), new fr(t);
  }, ai.hydrateRoot = function(e, t, l) {
    if (!f(e)) throw Error(r(299));
    var a = !1, n = "", s = Zd, d = Vd, p = $d, _ = null;
    return l != null && (l.unstable_strictMode === !0 && (a = !0), l.identifierPrefix !== void 0 && (n = l.identifierPrefix), l.onUncaughtError !== void 0 && (s = l.onUncaughtError), l.onCaughtError !== void 0 && (d = l.onCaughtError), l.onRecoverableError !== void 0 && (p = l.onRecoverableError), l.formState !== void 0 && (_ = l.formState)), t = Cm(
      e,
      1,
      !0,
      t,
      l ?? null,
      a,
      n,
      _,
      s,
      d,
      p,
      Lm
    ), t.context = Mm(null), l = t.current, a = At(), a = lc(a), n = Dl(a), n.callback = null, Hl(l, n, a), l = a, t.current.lanes = l, fn(t, l), al(t), e[xa] = t.current, $u(e), new Rs(t);
  }, ai.version = "19.2.8", ai;
}
var Jm;
function jg() {
  if (Jm) return pr.exports;
  Jm = 1;
  function i() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i);
      } catch (u) {
        console.error(u);
      }
  }
  return i(), pr.exports = Sg(), pr.exports;
}
var Ng = jg();
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
var Cr = /^(?:[a-z][a-z0-9+.-]*:|[\\/]{2})/i, mh = /^[\\/]{2}/;
function Eg(i, u) {
  return u + i.replace(/\\/g, "/");
}
var Fm = "popstate";
function Wm(i) {
  return typeof i == "object" && i != null && "pathname" in i && "search" in i && "hash" in i && "state" in i && "key" in i;
}
function Tg(i = {}) {
  function u(f, m) {
    let {
      pathname: g = "/",
      search: y = "",
      hash: v = ""
    } = ba(f.location.hash.substring(1));
    return !g.startsWith("/") && !g.startsWith(".") && (g = "/" + g), Sr(
      "",
      { pathname: g, search: y, hash: v },
      // state defaults to `null` because `window.history.state` does
      m.state && m.state.usr || null,
      m.state && m.state.key || "default"
    );
  }
  function o(f, m) {
    let g = f.document.querySelector("base"), y = "";
    if (g && g.getAttribute("href")) {
      let v = f.location.href, h = v.indexOf("#");
      y = h === -1 ? v : v.slice(0, h);
    }
    return y + "#" + (typeof m == "string" ? m : ui(m));
  }
  function r(f, m) {
    zt(
      f.pathname.charAt(0) === "/",
      `relative pathnames are not supported in hash history.push(${JSON.stringify(
        m
      )})`
    );
  }
  return Mg(
    u,
    o,
    r,
    i
  );
}
function Ge(i, u) {
  if (i === !1 || i === null || typeof i > "u")
    throw new Error(u);
}
function zt(i, u) {
  if (!i) {
    typeof console < "u" && console.warn(u);
    try {
      throw new Error(u);
    } catch {
    }
  }
}
function Cg() {
  return Math.random().toString(36).substring(2, 10);
}
function Pm(i, u) {
  return {
    usr: i.state,
    key: i.key,
    idx: u,
    masked: i.mask ? {
      pathname: i.pathname,
      search: i.search,
      hash: i.hash
    } : void 0
  };
}
function Sr(i, u, o = null, r, f) {
  return {
    pathname: typeof i == "string" ? i : i.pathname,
    search: "",
    hash: "",
    ...typeof u == "string" ? ba(u) : u,
    state: o,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: u && u.key || r || Cg(),
    mask: f
  };
}
function ui({
  pathname: i = "/",
  search: u = "",
  hash: o = ""
}) {
  return u && u !== "?" && (i += u.charAt(0) === "?" ? u : "?" + u), o && o !== "#" && (i += o.charAt(0) === "#" ? o : "#" + o), i;
}
function ba(i) {
  let u = {};
  if (i) {
    let o = i.indexOf("#");
    o >= 0 && (u.hash = i.substring(o), i = i.substring(0, o));
    let r = i.indexOf("?");
    r >= 0 && (u.search = i.substring(r), i = i.substring(0, r)), i && (u.pathname = i);
  }
  return u;
}
function Mg(i, u, o, r = {}) {
  let { window: f = document.defaultView, v5Compat: m = !1 } = r, g = f.history, y = "POP", v = null, h = b();
  h == null && (h = 0, g.replaceState({ ...g.state, idx: h }, ""));
  function b() {
    return (g.state || { idx: null }).idx;
  }
  function x() {
    y = "POP";
    let O = b(), Q = O == null ? null : O - h;
    h = O, v && v({ action: y, location: B.location, delta: Q });
  }
  function E(O, Q) {
    y = "PUSH";
    let K = Wm(O) ? O : Sr(B.location, O, Q);
    o && o(K, O), h = b() + 1;
    let q = Pm(K, h), te = B.createHref(K.mask || K);
    try {
      g.pushState(q, "", te);
    } catch (ie) {
      if (ie instanceof DOMException && ie.name === "DataCloneError")
        throw ie;
      f.location.assign(te);
    }
    m && v && v({ action: y, location: B.location, delta: 1 });
  }
  function Y(O, Q) {
    y = "REPLACE";
    let K = Wm(O) ? O : Sr(B.location, O, Q);
    o && o(K, O), h = b();
    let q = Pm(K, h), te = B.createHref(K.mask || K);
    g.replaceState(q, "", te), m && v && v({ action: y, location: B.location, delta: 0 });
  }
  function X(O) {
    return Rg(f, O);
  }
  let B = {
    get action() {
      return y;
    },
    get location() {
      return i(f, g);
    },
    listen(O) {
      if (v)
        throw new Error("A history only accepts one active listener");
      return f.addEventListener(Fm, x), v = O, () => {
        f.removeEventListener(Fm, x), v = null;
      };
    },
    createHref(O) {
      return u(f, O);
    },
    createURL: X,
    encodeLocation(O) {
      let Q = X(O);
      return {
        pathname: Q.pathname,
        search: Q.search,
        hash: Q.hash
      };
    },
    push: E,
    replace: Y,
    go(O) {
      return g.go(O);
    }
  };
  return B;
}
function Rg(i, u, o = !1) {
  let r = "http://localhost";
  i && (r = i.location.origin !== "null" ? i.location.origin : i.location.href), Ge(r, "No window.location.(origin|href) available to create URL");
  let f = typeof u == "string" ? u : ui(u);
  return f = f.replace(/ $/, "%20"), !o && mh.test(f) && (f = r + f), new URL(f, r);
}
function hh(i, u, o = "/") {
  return Ag(i, u, o, !1);
}
function Ag(i, u, o, r, f) {
  let m = typeof u == "string" ? ba(u) : u, g = El(m.pathname || "/", o);
  if (g == null)
    return null;
  let y = zg(i), v = null, h = Gg(g);
  for (let b = 0; v == null && b < y.length; ++b)
    v = Yg(
      y[b],
      h,
      r
    );
  return v;
}
function zg(i) {
  let u = ph(i);
  return wg(u), u;
}
function ph(i, u = [], o = [], r = "", f = !1) {
  let m = (g, y, v = f, h) => {
    let b = {
      relativePath: h === void 0 ? g.path || "" : h,
      caseSensitive: g.caseSensitive === !0,
      childrenIndex: y,
      route: g
    };
    if (b.relativePath.startsWith("/")) {
      if (!b.relativePath.startsWith(r) && v)
        return;
      Ge(
        b.relativePath.startsWith(r),
        `Absolute route path "${b.relativePath}" nested under path "${r}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
      ), b.relativePath = b.relativePath.slice(r.length);
    }
    let x = It([r, b.relativePath]), E = o.concat(b);
    g.children && g.children.length > 0 && (Ge(
      // Our types know better, but runtime JS may not!
      // @ts-expect-error
      g.index !== !0,
      `Index routes must not have child routes. Please remove all child routes from route path "${x}".`
    ), ph(
      g.children,
      u,
      E,
      x,
      v
    )), !(g.path == null && !g.index) && u.push({
      path: x,
      score: Bg(x, g.index),
      routesMeta: E.map((Y, X) => {
        let [B, O] = yh(
          Y.relativePath,
          Y.caseSensitive,
          X === E.length - 1
        );
        return {
          ...Y,
          matcher: B,
          compiledParams: O
        };
      })
    });
  };
  return i.forEach((g, y) => {
    if (g.path === "" || !g.path?.includes("?"))
      m(g, y);
    else
      for (let v of vh(g.path))
        m(g, y, !0, v);
  }), u;
}
function vh(i) {
  let u = i.split("/");
  if (u.length === 0) return [];
  let [o, ...r] = u, f = o.endsWith("?"), m = o.replace(/\?$/, "");
  if (r.length === 0)
    return f ? [m, ""] : [m];
  let g = vh(r.join("/")), y = [];
  return y.push(
    ...g.map(
      (v) => v === "" ? m : [m, v].join("/")
    )
  ), f && y.push(...g), y.map(
    (v) => i.startsWith("/") && v === "" ? "/" : v
  );
}
function wg(i) {
  i.sort(
    (u, o) => u.score !== o.score ? o.score - u.score : qg(
      u.routesMeta.map((r) => r.childrenIndex),
      o.routesMeta.map((r) => r.childrenIndex)
    )
  );
}
var Og = /^:[\w-]+$/, Dg = 3, Hg = 2, Ug = 1, kg = 10, Lg = -2, Im = (i) => i === "*";
function Bg(i, u) {
  let o = i.split("/"), r = o.length;
  return o.some(Im) && (r += Lg), u && (r += Hg), o.filter((f) => !Im(f)).reduce(
    (f, m) => f + (Og.test(m) ? Dg : m === "" ? Ug : kg),
    r
  );
}
function qg(i, u) {
  return i.length === u.length && i.slice(0, -1).every((r, f) => r === u[f]) ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    i[i.length - 1] - u[u.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function Yg(i, u, o = !1) {
  let { routesMeta: r } = i, f = {}, m = "/", g = [];
  for (let y = 0; y < r.length; ++y) {
    let v = r[y], h = y === r.length - 1, b = m === "/" ? u : u.slice(m.length) || "/", x = {
      path: v.relativePath,
      caseSensitive: v.caseSensitive,
      end: h
    }, E = (
      // Use precomputed matcher if it exists
      v.matcher && v.compiledParams ? gh(
        x,
        b,
        v.matcher,
        v.compiledParams
      ) : Ls(x, b)
    ), Y = v.route;
    if (!E && h && o && !r[r.length - 1].route.index && (E = Ls(
      {
        path: v.relativePath,
        caseSensitive: v.caseSensitive,
        end: !1
      },
      b
    )), !E)
      return null;
    Object.assign(f, E.params), g.push({
      // TODO: Can this as be avoided?
      params: f,
      pathname: It([m, E.pathname]),
      pathnameBase: Zg(
        It([m, E.pathnameBase])
      ),
      route: Y
    }), E.pathnameBase !== "/" && (m = It([m, E.pathnameBase]));
  }
  return g;
}
function Ls(i, u) {
  typeof i == "string" && (i = { path: i, caseSensitive: !1, end: !0 });
  let [o, r] = yh(
    i.path,
    i.caseSensitive,
    i.end
  );
  return gh(i, u, o, r);
}
function gh(i, u, o, r) {
  let f = u.match(o);
  if (!f) return null;
  let m = f[0], g = m.replace(/(.)\/+$/, "$1"), y = f.slice(1);
  return {
    params: r.reduce(
      (h, { paramName: b, isOptional: x }, E) => {
        if (b === "*") {
          let X = y[E] || "";
          g = m.slice(0, m.length - X.length).replace(/(.)\/+$/, "$1");
        }
        const Y = y[E];
        return x && !Y ? h[b] = void 0 : h[b] = (Y || "").replace(/%2F/g, "/"), h;
      },
      {}
    ),
    pathname: m,
    pathnameBase: g,
    pattern: i
  };
}
function yh(i, u = !1, o = !0) {
  zt(
    i === "*" || !i.endsWith("*") || i.endsWith("/*"),
    `Route path "${i}" will be treated as if it were "${i.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${i.replace(/\*$/, "/*")}".`
  );
  let r = [], f = "^" + i.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(
    /\/:([\w-]+)(\?)?/g,
    (g, y, v, h, b) => {
      if (r.push({ paramName: y, isOptional: v != null }), v) {
        let x = b.charAt(h + g.length);
        return x && x !== "/" ? "/([^\\/]*)" : "(?:/([^\\/]*))?";
      }
      return "/([^\\/]+)";
    }
  ).replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
  return i.endsWith("*") ? (r.push({ paramName: "*" }), f += i === "*" || i === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$") : o ? f += "\\/*$" : i !== "" && i !== "/" && (f += "(?:(?=\\/|$))"), [new RegExp(f, u ? void 0 : "i"), r];
}
function Gg(i) {
  try {
    return i.split("/").map((u) => decodeURIComponent(u).replace(/\//g, "%2F")).join("/");
  } catch (u) {
    return zt(
      !1,
      `The URL path "${i}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${u}).`
    ), i;
  }
}
function El(i, u) {
  if (u === "/") return i;
  if (!i.toLowerCase().startsWith(u.toLowerCase()))
    return null;
  let o = u.endsWith("/") ? u.length - 1 : u.length, r = i.charAt(o);
  return r && r !== "/" ? null : i.slice(o) || "/";
}
function Xg(i, u = "/") {
  let {
    pathname: o,
    search: r = "",
    hash: f = ""
  } = typeof i == "string" ? ba(i) : i, m;
  return o ? (o = bh(o), o.startsWith("/") ? m = eh(o.substring(1), "/") : m = eh(o, u)) : m = u, {
    pathname: m,
    search: Vg(r),
    hash: $g(f)
  };
}
function eh(i, u) {
  let o = Bs(u).split("/");
  return i.split("/").forEach((f) => {
    f === ".." ? o.length > 1 && o.pop() : f !== "." && o.push(f);
  }), o.length > 1 ? o.join("/") : "/";
}
function br(i, u, o, r) {
  return `Cannot include a '${i}' character in a manually specified \`to.${u}\` field [${JSON.stringify(
    r
  )}].  Please separate it out to the \`to.${o}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function Qg(i) {
  return i.filter(
    (u, o) => o === 0 || u.route.path && u.route.path.length > 0
  );
}
function Mr(i) {
  let u = Qg(i);
  return u.map(
    (o, r) => r === u.length - 1 ? o.pathname : o.pathnameBase
  );
}
function Gs(i, u, o, r = !1) {
  let f;
  typeof i == "string" ? f = ba(i) : (f = { ...i }, Ge(
    !f.pathname || !f.pathname.includes("?"),
    br("?", "pathname", "search", f)
  ), Ge(
    !f.pathname || !f.pathname.includes("#"),
    br("#", "pathname", "hash", f)
  ), Ge(
    !f.search || !f.search.includes("#"),
    br("#", "search", "hash", f)
  ));
  let m = i === "" || f.pathname === "", g = m ? "/" : f.pathname, y;
  if (g == null)
    y = o;
  else {
    let x = u.length - 1;
    if (!r && g.startsWith("..")) {
      let E = g.split("/");
      for (; E[0] === ".."; )
        E.shift(), x -= 1;
      f.pathname = E.join("/");
    }
    y = x >= 0 ? u[x] : "/";
  }
  let v = Xg(f, y), h = g && g !== "/" && g.endsWith("/"), b = (m || g === ".") && o.endsWith("/");
  return !v.pathname.endsWith("/") && (h || b) && (v.pathname += "/"), v;
}
var bh = (i) => i.replace(/[\\/]{2,}/g, "/"), It = (i) => bh(i.join("/")), Bs = (i) => i.replace(/\/+$/, ""), Zg = (i) => Bs(i).replace(/^\/*/, "/"), Vg = (i) => !i || i === "?" ? "" : i.startsWith("?") ? i : "?" + i, $g = (i) => !i || i === "#" ? "" : i.startsWith("#") ? i : "#" + i, Kg = class {
  constructor(i, u, o, r = !1) {
    this.status = i, this.statusText = u || "", this.internal = r, o instanceof Error ? (this.data = o.toString(), this.error = o) : this.data = o;
  }
};
function Jg(i) {
  return i != null && typeof i.status == "number" && typeof i.statusText == "string" && typeof i.internal == "boolean" && "data" in i;
}
function Fg(i) {
  let u = i.map((o) => o.route.path).filter(Boolean);
  return It(u) || "/";
}
var xh = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
function _h(i, u) {
  let o = i;
  if (typeof o != "string" || !Cr.test(o))
    return {
      absoluteURL: void 0,
      isExternal: !1,
      to: o
    };
  let r = o, f = !1;
  if (xh)
    try {
      let m = new URL(window.location.href), g = mh.test(o) ? new URL(Eg(o, m.protocol)) : new URL(o), y = El(g.pathname, u);
      g.origin === m.origin && y != null ? o = y + g.search + g.hash : f = !0;
    } catch {
      zt(
        !1,
        `<Link to="${o}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`
      );
    }
  return {
    absoluteURL: r,
    isExternal: f,
    to: o
  };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
var Sh = [
  "POST",
  "PUT",
  "PATCH",
  "DELETE"
];
new Set(
  Sh
);
var Wg = [
  "GET",
  ...Sh
];
new Set(Wg);
var Pg = [
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
function Ig(i) {
  try {
    return Pg.includes(new URL(i).protocol);
  } catch {
    return !1;
  }
}
var sn = S.createContext(null);
sn.displayName = "DataRouter";
var Xs = S.createContext(null);
Xs.displayName = "DataRouterState";
var jh = S.createContext(!1);
function ey() {
  return S.useContext(jh);
}
var Nh = S.createContext({
  isTransitioning: !1
});
Nh.displayName = "ViewTransition";
var ty = S.createContext(
  /* @__PURE__ */ new Map()
);
ty.displayName = "Fetchers";
var ly = S.createContext(null);
ly.displayName = "Await";
var wt = S.createContext(
  null
);
wt.displayName = "Navigation";
var oi = S.createContext(
  null
);
oi.displayName = "Location";
var nl = S.createContext({
  outlet: null,
  matches: [],
  isDataRoute: !1
});
nl.displayName = "Route";
var Rr = S.createContext(null);
Rr.displayName = "RouteError";
var Eh = "REACT_ROUTER_ERROR", ay = "REDIRECT", ny = "ROUTE_ERROR_RESPONSE";
function iy(i) {
  if (i.startsWith(`${Eh}:${ay}:{`))
    try {
      let u = JSON.parse(i.slice(28));
      if (typeof u == "object" && u && typeof u.status == "number" && typeof u.statusText == "string" && typeof u.location == "string" && typeof u.reloadDocument == "boolean" && typeof u.replace == "boolean")
        return u;
    } catch {
    }
}
function sy(i) {
  if (i.startsWith(
    `${Eh}:${ny}:{`
  ))
    try {
      let u = JSON.parse(i.slice(40));
      if (typeof u == "object" && u && typeof u.status == "number" && typeof u.statusText == "string")
        return new Kg(
          u.status,
          u.statusText,
          u.data
        );
    } catch {
    }
}
function cy(i, { relative: u } = {}) {
  Ge(
    cn(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useHref() may be used only in the context of a <Router> component."
  );
  let { basename: o, navigator: r } = S.useContext(wt), { hash: f, pathname: m, search: g } = di(i, { relative: u }), y = m;
  return o !== "/" && (y = m === "/" ? o : It([o, m])), r.createHref({ pathname: y, search: g, hash: f });
}
function cn() {
  return S.useContext(oi) != null;
}
function xt() {
  return Ge(
    cn(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useLocation() may be used only in the context of a <Router> component."
  ), S.useContext(oi).location;
}
var Th = "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
function Ch(i) {
  S.useContext(wt).static || S.useLayoutEffect(i);
}
function Ot() {
  let { isDataRoute: i } = S.useContext(nl);
  return i ? xy() : uy();
}
function uy() {
  Ge(
    cn(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useNavigate() may be used only in the context of a <Router> component."
  );
  let i = S.useContext(sn), { basename: u, navigator: o } = S.useContext(wt), { matches: r } = S.useContext(nl), { pathname: f } = xt(), m = JSON.stringify(Mr(r)), g = S.useRef(!1);
  return Ch(() => {
    g.current = !0;
  }), S.useCallback(
    (v, h = {}) => {
      if (zt(g.current, Th), !g.current) return;
      if (typeof v == "number") {
        o.go(v);
        return;
      }
      let b = Gs(
        v,
        JSON.parse(m),
        f,
        h.relative === "path"
      );
      i == null && u !== "/" && (b.pathname = b.pathname === "/" ? u : It([u, b.pathname])), (h.replace ? o.replace : o.push)(
        b,
        h.state,
        h
      );
    },
    [
      u,
      o,
      m,
      f,
      i
    ]
  );
}
S.createContext(null);
function di(i, { relative: u } = {}) {
  let { matches: o } = S.useContext(nl), { pathname: r } = xt(), f = JSON.stringify(Mr(o));
  return S.useMemo(
    () => Gs(
      i,
      JSON.parse(f),
      r,
      u === "path"
    ),
    [i, f, r, u]
  );
}
function ry(i, u) {
  return Mh(i, u);
}
function Mh(i, u, o) {
  Ge(
    cn(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useRoutes() may be used only in the context of a <Router> component."
  );
  let { navigator: r } = S.useContext(wt), { matches: f } = S.useContext(nl), m = f[f.length - 1], g = m ? m.params : {}, y = m ? m.pathname : "/", v = m ? m.pathnameBase : "/", h = m && m.route;
  {
    let O = h && h.path || "";
    Ah(
      y,
      !h || O.endsWith("*") || O.endsWith("*?"),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${y}" (under <Route path="${O}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${O}"> to <Route path="${O === "/" ? "*" : `${O}/*`}">.`
    );
  }
  let b = xt(), x;
  if (u) {
    let O = typeof u == "string" ? ba(u) : u;
    Ge(
      v === "/" || O.pathname?.startsWith(v),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${v}" but pathname "${O.pathname}" was given in the \`location\` prop.`
    ), x = O;
  } else
    x = b;
  let E = x.pathname || "/", Y = E;
  if (v !== "/") {
    let O = v.replace(/^\//, "").split("/");
    Y = "/" + E.replace(/^\//, "").split("/").slice(O.length).join("/");
  }
  let X = o && o.state.matches.length ? (
    // If we're in a data router, use the matches we've already identified but ensure
    // we have the latest route instances from the manifest in case elements have changed
    o.state.matches.map(
      (O) => Object.assign(O, {
        route: o.manifest[O.route.id] || O.route
      })
    )
  ) : hh(i, { pathname: Y });
  zt(
    h || X != null,
    `No routes matched location "${x.pathname}${x.search}${x.hash}" `
  ), zt(
    X == null || X[X.length - 1].route.element !== void 0 || X[X.length - 1].route.Component !== void 0 || X[X.length - 1].route.lazy !== void 0,
    `Matched leaf route at location "${x.pathname}${x.search}${x.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`
  );
  let B = hy(
    X && X.map(
      (O) => Object.assign({}, O, {
        params: Object.assign({}, g, O.params),
        pathname: It([
          v,
          // Re-encode pathnames that were decoded inside matchRoutes.
          // Pre-encode `%`, `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          r.encodeLocation ? r.encodeLocation(
            O.pathname.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : O.pathname
        ]),
        pathnameBase: O.pathnameBase === "/" ? v : It([
          v,
          // Re-encode pathnames that were decoded inside matchRoutes
          // Pre-encode `%`, `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          r.encodeLocation ? r.encodeLocation(
            O.pathnameBase.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : O.pathnameBase
        ])
      })
    ),
    f,
    o
  );
  return u && B ? /* @__PURE__ */ S.createElement(
    oi.Provider,
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
    B
  ) : B;
}
function oy() {
  let i = by(), u = Jg(i) ? `${i.status} ${i.statusText}` : i instanceof Error ? i.message : JSON.stringify(i), o = i instanceof Error ? i.stack : null, r = "rgba(200,200,200, 0.5)", f = { padding: "0.5rem", backgroundColor: r }, m = { padding: "2px 4px", backgroundColor: r }, g = null;
  return console.error(
    "Error handled by React Router default ErrorBoundary:",
    i
  ), g = /* @__PURE__ */ S.createElement(S.Fragment, null, /* @__PURE__ */ S.createElement("p", null, "💿 Hey developer 👋"), /* @__PURE__ */ S.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", /* @__PURE__ */ S.createElement("code", { style: m }, "ErrorBoundary"), " or", " ", /* @__PURE__ */ S.createElement("code", { style: m }, "errorElement"), " prop on your route.")), /* @__PURE__ */ S.createElement(S.Fragment, null, /* @__PURE__ */ S.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ S.createElement("h3", { style: { fontStyle: "italic" } }, u), o ? /* @__PURE__ */ S.createElement("pre", { style: f }, o) : null, g);
}
var dy = /* @__PURE__ */ S.createElement(oy, null), Rh = class extends S.Component {
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
  static getDerivedStateFromProps(i, u) {
    return u.location !== i.location || u.revalidation !== "idle" && i.revalidation === "idle" ? {
      error: i.error,
      location: i.location,
      revalidation: i.revalidation
    } : {
      error: i.error !== void 0 ? i.error : u.error,
      location: u.location,
      revalidation: i.revalidation || u.revalidation
    };
  }
  componentDidCatch(i, u) {
    this.props.onError ? this.props.onError(i, u) : console.error(
      "React Router caught the following error during render",
      i
    );
  }
  render() {
    let i = this.state.error;
    if (this.context && typeof i == "object" && i && "digest" in i && typeof i.digest == "string") {
      const o = sy(i.digest);
      o && (i = o);
    }
    let u = i !== void 0 ? /* @__PURE__ */ S.createElement(nl.Provider, { value: this.props.routeContext }, /* @__PURE__ */ S.createElement(
      Rr.Provider,
      {
        value: i,
        children: this.props.component
      }
    )) : this.props.children;
    return this.context ? /* @__PURE__ */ S.createElement(fy, { error: i }, u) : u;
  }
};
Rh.contextType = jh;
var xr = /* @__PURE__ */ new WeakMap();
function fy({
  children: i,
  error: u
}) {
  let { basename: o } = S.useContext(wt);
  if (typeof u == "object" && u && "digest" in u && typeof u.digest == "string") {
    let r = iy(u.digest);
    if (r) {
      let f = xr.get(u);
      if (f) throw f;
      let m = _h(r.location, o), g = m.absoluteURL || m.to;
      if (Ig(g))
        throw new Error("Invalid redirect location");
      if (xh && !xr.get(u))
        if (m.isExternal || r.reloadDocument)
          window.location.href = g;
        else {
          const y = Promise.resolve().then(
            () => window.__reactRouterDataRouter.navigate(m.to, {
              replace: r.replace
            })
          );
          throw xr.set(u, y), y;
        }
      return /* @__PURE__ */ S.createElement("meta", { httpEquiv: "refresh", content: `0;url=${g}` });
    }
  }
  return i;
}
function my({ routeContext: i, match: u, children: o }) {
  let r = S.useContext(sn);
  return r && r.static && r.staticContext && (u.route.errorElement || u.route.ErrorBoundary) && (r.staticContext._deepestRenderedBoundaryId = u.route.id), /* @__PURE__ */ S.createElement(nl.Provider, { value: i }, o);
}
function hy(i, u = [], o) {
  let r = o?.state;
  if (i == null) {
    if (!r)
      return null;
    if (r.errors)
      i = r.matches;
    else if (u.length === 0 && !r.initialized && r.matches.length > 0)
      i = r.matches;
    else
      return null;
  }
  let f = i, m = r?.errors;
  if (m != null) {
    let b = f.findIndex(
      (x) => x.route.id && m?.[x.route.id] !== void 0
    );
    Ge(
      b >= 0,
      `Could not find a matching route for errors on route IDs: ${Object.keys(
        m
      ).join(",")}`
    ), f = f.slice(
      0,
      Math.min(f.length, b + 1)
    );
  }
  let g = !1, y = -1;
  if (o && r) {
    g = r.renderFallback;
    for (let b = 0; b < f.length; b++) {
      let x = f[b];
      if ((x.route.HydrateFallback || x.route.hydrateFallbackElement) && (y = b), x.route.id) {
        let { loaderData: E, errors: Y } = r, X = x.route.loader && !E.hasOwnProperty(x.route.id) && (!Y || Y[x.route.id] === void 0);
        if (x.route.lazy || X) {
          o.isStatic && (g = !0), y >= 0 ? f = f.slice(0, y + 1) : f = [f[0]];
          break;
        }
      }
    }
  }
  let v = o?.onError, h = r && v ? (b, x) => {
    v(b, {
      location: r.location,
      params: r.matches?.[0]?.params ?? {},
      pattern: Fg(r.matches),
      errorInfo: x
    });
  } : void 0;
  return f.reduceRight(
    (b, x, E) => {
      let Y, X = !1, B = null, O = null;
      r && (Y = m && x.route.id ? m[x.route.id] : void 0, B = x.route.errorElement || dy, g && (y < 0 && E === 0 ? (Ah(
        "route-fallback",
        !1,
        "No `HydrateFallback` element provided to render during initial hydration"
      ), X = !0, O = null) : y === E && (X = !0, O = x.route.hydrateFallbackElement || null)));
      let Q = u.concat(f.slice(0, E + 1)), K = () => {
        let q;
        return Y ? q = B : X ? q = O : x.route.Component ? q = /* @__PURE__ */ S.createElement(x.route.Component, null) : x.route.element ? q = x.route.element : q = b, /* @__PURE__ */ S.createElement(
          my,
          {
            match: x,
            routeContext: {
              outlet: b,
              matches: Q,
              isDataRoute: r != null
            },
            children: q
          }
        );
      };
      return r && (x.route.ErrorBoundary || x.route.errorElement || E === 0) ? /* @__PURE__ */ S.createElement(
        Rh,
        {
          location: r.location,
          revalidation: r.revalidation,
          component: B,
          error: Y,
          children: K(),
          routeContext: { outlet: null, matches: Q, isDataRoute: !0 },
          onError: h
        }
      ) : K();
    },
    null
  );
}
function Ar(i) {
  return `${i} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function py(i) {
  let u = S.useContext(sn);
  return Ge(u, Ar(i)), u;
}
function vy(i) {
  let u = S.useContext(Xs);
  return Ge(u, Ar(i)), u;
}
function gy(i) {
  let u = S.useContext(nl);
  return Ge(u, Ar(i)), u;
}
function zr(i) {
  let u = gy(i), o = u.matches[u.matches.length - 1];
  return Ge(
    o.route.id,
    `${i} can only be used on routes that contain a unique "id"`
  ), o.route.id;
}
function yy() {
  return zr(
    "useRouteId"
    /* UseRouteId */
  );
}
function by() {
  let i = S.useContext(Rr), u = vy(
    "useRouteError"
    /* UseRouteError */
  ), o = zr(
    "useRouteError"
    /* UseRouteError */
  );
  return i !== void 0 ? i : u.errors?.[o];
}
function xy() {
  let { router: i } = py(
    "useNavigate"
    /* UseNavigateStable */
  ), u = zr(
    "useNavigate"
    /* UseNavigateStable */
  ), o = S.useRef(!1);
  return Ch(() => {
    o.current = !0;
  }), S.useCallback(
    async (f, m = {}) => {
      zt(o.current, Th), o.current && (typeof f == "number" ? await i.navigate(f) : await i.navigate(f, { fromRouteId: u, ...m }));
    },
    [i, u]
  );
}
var th = {};
function Ah(i, u, o) {
  !u && !th[i] && (th[i] = !0, zt(!1, o));
}
S.memo(_y);
function _y({
  routes: i,
  manifest: u,
  future: o,
  state: r,
  isStatic: f,
  onError: m
}) {
  return Mh(i, void 0, {
    manifest: u,
    state: r,
    isStatic: f,
    onError: m
  });
}
function ga({
  to: i,
  replace: u,
  state: o,
  relative: r
}) {
  Ge(
    cn(),
    // TODO: This error is probably because they somehow have 2 versions of
    // the router loaded. We can help them understand how to avoid that.
    "<Navigate> may be used only in the context of a <Router> component."
  );
  let { static: f } = S.useContext(wt);
  zt(
    !f,
    "<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change."
  );
  let { matches: m } = S.useContext(nl), { pathname: g } = xt(), y = Ot(), v = Gs(
    i,
    Mr(m),
    g,
    r === "path"
  ), h = JSON.stringify(v);
  return S.useEffect(() => {
    y(JSON.parse(h), { replace: u, state: o, relative: r });
  }, [y, h, r, u, o]), null;
}
function He(i) {
  Ge(
    !1,
    "A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>."
  );
}
function Sy({
  basename: i = "/",
  children: u = null,
  location: o,
  navigationType: r = "POP",
  navigator: f,
  static: m = !1,
  useTransitions: g
}) {
  Ge(
    !cn(),
    "You cannot render a <Router> inside another <Router>. You should never have more than one in your app."
  );
  let y = i.replace(/^\/*/, "/"), v = S.useMemo(
    () => ({
      basename: y,
      navigator: f,
      static: m,
      useTransitions: g,
      future: {}
    }),
    [y, f, m, g]
  );
  typeof o == "string" && (o = ba(o));
  let {
    pathname: h = "/",
    search: b = "",
    hash: x = "",
    state: E = null,
    key: Y = "default",
    mask: X
  } = o, B = S.useMemo(() => {
    let O = El(h, y);
    return O == null ? null : {
      location: {
        pathname: O,
        search: b,
        hash: x,
        state: E,
        key: Y,
        mask: X
      },
      navigationType: r
    };
  }, [y, h, b, x, E, Y, r, X]);
  return zt(
    B != null,
    `<Router basename="${y}"> is not able to match the URL "${h}${b}${x}" because it does not start with the basename, so the <Router> won't render anything.`
  ), B == null ? null : /* @__PURE__ */ S.createElement(wt.Provider, { value: v }, /* @__PURE__ */ S.createElement(oi.Provider, { children: u, value: B }));
}
function jy({
  children: i,
  location: u
}) {
  return ry(jr(i), u);
}
function jr(i, u = []) {
  let o = [];
  return S.Children.forEach(i, (r, f) => {
    if (!S.isValidElement(r))
      return;
    let m = [...u, f];
    if (r.type === S.Fragment) {
      o.push.apply(
        o,
        jr(r.props.children, m)
      );
      return;
    }
    Ge(
      r.type === He,
      `[${typeof r.type == "string" ? r.type : r.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`
    ), Ge(
      !r.props.index || !r.props.children,
      "An index route cannot have child routes."
    );
    let g = {
      id: r.props.id || m.join("-"),
      caseSensitive: r.props.caseSensitive,
      element: r.props.element,
      Component: r.props.Component,
      index: r.props.index,
      path: r.props.path,
      middleware: r.props.middleware,
      loader: r.props.loader,
      action: r.props.action,
      hydrateFallbackElement: r.props.hydrateFallbackElement,
      HydrateFallback: r.props.HydrateFallback,
      errorElement: r.props.errorElement,
      ErrorBoundary: r.props.ErrorBoundary,
      hasErrorBoundary: r.props.hasErrorBoundary === !0 || r.props.ErrorBoundary != null || r.props.errorElement != null,
      shouldRevalidate: r.props.shouldRevalidate,
      handle: r.props.handle,
      lazy: r.props.lazy
    };
    r.props.children && (g.children = jr(
      r.props.children,
      m
    )), o.push(g);
  }), o;
}
var Ds = "get", Hs = "application/x-www-form-urlencoded";
function Qs(i) {
  return typeof HTMLElement < "u" && i instanceof HTMLElement;
}
function Ny(i) {
  return Qs(i) && i.tagName.toLowerCase() === "button";
}
function Ey(i) {
  return Qs(i) && i.tagName.toLowerCase() === "form";
}
function Ty(i) {
  return Qs(i) && i.tagName.toLowerCase() === "input";
}
function Cy(i) {
  return !!(i.metaKey || i.altKey || i.ctrlKey || i.shiftKey);
}
function My(i, u) {
  return i.button === 0 && // Ignore everything but left clicks
  (!u || u === "_self") && // Let browser handle "target=_blank" etc.
  !Cy(i);
}
function Nr(i = "") {
  return new URLSearchParams(
    typeof i == "string" || Array.isArray(i) || i instanceof URLSearchParams ? i : Object.keys(i).reduce((u, o) => {
      let r = i[o];
      return u.concat(
        Array.isArray(r) ? r.map((f) => [o, f]) : [[o, r]]
      );
    }, [])
  );
}
function Ry(i, u) {
  let o = Nr(i);
  return u && u.forEach((r, f) => {
    o.has(f) || u.getAll(f).forEach((m) => {
      o.append(f, m);
    });
  }), o;
}
var ws = null;
function Ay() {
  if (ws === null)
    try {
      new FormData(
        document.createElement("form"),
        // @ts-expect-error if FormData supports the submitter parameter, this will throw
        0
      ), ws = !1;
    } catch {
      ws = !0;
    }
  return ws;
}
var zy = /* @__PURE__ */ new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
]);
function _r(i) {
  return i != null && !zy.has(i) ? (zt(
    !1,
    `"${i}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${Hs}"`
  ), null) : i;
}
function wy(i, u) {
  let o, r, f, m, g;
  if (Ey(i)) {
    let y = i.getAttribute("action");
    r = y ? El(y, u) : null, o = i.getAttribute("method") || Ds, f = _r(i.getAttribute("enctype")) || Hs, m = new FormData(i);
  } else if (Ny(i) || Ty(i) && (i.type === "submit" || i.type === "image")) {
    let y = i.form;
    if (y == null)
      throw new Error(
        'Cannot submit a <button> or <input type="submit"> without a <form>'
      );
    let v = i.getAttribute("formaction") || y.getAttribute("action");
    if (r = v ? El(v, u) : null, o = i.getAttribute("formmethod") || y.getAttribute("method") || Ds, f = _r(i.getAttribute("formenctype")) || _r(y.getAttribute("enctype")) || Hs, m = new FormData(y, i), !Ay()) {
      let { name: h, type: b, value: x } = i;
      if (b === "image") {
        let E = h ? `${h}.` : "";
        m.append(`${E}x`, "0"), m.append(`${E}y`, "0");
      } else h && m.append(h, x);
    }
  } else {
    if (Qs(i))
      throw new Error(
        'Cannot submit element that is not <form>, <button>, or <input type="submit|image">'
      );
    o = Ds, r = null, f = Hs, g = i;
  }
  return m && f === "text/plain" && (g = m, m = void 0), { action: r, method: o.toLowerCase(), encType: f, formData: m, body: g };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function wr(i, u) {
  if (i === !1 || i === null || typeof i > "u")
    throw new Error(u);
}
function zh(i, u, o, r) {
  let f = typeof i == "string" ? new URL(
    i,
    // This can be called during the SSR flow via PrefetchPageLinksImpl so
    // don't assume window is available
    typeof window > "u" ? "server://singlefetch/" : window.location.origin
  ) : i;
  return o ? f.pathname.endsWith("/") ? f.pathname = `${f.pathname}_.${r}` : f.pathname = `${f.pathname}.${r}` : f.pathname === "/" ? f.pathname = `_root.${r}` : u && El(f.pathname, u) === "/" ? f.pathname = `${Bs(u)}/_root.${r}` : f.pathname = `${Bs(f.pathname)}.${r}`, f;
}
async function Oy(i, u) {
  if (i.id in u)
    return u[i.id];
  try {
    let o = await import(
      /* @vite-ignore */
      /* webpackIgnore: true */
      i.module
    );
    return u[i.id] = o, o;
  } catch (o) {
    return console.error(
      `Error loading route module \`${i.module}\`, reloading page...`
    ), console.error(o), window.__reactRouterContext && window.__reactRouterContext.isSpaMode, window.location.reload(), new Promise(() => {
    });
  }
}
function Dy(i) {
  return i == null ? !1 : i.href == null ? i.rel === "preload" && typeof i.imageSrcSet == "string" && typeof i.imageSizes == "string" : typeof i.rel == "string" && typeof i.href == "string";
}
async function Hy(i, u, o) {
  let r = await Promise.all(
    i.map(async (f) => {
      let m = u.routes[f.route.id];
      if (m) {
        let g = await Oy(m, o);
        return g.links ? g.links() : [];
      }
      return [];
    })
  );
  return By(
    r.flat(1).filter(Dy).filter((f) => f.rel === "stylesheet" || f.rel === "preload").map(
      (f) => f.rel === "stylesheet" ? { ...f, rel: "prefetch", as: "style" } : { ...f, rel: "prefetch" }
    )
  );
}
function lh(i, u, o, r, f, m) {
  let g = (v, h) => o[h] ? v.route.id !== o[h].route.id : !0, y = (v, h) => (
    // param change, /users/123 -> /users/456
    o[h].pathname !== v.pathname || // splat param changed, which is not present in match.path
    // e.g. /files/images/avatar.jpg -> files/finances.xls
    o[h].route.path?.endsWith("*") && o[h].params["*"] !== v.params["*"]
  );
  return m === "assets" ? u.filter(
    (v, h) => g(v, h) || y(v, h)
  ) : m === "data" ? u.filter((v, h) => {
    let b = r.routes[v.route.id];
    if (!b || !b.hasLoader)
      return !1;
    if (g(v, h) || y(v, h))
      return !0;
    if (v.route.shouldRevalidate) {
      let x = v.route.shouldRevalidate({
        currentUrl: new URL(
          f.pathname + f.search + f.hash,
          window.origin
        ),
        currentParams: o[0]?.params || {},
        nextUrl: new URL(i, window.origin),
        nextParams: v.params,
        defaultShouldRevalidate: !0
      });
      if (typeof x == "boolean")
        return x;
    }
    return !0;
  }) : [];
}
function Uy(i, u, { includeHydrateFallback: o } = {}) {
  return ky(
    i.map((r) => {
      let f = u.routes[r.route.id];
      if (!f) return [];
      let m = [f.module];
      return f.clientActionModule && (m = m.concat(f.clientActionModule)), f.clientLoaderModule && (m = m.concat(f.clientLoaderModule)), o && f.hydrateFallbackModule && (m = m.concat(f.hydrateFallbackModule)), f.imports && (m = m.concat(f.imports)), m;
    }).flat(1)
  );
}
function ky(i) {
  return [...new Set(i)];
}
function Ly(i) {
  let u = {}, o = Object.keys(i).sort();
  for (let r of o)
    u[r] = i[r];
  return u;
}
function By(i, u) {
  let o = /* @__PURE__ */ new Set();
  return new Set(u), i.reduce((r, f) => {
    let m = JSON.stringify(Ly(f));
    return o.has(m) || (o.add(m), r.push({ key: m, link: f })), r;
  }, []);
}
function Or() {
  let i = S.useContext(sn);
  return wr(
    i,
    "You must render this element inside a <DataRouterContext.Provider> element"
  ), i;
}
function qy() {
  let i = S.useContext(Xs);
  return wr(
    i,
    "You must render this element inside a <DataRouterStateContext.Provider> element"
  ), i;
}
var Dr = S.createContext(void 0);
Dr.displayName = "FrameworkContext";
function Zs() {
  let i = S.useContext(Dr);
  return wr(
    i,
    "You must render this element inside a <HydratedRouter> element"
  ), i;
}
function Yy(i, u) {
  let o = S.useContext(Dr), [r, f] = S.useState(!1), [m, g] = S.useState(!1), { onFocus: y, onBlur: v, onMouseEnter: h, onMouseLeave: b, onTouchStart: x } = u, E = S.useRef(null);
  S.useEffect(() => {
    if (i === "render" && g(!0), i === "viewport") {
      let B = (Q) => {
        Q.forEach((K) => {
          g(K.isIntersecting);
        });
      }, O = new IntersectionObserver(B, { threshold: 0.5 });
      return E.current && O.observe(E.current), () => {
        O.disconnect();
      };
    }
  }, [i]), S.useEffect(() => {
    if (r) {
      let B = setTimeout(() => {
        g(!0);
      }, 100);
      return () => {
        clearTimeout(B);
      };
    }
  }, [r]);
  let Y = () => {
    f(!0);
  }, X = () => {
    f(!1), g(!1);
  };
  return o ? i !== "intent" ? [m, E, {}] : [
    m,
    E,
    {
      onFocus: ni(y, Y),
      onBlur: ni(v, X),
      onMouseEnter: ni(h, Y),
      onMouseLeave: ni(b, X),
      onTouchStart: ni(x, Y)
    }
  ] : [!1, E, {}];
}
function ni(i, u) {
  return (o) => {
    i && i(o), o.defaultPrevented || u(o);
  };
}
function Gy({ page: i, ...u }) {
  let o = ey(), { nonce: r } = Zs(), { router: f } = Or(), m = S.useMemo(
    () => hh(f.routes, i, f.basename),
    [f.routes, i, f.basename]
  );
  return m ? (u.nonce == null && r && (u = { ...u, nonce: r }), o ? /* @__PURE__ */ S.createElement(Qy, { page: i, matches: m, ...u }) : /* @__PURE__ */ S.createElement(Zy, { page: i, matches: m, ...u })) : null;
}
function Xy(i) {
  let { manifest: u, routeModules: o } = Zs(), [r, f] = S.useState([]);
  return S.useEffect(() => {
    let m = !1;
    return Hy(i, u, o).then(
      (g) => {
        m || f(g);
      }
    ), () => {
      m = !0;
    };
  }, [i, u, o]), r;
}
function Qy({
  page: i,
  matches: u,
  ...o
}) {
  let r = xt(), { future: f } = Zs(), { basename: m } = Or(), g = S.useMemo(() => {
    if (i === r.pathname + r.search + r.hash)
      return [];
    let y = zh(
      i,
      m,
      f.v8_trailingSlashAwareDataRequests,
      "rsc"
    ), v = !1, h = [];
    for (let b of u)
      typeof b.route.shouldRevalidate == "function" ? v = !0 : h.push(b.route.id);
    return v && h.length > 0 && y.searchParams.set("_routes", h.join(",")), [y.pathname + y.search];
  }, [
    m,
    f.v8_trailingSlashAwareDataRequests,
    i,
    r,
    u
  ]);
  return /* @__PURE__ */ S.createElement(S.Fragment, null, g.map((y) => /* @__PURE__ */ S.createElement("link", { key: y, rel: "prefetch", as: "fetch", href: y, ...o })));
}
function Zy({
  page: i,
  matches: u,
  ...o
}) {
  let r = xt(), { future: f, manifest: m, routeModules: g } = Zs(), { basename: y } = Or(), { loaderData: v, matches: h } = qy(), b = S.useMemo(
    () => lh(
      i,
      u,
      h,
      m,
      r,
      "data"
    ),
    [i, u, h, m, r]
  ), x = S.useMemo(
    () => lh(
      i,
      u,
      h,
      m,
      r,
      "assets"
    ),
    [i, u, h, m, r]
  ), E = S.useMemo(() => {
    if (i === r.pathname + r.search + r.hash)
      return [];
    let B = /* @__PURE__ */ new Set(), O = !1;
    if (u.forEach((K) => {
      let q = m.routes[K.route.id];
      !q || !q.hasLoader || (!b.some((te) => te.route.id === K.route.id) && K.route.id in v && g[K.route.id]?.shouldRevalidate || q.hasClientLoader ? O = !0 : B.add(K.route.id));
    }), B.size === 0)
      return [];
    let Q = zh(
      i,
      y,
      f.v8_trailingSlashAwareDataRequests,
      "data"
    );
    return O && B.size > 0 && Q.searchParams.set(
      "_routes",
      u.filter((K) => B.has(K.route.id)).map((K) => K.route.id).join(",")
    ), [Q.pathname + Q.search];
  }, [
    y,
    f.v8_trailingSlashAwareDataRequests,
    v,
    r,
    m,
    b,
    u,
    i,
    g
  ]), Y = S.useMemo(
    () => Uy(x, m),
    [x, m]
  ), X = Xy(x);
  return /* @__PURE__ */ S.createElement(S.Fragment, null, E.map((B) => /* @__PURE__ */ S.createElement("link", { key: B, rel: "prefetch", as: "fetch", href: B, ...o })), Y.map((B) => /* @__PURE__ */ S.createElement("link", { key: B, rel: "modulepreload", href: B, ...o })), X.map(({ key: B, link: O }) => (
    // these don't spread `linkProps` because they are full link descriptors
    // already with their own props
    /* @__PURE__ */ S.createElement(
      "link",
      {
        key: B,
        nonce: o.nonce,
        ...O,
        crossOrigin: O.crossOrigin ?? o.crossOrigin
      }
    )
  )));
}
function Vy(...i) {
  return (u) => {
    i.forEach((o) => {
      typeof o == "function" ? o(u) : o != null && (o.current = u);
    });
  };
}
var $y = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
try {
  $y && (window.__reactRouterVersion = // @ts-expect-error
  "7.18.2");
} catch {
}
function Ky({
  basename: i,
  children: u,
  useTransitions: o,
  window: r
}) {
  let f = S.useRef();
  f.current == null && (f.current = Tg({ window: r, v5Compat: !0 }));
  let m = f.current, [g, y] = S.useState({
    action: m.action,
    location: m.location
  }), v = S.useCallback(
    (h) => {
      o === !1 ? y(h) : S.startTransition(() => y(h));
    },
    [o]
  );
  return S.useLayoutEffect(() => m.listen(v), [m, v]), /* @__PURE__ */ S.createElement(
    Sy,
    {
      basename: i,
      children: u,
      location: g.location,
      navigationType: g.action,
      navigator: m,
      useTransitions: o
    }
  );
}
var ri = S.forwardRef(
  function({
    onClick: u,
    discover: o = "render",
    prefetch: r = "none",
    relative: f,
    reloadDocument: m,
    replace: g,
    mask: y,
    state: v,
    target: h,
    to: b,
    preventScrollReset: x,
    viewTransition: E,
    defaultShouldRevalidate: Y,
    ...X
  }, B) {
    let { basename: O, navigator: Q, useTransitions: K } = S.useContext(wt), q = typeof b == "string" && Cr.test(b), te = _h(b, O);
    b = te.to;
    let ie = cy(b, { relative: f }), ue = xt(), V = null;
    if (y) {
      let P = Gs(
        y,
        [],
        ue.mask ? ue.mask.pathname : "/",
        !0
      );
      O !== "/" && (P.pathname = P.pathname === "/" ? O : It([O, P.pathname])), V = Q.createHref(P);
    }
    let [se, _e, Ne] = Yy(
      r,
      X
    ), Te = Wy(b, {
      replace: g,
      mask: y,
      state: v,
      target: h,
      preventScrollReset: x,
      relative: f,
      viewTransition: E,
      defaultShouldRevalidate: Y,
      useTransitions: K
    });
    function he(P) {
      u && u(P), P.defaultPrevented || Te(P);
    }
    let w = !(te.isExternal || m), F = (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      /* @__PURE__ */ S.createElement(
        "a",
        {
          ...X,
          ...Ne,
          href: (w ? V : void 0) || te.absoluteURL || ie,
          onClick: w ? he : u,
          ref: Vy(B, _e),
          target: h,
          "data-discover": !q && o === "render" ? "true" : void 0
        }
      )
    );
    return se && !q ? /* @__PURE__ */ S.createElement(S.Fragment, null, F, /* @__PURE__ */ S.createElement(Gy, { page: ie })) : F;
  }
);
ri.displayName = "Link";
var Us = S.forwardRef(
  function({
    "aria-current": u = "page",
    caseSensitive: o = !1,
    className: r = "",
    end: f = !1,
    style: m,
    to: g,
    viewTransition: y,
    children: v,
    ...h
  }, b) {
    let x = di(g, { relative: h.relative }), E = xt(), Y = S.useContext(Xs), { navigator: X, basename: B } = S.useContext(wt), O = Y != null && // Conditional usage is OK here because the usage of a data router is static
    // eslint-disable-next-line react-hooks/rules-of-hooks
    lb(x) && y === !0, Q = X.encodeLocation ? X.encodeLocation(x).pathname : x.pathname, K = E.pathname, q = Y && Y.navigation && Y.navigation.location ? Y.navigation.location.pathname : null;
    o || (K = K.toLowerCase(), q = q ? q.toLowerCase() : null, Q = Q.toLowerCase()), q && B && (q = El(q, B) || q);
    const te = Q !== "/" && Q.endsWith("/") ? Q.length - 1 : Q.length;
    let ie = K === Q || !f && K.startsWith(Q) && K.charAt(te) === "/", ue = q != null && (q === Q || !f && q.startsWith(Q) && q.charAt(Q.length) === "/"), V = {
      isActive: ie,
      isPending: ue,
      isTransitioning: O
    }, se = ie ? u : void 0, _e;
    typeof r == "function" ? _e = r(V) : _e = [
      r,
      ie ? "active" : null,
      ue ? "pending" : null,
      O ? "transitioning" : null
    ].filter(Boolean).join(" ");
    let Ne = typeof m == "function" ? m(V) : m;
    return /* @__PURE__ */ S.createElement(
      ri,
      {
        ...h,
        "aria-current": se,
        className: _e,
        ref: b,
        style: Ne,
        to: g,
        viewTransition: y
      },
      typeof v == "function" ? v(V) : v
    );
  }
);
Us.displayName = "NavLink";
var Jy = S.forwardRef(
  ({
    discover: i = "render",
    fetcherKey: u,
    navigate: o,
    reloadDocument: r,
    replace: f,
    state: m,
    method: g = Ds,
    action: y,
    onSubmit: v,
    relative: h,
    preventScrollReset: b,
    viewTransition: x,
    defaultShouldRevalidate: E,
    ...Y
  }, X) => {
    let { useTransitions: B } = S.useContext(wt), O = eb(), Q = tb(y, { relative: h }), K = g.toLowerCase() === "get" ? "get" : "post", q = typeof y == "string" && Cr.test(y), te = (ie) => {
      if (v && v(ie), ie.defaultPrevented) return;
      ie.preventDefault();
      let ue = ie.nativeEvent.submitter, V = ue?.getAttribute("formmethod") || g, se = () => O(ue || ie.currentTarget, {
        fetcherKey: u,
        method: V,
        navigate: o,
        replace: f,
        state: m,
        relative: h,
        preventScrollReset: b,
        viewTransition: x,
        defaultShouldRevalidate: E
      });
      B && o !== !1 ? S.startTransition(() => se()) : se();
    };
    return /* @__PURE__ */ S.createElement(
      "form",
      {
        ref: X,
        method: K,
        action: Q,
        onSubmit: r ? v : te,
        ...Y,
        "data-discover": !q && i === "render" ? "true" : void 0
      }
    );
  }
);
Jy.displayName = "Form";
function Fy(i) {
  return `${i} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function wh(i) {
  let u = S.useContext(sn);
  return Ge(u, Fy(i)), u;
}
function Wy(i, {
  target: u,
  replace: o,
  mask: r,
  state: f,
  preventScrollReset: m,
  relative: g,
  viewTransition: y,
  defaultShouldRevalidate: v,
  useTransitions: h
} = {}) {
  let b = Ot(), x = xt(), E = di(i, { relative: g });
  return S.useCallback(
    (Y) => {
      if (My(Y, u)) {
        Y.preventDefault();
        let X = o !== void 0 ? o : ui(x) === ui(E), B = () => b(i, {
          replace: X,
          mask: r,
          state: f,
          preventScrollReset: m,
          relative: g,
          viewTransition: y,
          defaultShouldRevalidate: v
        });
        h ? S.startTransition(() => B()) : B();
      }
    },
    [
      x,
      b,
      E,
      o,
      r,
      f,
      u,
      i,
      m,
      g,
      y,
      v,
      h
    ]
  );
}
function Vs(i) {
  zt(
    typeof URLSearchParams < "u",
    "You cannot use the `useSearchParams` hook in a browser that does not support the URLSearchParams API. If you need to support Internet Explorer 11, we recommend you load a polyfill such as https://github.com/ungap/url-search-params."
  );
  let u = S.useRef(Nr(i)), o = S.useRef(!1), r = xt(), f = S.useMemo(
    () => (
      // Only merge in the defaults if we haven't yet called setSearchParams.
      // Once we call that we want those to take precedence, otherwise you can't
      // remove a param with setSearchParams({}) if it has an initial value
      Ry(
        r.search,
        o.current ? null : u.current
      )
    ),
    [r.search]
  ), m = Ot(), g = S.useCallback(
    (y, v) => {
      const h = Nr(
        typeof y == "function" ? y(new URLSearchParams(f)) : y
      );
      o.current = !0, m("?" + h, v);
    },
    [m, f]
  );
  return [f, g];
}
var Py = 0, Iy = () => `__${String(++Py)}__`;
function eb() {
  let { router: i } = wh(
    "useSubmit"
    /* UseSubmit */
  ), { basename: u } = S.useContext(wt), o = yy(), r = i.fetch, f = i.navigate;
  return S.useCallback(
    async (m, g = {}) => {
      let { action: y, method: v, encType: h, formData: b, body: x } = wy(
        m,
        u
      );
      if (g.navigate === !1) {
        let E = g.fetcherKey || Iy();
        await r(E, o, g.action || y, {
          defaultShouldRevalidate: g.defaultShouldRevalidate,
          preventScrollReset: g.preventScrollReset,
          formData: b,
          body: x,
          formMethod: g.method || v,
          formEncType: g.encType || h,
          flushSync: g.flushSync
        });
      } else
        await f(g.action || y, {
          defaultShouldRevalidate: g.defaultShouldRevalidate,
          preventScrollReset: g.preventScrollReset,
          formData: b,
          body: x,
          formMethod: g.method || v,
          formEncType: g.encType || h,
          replace: g.replace,
          state: g.state,
          fromRouteId: o,
          flushSync: g.flushSync,
          viewTransition: g.viewTransition
        });
    },
    [r, f, u, o]
  );
}
function tb(i, { relative: u } = {}) {
  let { basename: o } = S.useContext(wt), r = S.useContext(nl);
  Ge(r, "useFormAction must be used inside a RouteContext");
  let [f] = r.matches.slice(-1), m = { ...di(i || ".", { relative: u }) }, g = xt();
  if (i == null) {
    m.search = g.search;
    let y = new URLSearchParams(m.search), v = y.getAll("index");
    if (v.some((b) => b === "")) {
      y.delete("index"), v.filter((x) => x).forEach((x) => y.append("index", x));
      let b = y.toString();
      m.search = b ? `?${b}` : "";
    }
  }
  return (!i || i === ".") && f.route.index && (m.search = m.search ? m.search.replace(/^\?/, "?index&") : "?index"), o !== "/" && (m.pathname = m.pathname === "/" ? o : It([o, m.pathname])), ui(m);
}
function lb(i, { relative: u } = {}) {
  let o = S.useContext(Nh);
  Ge(
    o != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?"
  );
  let { basename: r } = wh(
    "useViewTransitionState"
    /* useViewTransitionState */
  ), f = di(i, { relative: u });
  if (!o.isTransitioning)
    return !1;
  let m = El(o.currentLocation.pathname, r) || o.currentLocation.pathname, g = El(o.nextLocation.pathname, r) || o.nextLocation.pathname;
  return Ls(f.pathname, g) != null || Ls(f.pathname, m) != null;
}
const ab = "/dsc_hub/assets", nb = {
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
function ah(i) {
  return `${ab}/${nb[i]}`;
}
const Oh = S.createContext(null);
function ib(i) {
  if (!i) return !1;
  const u = i.toLowerCase();
  return u.includes("dsc_") || u.includes("dsc-") || u.startsWith("sensor.dsc") || u.startsWith("switch.dsc") || u.startsWith("binary_sensor.dsc") || u.startsWith("number.dsc") || u.startsWith("light.dsc") || u.startsWith("fan.dsc") || u.startsWith("select.dsc") || u.startsWith("input_");
}
function sb({
  hass: i,
  children: u
}) {
  const [o, r] = S.useState(0);
  S.useEffect(() => {
    if (!i) return;
    r((h) => h + 1);
    const m = i.connection;
    if (!m?.subscribeEvents) return;
    let g, y = !1;
    const v = (h) => {
      const b = h.data?.entity_id;
      ib(b) && r((x) => x + 1);
    };
    return Promise.resolve(m.subscribeEvents(v, "state_changed")).then((h) => {
      if (y) {
        h();
        return;
      }
      g = h;
    }).catch(() => {
    }), () => {
      y = !0, g?.();
    };
  }, [i]);
  const f = S.useMemo(() => {
    const m = (x) => i?.states?.[x], g = (x) => {
      const E = m(x)?.state;
      return !!E && E !== "unavailable" && E !== "unknown";
    }, y = (x, E = "—") => g(x) ? m(x)?.state ?? E : E;
    return { hass: i, entity: m, state: y, num: (x, E = NaN) => {
      const Y = Number(y(x, ""));
      return Number.isFinite(Y) ? Y : E;
    }, available: g, callService: (x, E, Y) => i?.callService ? i.callService(x, E, Y) : Promise.resolve(null), callWS: (x) => i?.callWS ? i.callWS(x) : Promise.resolve(null), tick: o };
  }, [i, o]);
  return S.createElement(Oh.Provider, { value: f }, u);
}
function Qe() {
  const i = S.useContext(Oh);
  if (!i) throw new Error("useHass outside HassProvider");
  return i;
}
function Nl({
  name: i,
  size: u = 16,
  className: o,
  color: r = "currentColor"
}) {
  return /* @__PURE__ */ c.jsx(
    "span",
    {
      className: o,
      role: "img",
      "aria-hidden": !0,
      style: {
        display: "inline-block",
        width: u,
        height: u,
        backgroundColor: r,
        WebkitMaskImage: `url(${ah(i)})`,
        maskImage: `url(${ah(i)})`,
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
function ce({
  title: i,
  children: u,
  className: o = "",
  style: r,
  icon: f
}) {
  return /* @__PURE__ */ c.jsxs("section", { className: `dsc-card ${o}`.trim(), style: r, children: [
    i ? /* @__PURE__ */ c.jsxs("h3", { className: "dsc-card-title", children: [
      f ? /* @__PURE__ */ c.jsx(Nl, { name: f, size: 14, color: "var(--dsc-teal)" }) : null,
      i
    ] }) : null,
    u
  ] });
}
function Be({
  children: i,
  primary: u,
  teal: o,
  onClick: r,
  type: f = "button",
  disabled: m
}) {
  const g = ["dsc-btn"];
  return u && g.push("primary"), o && g.push("teal"), /* @__PURE__ */ c.jsx("button", { type: f, className: g.join(" "), onClick: r, disabled: m, children: i });
}
function Xe({
  label: i,
  value: u,
  unit: o,
  sub: r,
  tone: f = "normal",
  stale: m,
  onClick: g
}) {
  const y = f === "ok" ? "dsc-status-ok" : f === "bad" ? "dsc-status-bad" : f === "muted" || m ? "dsc-status-muted" : "", v = /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
    /* @__PURE__ */ c.jsxs("div", { className: `dsc-kpi-value ${y}`.trim(), children: [
      u,
      o ? /* @__PURE__ */ c.jsx("span", { className: "dsc-kpi-unit", children: o }) : null,
      m ? /* @__PURE__ */ c.jsx("span", { className: "dsc-held-tag", children: "HELD" }) : null
    ] }),
    r ? /* @__PURE__ */ c.jsx("div", { className: "dsc-kpi-sub", children: r }) : null
  ] });
  return g ? /* @__PURE__ */ c.jsx("button", { type: "button", className: "dsc-kpi-hit", onClick: g, title: `History · ${i}`, children: /* @__PURE__ */ c.jsx(ce, { title: i, className: m ? "is-stale" : void 0, children: v }) }) : /* @__PURE__ */ c.jsx(ce, { title: i, className: m ? "is-stale" : void 0, children: v });
}
function $t({
  title: i,
  subtitle: u,
  icon: o,
  primaryAction: r,
  actions: f
}) {
  const m = r || f ? /* @__PURE__ */ c.jsxs("div", { className: "dsc-page-header-actions", children: [
    r,
    f
  ] }) : null;
  return /* @__PURE__ */ c.jsxs("header", { className: "dsc-page-header", children: [
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-page-header-main", children: [
      o ? /* @__PURE__ */ c.jsx(Nl, { name: o, size: 22, color: "var(--dsc-teal)" }) : null,
      /* @__PURE__ */ c.jsxs("div", { children: [
        /* @__PURE__ */ c.jsx("h1", { className: "dsc-page-title", children: i }),
        u ? /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: u }) : null
      ] })
    ] }),
    m
  ] });
}
function I({
  label: i,
  tone: u = "muted",
  pulse: o,
  icon: r
}) {
  return /* @__PURE__ */ c.jsxs("span", { className: `dsc-chip dsc-chip--${u}${o ? " dsc-chip--pulse" : ""}`, children: [
    r ? /* @__PURE__ */ c.jsx(Nl, { name: r, size: 11 }) : null,
    i
  ] });
}
function Ue({
  entityId: i,
  label: u,
  warnWhenMissing: o,
  icon: r,
  showBrightness: f
}) {
  const { state: m, available: g, callService: y, entity: v } = Qe(), h = m(i, "off") === "on", b = g(i), x = i.split(".")[0], E = () => {
    if (b) {
      if (x === "switch" || x === "input_boolean") {
        y("homeassistant", "toggle", { entity_id: i });
        return;
      }
      x === "light" && y("light", h ? "turn_off" : "turn_on", { entity_id: i });
    }
  }, Y = f !== !1 && x === "light" && h ? Math.round(Number(v(i)?.attributes?.brightness ?? 0) / 255 * 100) : null;
  return /* @__PURE__ */ c.jsxs(
    "button",
    {
      type: "button",
      className: `dsc-demand${h ? " is-on" : ""}${b ? "" : " is-missing"}`,
      onClick: E,
      disabled: !b && !o,
      title: b ? i : o || `${i} unavailable`,
      children: [
        r ? /* @__PURE__ */ c.jsx(Nl, { name: r, size: 14, className: "dsc-demand-icon" }) : null,
        /* @__PURE__ */ c.jsx("span", { className: "dsc-demand-label", children: u }),
        /* @__PURE__ */ c.jsx("span", { className: "dsc-demand-state", children: b ? Y != null ? `${Y}%` : h ? "ON" : "OFF" : o || "—" })
      ]
    }
  );
}
function qs({
  entityId: i,
  label: u,
  icon: o
}) {
  const { state: r, available: f, callService: m, entity: g } = Qe(), y = f(i), v = r(i, ""), h = g(i)?.attributes?.options || [], b = i.split(".")[0], x = (E) => {
    !y || !E || (b === "select" ? m("select", "select_option", { entity_id: i, option: E }) : b === "input_select" && m("input_select", "select_option", { entity_id: i, option: E }));
  };
  return /* @__PURE__ */ c.jsxs("label", { className: `dsc-entity-select${y ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ c.jsxs("span", { className: "dsc-entity-select-label", children: [
      o ? /* @__PURE__ */ c.jsx(Nl, { name: o, size: 13, color: "var(--dsc-teal)" }) : null,
      u
    ] }),
    /* @__PURE__ */ c.jsxs("select", { value: v, disabled: !y, onChange: (E) => x(E.target.value), children: [
      !h.includes(v) && v ? /* @__PURE__ */ c.jsx("option", { value: v, children: v }) : null,
      h.map((E) => /* @__PURE__ */ c.jsx("option", { value: E, children: E }, E))
    ] })
  ] });
}
function Wl({
  entityId: i,
  label: u,
  disabled: o
}) {
  const { available: r, callService: f, entity: m, state: g } = Qe(), y = r(i), v = Number(m(i)?.attributes?.percentage ?? 0), h = g(i) === "on", b = o || !y, x = (E) => {
    b || f("fan", "set_percentage", { entity_id: i, percentage: E });
  };
  return /* @__PURE__ */ c.jsxs("label", { className: `dsc-fan-slider${b ? " is-disabled" : ""}`, children: [
    /* @__PURE__ */ c.jsxs("span", { className: "dsc-fan-slider-label", children: [
      u,
      /* @__PURE__ */ c.jsx("strong", { children: y ? `${Math.round(v)}%` : "—" }),
      !h && y ? /* @__PURE__ */ c.jsx("em", { className: "dsc-muted", children: "off" }) : null
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
        onChange: (E) => x(Number(E.target.value))
      }
    )
  ] });
}
function cb(i) {
  const u = [], o = (g, y = "unknown") => i.state(g, y), r = (g) => o(g) === "on", f = i.entity?.("sensor.dsc_keepup_gaps")?.attributes ?? {}, m = String(f.full_auto_honesty ?? "").trim();
  if (i.available && !i.available("sensor.dsc_hub_uptime")) {
    const g = i.entity?.("sensor.dsc_hub_uptime")?.last_changed;
    let y = "";
    if (g) {
      const v = Date.now() - Date.parse(g);
      if (Number.isFinite(v) && v >= 0) {
        const h = Math.floor(v / 6e4);
        y = h < 60 ? ` · offline ${Math.max(1, h)}m` : ` · offline ${(h / 60).toFixed(1)}h`;
      }
    }
    u.push({
      id: "hub-dark",
      label: "Hub offline",
      detail: `Showing last good vitals${y}. Reconnect snaps to live.`,
      tone: "bad",
      href: "/fleet",
      cta: "Open Fleet",
      priority: 10
    });
  }
  return r("binary_sensor.dsc_reduced_kit") && u.push({
    id: "reduced-kit",
    label: "Reduced kit",
    detail: "Full Auto keep-up is honesty-limited while kit is reduced.",
    tone: "warn",
    href: "/fleet",
    cta: "Review kit",
    priority: 20
  }), m && r("switch.dsc_hub_tent_full_auto_mode") && u.push({
    id: "keepup",
    label: "Keep-up gaps",
    detail: m,
    tone: "warn",
    href: "/live/climate",
    cta: "Fix Climate",
    priority: 30
  }), o("input_boolean.dsc_pot3_in_service") === "off" && u.push({
    id: "pot3-oos",
    label: "POT3 out of service",
    detail: "Probe fault path — mat vote excluded while OOS.",
    tone: "warn",
    href: "/live/root?pot=3",
    cta: "Inspect Root",
    priority: 40
  }), r("binary_sensor.dsc_clone_dark_period_violation") && u.push({
    id: "dark-viol",
    label: "Clone dark violation",
    detail: "Photoperiod honesty — check Light Cycle.",
    tone: "bad",
    href: "/live/light",
    cta: "Open Light",
    priority: 25
  }), r("binary_sensor.dsc_hub_climate_sensor_fault") && u.push({
    id: "climate-fault",
    label: "Climate sensor fault",
    detail: "Trust the honesty rail — do not invent Got.",
    tone: "bad",
    href: "/live/climate",
    cta: "Open Climate",
    priority: 15
  }), r("binary_sensor.dsc_hub_emergency_failsafe") && u.push({
    id: "failsafe",
    label: "Emergency failsafe",
    detail: "Hub failsafe active.",
    tone: "bad",
    href: "/live/mission",
    cta: "Mission",
    priority: 5
  }), u.sort((g, y) => g.priority - y.priority);
}
function ub(i) {
  return i[0] ?? null;
}
function Dh() {
  const i = Qe();
  return S.useMemo(
    () => cb({
      state: i.state,
      available: i.available,
      entity: i.entity
    }),
    [i.state, i.available, i.entity, i.tick]
  );
}
function rb({ gaps: i }) {
  const u = Dh(), o = i ?? u;
  return o.length ? /* @__PURE__ */ c.jsx("div", { className: "dsc-honesty-rail", "aria-label": "Honesty gaps", children: o.slice(0, 6).map((r) => /* @__PURE__ */ c.jsx(I, { icon: "alert", label: r.label, tone: r.tone === "bad" ? "bad" : "warn" }, r.id)) }) : /* @__PURE__ */ c.jsx("div", { className: "dsc-honesty-rail", "aria-label": "Honesty", children: /* @__PURE__ */ c.jsx(I, { icon: "ok", label: "Kit honest", tone: "ok" }) });
}
function ob({ gaps: i }) {
  const u = Dh(), r = ub(i ?? u), f = Ot();
  return r ? /* @__PURE__ */ c.jsxs(ce, { className: "dsc-glass dsc-next-rec", title: "Do this next", icon: "alert", children: [
    /* @__PURE__ */ c.jsxs("p", { style: { margin: "0 0 8px" }, children: [
      /* @__PURE__ */ c.jsx("strong", { children: r.label }),
      " — ",
      r.detail
    ] }),
    /* @__PURE__ */ c.jsx(Be, { primary: !0, onClick: () => f(r.href), children: r.cta })
  ] }) : /* @__PURE__ */ c.jsxs(ce, { className: "dsc-glass dsc-next-rec", title: "Next", icon: "ok", children: [
    /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: "No critical gaps — fly Live or open Twin." }),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-row-actions", children: [
      /* @__PURE__ */ c.jsx(Be, { primary: !0, onClick: () => f("/live/twin"), children: "Open Twin" }),
      /* @__PURE__ */ c.jsx(Be, { teal: !0, onClick: () => f("/live/climate"), children: "Climate Want" })
    ] })
  ] });
}
const db = [
  "/local/DSC-HUB.js",
  "/local/dsc-system-map-card.js",
  "/hacsfiles/DSC-HUB/DSC-HUB.js"
], ci = /* @__PURE__ */ new Map();
let nh = !1;
function fb(i) {
  if (document.querySelector(`script[data-dsc-autoload="${i}"]`))
    return ci.get(i) ?? Promise.resolve();
  if (ci.has(i)) return ci.get(i);
  const o = new Promise((r, f) => {
    const m = document.createElement("script");
    m.src = i, m.async = !0, m.dataset.dscAutoload = i, m.onload = () => r(), m.onerror = () => f(new Error(`Failed to load ${i}`)), document.head.appendChild(m);
  });
  return ci.set(i, o), o;
}
async function Hh(i, u = 12e3) {
  if (customElements.get(i)) return !0;
  if (nh)
    await Promise.allSettled([...ci.values()]);
  else {
    nh = !0;
    for (const o of db)
      try {
        if (await fb(o), customElements.get(i)) return !0;
      } catch {
      }
  }
  try {
    return await Promise.race([
      customElements.whenDefined(i),
      new Promise(
        (o, r) => window.setTimeout(() => r(new Error("timeout")), u)
      )
    ]), !!customElements.get(i);
  } catch {
    return !!customElements.get(i);
  }
}
function mb() {
  const i = xt(), { hass: u } = Qe(), o = S.useRef(null), r = S.useRef(
    null
  ), [f, m] = S.useState("loading"), g = i.pathname === "/live/twin" || i.pathname === "/ops/dash";
  return S.useEffect(() => {
    const y = o.current;
    if (!y || r.current) return;
    let v = !1;
    return (async () => {
      m("loading");
      const h = await Hh("dsc-the-dash-card");
      if (v || !o.current) return;
      if (!h) {
        m("missing");
        return;
      }
      const b = document.createElement("dsc-the-dash-card");
      typeof b.setConfig == "function" && b.setConfig({ type: "custom:dsc-the-dash-card" }), u && (b.hass = u), y.appendChild(b), r.current = b, m("ready");
    })(), () => {
      v = !0;
    };
  }, []), S.useEffect(() => {
    r.current && u && (r.current.hass = u);
  }, [u]), /* @__PURE__ */ c.jsxs(
    "div",
    {
      className: `dsc-twin-keepalive${g ? " is-active" : ""}`,
      "aria-hidden": !g,
      "data-status": f,
      children: [
        /* @__PURE__ */ c.jsx("div", { className: "dsc-twin-keepalive-host", ref: o }),
        f === "missing" ? /* @__PURE__ */ c.jsxs("div", { className: "dsc-empty", children: [
          /* @__PURE__ */ c.jsx("strong", { children: "dsc-the-dash-card" }),
          " did not register. Deploy /local/DSC-HUB.js and hard-refresh."
        ] }) : null
      ]
    }
  );
}
const Uh = S.createContext(null);
function hb(i) {
  return i === "clone" || i === "compare" || i === "room" || i === "main" ? i : "main";
}
function pb({ children: i }) {
  const [u, o] = Vs(), r = hb(u.get("tent") ?? u.get("zone")), f = S.useCallback(
    (g) => {
      const y = new URLSearchParams(u);
      y.set("tent", g), y.delete("zone"), o(y, { replace: !0 });
    },
    [u, o]
  ), m = S.useMemo(() => ({ focus: r, setFocus: f }), [r, f]);
  return /* @__PURE__ */ c.jsx(Uh.Provider, { value: m, children: i });
}
function kh() {
  const i = S.useContext(Uh);
  return i || {
    focus: "main",
    setFocus: () => {
    }
  };
}
function Hr({
  label: i,
  icon: u,
  onClick: o,
  className: r = ""
}) {
  return /* @__PURE__ */ c.jsx(
    "button",
    {
      type: "button",
      className: `dsc-icon-btn ${r}`.trim(),
      "aria-label": i,
      title: i,
      onClick: o,
      children: /* @__PURE__ */ c.jsx(Nl, { name: u, size: 16 })
    }
  );
}
function $s({
  items: i,
  label: u = "More actions"
}) {
  const [o, r] = S.useState(!1), f = S.useRef(null);
  return S.useEffect(() => {
    if (!o) return;
    const m = (g) => {
      f.current?.contains(g.target) || r(!1);
    };
    return document.addEventListener("mousedown", m), () => document.removeEventListener("mousedown", m);
  }, [o]), /* @__PURE__ */ c.jsxs("div", { className: "dsc-overflow", ref: f, children: [
    /* @__PURE__ */ c.jsx(Hr, { label: u, icon: "more", onClick: () => r((m) => !m) }),
    o ? /* @__PURE__ */ c.jsx("div", { className: "dsc-overflow-menu", role: "menu", children: i.map((m) => /* @__PURE__ */ c.jsx(
      "button",
      {
        type: "button",
        role: "menuitem",
        onClick: () => {
          r(!1), m.onSelect();
        },
        children: m.label
      },
      m.id
    )) }) : null
  ] });
}
function fi({
  open: i,
  onClose: u,
  title: o,
  side: r = "right",
  children: f
}) {
  const m = S.useId();
  return S.useEffect(() => {
    if (!i) return;
    const g = (y) => {
      y.key === "Escape" && u();
    };
    return window.addEventListener("keydown", g), () => window.removeEventListener("keydown", g);
  }, [i, u]), /* @__PURE__ */ c.jsxs("div", { className: `dsc-drawer-root${i ? " is-open" : ""}`, "aria-hidden": !i, children: [
    /* @__PURE__ */ c.jsx("div", { className: "dsc-drawer-scrim", onClick: u }),
    /* @__PURE__ */ c.jsxs(
      "aside",
      {
        className: `dsc-drawer-panel ${r}`,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": m,
        children: [
          /* @__PURE__ */ c.jsx(
            "button",
            {
              type: "button",
              className: "dsc-drawer-rail",
              "aria-label": "Close panel",
              onClick: u,
              children: r === "right" ? ">" : "<"
            }
          ),
          /* @__PURE__ */ c.jsxs("div", { className: "dsc-drawer-head", children: [
            /* @__PURE__ */ c.jsx("h2", { id: m, children: o }),
            /* @__PURE__ */ c.jsx(Hr, { label: "Close", icon: "close", onClick: u })
          ] }),
          /* @__PURE__ */ c.jsx("div", { className: "dsc-drawer-body", children: f })
        ]
      }
    )
  ] });
}
const ih = [
  "var(--dsc-soil-1)",
  "var(--dsc-soil-2)",
  "var(--dsc-soil-3)",
  "var(--dsc-soil-4)"
];
function vb(i) {
  if (!i || !i.trim()) return [];
  const u = i.split(/[|/·]/).map((r) => r.trim()).filter(Boolean), o = [];
  for (const r of u) {
    const f = r.match(/^(.+?)\s*[·:]?\s*(\d+(?:\.\d+)?)\s*%?$/);
    if (f) {
      o.push({ name: f[1].trim(), pct: Number(f[2]) });
      continue;
    }
    const m = r.match(/(\d+(?:\.\d+)?)\s*%\s*(.+)$/);
    if (m) {
      o.push({ name: m[2].trim(), pct: Number(m[1]) });
      continue;
    }
    r && o.push({ name: r, pct: 0 });
  }
  if (o.length && o.every((r) => r.pct === 0)) {
    const r = 100 / o.length;
    return o.map((f) => ({ ...f, pct: r }));
  }
  return o.filter((r) => r.pct > 0);
}
function gb({
  layers: i,
  valid: u,
  emptyLabel: o = "No blend on roster seat"
}) {
  const r = i.reduce((g, y) => g + y.pct, 0), f = u ?? (i.length > 0 && Math.round(r) === 100);
  let m = 0;
  return /* @__PURE__ */ c.jsx("div", { className: "dsc-soil", children: /* @__PURE__ */ c.jsx("div", { className: `dsc-soil-pot${f && i.length ? " is-valid" : ""}`, children: i.length ? i.map((g, y) => {
    const v = m;
    return m += g.pct, /* @__PURE__ */ c.jsx(
      "div",
      {
        className: "dsc-soil-layer",
        style: {
          bottom: `${v}%`,
          height: `${g.pct}%`,
          background: g.color || ih[y % ih.length]
        },
        title: `${g.name} ${g.pct}%`,
        children: g.pct >= 12 ? `${g.name} ${Math.round(g.pct)}%` : ""
      },
      `${g.name}-${y}`
    );
  }) : /* @__PURE__ */ c.jsx("div", { className: "dsc-soil-empty", children: o }) }) });
}
const yb = {
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
function ii({
  entityId: i,
  label: u,
  step: o
}) {
  const { num: r, available: f, callService: m, entity: g } = Qe(), y = f(i), v = g(i), h = r(i, NaN), b = Number(v?.attributes?.min ?? 0), x = Number(v?.attributes?.max ?? 100), E = o ?? Number(v?.attributes?.step ?? 0.1), [Y, X] = S.useState(String(Number.isFinite(h) ? h : ""));
  S.useEffect(() => {
    Number.isFinite(h) && X(String(h));
  }, [h]);
  const B = () => {
    if (!y) return;
    const O = Number(Y);
    if (!Number.isFinite(O)) {
      X(String(Number.isFinite(h) ? h : ""));
      return;
    }
    const Q = Math.min(x, Math.max(b, O));
    m("number", "set_value", { entity_id: i, value: Q }), X(String(Q));
  };
  return /* @__PURE__ */ c.jsxs("label", { className: `dsc-target-num${y ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ c.jsx("span", { className: "dsc-target-num-label", children: u }),
    /* @__PURE__ */ c.jsx(
      "input",
      {
        type: "number",
        value: Y,
        disabled: !y,
        min: b,
        max: x,
        step: E,
        onChange: (O) => X(O.target.value),
        onBlur: B,
        onKeyDown: (O) => {
          O.key === "Enter" && O.target.blur();
        }
      }
    )
  ] });
}
function bb({ tent: i, title: u }) {
  const { num: o, available: r } = Qe(), f = yb[i], m = o(f.gotTemp), g = o(f.gotRh), y = r(f.gotVpd) ? o(f.gotVpd) : NaN, v = o(f.temp), h = o(f.rhMin), b = o(f.rhMax), x = (E) => {
    const Y = new CustomEvent("hass-more-info", {
      detail: { entityId: E },
      bubbles: !0,
      composed: !0
    });
    document.querySelector("home-assistant")?.dispatchEvent(Y);
  };
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-tent-targets", children: [
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-tent-targets-head", children: [
      /* @__PURE__ */ c.jsx("strong", { children: u }),
      /* @__PURE__ */ c.jsx(
        $s,
        {
          label: `${u} more`,
          items: [
            {
              id: "temp",
              label: "More info · temp target",
              onSelect: () => x(f.temp)
            },
            {
              id: "rh",
              label: "More info · RH band",
              onSelect: () => x(f.rhMin)
            },
            {
              id: "vpd",
              label: "More info · VPD band",
              onSelect: () => x(f.vpdMin)
            }
          ]
        }
      )
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-got-want", children: [
      /* @__PURE__ */ c.jsxs("span", { children: [
        "Got ",
        Number.isFinite(m) ? m.toFixed(1) : "—",
        "°C /",
        " ",
        Number.isFinite(g) ? g.toFixed(0) : "—",
        "%",
        Number.isFinite(y) ? ` / ${y.toFixed(2)} kPa` : ""
      ] }),
      /* @__PURE__ */ c.jsxs("span", { className: "dsc-muted", children: [
        "Want ",
        Number.isFinite(v) ? v.toFixed(1) : "—",
        "°C · RH",
        " ",
        Number.isFinite(h) ? h.toFixed(0) : "—",
        "–",
        Number.isFinite(b) ? b.toFixed(0) : "—",
        "%"
      ] })
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-target-grid", children: [
      /* @__PURE__ */ c.jsx(ii, { entityId: f.temp, label: "Temp °C", step: 0.5 }),
      /* @__PURE__ */ c.jsx(ii, { entityId: f.rhMin, label: "RH min %", step: 1 }),
      /* @__PURE__ */ c.jsx(ii, { entityId: f.rhMax, label: "RH max %", step: 1 }),
      /* @__PURE__ */ c.jsx(ii, { entityId: f.vpdMin, label: "VPD min", step: 0.01 }),
      /* @__PURE__ */ c.jsx(ii, { entityId: f.vpdMax, label: "VPD max", step: 0.01 })
    ] })
  ] });
}
function Lh({
  compact: i,
  emphasize: u
}) {
  const o = u === "clone" ? ["clone", "main"] : ["main", "clone"];
  return /* @__PURE__ */ c.jsx("div", { className: `dsc-target-panel${i ? " is-compact" : ""}`, children: o.map((r) => /* @__PURE__ */ c.jsx(bb, { tent: r, title: r === "main" ? "Main 4×8" : "Clone 2×4" }, r)) });
}
function xb(i) {
  if (typeof i.lu == "number" && Number.isFinite(i.lu))
    return i.lu * 1e3;
  const u = i.last_changed || i.last_updated;
  if (u) {
    const o = Date.parse(u);
    return Number.isFinite(o) ? o : null;
  }
  return null;
}
function _b(i) {
  const u = i.s ?? i.state, o = typeof u == "number" ? u : Number(u);
  return Number.isFinite(o) ? o : null;
}
function Sb(i, u) {
  if (i.length <= u) return i;
  const o = [], r = (i.length - 1) / (u - 1);
  for (let f = 0; f < u; f++)
    o.push(i[Math.round(f * r)]);
  return o;
}
function jb(i, u = 6, o = 96) {
  const { hass: r, callWS: f, available: m } = Qe(), [g, y] = S.useState([]), [v, h] = S.useState(!0), [b, x] = S.useState(null);
  return S.useEffect(() => {
    let E = !1;
    async function Y() {
      if (!r?.callWS || !i) {
        y([]), h(!1);
        return;
      }
      h(!0), x(null);
      const X = /* @__PURE__ */ new Date(), B = new Date(X.getTime() - u * 3600 * 1e3);
      try {
        const O = await f({
          type: "history/history_during_period",
          start_time: B.toISOString(),
          end_time: X.toISOString(),
          significant_changes_only: !1,
          minimal_response: !0,
          no_attributes: !0,
          entity_ids: [i]
        });
        if (E) return;
        let Q = [];
        Array.isArray(O) ? Q = O[0] || [] : O && typeof O == "object" && (Q = O[i] || []);
        const K = [];
        for (const q of Q) {
          const te = xb(q), ie = _b(q);
          te == null || ie == null || K.push({ t: te, v: ie });
        }
        K.sort((q, te) => q.t - te.t), y(Sb(K, o));
      } catch (O) {
        E || (x(O instanceof Error ? O.message : "history unavailable"), y([]));
      } finally {
        E || h(!1);
      }
    }
    return Y(), () => {
      E = !0;
    };
  }, [r, f, i, u, o, m]), { points: g, loading: v, error: b };
}
function qe(i, u) {
  const o = u?.maxPoints ?? 96, r = u?.hours ?? 6, { num: f, available: m, tick: g } = Qe(), { points: y } = jb(i, r, o), [v, h] = S.useState([]), [b, x] = S.useState(void 0), E = S.useRef(null), Y = S.useRef(!1);
  return S.useEffect(() => {
    Y.current = !1, h([]), E.current = null, x(void 0);
  }, [i, r, o]), S.useEffect(() => {
    if (y.length && !Y.current) {
      Y.current = !0;
      const B = y[y.length - 1]?.v;
      Number.isFinite(B) && (E.current = B);
    }
  }, [y]), S.useEffect(() => {
    if (!i || !m(i)) return;
    const B = f(i);
    if (!Number.isFinite(B)) return;
    if (E.current === B && v.length > 0) {
      const Q = Date.now(), K = v[v.length - 1]?.t ?? 0;
      if (Q - K < 4e3) return;
    }
    E.current = B;
    const O = Date.now();
    h((Q) => [...Q, { t: O, v: B }].slice(-o)), x(O);
  }, [i, g, m, f, o]), { series: S.useMemo(() => {
    if (!y.length && !v.length) return v;
    if (!v.length) return y;
    if (!y.length) return v;
    const B = v[0]?.t ?? 0, Q = [...y.filter((K) => K.t < B - 500), ...v];
    return Q.length > o ? Q.slice(-o) : Q;
  }, [y, v, o]), lastSyncAt: b };
}
const Bh = [1, 6, 24, 48], qh = "dsc_chart_hours";
function Nb() {
  try {
    const i = sessionStorage.getItem(qh), u = Number(i);
    if (Bh.includes(u)) return u;
  } catch {
  }
  return 6;
}
function Ks(i = 6) {
  const [u, o] = S.useState(() => Nb() || i), r = S.useCallback((m) => {
    o(m);
    try {
      sessionStorage.setItem(qh, String(m));
    } catch {
    }
  }, []), f = u <= 1 ? 60 : u <= 6 ? 96 : u <= 24 ? 144 : 192;
  return { hours: u, setHours: r, maxPoints: f };
}
const Os = [
  "var(--dsc-neon)",
  "var(--dsc-teal)",
  "var(--dsc-amber)",
  "var(--dsc-gray-5)"
];
function sh(i) {
  const u = Math.max(...i, 1), o = 10 ** Math.floor(Math.log10(u));
  return Math.ceil(u / o) * o;
}
function ch(i, u = !1) {
  const o = Math.min(...i);
  if (u && o >= 0) return 0;
  const r = Math.abs(o) || 1, f = 10 ** Math.floor(Math.log10(r));
  return Math.floor(o / f) * f;
}
function uh(i, u, o = 0.08) {
  if (!Number.isFinite(i) || !Number.isFinite(u)) return { min: 0, max: 1 };
  if (u <= i) return { min: i - 1, max: u + 1 };
  const f = (u - i) * o || 1;
  return { min: i - f, max: u + f };
}
function Eb(i, u, o, r, f, m, g, y) {
  if (!i.length) return "";
  const v = Math.max(m - f, 1e-6), h = Math.max(y - g, 1), b = u - r.l - r.r, x = o - r.t - r.b;
  return i.map((E, Y) => {
    const X = r.l + (E.t - g) / h * b, B = r.t + (1 - (E.v - f) / v) * x;
    return `${Y === 0 ? "M" : "L"}${X.toFixed(1)} ${B.toFixed(1)}`;
  }).join(" ");
}
function rh(i) {
  const u = new Date(i), o = String(u.getHours()).padStart(2, "0"), r = String(u.getMinutes()).padStart(2, "0");
  return `${o}:${r}`;
}
function si(i, u, o, r, f) {
  const m = Math.max(o - u, 1e-6);
  return f.t + (1 - (i - u) / m) * (r - f.t - f.b);
}
function oh(i, u, o) {
  const r = i.filter((f) => (f.axis || "left") === u).flatMap((f) => f.series.map((m) => m.v));
  if (!r.length)
    return u === "right" ? { min: 0, max: 100 } : { min: 0, max: 1 };
  if (u === "right") {
    const f = Math.min(...r, 0);
    return Math.max(...r, 100) <= 100 && f >= 0 ? { min: 0, max: 100 } : uh(ch(r, !0), sh(r));
  }
  return uh(ch(r), sh(r));
}
function Vt({
  series: i,
  height: u = 180,
  unit: o = "",
  live: r = !0,
  emptyLabel: f = "No history yet",
  lastSyncAt: m,
  targets: g = []
}) {
  const y = S.useId().replace(/:/g, ""), v = 640, h = i.some((w) => w.axis === "right"), b = { l: 40, r: h ? 40 : 14, t: 16, b: 28 }, x = S.useRef(null), [E, Y] = S.useState(null), [X, B] = S.useState(!1), [O, Q] = S.useState(0), K = S.useRef(void 0);
  S.useEffect(() => {
    m != null && K.current !== m && (K.current = m, Q((w) => w + 1));
  }, [m]);
  const q = S.useMemo(() => {
    const w = i.flatMap((ee) => ee.series);
    if (!w.length) return null;
    const F = oh(i, "left"), P = oh(i, "right"), C = Math.min(...w.map((ee) => ee.t)), L = Math.max(...w.map((ee) => ee.t)), $ = i.map((ee, re) => {
      const j = ee.axis || "left", H = j === "right" ? P : F;
      return {
        ...ee,
        axis: j,
        color: ee.color || Os[re % Os.length],
        d: Eb(ee.series, v, u, b, H.min, H.max, C, L),
        last: ee.series.length ? ee.series[ee.series.length - 1] : null,
        dom: H
      };
    });
    return { left: F, right: P, t0: C, t1: L, paths: $ };
  }, [i, u, h]), te = S.useMemo(() => {
    if (!q) return [];
    const w = 4, F = [];
    for (let P = 0; P <= w; P++) {
      const C = P / w, L = q.left.max - C * (q.left.max - q.left.min), $ = b.t + C * (u - b.t - b.b);
      F.push({ y: $, label: L.toFixed(Math.abs(L) >= 100 ? 0 : 1) });
    }
    return F;
  }, [q, u]), ie = S.useMemo(() => {
    if (!q || !h) return [];
    const w = 4, F = [];
    for (let P = 0; P <= w; P++) {
      const C = P / w, L = q.right.max - C * (q.right.max - q.right.min), $ = b.t + C * (u - b.t - b.b);
      F.push({ y: $, label: L.toFixed(Math.abs(L) >= 100 ? 0 : 1) });
    }
    return F;
  }, [q, u, h]), ue = S.useMemo(() => {
    if (!q) return [];
    const w = 5, F = [], P = Math.max(q.t1 - q.t0, 1), C = v - b.l - b.r;
    for (let L = 0; L < w; L++) {
      const $ = L / (w - 1), ee = q.t0 + $ * P;
      F.push({ x: b.l + $ * C, label: rh(ee) });
    }
    return F;
  }, [q]), V = S.useCallback(
    (w) => {
      const F = x.current;
      if (!F || !q) return null;
      const P = F.getBoundingClientRect(), C = (w - P.left) / Math.max(P.width, 1) * v, L = v - b.l - b.r, $ = Math.min(v - b.r, Math.max(b.l, C)), ee = ($ - b.l) / Math.max(L, 1);
      return { t: q.t0 + ee * Math.max(q.t1 - q.t0, 1), x: $ };
    },
    [q]
  ), se = (w) => {
    if (X) return;
    const F = V(w.clientX);
    F && Y(F);
  }, _e = () => {
    X || Y(null);
  }, Ne = (w) => {
    const F = V(w.clientX);
    if (F) {
      if (X && E && Math.abs(E.x - F.x) < 8) {
        B(!1), Y(null);
        return;
      }
      B(!0), Y(F);
    }
  }, Te = S.useMemo(() => !q || !E ? [] : q.paths.map((w) => {
    if (!w.series.length) return { id: w.id, label: w.label, color: w.color, v: null, unit: w.unit || "" };
    let F = w.series[0], P = Math.abs(F.t - E.t);
    for (const L of w.series) {
      const $ = Math.abs(L.t - E.t);
      $ < P && (F = L, P = $);
    }
    const C = si(F.v, w.dom.min, w.dom.max, u, b);
    return {
      id: w.id,
      label: w.label,
      color: w.color,
      v: F.v,
      unit: w.unit || "",
      y: C,
      x: b.l + (F.t - q.t0) / Math.max(q.t1 - q.t0, 1) * (v - b.l - b.r)
    };
  }), [q, E, u]), he = q?.paths[0]?.last?.v ?? null;
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-chart", style: { position: "relative", width: "100%" }, children: [
    /* @__PURE__ */ c.jsxs(
      "svg",
      {
        ref: x,
        viewBox: `0 0 ${v} ${u}`,
        width: "100%",
        height: u,
        role: "img",
        "aria-label": "Live chart",
        className: "dsc-chart-svg",
        onPointerMove: se,
        onPointerLeave: _e,
        onPointerDown: Ne,
        children: [
          /* @__PURE__ */ c.jsxs("defs", { children: [
            q?.paths.map((w) => /* @__PURE__ */ c.jsxs("linearGradient", { id: `fill-${y}-${w.id}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ c.jsx("stop", { offset: "0%", stopColor: w.color, stopOpacity: "0.28" }),
              /* @__PURE__ */ c.jsx("stop", { offset: "100%", stopColor: w.color, stopOpacity: "0" })
            ] }, w.id)),
            /* @__PURE__ */ c.jsxs("filter", { id: `glow-${y}`, x: "-40%", y: "-40%", width: "180%", height: "180%", children: [
              /* @__PURE__ */ c.jsx("feGaussianBlur", { stdDeviation: "2.8", result: "b" }),
              /* @__PURE__ */ c.jsxs("feMerge", { children: [
                /* @__PURE__ */ c.jsx("feMergeNode", { in: "b" }),
                /* @__PURE__ */ c.jsx("feMergeNode", { in: "SourceGraphic" })
              ] })
            ] }),
            /* @__PURE__ */ c.jsxs("filter", { id: `glow-soft-${y}`, x: "-50%", y: "-50%", width: "200%", height: "200%", children: [
              /* @__PURE__ */ c.jsx("feGaussianBlur", { stdDeviation: "4.2", result: "b" }),
              /* @__PURE__ */ c.jsx("feMerge", { children: /* @__PURE__ */ c.jsx("feMergeNode", { in: "b" }) })
            ] })
          ] }),
          te.map((w) => /* @__PURE__ */ c.jsxs("g", { children: [
            /* @__PURE__ */ c.jsx(
              "line",
              {
                x1: b.l,
                x2: v - b.r,
                y1: w.y,
                y2: w.y,
                stroke: "var(--dsc-gray-3)",
                strokeWidth: "1",
                strokeDasharray: "3 4"
              }
            ),
            /* @__PURE__ */ c.jsx(
              "text",
              {
                x: b.l - 6,
                y: w.y + 3,
                textAnchor: "end",
                fill: "var(--dsc-gray-5)",
                fontSize: "9",
                fontFamily: "var(--dsc-mono)",
                children: w.label
              }
            )
          ] }, `L${w.y}`)),
          ie.map((w) => /* @__PURE__ */ c.jsx(
            "text",
            {
              x: v - b.r + 6,
              y: w.y + 3,
              textAnchor: "start",
              fill: "var(--dsc-teal)",
              fontSize: "9",
              fontFamily: "var(--dsc-mono)",
              opacity: 0.85,
              children: w.label
            },
            `R${w.y}`
          )),
          ue.map((w) => /* @__PURE__ */ c.jsx(
            "text",
            {
              x: w.x,
              y: u - 8,
              textAnchor: "middle",
              fill: "var(--dsc-gray-5)",
              fontSize: "9",
              fontFamily: "var(--dsc-mono)",
              children: w.label
            },
            w.x
          )),
          q ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
            g.map((w, F) => {
              const P = w.axis || "left", C = P === "right" ? q.right : q.left, L = w.color || (P === "right" ? "var(--dsc-teal)" : "var(--dsc-amber)");
              if (w.min != null && w.max != null) {
                const ee = si(w.max, C.min, C.max, u, b), re = si(w.min, C.min, C.max, u, b);
                return /* @__PURE__ */ c.jsxs("g", { children: [
                  /* @__PURE__ */ c.jsx(
                    "rect",
                    {
                      x: b.l,
                      y: Math.min(ee, re),
                      width: v - b.l - b.r,
                      height: Math.abs(re - ee),
                      fill: L,
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
                      stroke: L,
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
                      y1: re,
                      y2: re,
                      stroke: L,
                      strokeWidth: "1",
                      strokeDasharray: "4 4",
                      opacity: 0.7
                    }
                  )
                ] }, `tg-${F}`);
              }
              if (w.value == null || !Number.isFinite(w.value)) return null;
              const $ = si(w.value, C.min, C.max, u, b);
              return /* @__PURE__ */ c.jsxs("g", { children: [
                /* @__PURE__ */ c.jsx(
                  "line",
                  {
                    x1: b.l,
                    x2: v - b.r,
                    y1: $,
                    y2: $,
                    stroke: L,
                    strokeWidth: "1.2",
                    strokeDasharray: "5 4",
                    opacity: 0.85
                  }
                ),
                w.label ? /* @__PURE__ */ c.jsx(
                  "text",
                  {
                    x: v - b.r - 2,
                    y: $ - 4,
                    textAnchor: "end",
                    fill: L,
                    fontSize: "8",
                    fontFamily: "var(--dsc-mono)",
                    children: w.label
                  }
                ) : null
              ] }, `tg-${F}`);
            }),
            q.paths.map((w) => {
              if (!w.d || w.series.length === 0) return null;
              const F = w.series.length >= 2 ? `${w.d} L${v - b.r} ${u - b.b} L${b.l} ${u - b.b} Z` : "", P = w.last, C = P && q ? b.l + (P.t - q.t0) / Math.max(q.t1 - q.t0, 1) * (v - b.l - b.r) : 0, L = P ? si(P.v, w.dom.min, w.dom.max, u, b) : 0;
              return /* @__PURE__ */ c.jsxs("g", { className: "dsc-chart-series", children: [
                F ? /* @__PURE__ */ c.jsx("path", { d: F, fill: `url(#fill-${y}-${w.id})`, opacity: 0.9, className: "dsc-chart-fill" }) : null,
                /* @__PURE__ */ c.jsx(
                  "path",
                  {
                    d: w.d,
                    fill: "none",
                    stroke: w.color,
                    strokeWidth: "4.5",
                    strokeLinejoin: "round",
                    strokeLinecap: "round",
                    filter: `url(#glow-soft-${y})`,
                    opacity: 0.35,
                    className: "dsc-chart-glow"
                  }
                ),
                /* @__PURE__ */ c.jsx(
                  "path",
                  {
                    d: w.d,
                    fill: "none",
                    stroke: w.color,
                    strokeWidth: "2.2",
                    strokeLinejoin: "round",
                    strokeLinecap: "round",
                    filter: `url(#glow-${y})`,
                    opacity: 0.95,
                    className: "dsc-chart-core"
                  }
                ),
                r && P && w.series.length >= 2 ? /* @__PURE__ */ c.jsxs("g", { className: "dsc-chart-pulse-wrap", children: [
                  /* @__PURE__ */ c.jsx(
                    "path",
                    {
                      className: "dsc-chart-pulse",
                      d: w.d,
                      fill: "none",
                      stroke: w.color,
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
                      cx: C,
                      cy: L,
                      r: 4,
                      fill: w.color,
                      className: "dsc-chart-tip",
                      filter: `url(#glow-${y})`
                    }
                  )
                ] }, `pulse-${O}-${w.id}`) : P ? /* @__PURE__ */ c.jsx("circle", { cx: C, cy: L, r: 3.2, fill: w.color, opacity: 0.9 }) : null
              ] }, w.id);
            }),
            E ? /* @__PURE__ */ c.jsxs("g", { className: "dsc-chart-crosshair", children: [
              /* @__PURE__ */ c.jsx(
                "line",
                {
                  x1: E.x,
                  x2: E.x,
                  y1: b.t,
                  y2: u - b.b,
                  stroke: "var(--dsc-white)",
                  strokeOpacity: 0.35,
                  strokeWidth: "1"
                }
              ),
              Te.map(
                (w) => w.v == null || w.y == null ? null : /* @__PURE__ */ c.jsx(
                  "circle",
                  {
                    cx: w.x ?? E.x,
                    cy: w.y,
                    r: 4,
                    fill: w.color,
                    stroke: "var(--dsc-black)",
                    strokeWidth: "1"
                  },
                  w.id
                )
              )
            ] }) : null
          ] }) : /* @__PURE__ */ c.jsx(
            "text",
            {
              x: v / 2,
              y: u / 2,
              textAnchor: "middle",
              fill: "var(--dsc-gray-5)",
              fontSize: "12",
              children: f
            }
          )
        ]
      }
    ),
    E && q ? /* @__PURE__ */ c.jsxs(
      "div",
      {
        className: "dsc-chart-tooltip",
        style: {
          left: `${Math.min(92, Math.max(8, E.x / v * 100))}%`
        },
        children: [
          /* @__PURE__ */ c.jsx("div", { className: "dsc-chart-tooltip-time", children: rh(E.t) }),
          Te.map(
            (w) => w.v == null ? null : /* @__PURE__ */ c.jsxs("div", { className: "dsc-chart-tooltip-row", children: [
              /* @__PURE__ */ c.jsx("i", { style: { background: w.color } }),
              /* @__PURE__ */ c.jsxs("span", { children: [
                w.label || w.id,
                " ",
                w.v.toFixed(w.v >= 100 ? 0 : 1),
                w.unit ? ` ${w.unit}` : ""
              ] })
            ] }, w.id)
          )
        ]
      }
    ) : null,
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-chart-legend", children: [
      i.filter((w) => w.label).map((w, F) => /* @__PURE__ */ c.jsxs("span", { className: "dsc-chart-legend-item", children: [
        /* @__PURE__ */ c.jsx("i", { style: { background: w.color || Os[F % Os.length] } }),
        w.label
      ] }, w.id)),
      he != null ? /* @__PURE__ */ c.jsxs("span", { className: "dsc-chart-last", children: [
        he.toFixed(1),
        o ? ` ${o}` : i[0]?.unit ? ` ${i[0].unit}` : ""
      ] }) : null
    ] })
  ] });
}
function Tb(i, u = 280) {
  const [o, r] = S.useState(i);
  return S.useEffect(() => {
    if (!Number.isFinite(i)) {
      r(i);
      return;
    }
    const f = Number.isFinite(o) ? o : i, m = performance.now();
    let g = 0;
    const y = (v) => {
      const h = Math.min(1, (v - m) / u), b = 1 - (1 - h) ** 3;
      r(f + (i - f) * b), h < 1 && (g = requestAnimationFrame(y));
    };
    return g = requestAnimationFrame(y), () => cancelAnimationFrame(g);
  }, [i, u]), o;
}
function dh(i, u, o, r) {
  return { x: i + o * Math.cos(r), y: u + o * Math.sin(r) };
}
function Pt({
  value: i,
  min: u = 0,
  max: o = 100,
  label: r,
  unit: f = "",
  target: m,
  band: g,
  extrema: y,
  stale: v,
  onClick: h
}) {
  const b = Number.isFinite(i) ? i : NaN, x = Tb(Number.isFinite(b) ? b : u), E = Number.isFinite(b) ? x : u, Y = Math.min(o, Math.max(u, E)), X = Math.max(o - u, 1e-6), B = Number.isFinite(b) ? (Y - u) / X : 0, O = 46, Q = 2 * Math.PI * O * 0.75, K = Q * B, q = (se) => {
    const _e = Math.min(1, Math.max(0, (se - u) / X));
    return Math.PI - _e * Math.PI;
  }, te = g && Number.isFinite(b) ? b >= g.min && b <= g.max : !0, ie = Number.isFinite(b) ? v ? "var(--dsc-amber)" : te ? "var(--dsc-teal)" : "var(--dsc-amber)" : "var(--dsc-gray-4)", ue = [];
  g && ue.push({ v: g.min, kind: "band" }, { v: g.max, kind: "band" }), y?.min != null && ue.push({ v: y.min, kind: "ext" }), y?.max != null && ue.push({ v: y.max, kind: "ext" }), m != null && Number.isFinite(m) && ue.push({ v: m, kind: "target" });
  const V = /* @__PURE__ */ c.jsxs(
    "div",
    {
      className: `dsc-gauge${!te && Number.isFinite(b) ? " is-warn" : ""}${v ? " is-stale" : ""}${h ? " is-clickable" : ""}`,
      children: [
        /* @__PURE__ */ c.jsxs("svg", { viewBox: "0 0 120 90", width: "140", height: "105", "aria-label": r, children: [
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
              stroke: ie,
              strokeWidth: "10",
              strokeLinecap: "round",
              strokeDasharray: `${K} ${Q}`,
              filter: "url(#dsc-gauge-glow)",
              style: { transition: "stroke-dasharray 220ms ease, stroke 220ms ease" }
            }
          ),
          ue.map((se, _e) => {
            const Ne = q(se.v), Te = dh(60, 72, se.kind === "ext" ? O - 2 : O + 1, Ne), he = dh(60, 72, O - (se.kind === "target" ? 14 : 10), Ne), w = se.kind === "target" ? "var(--dsc-teal)" : se.kind === "band" ? "var(--dsc-amber)" : "var(--dsc-gray-5)";
            return /* @__PURE__ */ c.jsx(
              "line",
              {
                x1: he.x,
                y1: he.y,
                x2: Te.x,
                y2: Te.y,
                stroke: w,
                strokeWidth: se.kind === "target" ? 2.4 : 1.6,
                strokeLinecap: "round",
                opacity: se.kind === "ext" ? 0.65 : 0.95
              },
              `${se.kind}-${_e}`
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
              children: Number.isFinite(b) ? b.toFixed(b >= 100 ? 0 : b < 10 ? 2 : 1) : "—"
            }
          ),
          /* @__PURE__ */ c.jsx("text", { x: "60", y: "74", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: v ? "HELD" : f })
        ] }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-gauge-label", children: r })
      ]
    }
  );
  return h ? /* @__PURE__ */ c.jsx("button", { type: "button", className: "dsc-gauge-hit", onClick: h, title: `History · ${r}`, children: V }) : V;
}
function ks({
  series: i,
  color: u = "var(--dsc-blue)",
  width: o = 120,
  height: r = 28
}) {
  if (i.length < 2)
    return /* @__PURE__ */ c.jsx("div", { className: "dsc-sparkline dsc-muted", style: { width: o, height: r } });
  const f = i.map((E) => E.v), m = Math.min(...f), g = Math.max(...f), y = Math.max(g - m, 1e-6), v = i[0].t, h = i[i.length - 1].t, b = Math.max(h - v, 1), x = i.map((E, Y) => {
    const X = (E.t - v) / b * o, B = r - (E.v - m) / y * (r - 4) - 2;
    return `${Y === 0 ? "M" : "L"}${X.toFixed(1)} ${B.toFixed(1)}`;
  }).join(" ");
  return /* @__PURE__ */ c.jsx("svg", { className: "dsc-sparkline", width: o, height: r, "aria-hidden": !0, children: /* @__PURE__ */ c.jsx("path", { d: x, fill: "none", stroke: u, strokeWidth: "1.6", strokeLinecap: "round" }) });
}
function Cb({
  rows: i
}) {
  return /* @__PURE__ */ c.jsx("div", { className: "dsc-gotwant", children: i.map((u) => {
    const o = u.want != null ? u.want : u.wantMin != null && u.wantMax != null ? (u.wantMin + u.wantMax) / 2 : NaN, r = Math.max(
      Number.isFinite(u.got) ? u.got : 0,
      Number.isFinite(o) ? o : 0,
      u.wantMax ?? 0,
      1
    ), f = Number.isFinite(u.got) ? u.got / r * 100 : 0, m = Number.isFinite(o) ? o / r * 100 : 0;
    return /* @__PURE__ */ c.jsxs("div", { className: "dsc-gotwant-row", children: [
      /* @__PURE__ */ c.jsx("div", { className: "dsc-gotwant-label", children: u.label }),
      /* @__PURE__ */ c.jsxs("div", { className: "dsc-gotwant-track", children: [
        Number.isFinite(o) ? /* @__PURE__ */ c.jsx("div", { className: "dsc-gotwant-want", style: { width: `${m}%` } }) : null,
        /* @__PURE__ */ c.jsx("div", { className: "dsc-gotwant-got", style: { width: `${f}%` } })
      ] }),
      /* @__PURE__ */ c.jsxs("div", { className: "dsc-gotwant-vals", children: [
        /* @__PURE__ */ c.jsxs("span", { children: [
          "Got ",
          Number.isFinite(u.got) ? u.got.toFixed(1) : "—",
          u.unit || ""
        ] }),
        /* @__PURE__ */ c.jsxs("span", { className: "dsc-muted", children: [
          "Want",
          " ",
          u.wantMin != null && u.wantMax != null ? `${u.wantMin}–${u.wantMax}` : Number.isFinite(o) ? o.toFixed(1) : "—"
        ] })
      ] })
    ] }, u.label);
  }) });
}
function Ys(i) {
  if (!i.length) return {};
  let u = i[0].v, o = i[0].v;
  for (const r of i)
    r.v < u && (u = r.v), r.v > o && (o = r.v);
  return { min: u, max: o };
}
function Js({
  hours: i,
  setHours: u
}) {
  return /* @__PURE__ */ c.jsx("div", { className: "dsc-timespan", role: "group", "aria-label": "Chart timespan", children: Bh.map((o) => /* @__PURE__ */ c.jsxs(
    "button",
    {
      type: "button",
      className: `dsc-chip${i === o ? " dsc-chip--ok" : ""}`,
      onClick: () => u(o),
      children: [
        o,
        "h"
      ]
    },
    o
  )) });
}
function Ur({
  open: i,
  onClose: u,
  entityId: o,
  label: r,
  unit: f = "",
  color: m = "var(--dsc-blue)"
}) {
  const { hours: g, setHours: y, maxPoints: v } = Ks(6), h = qe(o || "", { hours: g, maxPoints: v }), b = !o || h.series.length < 2;
  return /* @__PURE__ */ c.jsxs(
    fi,
    {
      open: i && !!o,
      onClose: u,
      title: r ? `History · ${r}` : "History",
      children: [
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: [
          /* @__PURE__ */ c.jsx(Js, { hours: g, setHours: y }),
          b ? /* @__PURE__ */ c.jsx(I, { label: "Thin recorder", tone: "warn" }) : null
        ] }),
        o ? /* @__PURE__ */ c.jsx(
          Vt,
          {
            live: !0,
            unit: f,
            lastSyncAt: h.lastSyncAt,
            series: [
              {
                id: o,
                label: r,
                series: h.series,
                color: m,
                unit: f
              }
            ]
          }
        ) : null,
        /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { marginTop: 10, fontSize: 12 }, children: o })
      ]
    }
  );
}
const Er = "sensor.dsc_hub_uptime", Mb = "sensor.dsc_hub_heartbeat";
function rt(i) {
  const { num: u, available: o, tick: r, entity: f } = Qe(), m = S.useRef(null), [, g] = S.useState(0), y = !o(Er) || !o(Mb), v = o(i), h = u(i);
  return S.useEffect(() => {
    if (v && Number.isFinite(h)) {
      if (y && h === 0 && m.current != null) {
        g((b) => b + 1);
        return;
      }
      m.current = { value: h, at: Date.now() }, g((b) => b + 1);
      return;
    }
    g((b) => b + 1);
  }, [i, v, h, y, r, f]), v && Number.isFinite(h) && !(y && h === 0 && m.current != null) ? { value: h, stale: !1, heldAt: m.current?.at, live: !0 } : m.current != null ? {
    value: m.current.value,
    stale: !0,
    heldAt: m.current.at,
    live: !1
  } : { value: NaN, stale: !v, heldAt: void 0, live: !1 };
}
function Rb() {
  const { available: i, entity: u, tick: o } = Qe();
  if (i(Er)) return null;
  const r = u(Er)?.last_changed;
  if (!r) return null;
  const f = Date.parse(r);
  return Number.isFinite(f) ? Date.now() - f : null;
}
function Yh(i) {
  if (!Number.isFinite(i) || i < 0) return "—";
  const u = Math.floor(i / 1e3);
  if (u < 60) return `${Math.max(1, u)}S`;
  const o = Math.floor(u / 60);
  if (o < 60) return `${o}M`;
  const r = Math.floor(o / 60), f = o % 60;
  return r < 48 ? f > 0 ? `${r}H ${f}M` : `${r}H` : `${(r / 24).toFixed(1)}D`;
}
function Ab(i) {
  return !Number.isFinite(i) || i <= 0 ? "—" : Yh(i * 1e3);
}
function dt(i, u = "—") {
  return !i || i === "unknown" || i === "unavailable" || i === "none" ? u : i;
}
function Gh(i, u) {
  const o = i(`input_select.dsc_pot${u}_tent`, "unassigned");
  return o === "clone" || o === "main" || o === "unassigned" ? o : "unassigned";
}
function Fs(i) {
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
function mi(i, u) {
  const { state: o, entity: r } = u, f = r("sensor.dsc_plant_roster_summary")?.attributes?.slots || [], m = Array.isArray(f) ? f.find((v) => String(v.pot) === String(i)) : void 0, g = (v, h) => {
    const b = dt(o(v, ""));
    return b !== "—" ? b : dt(o(h, ""));
  }, y = dt(m?.blend, "");
  return {
    pot: i,
    plantName: dt(o(`text.dsc_pot${i}_plant_name`, "")),
    strainDisplay: dt(o(`sensor.dsc_pot${i}_strain_display`, "")),
    sprout: dt(o(`datetime.dsc_pot${i}_sprout_date`, ""), "—").slice(0, 10),
    days: dt(o(`sensor.dsc_pot${i}_days_since_sprout`, "")),
    stage: dt(o(`sensor.dsc_pot${i}_expected_stage`, "")),
    growthStage: dt(o(`select.dsc_pot${i}_growth_stage`, "")),
    tent: Gh(o, i),
    blend: y,
    recipe: dt(m?.recipe, ""),
    notes: dt(m?.notes, ""),
    layers: vb(y),
    moisture: g(`sensor.dsc_pot${i}_got_moisture`, `sensor.dsc_pot${i}_soil_moisture`),
    soilTemp: dt(o(`sensor.dsc_pot${i}_soil_temperature`, "")),
    ec: g(`sensor.dsc_pot${i}_got_ec`, `sensor.dsc_pot${i}_soil_conductivity`),
    ph: g(`sensor.dsc_pot${i}_got_ph`, `sensor.dsc_pot${i}_soil_ph`),
    n: dt(o(`sensor.dsc_pot${i}_soil_nitrogen`, "")),
    p: dt(o(`sensor.dsc_pot${i}_soil_phosphorus`, "")),
    k: dt(o(`sensor.dsc_pot${i}_soil_potassium`, "")),
    need: dt(o(`sensor.dsc_pot${i}_need_summary`, "")),
    rosterSlot: m?.slot ?? null
  };
}
function ya(i, u, o) {
  const r = `sensor.dsc_pot${i}_got_${u}`, f = u === "moisture" ? `sensor.dsc_pot${i}_soil_moisture` : u === "ec" ? `sensor.dsc_pot${i}_soil_conductivity` : `sensor.dsc_pot${i}_soil_ph`, m = o(r, "");
  return m && m !== "unavailable" && m !== "unknown" ? r : f;
}
function zb(i, u, o) {
  return [1, 2, 3, 4].map((r) => mi(r, { state: u, entity: o })).filter((r) => r.tent === i);
}
function wb(i) {
  const u = i("sensor.dsc_plant_roster_summary")?.attributes?.slots;
  return Array.isArray(u) ? u : [];
}
const Ob = [
  { id: "binary_sensor.dsc_hub_emergency_failsafe", label: "Emergency failsafe" },
  { id: "binary_sensor.dsc_hub_climate_sensor_fault", label: "Climate sensor fault" },
  { id: "binary_sensor.dsc_hub_aux_sensor_fault", label: "Aux sensor fault" },
  { id: "binary_sensor.dsc_hub_root_zone_sensor_fault", label: "Root-zone probes" },
  { id: "binary_sensor.dsc_clone_dark_period_violation", label: "Clone dark violation" },
  { id: "binary_sensor.dsc_reduced_kit", label: "Reduced kit" }
];
function fh(i, u = 1) {
  return Number.isFinite(i) ? i.toFixed(u) : "—";
}
function Db() {
  const { state: i, num: u, available: o, entity: r, tick: f } = Qe(), m = Ot(), [g, y] = S.useState(!1), [v, h] = S.useState(null), { hours: b, setHours: x, maxPoints: E } = Ks(6), Y = o("sensor.dsc_hub_uptime"), X = Rb(), B = u("sensor.dsc_active_alert_count", 0), O = rt("sensor.dsc_hub_tent_temperature"), Q = rt("sensor.dsc_hub_tent_humidity"), K = rt("sensor.dsc_hub_vpd_kpa"), q = rt("sensor.dsc_hub_room_temperature"), te = rt("sensor.dsc_hub_clone_temperature"), ie = rt("sensor.dsc_hub_clone_humidity"), ue = qe("sensor.dsc_hub_tent_temperature", { hours: b, maxPoints: E }), V = qe("sensor.dsc_hub_tent_humidity", { hours: b, maxPoints: E }), se = qe("sensor.dsc_hub_clone_temperature", {
    hours: b,
    maxPoints: Math.min(E, 96)
  }), _e = u("number.dsc_hub_target_temp"), Ne = u("number.dsc_hub_rh_target_min"), Te = u("number.dsc_hub_rh_target_max"), he = u("number.dsc_hub_clone_target_temp"), w = u("number.dsc_hub_clone_rh_min"), F = u("number.dsc_hub_clone_rh_max"), P = S.useMemo(() => Ys(ue.series), [ue.series]), C = S.useMemo(() => Ys(V.series), [V.series]), $ = i("binary_sensor.dsc_hub_panel_link") === "on", ee = i("sensor.dsc_hub_heartbeat", "NO BEAT"), re = o("sensor.dsc_hub_heartbeat"), j = i("sensor.dsc_fleet_version_status", "—"), H = i("switch.dsc_hub_manual_takeover") === "on", Z = i("switch.dsc_hub_tent_manual_override") === "on", G = i("switch.dsc_hub_tent_full_auto_mode") === "on", ae = i("binary_sensor.dsc_reduced_kit") === "on", de = String(r("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? ""), pe = G && !H, et = i("binary_sensor.dsc_hub_climate_sensor_fault") === "on", we = Ob.filter((De) => i(De.id) === "on"), Dt = [1, 2, 3, 4].map((De) => mi(De, { state: i, entity: r })), Kt = O.stale || Q.stale || te.stale, Ht = (De, il, un, rn) => h({ entityId: De, label: il, unit: un, color: rn });
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      $t,
      {
        icon: "mission",
        title: "Mission",
        subtitle: "Job line — mode, vitals, seats, demands. Click a gauge for history.",
        primaryAction: /* @__PURE__ */ c.jsx(Be, { teal: !0, onClick: () => m("/live/twin"), children: "Open Twin" }),
        actions: /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsx(Be, { primary: !0, onClick: () => m("/live/climate"), children: "Climate Want" }),
          /* @__PURE__ */ c.jsx(Hr, { label: "Search", icon: "search", onClick: () => y(!0) }),
          /* @__PURE__ */ c.jsx(
            $s,
            {
              label: "Mission settings",
              items: [
                {
                  id: "climate",
                  label: "Open Climate",
                  onSelect: () => m("/live/climate")
                },
                { id: "main", label: "Main cockpit", onSelect: () => m("/live/main") },
                { id: "clone", label: "Clone cockpit", onSelect: () => m("/live/clone") },
                { id: "fleet", label: "Open Fleet", onSelect: () => m("/fleet") }
              ]
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-status-strip", children: [
      /* @__PURE__ */ c.jsx(
        I,
        {
          icon: Y ? "ok" : "alert",
          label: Y ? "HUB ONLINE" : "HUB OFFLINE",
          tone: Y ? "ok" : "bad"
        }
      ),
      Y ? null : /* @__PURE__ */ c.jsx(
        I,
        {
          label: `OFF ${X != null ? Yh(X) : "—"}`,
          tone: "bad",
          pulse: !0
        }
      ),
      Kt ? /* @__PURE__ */ c.jsx(I, { label: "HELD VITALS", tone: "warn" }) : null,
      /* @__PURE__ */ c.jsx(
        I,
        {
          label: $ ? "PANEL ESP-NOW" : o("sensor.dsc_control_wifi_rssi") ? "PANEL HA-ONLY" : "PANEL OFFLINE",
          tone: $ ? "ok" : o("sensor.dsc_control_wifi_rssi") ? "warn" : "bad"
        }
      ),
      /* @__PURE__ */ c.jsx(
        I,
        {
          icon: re ? "ok" : "alert",
          label: re ? `BEAT ${ee}` : "NO BEAT",
          tone: re ? "ok" : "bad"
        }
      ),
      /* @__PURE__ */ c.jsx(
        I,
        {
          label: `UP ${Ab(u("sensor.dsc_hub_uptime"))}`,
          tone: Y ? "ok" : "muted"
        }
      ),
      /* @__PURE__ */ c.jsx(
        I,
        {
          icon: B === 0 ? "ok" : "alert",
          label: B === 0 ? "All clear" : `${B} alert(s)`,
          tone: B === 0 ? "ok" : "bad",
          pulse: B > 0
        }
      ),
      /* @__PURE__ */ c.jsx(
        I,
        {
          label: j === "ok" ? "FLEET OK" : j === "warn" ? "FLEET WARN" : "FLEET DRIFT",
          tone: j === "ok" ? "ok" : j === "warn" ? "warn" : "bad"
        }
      ),
      G ? /* @__PURE__ */ c.jsx(I, { icon: "ok", label: "FULL AUTO", tone: "ok", pulse: !0 }) : null,
      pe ? /* @__PURE__ */ c.jsx(I, { label: "AUTO-DRIVEN", tone: "ok" }) : null,
      H ? /* @__PURE__ */ c.jsx(I, { icon: "alert", label: "MANUAL TAKEOVER", tone: "warn", pulse: !0 }) : null,
      Z ? /* @__PURE__ */ c.jsx(I, { icon: "alert", label: "FAN OVERRIDE", tone: "warn", pulse: !0 }) : null,
      G && ae ? /* @__PURE__ */ c.jsx(I, { icon: "alert", label: de || "REDUCED KIT", tone: "warn", pulse: !0 }) : null
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-grid dsc-mission-modern", children: [
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ob, {}) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ c.jsxs(ce, { className: "dsc-glass", title: "Live gauges", icon: "gauge", children: [
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-gauge-row", children: [
          /* @__PURE__ */ c.jsx(
            Pt,
            {
              label: "Tent T",
              value: O.value,
              min: 15,
              max: 35,
              unit: "°C",
              target: _e,
              extrema: P,
              stale: O.stale,
              onClick: () => Ht("sensor.dsc_hub_tent_temperature", "Tent T", "°C", "var(--dsc-blue)")
            }
          ),
          /* @__PURE__ */ c.jsx(
            Pt,
            {
              label: "Tent RH",
              value: Q.value,
              min: 0,
              max: 100,
              unit: "%",
              band: { min: Ne, max: Te },
              extrema: C,
              stale: Q.stale,
              onClick: () => Ht("sensor.dsc_hub_tent_humidity", "Tent RH", "%", "var(--dsc-teal)")
            }
          ),
          /* @__PURE__ */ c.jsx(
            Pt,
            {
              label: "Clone T",
              value: te.value,
              min: 15,
              max: 35,
              unit: "°C",
              target: he,
              stale: te.stale,
              onClick: () => Ht("sensor.dsc_hub_clone_temperature", "Clone T", "°C", "var(--dsc-purple)")
            }
          )
        ] }),
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-spark-row", children: [
          /* @__PURE__ */ c.jsxs("div", { children: [
            /* @__PURE__ */ c.jsx("span", { className: "dsc-muted", children: "Tent T" }),
            /* @__PURE__ */ c.jsx(ks, { series: ue.series, color: "var(--dsc-blue)" })
          ] }),
          /* @__PURE__ */ c.jsxs("div", { children: [
            /* @__PURE__ */ c.jsx("span", { className: "dsc-muted", children: "Tent RH" }),
            /* @__PURE__ */ c.jsx(ks, { series: V.series, color: "var(--dsc-teal)" })
          ] }),
          /* @__PURE__ */ c.jsxs("div", { children: [
            /* @__PURE__ */ c.jsx("span", { className: "dsc-muted", children: "Clone T" }),
            /* @__PURE__ */ c.jsx(ks, { series: se.series, color: "var(--dsc-purple)" })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ c.jsxs(ce, { className: `dsc-glass${pe ? " is-auto" : ""}`, title: "Control Center", icon: "climate", children: [
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-mode-row", children: [
          /* @__PURE__ */ c.jsx(
            Ue,
            {
              entityId: "switch.dsc_hub_tent_full_auto_mode",
              label: "Full Auto",
              icon: "ok"
            }
          ),
          /* @__PURE__ */ c.jsx(
            Ue,
            {
              entityId: "switch.dsc_hub_manual_takeover",
              label: "Manual takeover",
              icon: "alert"
            }
          ),
          /* @__PURE__ */ c.jsx(
            Ue,
            {
              entityId: "switch.dsc_hub_tent_manual_override",
              label: "Fan override",
              icon: "climate"
            }
          ),
          /* @__PURE__ */ c.jsx(
            Ue,
            {
              entityId: "switch.dsc_hub_humidifier_intake_routing",
              label: "Hum intake routing",
              icon: "climate"
            }
          ),
          /* @__PURE__ */ c.jsx(
            Ue,
            {
              entityId: "switch.dsc_hub_recirc_de_strat_pulse",
              label: "RECIRC de-strat",
              icon: "climate"
            }
          )
        ] }),
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-mode-selects", children: [
          /* @__PURE__ */ c.jsx(
            qs,
            {
              entityId: "select.dsc_hub_control_strategy",
              label: "Strategy",
              icon: "climate"
            }
          ),
          /* @__PURE__ */ c.jsx(
            qs,
            {
              entityId: "select.dsc_hub_priority_tent",
              label: "Priority tent",
              icon: "tent"
            }
          )
        ] }),
        G && (ae || de) ? /* @__PURE__ */ c.jsxs("p", { className: "dsc-honesty", children: [
          /* @__PURE__ */ c.jsx(I, { icon: "alert", label: "Honesty", tone: "warn" }),
          " ",
          de || "Full Auto armed on reduced kit — capacity offline paths apply."
        ] }) : null,
        et ? /* @__PURE__ */ c.jsxs("p", { className: "dsc-honesty", children: [
          /* @__PURE__ */ c.jsx(I, { label: "Climate fault", tone: "bad" }),
          " Do not invent Got — trust held/—."
        ] }) : null
      ] }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ c.jsxs(ce, { className: "dsc-glass", title: "Got vs Want", icon: "gauge", children: [
        /* @__PURE__ */ c.jsx(
          Cb,
          {
            rows: [
              {
                label: "Main T",
                got: O.value,
                want: _e,
                unit: "°C"
              },
              {
                label: "Main RH",
                got: Q.value,
                wantMin: Ne,
                wantMax: Te,
                unit: "%"
              },
              {
                label: "Clone T",
                got: te.value,
                want: he,
                unit: "°C"
              },
              {
                label: "Clone RH",
                got: ie.value,
                wantMin: w,
                wantMax: F,
                unit: "%"
              }
            ]
          }
        ),
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-kpi-sub", style: { marginTop: 8 }, children: [
          "Room ",
          fh(q.value),
          " °C · VPD ",
          fh(K.value, 2),
          " kPa",
          K.stale || q.stale ? " · HELD" : ""
        ] }),
        /* @__PURE__ */ c.jsx(
          Xe,
          {
            label: "Surface",
            value: i("sensor.dsc_ha_surface_version", "7.1.0"),
            sub: `Fleet ${j}`,
            tone: "ok"
          }
        )
      ] }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ce, { className: "dsc-glass", title: "Targets", icon: "gauge", children: /* @__PURE__ */ c.jsx(Lh, { compact: !0 }) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ce, { className: "dsc-glass", title: "Plant seats", icon: "seat", children: /* @__PURE__ */ c.jsx("div", { className: "dsc-chip-row", children: Dt.map((De) => /* @__PURE__ */ c.jsxs(
        "button",
        {
          type: "button",
          className: "dsc-chip dsc-chip--ok",
          onClick: () => m(`/live/root?pot=${De.pot}`),
          title: De.blend || "Open plant seat",
          children: [
            "P",
            De.pot,
            " ",
            De.plantName !== "—" ? De.plantName : "—",
            " · ",
            Fs(De.tent),
            De.blend ? ` · ${De.blend.slice(0, 28)}` : ""
          ]
        },
        De.pot
      )) }) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsxs(ce, { className: "dsc-glass", title: "Live climate trend", icon: "climate", children: [
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
          /* @__PURE__ */ c.jsx(Js, { hours: b, setHours: x }),
          /* @__PURE__ */ c.jsx(Be, { onClick: () => m("/live/climate"), children: "Open Climate" })
        ] }),
        /* @__PURE__ */ c.jsx(
          Vt,
          {
            live: !0,
            lastSyncAt: Math.max(ue.lastSyncAt ?? 0, V.lastSyncAt ?? 0) || void 0,
            series: [
              {
                id: "t",
                label: "Temp °C",
                series: ue.series,
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
              { axis: "left", value: _e, color: "var(--dsc-amber)", label: "Want T" },
              { axis: "right", min: Ne, max: Te, color: "var(--dsc-teal)" }
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsxs(ce, { className: `dsc-glass${pe ? " is-auto" : ""}`, title: "Demands", icon: "climate", children: [
        pe ? /* @__PURE__ */ c.jsx("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: /* @__PURE__ */ c.jsx(I, { label: "AUTO", tone: "ok", icon: "ok" }) }) : null,
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-demand-row", children: [
          /* @__PURE__ */ c.jsx(Ue, { entityId: "switch.dsc_hub_heater_demand", label: "Heat", icon: "climate" }),
          /* @__PURE__ */ c.jsx(
            Ue,
            {
              entityId: "switch.dsc_hub_ac_demand",
              label: "Cool",
              icon: "climate",
              warnWhenMissing: i("binary_sensor.dsc_ac_capacity_offline") === "on" ? "AC ○" : void 0
            }
          ),
          /* @__PURE__ */ c.jsx(Ue, { entityId: "switch.dsc_hub_humidifier_demand", label: "Hum", icon: "climate" }),
          /* @__PURE__ */ c.jsx(
            Ue,
            {
              entityId: "switch.dsc_hub_dehumidifier_demand",
              label: "Dehum",
              icon: "climate"
            }
          ),
          /* @__PURE__ */ c.jsx(Ue, { entityId: "switch.dsc_hub_grow_mat_demand", label: "Mat", icon: "root" }),
          /* @__PURE__ */ c.jsx(
            Ue,
            {
              entityId: "switch.dsc_hub_clone_humidifier_demand",
              label: "C-Hum",
              icon: "clone"
            }
          ),
          /* @__PURE__ */ c.jsx(
            Ue,
            {
              entityId: "light.dsc_hub_sf1000_dimmer",
              label: "SF1000",
              icon: "lighting",
              showBrightness: !0
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsxs(ce, { className: "dsc-glass", title: "Fans", icon: "climate", children: [
        /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { margin: "0 0 8px" }, children: Z ? "Fan override ON — sliders write percentage." : "Enable Fan override to set duty." }),
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-fan-stack", children: [
          /* @__PURE__ */ c.jsx(
            Wl,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_main",
              label: "Intake Main",
              disabled: !Z
            }
          ),
          /* @__PURE__ */ c.jsx(
            Wl,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_2x4",
              label: "Intake 2×4",
              disabled: !Z
            }
          ),
          /* @__PURE__ */ c.jsx(
            Wl,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_room",
              label: "Exhaust room",
              disabled: !Z
            }
          ),
          /* @__PURE__ */ c.jsx(
            Wl,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_outside",
              label: "Exhaust outside",
              disabled: !Z
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsx(ce, { className: "dsc-glass", title: "Pot ESP-NOW", icon: "root", children: /* @__PURE__ */ c.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ c.jsx(
          I,
          {
            label: `P1 ${i("binary_sensor.dsc_hub_pot1_esp_now_link") === "on" ? "ON" : "OFF"}`,
            tone: i("binary_sensor.dsc_hub_pot1_esp_now_link") === "on" ? "ok" : "muted"
          }
        ),
        /* @__PURE__ */ c.jsx(
          I,
          {
            label: `P2 ${i("binary_sensor.dsc_hub_pot2_esp_now_link") === "on" ? "ON" : "OFF"}`,
            tone: i("binary_sensor.dsc_hub_pot2_esp_now_link") === "on" ? "ok" : "muted"
          }
        ),
        /* @__PURE__ */ c.jsx(
          I,
          {
            label: `P3 ${i("binary_sensor.dsc_hub_pot3_esp_now_link") === "on" ? "ON" : "OFF"}`,
            tone: i("binary_sensor.dsc_hub_pot3_esp_now_link") === "on" ? "ok" : "muted"
          }
        ),
        /* @__PURE__ */ c.jsx(
          I,
          {
            label: `P4 ${i("binary_sensor.dsc_hub_pot4_esp_now_link") === "on" ? "ON" : "OFF"}`,
            tone: i("binary_sensor.dsc_hub_pot4_esp_now_link") === "on" ? "ok" : "muted"
          }
        )
      ] }) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsx(ce, { className: "dsc-glass", title: "Faults / alerts", icon: "alert", children: we.length === 0 && B === 0 ? /* @__PURE__ */ c.jsx("div", { className: "dsc-empty dsc-empty--ok", children: "No active faults — all clear." }) : /* @__PURE__ */ c.jsxs("ul", { className: "dsc-fault-list", children: [
        we.map((De) => /* @__PURE__ */ c.jsxs("li", { children: [
          /* @__PURE__ */ c.jsx(I, { label: De.label, tone: "bad", pulse: !0, icon: "alert" }),
          /* @__PURE__ */ c.jsx("span", { className: "dsc-muted", children: De.id })
        ] }, De.id)),
        B > 0 && we.length === 0 ? /* @__PURE__ */ c.jsxs("li", { children: [
          /* @__PURE__ */ c.jsx(I, { label: `${B} system alert(s)`, tone: "bad", pulse: !0, icon: "alert" }),
          /* @__PURE__ */ c.jsx("span", { className: "dsc-muted", children: "See Fleet for entity detail" })
        ] }) : null
      ] }) }) })
    ] }),
    /* @__PURE__ */ c.jsx(fi, { open: g, onClose: () => y(!1), title: "Quick jump", children: /* @__PURE__ */ c.jsx("div", { className: "dsc-chip-row", children: [
      { path: "/live/climate", label: "Climate" },
      { path: "/live/twin", label: "Twin" },
      { path: "/live/main", label: "Main" },
      { path: "/live/clone", label: "Clone" },
      { path: "/live/root", label: "Root" },
      { path: "/live/light", label: "Light" },
      { path: "/grow/compose", label: "Compose" },
      { path: "/fleet", label: "Fleet" }
    ].map((De) => /* @__PURE__ */ c.jsx(
      "button",
      {
        type: "button",
        className: "dsc-btn teal",
        onClick: () => {
          y(!1), m(De.path);
        },
        children: De.label
      },
      De.path
    )) }) }),
    /* @__PURE__ */ c.jsx(
      Ur,
      {
        open: v != null,
        onClose: () => h(null),
        entityId: v?.entityId ?? null,
        label: v?.label ?? "",
        unit: v?.unit,
        color: v?.color
      }
    )
  ] });
}
function Ws({
  tag: i,
  config: u
}) {
  const o = S.useRef(null), { hass: r } = Qe(), [f, m] = S.useState("loading"), g = S.useRef(
    null
  ), y = JSON.stringify(u ?? {});
  return S.useEffect(() => {
    const v = o.current;
    if (!v) return;
    let h = !1;
    const b = y ? JSON.parse(y) : {};
    return (async () => {
      m("loading"), v.innerHTML = "";
      const x = await Hh(i);
      if (h || !o.current) return;
      if (!x) {
        m("missing");
        const Y = document.createElement("div");
        Y.className = "dsc-empty", Y.innerHTML = `<strong>${i}</strong> did not register.<br/>Tried /local/DSC-HUB.js and /local/dsc-system-map-card.js. Deploy the IIFE bundle or add it as a Lovelace resource, then hard-refresh.`, v.appendChild(Y);
        return;
      }
      const E = document.createElement(i);
      typeof E.setConfig == "function" && E.setConfig({ type: `custom:${i}`, ...b }), r && (E.hass = r), v.appendChild(E), g.current = E, m("ready");
    })(), () => {
      h = !0, g.current = null, v.innerHTML = "";
    };
  }, [i, y]), S.useEffect(() => {
    g.current && r && (g.current.hass = r);
  }, [r]), /* @__PURE__ */ c.jsx(
    "div",
    {
      className: `dsc-legacy-host${f === "missing" ? " dsc-legacy-host--empty" : ""}`,
      ref: o,
      "data-status": f
    }
  );
}
function kr({
  pot: i,
  onSelectPot: u
}) {
  const { state: o, entity: r, callService: f, available: m, tick: g, num: y } = Qe(), v = Ot(), h = mi(i, { state: o, entity: r }), [b, x] = S.useState(h.plantName === "—" ? "" : h.plantName), [E, Y] = S.useState(h.sprout === "—" ? "" : h.sprout), [X, B] = S.useState(h.growthStage === "—" ? "" : h.growthStage), [O, Q] = S.useState(h.notes === "—" ? "" : h.notes), [K, q] = S.useState(null), [te, ie] = S.useState(null);
  S.useEffect(() => {
    x(h.plantName === "—" ? "" : h.plantName), Y(h.sprout === "—" ? "" : h.sprout), B(h.growthStage === "—" ? "" : h.growthStage), Q(h.notes === "—" ? "" : h.notes);
  }, [i, h.plantName, h.sprout, h.growthStage, h.notes]);
  const ue = ya(i, "moisture", o), V = ya(i, "ec", o), se = ya(i, "ph", o), _e = `sensor.dsc_pot${i}_dryback_pct`, Ne = rt(ue), Te = rt(_e), he = qe(ue, { hours: 6, maxPoints: 72 }), w = qe(V, { hours: 6, maxPoints: 72 }), F = y(`number.dsc_pot${i}_want_moisture_min`), P = y(`number.dsc_pot${i}_want_moisture_max`), C = Number.isFinite(F) && Number.isFinite(P) && m(`number.dsc_pot${i}_want_moisture_min`), L = !h.strainDisplay || h.strainDisplay === "—" || /generic/i.test(h.strainDisplay), $ = async (G) => {
    q(null);
    try {
      await f("input_select", "select_option", {
        entity_id: `input_select.dsc_pot${i}_tent`,
        option: G
      }), window.setTimeout(() => {
        o(`input_select.dsc_pot${i}_tent`, "") !== G && q("Tent apply failed — check helper options (clone|main|unassigned).");
      }, 400);
    } catch {
      q("Tent apply failed — check helper options (clone|main|unassigned).");
    }
  }, ee = () => {
    m(`text.dsc_pot${i}_plant_name`) && f("text", "set_value", {
      entity_id: `text.dsc_pot${i}_plant_name`,
      value: b
    });
  }, re = () => {
    const G = `datetime.dsc_pot${i}_sprout_date`;
    if (!m(G) || !E) return;
    const ae = E.length === 10 ? `${E}T00:00:00` : E;
    f("datetime", "set_value", { entity_id: G, datetime: ae });
  }, j = () => {
    const G = `select.dsc_pot${i}_growth_stage`;
    !m(G) || !X || f("select", "select_option", { entity_id: G, option: X });
  }, H = () => {
    if (h.rosterSlot == null) return;
    const G = `input_text.dsc_plant_roster_${h.rosterSlot}_notes`;
    !m(G) && r(G), f("input_text", "set_value", { entity_id: G, value: O });
  }, Z = r(`select.dsc_pot${i}_growth_stage`)?.attributes?.options || [];
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-seat-panel", children: [
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 14 }, children: [
      [1, 2, 3, 4].map((G) => /* @__PURE__ */ c.jsxs(
        "button",
        {
          type: "button",
          className: `dsc-chip${G === i ? " dsc-chip--ok" : ""}`,
          onClick: () => u?.(G),
          children: [
            "P",
            G
          ]
        },
        G
      )),
      /* @__PURE__ */ c.jsx(I, { label: Fs(h.tent), tone: h.tent === "unassigned" ? "muted" : "ok" }),
      h.rosterSlot != null ? /* @__PURE__ */ c.jsx(I, { label: `Roster #${h.rosterSlot}`, tone: "muted" }) : /* @__PURE__ */ c.jsx(I, { label: "No roster join", tone: "warn" }),
      Ne.stale ? /* @__PURE__ */ c.jsx(I, { label: "HELD Got", tone: "warn" }) : null
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-seat-layout", children: [
      /* @__PURE__ */ c.jsxs(ce, { className: "dsc-glass dsc-glass--glow", title: "Medium", children: [
        /* @__PURE__ */ c.jsx(gb, { layers: h.layers }),
        /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { marginTop: 10, fontSize: 12 }, children: h.blend || "Blend lives on roster after commit — not invented here." })
      ] }),
      /* @__PURE__ */ c.jsxs("div", { className: "dsc-grid", style: { gap: 14 }, children: [
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ce, { className: "dsc-glass", title: "Identity", children: /* @__PURE__ */ c.jsxs("div", { className: "dsc-seat-editors", children: [
          /* @__PURE__ */ c.jsxs("label", { children: [
            "Nickname",
            /* @__PURE__ */ c.jsx(
              "input",
              {
                value: b,
                onChange: (G) => x(G.target.value),
                onBlur: ee,
                disabled: !m(`text.dsc_pot${i}_plant_name`)
              }
            )
          ] }),
          /* @__PURE__ */ c.jsxs("label", { children: [
            "Sprout date",
            /* @__PURE__ */ c.jsx(
              "input",
              {
                type: "date",
                value: E.slice(0, 10),
                onChange: (G) => Y(G.target.value),
                onBlur: re,
                disabled: !m(`datetime.dsc_pot${i}_sprout_date`)
              }
            )
          ] }),
          /* @__PURE__ */ c.jsxs("label", { children: [
            "Growth stage",
            /* @__PURE__ */ c.jsxs(
              "select",
              {
                value: X,
                onChange: (G) => {
                  B(G.target.value);
                },
                onBlur: j,
                disabled: !m(`select.dsc_pot${i}_growth_stage`),
                children: [
                  /* @__PURE__ */ c.jsx("option", { value: "", children: "—" }),
                  Z.map((G) => /* @__PURE__ */ c.jsx("option", { value: G, children: G }, G))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ c.jsxs("div", { className: "dsc-chip-row", children: [
            /* @__PURE__ */ c.jsx(I, { label: `Day ${h.days}`, tone: "ok" }),
            /* @__PURE__ */ c.jsx(I, { label: h.stage, tone: "muted" }),
            /* @__PURE__ */ c.jsx(I, { label: h.strainDisplay, tone: "muted" })
          ] }),
          /* @__PURE__ */ c.jsx(
            $s,
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
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsxs(ce, { className: "dsc-glass", title: "Want · Got · Need", children: [
          /* @__PURE__ */ c.jsxs("div", { className: "dsc-chip-row", children: [
            /* @__PURE__ */ c.jsx(
              I,
              {
                label: `Got M ${Ne.stale ? `${Number.isFinite(Ne.value) ? Ne.value.toFixed(0) : "—"}*` : h.moisture}`,
                tone: Ne.stale ? "warn" : "ok"
              }
            ),
            /* @__PURE__ */ c.jsx(I, { label: `EC ${h.ec}`, tone: "muted" }),
            /* @__PURE__ */ c.jsx(I, { label: `pH ${h.ph}`, tone: "muted" }),
            /* @__PURE__ */ c.jsx(
              I,
              {
                label: h.need,
                tone: h.need !== "—" && h.need !== "OK" ? "warn" : "ok"
              }
            )
          ] }),
          C && !L ? /* @__PURE__ */ c.jsxs("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: [
            "Want moisture ",
            F,
            "–",
            P,
            "%"
          ] }) : /* @__PURE__ */ c.jsxs("p", { className: "dsc-honesty", style: { margin: "8px 0 0" }, children: [
            /* @__PURE__ */ c.jsx(I, { label: "No catalog Want", tone: "warn" }),
            " ",
            L ? "Generic / empty strain — Want bands not invented." : "Custom Want helpers missing — Got + Need only."
          ] })
        ] }) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsx(ce, { className: "dsc-glass", title: "Dryback", children: /* @__PURE__ */ c.jsx(
          Pt,
          {
            label: "Dryback",
            value: Te.value,
            min: 0,
            max: 100,
            unit: "%",
            stale: Te.stale,
            band: { min: 0, max: 45 },
            onClick: () => ie({ id: _e, label: "Dryback", unit: "%" })
          }
        ) }) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsxs(ce, { className: "dsc-glass", title: "Got history", children: [
          /* @__PURE__ */ c.jsx(
            Vt,
            {
              live: !0,
              lastSyncAt: Math.max(he.lastSyncAt ?? 0, w.lastSyncAt ?? 0) || void 0,
              series: [
                {
                  id: "m",
                  label: "Moisture",
                  series: he.series,
                  color: "var(--dsc-blue)",
                  axis: "left",
                  unit: "%"
                },
                {
                  id: "ec",
                  label: "EC",
                  series: w.series,
                  color: "var(--dsc-amber)",
                  axis: "right",
                  unit: ""
                }
              ]
            }
          ),
          /* @__PURE__ */ c.jsxs("div", { className: "dsc-chip-row", style: { marginTop: 8 }, children: [
            /* @__PURE__ */ c.jsx(Be, { onClick: () => ie({ id: ue, label: "Moisture", unit: "%" }), children: "Moisture hist" }),
            /* @__PURE__ */ c.jsx(Be, { onClick: () => ie({ id: V, label: "EC", unit: "" }), children: "EC hist" }),
            /* @__PURE__ */ c.jsx(Be, { onClick: () => ie({ id: se, label: "pH", unit: "" }), children: "pH hist" })
          ] })
        ] }) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsxs(ce, { className: "dsc-glass", title: "Nutrition", children: [
          /* @__PURE__ */ c.jsx("p", { style: { margin: "0 0 6px" }, children: h.recipe || "No roster recipe — catalog doses only, never invented." }),
          /* @__PURE__ */ c.jsxs("label", { className: "dsc-seat-editors", children: [
            "Roster notes",
            /* @__PURE__ */ c.jsx(
              "textarea",
              {
                rows: 3,
                value: O,
                onChange: (G) => Q(G.target.value),
                onBlur: H,
                disabled: h.rosterSlot == null
              }
            )
          ] }),
          /* @__PURE__ */ c.jsx("div", { style: { marginTop: 10 }, children: /* @__PURE__ */ c.jsx(ri, { to: "/grow/compose", children: /* @__PURE__ */ c.jsx(Be, { teal: !0, children: "Mix in Compose" }) }) })
        ] }) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsxs(ce, { className: "dsc-glass", title: "Live Got chips", children: [
          /* @__PURE__ */ c.jsxs("div", { className: "dsc-chip-row", children: [
            /* @__PURE__ */ c.jsx(I, { label: `M ${h.moisture}`, tone: "muted" }),
            /* @__PURE__ */ c.jsx(I, { label: `T ${h.soilTemp}`, tone: "muted" }),
            /* @__PURE__ */ c.jsx(I, { label: `EC ${h.ec}`, tone: "muted" }),
            /* @__PURE__ */ c.jsx(I, { label: `pH ${h.ph}`, tone: "muted" }),
            /* @__PURE__ */ c.jsx(I, { label: `N ${h.n}`, tone: "muted" }),
            /* @__PURE__ */ c.jsx(I, { label: `P ${h.p}`, tone: "muted" }),
            /* @__PURE__ */ c.jsx(I, { label: `K ${h.k}`, tone: "muted" })
          ] }),
          /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: "NPK = trend indicators. Unavailable stays —. Held shows last good on blip." })
        ] }) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsxs(ce, { className: "dsc-glass", title: "Apply to tent", children: [
          /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "Digital-twin placement. Moves the plant on Twin; does not rewrite climate Want." }),
          /* @__PURE__ */ c.jsxs("div", { className: "dsc-seat-actions", children: [
            /* @__PURE__ */ c.jsx(Be, { primary: h.tent === "clone", onClick: () => void $("clone"), children: "Clone 2×4" }),
            /* @__PURE__ */ c.jsx(Be, { primary: h.tent === "main", onClick: () => void $("main"), children: "Main 4×8" }),
            /* @__PURE__ */ c.jsx(Be, { onClick: () => void $("unassigned"), children: "Unassigned" }),
            /* @__PURE__ */ c.jsx(ri, { to: "/live/twin", children: /* @__PURE__ */ c.jsx(Be, { children: "Open Twin" }) })
          ] }),
          K ? /* @__PURE__ */ c.jsxs("p", { className: "dsc-honesty", children: [
            /* @__PURE__ */ c.jsx(I, { label: "Tent apply failed", tone: "bad" }),
            " ",
            K
          ] }) : null
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ c.jsx(
      Ur,
      {
        open: te != null,
        onClose: () => ie(null),
        entityId: te?.id ?? null,
        label: te?.label ?? "",
        unit: te?.unit
      }
    )
  ] });
}
function Hb() {
  const i = Ot();
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      $t,
      {
        icon: "compose",
        title: "Compose",
        subtitle: "Build soil blend, roster commit, and Want handoff.",
        primaryAction: /* @__PURE__ */ c.jsx(Be, { teal: !0, onClick: () => i("/grow/roster"), children: "Open Roster" })
      }
    ),
    /* @__PURE__ */ c.jsx(Ws, { tag: "dsc-build-plant-card", config: {} })
  ] });
}
function Ub() {
  const i = Ot();
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      $t,
      {
        icon: "research",
        title: "Research",
        subtitle: "Catalog browser over /local/dsc-catalog indexes.",
        actions: /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsx(Be, { primary: !0, onClick: () => i("/grow/compose"), children: "Use in Compose" }),
          /* @__PURE__ */ c.jsx(Be, { teal: !0, onClick: () => i("/grow/roster"), children: "Open Seat" })
        ] })
      }
    ),
    /* @__PURE__ */ c.jsx(Ws, { tag: "dsc-catalog-browse-card", config: {} })
  ] });
}
function kb() {
  const { entity: i, state: u, tick: o } = Qe(), [r, f] = Vs(), m = wb(i), g = Number(r.get("pot") || 0), y = g >= 1 && g <= 4 ? g : null, v = (b) => {
    const x = new URLSearchParams(r);
    x.set("pot", String(b)), f(x, { replace: !0 });
  }, h = () => {
    const b = new URLSearchParams(r);
    b.delete("pot"), f(b, { replace: !0 });
  };
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      $t,
      {
        icon: "roster",
        title: "Roster",
        subtitle: "Seats — open a row for Plant Seat drawer. Nutrient mix lives in Compose.",
        primaryAction: /* @__PURE__ */ c.jsx(ri, { to: "/grow/compose", children: /* @__PURE__ */ c.jsx(Be, { primary: !0, children: "Use in Compose" }) })
      }
    ),
    /* @__PURE__ */ c.jsx(ce, { className: "dsc-glass", title: "Roster", icon: "roster", children: m.length ? /* @__PURE__ */ c.jsxs("table", { className: "dsc-table", children: [
      /* @__PURE__ */ c.jsx("thead", { children: /* @__PURE__ */ c.jsxs("tr", { children: [
        /* @__PURE__ */ c.jsx("th", { children: "Slot" }),
        /* @__PURE__ */ c.jsx("th", { children: "Name" }),
        /* @__PURE__ */ c.jsx("th", { children: "Strain" }),
        /* @__PURE__ */ c.jsx("th", { children: "Status" }),
        /* @__PURE__ */ c.jsx("th", { children: "Pot" }),
        /* @__PURE__ */ c.jsx("th", { children: "Tent" })
      ] }) }),
      /* @__PURE__ */ c.jsx("tbody", { children: m.map((b) => {
        const x = Number(b.pot), E = x >= 1 && x <= 4 ? Fs(Gh(u, x)) : "—";
        return /* @__PURE__ */ c.jsxs(
          "tr",
          {
            onClick: () => {
              x >= 1 && x <= 4 && v(x);
            },
            style: x >= 1 && x <= 4 ? { cursor: "pointer" } : void 0,
            children: [
              /* @__PURE__ */ c.jsxs("td", { children: [
                "#",
                b.slot
              ] }),
              /* @__PURE__ */ c.jsx("td", { children: b.nickname || "—" }),
              /* @__PURE__ */ c.jsx("td", { children: b.strain || "—" }),
              /* @__PURE__ */ c.jsx("td", { children: b.status || "—" }),
              /* @__PURE__ */ c.jsx("td", { children: x >= 1 && x <= 4 ? `P${x}` : "—" }),
              /* @__PURE__ */ c.jsx("td", { children: /* @__PURE__ */ c.jsx(I, { label: E, tone: "muted" }) })
            ]
          },
          b.slot
        );
      }) })
    ] }) : /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "No plants in roster yet. Commit from Compose, then assign a pot." }) }),
    /* @__PURE__ */ c.jsx(
      fi,
      {
        open: y != null,
        onClose: h,
        title: y != null ? `Plant seat · POT${y}` : "Plant seat",
        children: y != null ? /* @__PURE__ */ c.jsx(kr, { pot: y, onSelectPot: v }) : null
      }
    )
  ] });
}
function Je(i, u = 1) {
  return Number.isFinite(i) ? i.toFixed(u) : "—";
}
const Lb = [
  { id: "main", label: "Main" },
  { id: "clone", label: "Clone" },
  { id: "compare", label: "Compare" }
];
function Bb() {
  const i = Ot();
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page dsc-page--twin-chrome", children: [
    /* @__PURE__ */ c.jsx(
      $t,
      {
        icon: "twin",
        title: "Twin",
        subtitle: "Cinematic digital twin — pick a pot to open Root seat.",
        primaryAction: /* @__PURE__ */ c.jsx(Be, { teal: !0, onClick: () => i("/live/climate"), children: "Set Climate Want" }),
        actions: /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsx(Be, { onClick: () => i("/live/main"), children: "Main cockpit" }),
          /* @__PURE__ */ c.jsx(Be, { onClick: () => i("/live/clone"), children: "Clone cockpit" })
        ] })
      }
    ),
    /* @__PURE__ */ c.jsx("p", { className: "dsc-honesty dsc-muted", style: { marginTop: 0 }, children: "Pick a pot in the twin to open its seat. Twin stays warm across tabs (keep-alive)." })
  ] });
}
function qb() {
  const { num: i, state: u, entity: o, available: r } = Qe(), f = Ot(), { focus: m, setFocus: g } = kh(), { hours: y, setHours: v, maxPoints: h } = Ks(6), [b, x] = S.useState(null), E = u("switch.dsc_hub_tent_manual_override") === "on", Y = u("switch.dsc_hub_tent_full_auto_mode") === "on", X = String(o("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? ""), B = rt("sensor.dsc_hub_tent_temperature"), O = rt("sensor.dsc_hub_tent_humidity"), Q = rt("sensor.dsc_hub_clone_temperature"), K = rt("sensor.dsc_hub_clone_humidity"), q = rt("sensor.dsc_hub_vpd_kpa"), te = qe("sensor.dsc_hub_tent_temperature", { hours: y, maxPoints: h }), ie = qe("sensor.dsc_hub_tent_humidity", { hours: y, maxPoints: h }), ue = qe("sensor.dsc_hub_clone_temperature", { hours: y, maxPoints: h }), V = qe("sensor.dsc_hub_clone_humidity", { hours: y, maxPoints: h }), se = r("sensor.dsc_cfm_exhaust_out_allocated") ? "sensor.dsc_cfm_exhaust_out_allocated" : "sensor.dsc_cfm_exhaust_out", _e = r("sensor.dsc_cfm_exhaust_recirc_allocated") ? "sensor.dsc_cfm_exhaust_recirc_allocated" : "sensor.dsc_cfm_exhaust_recirc", Ne = qe(se, { hours: y, maxPoints: h }), Te = qe(_e, { hours: y, maxPoints: h }), he = qe("sensor.dsc_fan_exhaust_outside_pct", { hours: y, maxPoints: h }), w = qe("sensor.dsc_fan_exhaust_room_pct", { hours: y, maxPoints: h }), F = i("sensor.dsc_cfm_exhaust_out"), P = i(se), C = i("sensor.dsc_cfm_exhaust_recirc"), L = i(_e), $ = i("number.dsc_hub_target_temp"), ee = i("number.dsc_hub_rh_target_min"), re = i("number.dsc_hub_rh_target_max"), j = i("number.dsc_hub_vpd_target_min"), H = i("number.dsc_hub_vpd_target_max"), Z = i("number.dsc_hub_clone_target_temp"), G = i("number.dsc_hub_clone_rh_min"), ae = i("number.dsc_hub_clone_rh_max"), de = i("number.dsc_hub_clone_vpd_min"), pe = i("number.dsc_hub_clone_vpd_max"), et = S.useMemo(() => Ys(te.series), [te.series]), we = S.useMemo(() => Ys(ie.series), [ie.series]), Dt = m === "main" || m === "compare" || m === "room", Kt = m === "clone" || m === "compare";
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      $t,
      {
        icon: "climate",
        title: "Climate",
        subtitle: "Command, Want targets, zone traces, VPD, airflow honesty.",
        actions: /* @__PURE__ */ c.jsx(
          $s,
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
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 14 }, role: "group", "aria-label": "Tent focus", children: [
      Lb.map((Ht) => /* @__PURE__ */ c.jsx(
        "button",
        {
          type: "button",
          className: `dsc-chip${m === Ht.id ? " dsc-chip--ok" : ""}`,
          onClick: () => g(Ht.id),
          children: Ht.label
        },
        Ht.id
      )),
      /* @__PURE__ */ c.jsx(Js, { hours: y, setHours: v }),
      /* @__PURE__ */ c.jsx(Be, { teal: !0, onClick: () => f("/fleet"), children: "Kit / Fleet" })
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsxs(ce, { className: "dsc-glass", title: "Command", icon: "climate", children: [
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-mode-row", children: [
          /* @__PURE__ */ c.jsx(Ue, { entityId: "switch.dsc_hub_tent_full_auto_mode", label: "Full Auto", icon: "ok" }),
          /* @__PURE__ */ c.jsx(Ue, { entityId: "switch.dsc_hub_manual_takeover", label: "Master takeover", icon: "alert" }),
          /* @__PURE__ */ c.jsx(Ue, { entityId: "switch.dsc_hub_tent_manual_override", label: "Fan override", icon: "climate" }),
          /* @__PURE__ */ c.jsx(
            Ue,
            {
              entityId: "switch.dsc_hub_humidifier_intake_routing",
              label: "Hum intake routing",
              icon: "climate"
            }
          ),
          /* @__PURE__ */ c.jsx(
            Ue,
            {
              entityId: "switch.dsc_hub_recirc_de_strat_pulse",
              label: "RECIRC de-strat",
              icon: "climate"
            }
          )
        ] }),
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-mode-selects", children: [
          /* @__PURE__ */ c.jsx(qs, { entityId: "select.dsc_hub_control_strategy", label: "Strategy", icon: "climate" }),
          /* @__PURE__ */ c.jsx(qs, { entityId: "select.dsc_hub_priority_tent", label: "Priority tent", icon: "tent" })
        ] }),
        Y ? /* @__PURE__ */ c.jsxs("p", { className: "dsc-honesty", children: [
          /* @__PURE__ */ c.jsx(
            I,
            {
              icon: "alert",
              label: u("binary_sensor.dsc_reduced_kit") === "on" ? "Reduced kit" : "Full Auto",
              tone: u("binary_sensor.dsc_reduced_kit") === "on" ? "warn" : "ok"
            }
          ),
          " ",
          X || "Hub owns fans + appliance Autos when Full Auto is on."
        ] }) : null
      ] }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ce, { className: "dsc-glass", title: "Targets", icon: "gauge", children: /* @__PURE__ */ c.jsx(Lh, { emphasize: m === "clone" ? "clone" : "main" }) }) }),
      Dt ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(
          Xe,
          {
            label: "Tent °C",
            value: Je(B.value),
            unit: "°C",
            stale: B.stale,
            onClick: () => x({ id: "sensor.dsc_hub_tent_temperature", label: "Tent T", unit: "°C" })
          }
        ) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(
          Xe,
          {
            label: "Tent RH",
            value: Je(O.value, 0),
            unit: "%",
            stale: O.stale,
            onClick: () => x({ id: "sensor.dsc_hub_tent_humidity", label: "Tent RH", unit: "%" })
          }
        ) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(
          Xe,
          {
            label: "VPD",
            value: Je(q.value, 2),
            unit: "kPa",
            stale: q.stale,
            onClick: () => x({ id: "sensor.dsc_hub_vpd_kpa", label: "VPD", unit: "kPa" })
          }
        ) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(Xe, { label: "Room °C", value: Je(i("sensor.dsc_hub_room_temperature")), unit: "°C" }) })
      ] }) : null,
      Kt ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(
          Xe,
          {
            label: "Clone °C",
            value: Je(Q.value),
            unit: "°C",
            stale: Q.stale
          }
        ) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(
          Xe,
          {
            label: "Clone RH",
            value: Je(K.value, 0),
            unit: "%",
            stale: K.stale
          }
        ) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(Xe, { label: "Clone VPD", value: Je(i("sensor.dsc_hub_clone_vpd_kpa"), 2), unit: "kPa" }) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(Xe, { label: "Room °C", value: Je(i("sensor.dsc_hub_room_temperature")), unit: "°C" }) })
      ] }) : null,
      Dt ? /* @__PURE__ */ c.jsx("div", { className: Kt ? "dsc-col-6" : "dsc-col-12", children: /* @__PURE__ */ c.jsx(ce, { className: "dsc-glass", title: "Main tent T + RH", icon: "tent", children: /* @__PURE__ */ c.jsx(
        Vt,
        {
          lastSyncAt: Math.max(te.lastSyncAt ?? 0, ie.lastSyncAt ?? 0) || void 0,
          series: [
            {
              id: "t",
              label: "Temp °C",
              series: te.series,
              color: "var(--dsc-blue)",
              axis: "left",
              unit: "°C"
            },
            {
              id: "rh",
              label: "RH %",
              series: ie.series,
              color: "var(--dsc-teal)",
              axis: "right",
              unit: "%"
            }
          ],
          targets: [
            { axis: "left", value: $, color: "var(--dsc-amber)", label: "Want T" },
            { axis: "right", min: ee, max: re, color: "var(--dsc-teal)" }
          ]
        }
      ) }) }) : null,
      Kt ? /* @__PURE__ */ c.jsx("div", { className: Dt ? "dsc-col-6" : "dsc-col-12", children: /* @__PURE__ */ c.jsx(ce, { className: "dsc-glass", title: "Clone tent T + RH", icon: "clone", children: /* @__PURE__ */ c.jsx(
        Vt,
        {
          lastSyncAt: Math.max(ue.lastSyncAt ?? 0, V.lastSyncAt ?? 0) || void 0,
          series: [
            {
              id: "t",
              label: "Temp °C",
              series: ue.series,
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
            {
              axis: "left",
              value: Z,
              color: "var(--dsc-amber)",
              label: "Want T"
            },
            { axis: "right", min: G, max: ae, color: "var(--dsc-teal)" }
          ]
        }
      ) }) }) : null,
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(
        Xe,
        {
          label: "CFM OUT",
          value: Je(P, 0),
          unit: "cfm",
          sub: `Alloc · nameplate ${Je(F, 0)}`
        }
      ) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(
        Xe,
        {
          label: "CFM RECIRC",
          value: Je(L, 0),
          unit: "cfm",
          sub: `Alloc · nameplate ${Je(C, 0)}`
        }
      ) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(Xe, { label: "Intake main", value: Je(i("sensor.dsc_cfm_intake_main"), 0), unit: "cfm" }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(Xe, { label: "Intake 2×4", value: Je(i("sensor.dsc_cfm_intake_2x4"), 0), unit: "cfm" }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsxs(ce, { className: "dsc-glass", title: "Airflow honesty", icon: "climate", children: [
        /* @__PURE__ */ c.jsxs("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: [
          /* @__PURE__ */ c.jsx(I, { label: "Allocated", tone: "ok" }),
          " Prefer allocated CFM over nameplate capacity. Blend OUT/RECIRC is normal — map shows topology."
        ] }),
        /* @__PURE__ */ c.jsx(Ws, { tag: "dsc-airflow-map-card", config: {} })
      ] }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsx(ce, { className: "dsc-glass", title: "Exhaust CFM (allocated)", icon: "climate", children: /* @__PURE__ */ c.jsx(
        Vt,
        {
          unit: "cfm",
          lastSyncAt: Math.max(Ne.lastSyncAt ?? 0, Te.lastSyncAt ?? 0) || void 0,
          series: [
            {
              id: "out",
              label: "OUT",
              series: Ne.series,
              color: "var(--dsc-blue)",
              unit: "cfm"
            },
            {
              id: "recirc",
              label: "RECIRC",
              series: Te.series,
              color: "var(--dsc-purple)",
              unit: "cfm"
            }
          ]
        }
      ) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsxs(ce, { className: "dsc-glass", title: "Fan duty %", icon: "climate", children: [
        /* @__PURE__ */ c.jsx(
          Vt,
          {
            unit: "%",
            lastSyncAt: Math.max(he.lastSyncAt ?? 0, w.lastSyncAt ?? 0) || void 0,
            series: [
              {
                id: "fout",
                label: "OUT %",
                series: he.series,
                color: "var(--dsc-teal)",
                unit: "%"
              },
              {
                id: "frec",
                label: "RECIRC %",
                series: w.series,
                color: "var(--dsc-amber)",
                unit: "%"
              }
            ]
          }
        ),
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-fan-stack", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ c.jsx(
            Wl,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_main",
              label: "Intake Main",
              disabled: !E
            }
          ),
          /* @__PURE__ */ c.jsx(
            Wl,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_2x4",
              label: "Intake 2×4",
              disabled: !E
            }
          ),
          /* @__PURE__ */ c.jsx(
            Wl,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_room",
              label: "Exhaust room",
              disabled: !E
            }
          ),
          /* @__PURE__ */ c.jsx(
            Wl,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_outside",
              label: "Exhaust outside",
              disabled: !E
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ce, { className: "dsc-glass", title: "Zone gauges", icon: "gauge", children: /* @__PURE__ */ c.jsxs("div", { className: "dsc-gauge-row", children: [
        Dt ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsx(
            Pt,
            {
              label: "Tent T",
              value: B.value,
              min: 15,
              max: 35,
              unit: "°C",
              target: $,
              extrema: et,
              stale: B.stale,
              onClick: () => x({
                id: "sensor.dsc_hub_tent_temperature",
                label: "Tent T",
                unit: "°C"
              })
            }
          ),
          /* @__PURE__ */ c.jsx(
            Pt,
            {
              label: "Tent RH",
              value: O.value,
              min: 0,
              max: 100,
              unit: "%",
              band: { min: ee, max: re },
              extrema: we,
              stale: O.stale
            }
          ),
          /* @__PURE__ */ c.jsx(
            Pt,
            {
              label: "VPD",
              value: q.value,
              min: 0,
              max: 2.5,
              unit: "kPa",
              band: { min: j, max: H },
              stale: q.stale
            }
          )
        ] }) : null,
        Kt ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsx(
            Pt,
            {
              label: "Clone T",
              value: Q.value,
              min: 15,
              max: 35,
              unit: "°C",
              target: Z,
              stale: Q.stale
            }
          ),
          /* @__PURE__ */ c.jsx(
            Pt,
            {
              label: "Clone RH",
              value: K.value,
              min: 0,
              max: 100,
              unit: "%",
              band: { min: G, max: ae },
              stale: K.stale
            }
          ),
          /* @__PURE__ */ c.jsx(
            Pt,
            {
              label: "Clone VPD",
              value: i("sensor.dsc_hub_clone_vpd_kpa"),
              min: 0,
              max: 2.5,
              unit: "kPa",
              band: { min: de, max: pe }
            }
          )
        ] }) : null
      ] }) }) })
    ] }),
    /* @__PURE__ */ c.jsx(
      Ur,
      {
        open: b != null,
        onClose: () => x(null),
        entityId: b?.id ?? null,
        label: b?.label ?? "",
        unit: b?.unit
      }
    )
  ] });
}
function Xh({ tent: i }) {
  const { state: u, entity: o, num: r, tick: f, callWS: m } = Qe(), g = Ot(), { setFocus: y } = kh(), [v, h] = Vs(), [b, x] = S.useState([]);
  S.useEffect(() => {
    y(i);
  }, [i, y]);
  const E = zb(i, u, o), Y = Number(v.get("pot") || 0), X = Y >= 1 && Y <= 4 ? Y : null, B = i === "main" ? "sensor.dsc_hub_tent_temperature" : "sensor.dsc_hub_clone_temperature", O = i === "main" ? "sensor.dsc_hub_tent_humidity" : "sensor.dsc_hub_clone_humidity", Q = qe(B, { hours: 6 }), K = qe(O, { hours: 6 }), q = rt(B), te = rt(O);
  S.useEffect(() => {
    let V = !1;
    async function se() {
      if (!m || E.length === 0) {
        x([]);
        return;
      }
      const _e = E.flatMap((he) => [
        `text.dsc_pot${he.pot}_plant_name`,
        `input_select.dsc_pot${he.pot}_tent`,
        `select.dsc_pot${he.pot}_growth_stage`
      ]), Ne = /* @__PURE__ */ new Date(), Te = new Date(Ne.getTime() - 48 * 3600 * 1e3);
      try {
        const he = await m({
          type: "history/history_during_period",
          start_time: Te.toISOString(),
          end_time: Ne.toISOString(),
          significant_changes_only: !0,
          minimal_response: !0,
          no_attributes: !0,
          entity_ids: _e.slice(0, 8)
        });
        if (V || !he) return;
        const w = [];
        for (const [F, P] of Object.entries(he))
          for (const C of P || []) {
            const L = typeof C.lu == "number" ? C.lu * 1e3 : C.last_changed ? Date.parse(C.last_changed) : NaN, $ = String(C.s ?? C.state ?? "");
            !Number.isFinite(L) || !$ || $ === "unavailable" || w.push({ t: L, text: `${new Date(L).toLocaleString()} · ${F.split(".").pop()} → ${$}` });
          }
        w.sort((F, P) => P.t - F.t), x(w.slice(0, 40).map((F) => F.text));
      } catch {
        V || x([]);
      }
    }
    return se(), () => {
      V = !0;
    };
  }, [m, E, i]);
  const ie = i === "main" ? "Main 4×8" : "Clone 2×4", ue = i === "main" ? "Intake main + cascade in · OUT / RECIRC" : "Intake 2×4 + cascade out · clone mister path";
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      $t,
      {
        icon: i === "main" ? "tent" : "clone",
        title: ie,
        subtitle: `Tent cockpit — ${E.length} seat(s). ${ue}`,
        primaryAction: /* @__PURE__ */ c.jsx(Be, { teal: !0, onClick: () => g("/live/twin"), children: "Focus Twin" }),
        actions: /* @__PURE__ */ c.jsx(Be, { primary: !0, onClick: () => g(`/live/climate?tent=${i}`), children: "Climate Want" })
      }
    ),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-tent-cockpit-strip", children: [
      /* @__PURE__ */ c.jsx(I, { label: `${E.length} plants`, tone: "ok" }),
      /* @__PURE__ */ c.jsx(
        I,
        {
          label: `T ${Je(q.value)}°C`,
          tone: q.stale ? "warn" : "ok"
        }
      ),
      /* @__PURE__ */ c.jsx(
        I,
        {
          label: `RH ${Je(te.value, 0)}%`,
          tone: te.stale ? "warn" : "ok"
        }
      ),
      /* @__PURE__ */ c.jsx(
        I,
        {
          label: `CFM OUT ${Je(r("sensor.dsc_cfm_exhaust_out_allocated") || r("sensor.dsc_cfm_exhaust_out"), 0)}`,
          tone: "muted"
        }
      )
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ce, { className: "dsc-glass", title: "Seat strip", icon: "seat", children: /* @__PURE__ */ c.jsx("div", { className: "dsc-chip-row", children: E.length === 0 ? /* @__PURE__ */ c.jsx("div", { className: "dsc-empty", children: "No pots assigned — Apply to tent from a seat." }) : E.map((V) => /* @__PURE__ */ c.jsxs(
        "button",
        {
          type: "button",
          className: "dsc-chip dsc-chip--ok",
          onClick: () => {
            const se = new URLSearchParams(v);
            se.set("pot", String(V.pot)), h(se, { replace: !0 });
          },
          children: [
            "P",
            V.pot,
            " ",
            V.plantName,
            " · M ",
            V.moisture,
            " · EC ",
            V.ec
          ]
        },
        V.pot
      )) }) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ce, { className: "dsc-glass", title: "Tent history", icon: "climate", children: /* @__PURE__ */ c.jsx(
        Vt,
        {
          live: !0,
          lastSyncAt: Math.max(Q.lastSyncAt ?? 0, K.lastSyncAt ?? 0) || void 0,
          series: [
            {
              id: "t",
              label: "Temp",
              series: Q.series,
              color: "var(--dsc-blue)",
              axis: "left",
              unit: "°C"
            },
            {
              id: "rh",
              label: "RH",
              series: K.series,
              color: "var(--dsc-teal)",
              axis: "right",
              unit: "%"
            }
          ]
        }
      ) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ce, { className: "dsc-glass", title: "Plant log (48h)", icon: "roster", children: b.length === 0 ? /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: "Thin recorder / no recent identity changes — honesty empty, not invented." }) : /* @__PURE__ */ c.jsx("ul", { className: "dsc-fault-list", children: b.map((V) => /* @__PURE__ */ c.jsx("li", { children: /* @__PURE__ */ c.jsx("span", { className: "dsc-muted", style: { fontFamily: "var(--dsc-mono)", fontSize: 12 }, children: V }) }, V)) }) }) })
    ] }),
    /* @__PURE__ */ c.jsx(
      fi,
      {
        open: X != null,
        onClose: () => {
          const V = new URLSearchParams(v);
          V.delete("pot"), h(V, { replace: !0 });
        },
        title: X != null ? `Plant seat · POT${X}` : "Plant seat",
        children: X != null ? /* @__PURE__ */ c.jsx(
          kr,
          {
            pot: X,
            onSelectPot: (V) => {
              const se = new URLSearchParams(v);
              se.set("pot", String(V)), h(se, { replace: !0 });
            }
          }
        ) : null
      }
    )
  ] });
}
function Yb() {
  return /* @__PURE__ */ c.jsx(Xh, { tent: "main" });
}
function Gb() {
  return /* @__PURE__ */ c.jsx(Xh, { tent: "clone" });
}
function Xb() {
  const { state: i, entity: u, tick: o, num: r } = Qe(), [f, m] = Vs(), g = [1, 2, 3, 4].map((x) => mi(x, { state: i, entity: u })), y = Number(f.get("pot") || 0), v = y >= 1 && y <= 4 ? y : null, h = (x) => {
    const E = new URLSearchParams(f);
    E.set("pot", String(x)), m(E, { replace: !0 });
  }, b = () => {
    const x = new URLSearchParams(f);
    x.delete("pot"), m(x, { replace: !0 });
  };
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      $t,
      {
        icon: "root",
        title: "Root",
        subtitle: "Fleet glance — dryback / nutrition / Need. Click a row for seat + history."
      }
    ),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ c.jsx(Xe, { label: "Coldest root", value: Je(r("sensor.dsc_coldest_root_zone_temp")), unit: "°C" }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ c.jsx(Xe, { label: "Heat mat on time", value: Je(r("sensor.dsc_heatmat_relay_on_time"), 0), unit: "s" }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ c.jsx(ce, { title: "Notes", children: /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: "Mat loop uses per-pot sense with plausibility filter." }) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ce, { className: "dsc-glass", title: "Dryback strip", icon: "gauge", children: /* @__PURE__ */ c.jsx("div", { className: "dsc-gauge-row", children: [1, 2, 3, 4].map((x) => /* @__PURE__ */ c.jsx(Qb, { pot: x, onOpen: () => h(x) }, x)) }) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ce, { className: "dsc-glass dsc-root-matrix", title: "Fleet matrix", icon: "root", children: /* @__PURE__ */ c.jsxs("table", { className: "dsc-table", children: [
        /* @__PURE__ */ c.jsx("thead", { children: /* @__PURE__ */ c.jsxs("tr", { children: [
          /* @__PURE__ */ c.jsx("th", { children: "Pot" }),
          /* @__PURE__ */ c.jsx("th", { children: "Name" }),
          /* @__PURE__ */ c.jsx("th", { children: "Tent" }),
          /* @__PURE__ */ c.jsx("th", { children: "M%" }),
          /* @__PURE__ */ c.jsx("th", { children: "Dryback" }),
          /* @__PURE__ */ c.jsx("th", { children: "EC" }),
          /* @__PURE__ */ c.jsx("th", { children: "pH" }),
          /* @__PURE__ */ c.jsx("th", { children: "Need" }),
          /* @__PURE__ */ c.jsx("th", { children: "Trend" })
        ] }) }),
        /* @__PURE__ */ c.jsx("tbody", { children: g.map((x) => /* @__PURE__ */ c.jsx(Zb, { pot: x.pot, onOpen: () => h(x.pot) }, x.pot)) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ c.jsx(
      fi,
      {
        open: v != null,
        onClose: b,
        title: v != null ? `Plant seat · POT${v}` : "Plant seat",
        children: v != null ? /* @__PURE__ */ c.jsx(kr, { pot: v, onSelectPot: h }) : null
      }
    )
  ] });
}
function Qb({ pot: i, onOpen: u }) {
  const o = rt(`sensor.dsc_pot${i}_dryback_pct`);
  return /* @__PURE__ */ c.jsx(
    Pt,
    {
      label: `P${i}`,
      value: o.value,
      min: 0,
      max: 100,
      unit: "%",
      stale: o.stale,
      band: { min: 0, max: 45 },
      onClick: u
    }
  );
}
function Zb({ pot: i, onOpen: u }) {
  const { state: o, entity: r } = Qe(), f = mi(i, { state: o, entity: r }), m = ya(i, "moisture", o), g = qe(m, { hours: 6, maxPoints: 48 }), y = rt(`sensor.dsc_pot${i}_dryback_pct`), v = y.stale ? "dsc-tone-stale" : Number.isFinite(y.value) && y.value > 55 ? "dsc-tone-bad" : Number.isFinite(y.value) && y.value > 40 ? "dsc-tone-warn" : "dsc-tone-ok";
  return /* @__PURE__ */ c.jsxs("tr", { onClick: u, style: { cursor: "pointer" }, children: [
    /* @__PURE__ */ c.jsxs("td", { children: [
      "P",
      i
    ] }),
    /* @__PURE__ */ c.jsx("td", { children: f.plantName }),
    /* @__PURE__ */ c.jsx("td", { children: /* @__PURE__ */ c.jsx(I, { label: Fs(f.tent), tone: f.tent === "unassigned" ? "muted" : "ok" }) }),
    /* @__PURE__ */ c.jsx("td", { children: f.moisture }),
    /* @__PURE__ */ c.jsx("td", { className: v, children: Je(y.value, 0) }),
    /* @__PURE__ */ c.jsx("td", { children: f.ec }),
    /* @__PURE__ */ c.jsx("td", { children: f.ph }),
    /* @__PURE__ */ c.jsx("td", { children: f.need }),
    /* @__PURE__ */ c.jsx("td", { children: /* @__PURE__ */ c.jsx(ks, { series: g.series, color: "var(--dsc-blue)", width: 90, height: 24 }) })
  ] });
}
function Vb() {
  const { state: i, num: u } = Qe(), o = Ot(), r = i("binary_sensor.dsc_clone_dark_period_violation") === "on", f = i("light.dsc_hub_sf1000_dimmer") === "on";
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      $t,
      {
        icon: "lighting",
        title: "Light",
        subtitle: "Photoperiod, SF1000, expected hours — Want stays on Climate.",
        primaryAction: /* @__PURE__ */ c.jsx(Be, { teal: !0, onClick: () => o("/live/climate"), children: "Climate Want" })
      }
    ),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-status-strip", children: [
      /* @__PURE__ */ c.jsx(
        I,
        {
          icon: r ? "alert" : "ok",
          label: r ? "CLONE DARK VIOLATION" : "Dark period OK",
          tone: r ? "bad" : "ok",
          pulse: r
        }
      ),
      /* @__PURE__ */ c.jsx(I, { label: f ? "SF1000 ON" : "SF1000 OFF", tone: f ? "ok" : "muted" })
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ c.jsx(
        Xe,
        {
          label: "Expected light hours",
          value: Je(u("sensor.dsc_expected_light_hours"), 1),
          unit: "h"
        }
      ) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-8", children: /* @__PURE__ */ c.jsxs(ce, { className: "dsc-glass", title: "SF1000", icon: "lighting", children: [
        /* @__PURE__ */ c.jsx("div", { className: "dsc-demand-row", children: /* @__PURE__ */ c.jsx(
          Ue,
          {
            entityId: "light.dsc_hub_sf1000_dimmer",
            label: "SF1000",
            icon: "lighting",
            showBrightness: !0
          }
        ) }),
        /* @__PURE__ */ c.jsxs("p", { className: "dsc-muted", style: { margin: "8px 0 0" }, children: [
          "Expected: ",
          i("sensor.dsc_expected_light_hours", "—"),
          ". Clone dark violation is binary — schedule edits belong on Climate / packages, not invented here."
        ] })
      ] }) })
    ] })
  ] });
}
function nn(i, u = 1) {
  return Number.isFinite(i) ? i.toFixed(u) : "—";
}
function $b() {
  const { state: i, num: u, available: o, entity: r } = Qe(), f = o("sensor.dsc_cfm_exhaust_out_allocated") ? u("sensor.dsc_cfm_exhaust_out_allocated") : u("sensor.dsc_cfm_exhaust_out"), m = o("sensor.dsc_cfm_exhaust_recirc_allocated") ? u("sensor.dsc_cfm_exhaust_recirc_allocated") : u("sensor.dsc_cfm_exhaust_recirc"), g = i("sensor.dsc_learn_status", "—"), y = i("binary_sensor.dsc_learn_gate", i("sensor.dsc_learn_gate", "—")), v = String(r("sensor.dsc_cfm_exhaust_out")?.attributes?.cal_curve ?? "");
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      $t,
      {
        icon: "learning",
        title: "Learning",
        subtitle: "Learn status, CFM honesty, kit — wizard math stays in Lovelace/brain."
      }
    ),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(
        Xe,
        {
          label: "CFM OUT alloc",
          value: nn(f, 0),
          unit: "cfm",
          sub: `Nameplate ${nn(u("sensor.dsc_cfm_exhaust_out"), 0)}`
        }
      ) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(
        Xe,
        {
          label: "CFM RECIRC alloc",
          value: nn(m, 0),
          unit: "cfm",
          sub: `Nameplate ${nn(u("sensor.dsc_cfm_exhaust_recirc"), 0)}`
        }
      ) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(Xe, { label: "Intake main", value: nn(u("sensor.dsc_cfm_intake_main"), 0), unit: "cfm" }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(Xe, { label: "Intake 2×4", value: nn(u("sensor.dsc_cfm_intake_2x4"), 0), unit: "cfm" }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsxs(ce, { className: "dsc-glass", title: "Learn status", icon: "learning", children: [
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-chip-row", children: [
          /* @__PURE__ */ c.jsx(I, { label: `Status ${g}`, tone: g === "—" ? "muted" : "ok" }),
          /* @__PURE__ */ c.jsx(I, { label: `Gate ${y}`, tone: "muted" }),
          /* @__PURE__ */ c.jsx(
            I,
            {
              label: `Beat ${i("sensor.dsc_hub_heartbeat", "—")}`,
              tone: o("sensor.dsc_hub_heartbeat") ? "ok" : "bad"
            }
          )
        ] }),
        /* @__PURE__ */ c.jsxs("p", { className: "dsc-honesty", style: { marginBottom: 0 }, children: [
          /* @__PURE__ */ c.jsx(I, { icon: "alert", label: "Nameplate", tone: "warn" }),
          " CFM figures are allocated / nameplate proxies unless cal curves exist",
          v ? ` (${v})` : " (no curve attrs)",
          "."
        ] }),
        /* @__PURE__ */ c.jsxs("p", { className: "dsc-muted", style: { marginBottom: 0 }, children: [
          "Surface: ",
          i("sensor.dsc_ha_surface_version", "7.1.0"),
          ". Full anemometer wizard remains on Lovelace Learning — open dsc-hub-pro Learning for unported steps."
        ] })
      ] }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsx(ce, { className: "dsc-glass", title: "Kit / In service", icon: "settings", children: /* @__PURE__ */ c.jsxs("div", { className: "dsc-mode-row", children: [
        /* @__PURE__ */ c.jsx(Ue, { entityId: "input_boolean.dsc_ac_in_service", label: "AC in service", icon: "climate" }),
        /* @__PURE__ */ c.jsx(
          Ue,
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
function Kb() {
  const { state: i } = Qe(), { hours: u, setHours: o, maxPoints: r } = Ks(6), f = qe("sensor.dsc_hub_tent_temperature", { maxPoints: r, hours: u }), m = qe("sensor.dsc_hub_tent_humidity", { maxPoints: r, hours: u }), g = qe(
    "sensor.dsc_cfm_exhaust_out_allocated",
    { maxPoints: r, hours: u }
  ), y = qe(
    "sensor.dsc_cfm_exhaust_recirc_allocated",
    { maxPoints: r, hours: u }
  ), v = qe(ya(1, "moisture", i), { maxPoints: r, hours: u }), h = qe("sensor.dsc_pot1_dryback_pct", { maxPoints: r, hours: u }), b = qe(ya(2, "moisture", i), { maxPoints: r, hours: u }), x = qe(ya(4, "moisture", i), { maxPoints: r, hours: u });
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      $t,
      {
        icon: "analytics",
        title: "Analytics",
        subtitle: "History-seeded trends — climate + root pack. Change timespan to zoom."
      }
    ),
    /* @__PURE__ */ c.jsx("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: /* @__PURE__ */ c.jsx(Js, { hours: u, setHours: o }) }),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ce, { className: "dsc-glass", title: "Tent T + RH", icon: "climate", children: /* @__PURE__ */ c.jsx(
        Vt,
        {
          live: !0,
          lastSyncAt: Math.max(f.lastSyncAt ?? 0, m.lastSyncAt ?? 0) || void 0,
          series: [
            {
              id: "t",
              label: "Temp °C",
              series: f.series,
              color: "var(--dsc-blue)",
              axis: "left",
              unit: "°C"
            },
            {
              id: "rh",
              label: "RH %",
              series: m.series,
              color: "var(--dsc-teal)",
              axis: "right",
              unit: "%"
            }
          ]
        }
      ) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ce, { className: "dsc-glass", title: "Exhaust CFM (allocated)", icon: "climate", children: /* @__PURE__ */ c.jsx(
        Vt,
        {
          live: !0,
          unit: "cfm",
          lastSyncAt: Math.max(g.lastSyncAt ?? 0, y.lastSyncAt ?? 0) || void 0,
          series: [
            {
              id: "out",
              label: "OUT",
              series: g.series,
              color: "var(--dsc-blue)",
              unit: "cfm"
            },
            {
              id: "recirc",
              label: "RECIRC",
              series: y.series,
              color: "var(--dsc-purple)",
              unit: "cfm"
            }
          ]
        }
      ) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ce, { className: "dsc-glass", title: "Root pack — moisture", icon: "root", children: /* @__PURE__ */ c.jsx(
        Vt,
        {
          live: !0,
          unit: "%",
          lastSyncAt: Math.max(v.lastSyncAt ?? 0, b.lastSyncAt ?? 0, x.lastSyncAt ?? 0) || void 0,
          series: [
            { id: "p1", label: "P1", series: v.series, color: "var(--dsc-blue)", unit: "%" },
            { id: "p2", label: "P2", series: b.series, color: "var(--dsc-teal)", unit: "%" },
            { id: "p4", label: "P4", series: x.series, color: "var(--dsc-purple)", unit: "%" }
          ]
        }
      ) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ce, { className: "dsc-glass", title: "P1 dryback", icon: "root", children: /* @__PURE__ */ c.jsx(
        Vt,
        {
          live: !0,
          unit: "%",
          lastSyncAt: h.lastSyncAt,
          series: [
            {
              id: "db",
              label: "Dryback",
              series: h.series,
              color: "var(--dsc-amber)",
              unit: "%"
            }
          ]
        }
      ) }) })
    ] })
  ] });
}
function Jb() {
  const { state: i, available: u, num: o } = Qe(), r = u("sensor.dsc_hub_uptime");
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      $t,
      {
        icon: "fleet",
        title: "Fleet",
        subtitle: "Diagnostics, versions, kit densify, system map, tank note."
      }
    ),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ c.jsx(
        Xe,
        {
          label: "Hub link",
          value: r ? "OK" : "DOWN",
          tone: r ? "ok" : "bad",
          sub: `Uptime raw ${i("sensor.dsc_hub_uptime", "—")}`
        }
      ) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ c.jsx(
        Xe,
        {
          label: "Surface",
          value: i("sensor.dsc_ha_surface_version", "7.1.0"),
          sub: "Panel product shell"
        }
      ) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ c.jsx(
        Xe,
        {
          label: "Alerts",
          value: Number.isFinite(o("sensor.dsc_active_alert_count")) ? o("sensor.dsc_active_alert_count") : "—",
          tone: o("sensor.dsc_active_alert_count", 0) === 0 ? "ok" : "bad"
        }
      ) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ce, { className: "dsc-glass", title: "Kit / In service", icon: "settings", children: /* @__PURE__ */ c.jsxs("div", { className: "dsc-mode-row", children: [
        /* @__PURE__ */ c.jsx(Ue, { entityId: "input_boolean.dsc_ac_in_service", label: "AC in service", icon: "climate" }),
        /* @__PURE__ */ c.jsx(
          Ue,
          {
            entityId: "input_boolean.dsc_clone_humidifier_in_service",
            label: "Clone mister",
            icon: "clone"
          }
        ),
        /* @__PURE__ */ c.jsx(Ue, { entityId: "input_boolean.dsc_pot1_in_service", label: "Pot 1", icon: "root" }),
        /* @__PURE__ */ c.jsx(Ue, { entityId: "input_boolean.dsc_pot2_in_service", label: "Pot 2", icon: "root" }),
        /* @__PURE__ */ c.jsx(Ue, { entityId: "input_boolean.dsc_pot3_in_service", label: "Pot 3", icon: "root" }),
        /* @__PURE__ */ c.jsx(Ue, { entityId: "input_boolean.dsc_pot4_in_service", label: "Pot 4", icon: "root" })
      ] }) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ce, { className: "dsc-glass", title: "System map", icon: "system", children: /* @__PURE__ */ c.jsx(Ws, { tag: "dsc-system-map-card", config: {} }) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsx(ce, { className: "dsc-glass", title: "Fleet version", icon: "fleet", children: /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: i("sensor.dsc_fleet_version_status", "—") }) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsx(ce, { className: "dsc-glass", title: "Tank", icon: "tank", children: /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "Reservoir / tank vitals land here as hardware comes online. Map above stays the topology view; do not invent tank sensors." }) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ce, { className: "dsc-glass", title: "Panel", icon: "system", children: /* @__PURE__ */ c.jsxs("p", { className: "dsc-muted", style: { marginTop: 0 }, children: [
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
const Fb = [
  { id: "live", label: "Live", path: "/live/mission", icon: "live" },
  { id: "grow", label: "Grow", path: "/grow/compose", icon: "grow" },
  { id: "tune", label: "Tune", path: "/tune/learning", icon: "tune" },
  { id: "fleet", label: "Fleet", path: "/fleet", icon: "fleet" }
], Wb = {
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
}, Pb = {
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
function Ib(i) {
  return i.startsWith("/grow") || i.startsWith("/plant") ? "grow" : i.startsWith("/tune") || i.startsWith("/advanced") ? "tune" : i.startsWith("/fleet") || i.startsWith("/system") ? "fleet" : "live";
}
function e0(i, u) {
  const o = Pb[i];
  return o ? o.includes("?") ? o : `${o}${u || ""}` : null;
}
const t0 = ':host,.dsc-root{--dsc-black: #0c1220;--dsc-black-2: #121a2c;--dsc-gray-1: #182238;--dsc-gray-2: #22304c;--dsc-gray-3: #334566;--dsc-gray-4: #8b95ab;--dsc-gray-5: #b6bfd4;--dsc-blue: #5b9bff;--dsc-blue-dim: rgba(91, 155, 255, .4);--dsc-purple: #a78bfa;--dsc-purple-dim: rgba(167, 139, 250, .35);--dsc-neon: #3dde7a;--dsc-neon-dim: rgba(61, 222, 122, .32);--dsc-neon-glow: rgba(61, 222, 122, .4);--dsc-teal: #2ec4d6;--dsc-teal-dim: rgba(46, 196, 214, .45);--dsc-teal-glow: rgba(46, 196, 214, .55);--dsc-amber: #ffb74d;--dsc-bad: #ff6b8a;--dsc-bad-soft: #ff8aa3;--dsc-soil-1: #5b9f6b;--dsc-soil-2: #4a8f9f;--dsc-soil-3: #c4a35a;--dsc-soil-4: #8d6e63;--dsc-glass: rgba(18, 26, 44, .78);--dsc-glass-border: rgba(130, 165, 230, .34);--dsc-white: #f2f5fb;--dsc-shadow: 0 8px 24px rgba(0, 0, 0, .45);--dsc-shadow-tight: 0 2px 8px rgba(0, 0, 0, .55);--dsc-radius: 10px;--dsc-radius-lg: 14px;--dsc-font: "Segoe UI", "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;--dsc-mono: "Cascadia Code", "IBM Plex Mono", ui-monospace, monospace;color:var(--dsc-white);background:var(--dsc-black);font-family:var(--dsc-font);display:block;height:100%;box-sizing:border-box}*,*:before,*:after{box-sizing:border-box}.dsc-root{height:100%;min-height:100%;overflow:auto;background:radial-gradient(1100px 560px at 8% -12%,rgba(91,155,255,.18),transparent 55%),radial-gradient(900px 520px at 92% -8%,rgba(46,196,214,.12),transparent 50%),radial-gradient(700px 420px at 70% 100%,rgba(61,222,122,.05),transparent 55%),var(--dsc-black)}.dsc-honesty-rail{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}.dsc-row-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.dsc-next-rec{border-color:var(--dsc-blue-dim)}.dsc-twin-keepalive{display:none;margin-bottom:12px;min-height:0}.dsc-twin-keepalive.is-active{display:block;min-height:min(70vh,720px)}.dsc-twin-keepalive-host{min-height:min(68vh,700px)}.dsc-twin-keepalive-host>*{min-height:min(68vh,700px)}.dsc-tab--live.active{color:var(--dsc-blue);border-color:var(--dsc-blue-dim)}.dsc-tab--grow.active{color:var(--dsc-teal);border-color:var(--dsc-teal-dim)}.dsc-tab--tune.active{color:var(--dsc-purple);border-color:var(--dsc-purple-dim)}.dsc-tab--fleet.active{color:var(--dsc-blue);border-color:var(--dsc-blue-dim)}.dsc-secondary-tabs .dsc-tab.active{color:var(--dsc-teal);border-color:var(--dsc-teal-dim);box-shadow:0 0 0 1px var(--dsc-blue-dim)}.dsc-tent-segment{display:inline-flex;gap:4px;padding:3px;border-radius:999px;background:var(--dsc-gray-1);border:1px solid var(--dsc-glass-border)}.dsc-tent-segment button{appearance:none;border:0;background:transparent;color:var(--dsc-gray-5);padding:6px 12px;border-radius:999px;cursor:pointer;font:inherit;font-size:.85rem}.dsc-tent-segment button.is-active{background:var(--dsc-gray-2);color:var(--dsc-white);box-shadow:var(--dsc-shadow-tight)}.dsc-tent-segment button[data-tent=main].is-active{color:var(--dsc-blue)}.dsc-tent-segment button[data-tent=clone].is-active{color:var(--dsc-purple)}.dsc-tent-segment button[data-tent=compare].is-active{color:var(--dsc-teal)}.dsc-shell{display:flex;flex-direction:column;min-height:100%;max-width:1600px;margin:0 auto;padding:16px 20px 28px}.dsc-brand-row{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:10px}.dsc-brand{display:flex;align-items:center;gap:12px;color:var(--dsc-white);text-decoration:none}.dsc-brand img,.dsc-brand svg{width:36px;height:36px;color:var(--dsc-neon)}.dsc-brand-title{display:flex;flex-direction:column;gap:2px}.dsc-brand-title strong{font-size:1.15rem;letter-spacing:.14em;font-weight:700}.dsc-brand-wordmark{height:18px;width:auto;max-width:160px;display:block;filter:brightness(0) invert(1)}.dsc-brand-title span{font-size:.72rem;color:var(--dsc-gray-5);letter-spacing:.08em;text-transform:uppercase}.dsc-page-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px}.dsc-page-header-main{display:flex;align-items:flex-start;gap:10px}.dsc-page-header-actions{display:flex;align-items:center;gap:6px;flex-shrink:0}.dsc-card-title{display:inline-flex;align-items:center;gap:8px}.dsc-primary-tabs,.dsc-secondary-tabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:thin;padding-bottom:2px;-webkit-overflow-scrolling:touch}.dsc-primary-tabs{border-bottom:1px solid var(--dsc-gray-3);margin-bottom:8px}.dsc-secondary-tabs{margin-bottom:16px;mask-image:linear-gradient(90deg,#000 85%,transparent)}.dsc-secondary-tabs:after{content:"";flex:0 0 12px}.dsc-tab{appearance:none;border:1px solid transparent;background:transparent;color:var(--dsc-gray-5);padding:10px 14px;min-height:44px;border-radius:8px 8px 0 0;cursor:pointer;font:inherit;font-size:.92rem;letter-spacing:.04em;white-space:nowrap;display:inline-flex;align-items:center;gap:8px;transition:transform .1s ease,box-shadow .1s ease,color .15s ease,border-color .15s ease,background .15s ease;text-decoration:none}.dsc-tab span[role=img]{opacity:.9;flex-shrink:0}.dsc-tab:hover{color:var(--dsc-white);background:var(--dsc-gray-1)}.dsc-tab:focus-visible{outline:2px solid var(--dsc-neon);outline-offset:2px}.dsc-tab.active{color:var(--dsc-white);border-bottom:2px solid var(--dsc-neon);box-shadow:0 6px 18px #39ff1414}.dsc-secondary-tabs .dsc-tab{border-radius:999px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-1);min-height:40px;padding:8px 14px}.dsc-secondary-tabs .dsc-tab.active{border-color:var(--dsc-neon-dim);color:var(--dsc-neon);background:#39ff1414;box-shadow:var(--dsc-shadow-tight)}.dsc-btn{appearance:none;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);border-radius:8px;padding:10px 16px;min-height:40px;font:inherit;cursor:pointer;box-shadow:var(--dsc-shadow-tight);transition:transform .1s ease,box-shadow .1s ease,border-color .12s ease,background .12s ease}.dsc-btn:hover{border-color:var(--dsc-neon-dim)}.dsc-btn:active,.dsc-tab:active{transform:translateY(1px);box-shadow:0 1px 3px #000000a6}.dsc-btn.primary{border-color:var(--dsc-neon-dim);color:var(--dsc-black);background:var(--dsc-neon);font-weight:650}.dsc-page{animation:dsc-fade .18s ease}@keyframes dsc-fade{0%{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.dsc-page,.dsc-btn,.dsc-tab,.dsc-live-pulse{animation:none!important;transition:none!important}}.dsc-grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:14px}.dsc-col-3{grid-column:span 3}.dsc-col-4{grid-column:span 4}.dsc-col-6{grid-column:span 6}.dsc-col-8{grid-column:span 8}.dsc-col-12{grid-column:span 12}@media(max-width:1100px){.dsc-col-3,.dsc-col-4{grid-column:span 6}.dsc-col-8{grid-column:span 12}}@media(max-width:720px){.dsc-shell{padding:12px}.dsc-col-3,.dsc-col-4,.dsc-col-6,.dsc-col-8{grid-column:span 12}}.dsc-card{background:linear-gradient(165deg,var(--dsc-gray-1),var(--dsc-black-2));border:1px solid var(--dsc-gray-3);border-radius:var(--dsc-radius);box-shadow:var(--dsc-shadow);padding:14px 16px;min-height:88px}.dsc-card h2,.dsc-card h3{margin:0 0 8px;font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;color:var(--dsc-gray-5);font-weight:600}.dsc-kpi-value{font-size:1.85rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:.02em;color:var(--dsc-white)}.dsc-kpi-unit{margin-left:6px;font-size:.85rem;color:var(--dsc-gray-5)}.dsc-kpi-sub{margin-top:6px;color:var(--dsc-gray-5);font-size:.82rem}.dsc-status-ok{color:var(--dsc-neon)}.dsc-status-bad{color:var(--dsc-bad)}.dsc-status-muted{color:var(--dsc-gray-5)}.dsc-page-title{margin:0 0 14px;font-size:1.35rem;letter-spacing:.04em}.dsc-muted{color:var(--dsc-gray-5)}.dsc-legacy-host{min-height:420px;border-radius:var(--dsc-radius);overflow:hidden;border:1px solid var(--dsc-gray-3);background:#000}.dsc-legacy-host--empty{background:var(--dsc-gray-1);min-height:160px}.dsc-legacy-host>*{display:block;width:100%}.dsc-status-strip{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}.dsc-chip-row{display:flex;flex-wrap:wrap;gap:8px}.dsc-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-1);font-size:.75rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-chip--ok{color:var(--dsc-neon);border-color:var(--dsc-neon-dim);background:#39ff1414;box-shadow:0 0 12px #39ff141f}.dsc-chip--bad{color:var(--dsc-bad-soft);border-color:color-mix(in srgb,var(--dsc-bad) 45%,transparent);background:color-mix(in srgb,var(--dsc-bad) 12%,transparent)}.dsc-chip--warn{color:var(--dsc-amber);border-color:color-mix(in srgb,var(--dsc-amber) 45%,transparent);background:color-mix(in srgb,var(--dsc-amber) 12%,transparent)}.dsc-chip--muted{color:var(--dsc-gray-5)}.dsc-chip--pulse{animation:dsc-chip-pulse 1.6s ease-in-out infinite}@keyframes dsc-chip-pulse{0%,to{box-shadow:0 0 #39ff1400}50%{box-shadow:0 0 14px #39ff1459}}.dsc-demand-row{display:flex;flex-wrap:wrap;gap:8px}.dsc-demand-row--stack{flex-direction:column}.dsc-demand{appearance:none;flex:1 1 110px;min-height:52px;padding:10px 12px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);font:inherit;cursor:pointer;display:flex;flex-direction:column;align-items:flex-start;gap:4px;box-shadow:var(--dsc-shadow-tight);transition:transform .1s ease,box-shadow .1s ease,border-color .12s ease,background .12s ease}.dsc-demand:hover{border-color:var(--dsc-neon-dim)}.dsc-demand:active{transform:translateY(1px);box-shadow:0 1px 3px #000000a6}.dsc-demand.is-on{border-color:var(--dsc-neon);background:#39ff141a;box-shadow:0 0 0 1px #39ff1440,0 0 18px #39ff1433}.dsc-demand.is-missing{opacity:.55;cursor:not-allowed}.dsc-demand-label{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-demand.is-on .dsc-demand-label{color:var(--dsc-neon)}.dsc-demand-state{font-weight:700;font-variant-numeric:tabular-nums;font-size:1rem}.dsc-demand-icon{margin-bottom:2px}.dsc-mode-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}.dsc-mode-selects{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}.dsc-entity-select{display:flex;flex-direction:column;gap:6px;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-entity-select-label{display:inline-flex;align-items:center;gap:6px}.dsc-entity-select select{appearance:none;min-height:40px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);padding:8px 12px;font:inherit;text-transform:none;letter-spacing:0}.dsc-entity-select.is-disabled{opacity:.55}.dsc-fan-stack{display:flex;flex-direction:column;gap:10px}.dsc-fan-slider{display:flex;flex-direction:column;gap:4px}.dsc-fan-slider-label{display:flex;align-items:baseline;gap:8px;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-fan-slider-label strong{color:var(--dsc-teal);font-variant-numeric:tabular-nums}.dsc-fan-slider input[type=range]{width:100%;accent-color:var(--dsc-teal)}.dsc-fan-slider.is-disabled{opacity:.5}.dsc-honesty{margin:10px 0 0;font-size:.85rem;color:var(--dsc-gray-5);display:flex;flex-wrap:wrap;align-items:center;gap:8px}.dsc-target-panel{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}.dsc-target-panel.is-compact .dsc-target-grid{grid-template-columns:repeat(auto-fit,minmax(90px,1fr))}.dsc-tent-targets{border:1px solid var(--dsc-glass-border);border-radius:var(--dsc-radius);padding:10px 12px;background:#0000002e}.dsc-tent-targets-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}.dsc-got-want{display:flex;flex-direction:column;gap:2px;font-size:.82rem;margin-bottom:10px}.dsc-target-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px}.dsc-target-num{display:flex;flex-direction:column;gap:4px;font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-target-num input{min-height:36px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);padding:6px 8px;font:inherit;font-variant-numeric:tabular-nums}.dsc-target-num.is-disabled{opacity:.55}.dsc-chart{position:relative}.dsc-chart-svg{cursor:crosshair;touch-action:none}.dsc-chart-tooltip{position:absolute;top:8px;transform:translate(-50%);pointer-events:none;z-index:2;min-width:120px;padding:8px 10px;border-radius:8px;border:1px solid var(--dsc-glass-border);background:var(--dsc-glass);backdrop-filter:blur(10px);box-shadow:var(--dsc-shadow-tight);font-size:.75rem}.dsc-chart-tooltip-time{color:var(--dsc-teal);font-family:var(--dsc-mono);margin-bottom:4px}.dsc-chart-tooltip-row{display:flex;align-items:center;gap:6px;color:var(--dsc-white)}.dsc-chart-tooltip-row i{width:7px;height:7px;border-radius:50%;display:inline-block}@keyframes dsc-sync-pulse{0%{stroke-dashoffset:1;opacity:.2}35%{opacity:1}to{stroke-dashoffset:0;opacity:0}}@media(prefers-reduced-motion:reduce){.dsc-chart-pulse{animation:none!important;opacity:.85}}.dsc-gauge.is-warn .dsc-gauge-label{color:var(--dsc-amber)}.dsc-gauge-row{display:flex;justify-content:space-around;flex-wrap:wrap;gap:8px}.dsc-gauge{display:flex;flex-direction:column;align-items:center;gap:4px}.dsc-gauge-label{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-chart-legend{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:4px;min-height:20px}.dsc-chart-legend-item{display:inline-flex;align-items:center;gap:6px;font-size:.75rem;color:var(--dsc-gray-5)}.dsc-chart-legend-item i{width:8px;height:8px;border-radius:50%;display:inline-block;box-shadow:0 0 6px currentColor}.dsc-chart-last{margin-left:auto;font-variant-numeric:tabular-nums;color:var(--dsc-neon);font-size:13px;font-weight:650}.dsc-fault-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.dsc-fault-list li{display:flex;flex-wrap:wrap;align-items:center;gap:10px}.dsc-empty{padding:18px 14px;border:1px dashed var(--dsc-gray-3);border-radius:8px;color:var(--dsc-gray-5);background:#00000040;font-size:.9rem;line-height:1.45}.dsc-empty--ok{border-style:solid;border-color:var(--dsc-neon-dim);color:var(--dsc-neon)}.dsc-btn:disabled{opacity:.45;cursor:not-allowed}.dsc-glass{background:var(--dsc-glass);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid var(--dsc-glass-border);border-radius:var(--dsc-radius-lg);box-shadow:var(--dsc-shadow)}.dsc-glass--glow{border-color:var(--dsc-teal-dim);box-shadow:0 0 0 1px #26c6da26,0 0 24px #26c6da1f}.dsc-icon-btn{appearance:none;width:36px;height:36px;padding:0;display:inline-flex;align-items:center;justify-content:center;border-radius:10px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);cursor:pointer;box-shadow:var(--dsc-shadow-tight);transition:border-color .12s ease,background .12s ease,transform .1s ease}.dsc-icon-btn:hover{border-color:var(--dsc-teal-dim);color:var(--dsc-teal)}.dsc-icon-btn:active{transform:translateY(1px)}.dsc-result-chip{display:inline-flex;align-items:center;gap:8px;max-width:100%;padding:8px 12px;border-radius:999px;border:1px solid var(--dsc-teal-dim);background:#26c6da1a;color:var(--dsc-white);font-size:.9rem}.dsc-result-chip span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dsc-overflow{position:relative;display:inline-block}.dsc-overflow-menu{position:absolute;right:0;top:calc(100% + 6px);z-index:40;min-width:180px;padding:6px;background:var(--dsc-black-2);border:1px solid var(--dsc-gray-3);border-radius:10px;box-shadow:var(--dsc-shadow)}.dsc-overflow-menu button{appearance:none;width:100%;text-align:left;border:0;background:transparent;color:var(--dsc-white);font:inherit;font-size:.88rem;padding:10px 12px;border-radius:8px;cursor:pointer}.dsc-overflow-menu button:hover{background:#26c6da1f;color:var(--dsc-teal)}.dsc-drawer-root{position:fixed;inset:0;z-index:80;pointer-events:none}.dsc-drawer-root.is-open{pointer-events:auto}.dsc-drawer-scrim{position:absolute;inset:0;background:#00000073;opacity:0;transition:opacity .18s ease}.dsc-drawer-root.is-open .dsc-drawer-scrim{opacity:1}.dsc-drawer-panel{position:absolute;top:0;bottom:0;width:min(380px,92vw);background:linear-gradient(165deg,#121a16,#0a100e);border:1px solid var(--dsc-glass-border);box-shadow:-12px 0 40px #0000008c;display:flex;flex-direction:column;transition:transform .22s ease}.dsc-drawer-panel.right{right:0;transform:translate(105%);border-radius:14px 0 0 14px}.dsc-drawer-panel.left{left:0;transform:translate(-105%);border-radius:0 14px 14px 0}.dsc-drawer-root.is-open .dsc-drawer-panel.right,.dsc-drawer-root.is-open .dsc-drawer-panel.left{transform:none}.dsc-drawer-rail{position:absolute;top:50%;transform:translateY(-50%);width:28px;height:64px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:2}.dsc-drawer-panel.right .dsc-drawer-rail{left:-28px;border-radius:10px 0 0 10px}.dsc-drawer-panel.left .dsc-drawer-rail{right:-28px;border-radius:0 10px 10px 0}.dsc-drawer-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-bottom:1px solid var(--dsc-gray-3)}.dsc-drawer-head h2{margin:0;font-size:.85rem;letter-spacing:.12em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-drawer-body{flex:1;overflow:auto;padding:14px 16px}.dsc-soil{width:100%;max-width:280px;margin:0 auto}.dsc-soil-pot{position:relative;width:100%;aspect-ratio:4 / 5;border-radius:12px 12px 28px 28px;border:2px solid rgba(120,160,130,.45);background:linear-gradient(180deg,#1a1410,#0e0c0a);overflow:hidden;box-shadow:inset 0 0 24px #0000008c,0 0 20px #26c6da14}.dsc-soil-pot.is-valid{border-color:var(--dsc-teal-dim);box-shadow:inset 0 0 24px #0000008c,0 0 28px #26c6da47,0 0 42px #39ff141f}.dsc-soil-layer{position:absolute;left:8%;right:8%;display:flex;align-items:center;justify-content:center;font-size:.72rem;letter-spacing:.04em;color:#f4f7f4eb;text-shadow:0 1px 2px rgba(0,0,0,.65);border-top:1px solid rgba(255,255,255,.08)}.dsc-soil-empty{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--dsc-gray-5);font-size:.85rem;padding:16px;text-align:center}.dsc-seat-layout{display:grid;grid-template-columns:minmax(200px,320px) 1fr;gap:18px;align-items:start}@media(max-width:900px){.dsc-seat-layout{grid-template-columns:1fr}}.dsc-seat-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.dsc-table{width:100%;border-collapse:collapse;font-size:.88rem}.dsc-table th,.dsc-table td{text-align:left;padding:8px 6px;border-bottom:1px solid var(--dsc-gray-3)}.dsc-table th{font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--dsc-gray-5);font-weight:600}.dsc-table tr{cursor:pointer}.dsc-table tr:hover td{background:#26c6da0f}.dsc-btn.teal{border-color:var(--dsc-teal-dim);background:#26c6da2e;color:var(--dsc-white);box-shadow:0 0 18px #26c6da33}.dsc-btn.teal.primary{background:var(--dsc-teal);color:#041018;font-weight:650}.dsc-held-tag{margin-left:8px;font-size:.65rem;letter-spacing:.08em;color:var(--dsc-amber);vertical-align:middle}.dsc-kpi-hit,.dsc-gauge-hit{appearance:none;border:0;background:transparent;padding:0;margin:0;color:inherit;font:inherit;text-align:left;cursor:pointer;width:100%;display:block}.dsc-card.is-stale,.dsc-gauge.is-stale{opacity:.88;border-color:var(--dsc-amber)}.dsc-gauge.is-clickable:hover,.dsc-kpi-hit:hover .dsc-card{border-color:var(--dsc-blue-dim)}.dsc-timespan{display:inline-flex;flex-wrap:wrap;gap:6px}.dsc-spark-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}.dsc-sparkline{display:block;margin-top:4px}.dsc-gotwant{display:flex;flex-direction:column;gap:10px}.dsc-gotwant-row{display:grid;grid-template-columns:64px 1fr;gap:6px 10px;align-items:center}.dsc-gotwant-label{font-size:.75rem;color:var(--dsc-gray-5);letter-spacing:.04em}.dsc-gotwant-track{position:relative;height:10px;border-radius:999px;background:#ffffff0f;overflow:hidden;grid-column:2}.dsc-gotwant-want{position:absolute;inset:0 auto 0 0;background:#2ec4d647;border-right:1px solid var(--dsc-teal)}.dsc-gotwant-got{position:absolute;inset:2px auto 2px 0;background:linear-gradient(90deg,var(--dsc-blue),var(--dsc-teal));border-radius:999px}.dsc-gotwant-vals{grid-column:2;display:flex;justify-content:space-between;font-size:.72rem;font-family:var(--dsc-mono)}.dsc-seat-editors{display:grid;gap:10px}.dsc-seat-editors label{display:flex;flex-direction:column;gap:4px;font-size:.75rem;color:var(--dsc-gray-5)}.dsc-seat-editors input,.dsc-seat-editors select,.dsc-seat-editors textarea{background:var(--dsc-gray-1);border:1px solid var(--dsc-glass-border);border-radius:8px;color:var(--dsc-white);padding:8px 10px;font:inherit}.dsc-root-matrix .dsc-tone-ok{color:var(--dsc-neon)}.dsc-root-matrix .dsc-tone-warn{color:var(--dsc-amber)}.dsc-root-matrix .dsc-tone-bad{color:var(--dsc-bad)}.dsc-root-matrix .dsc-tone-stale{color:var(--dsc-amber);opacity:.85}.dsc-tent-cockpit-strip{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}@media(prefers-reduced-motion:reduce){.dsc-drawer-panel,.dsc-drawer-scrim{transition:none!important}}', l0 = t0;
function va() {
  const i = xt(), u = e0(i.pathname, i.search);
  return u ? /* @__PURE__ */ c.jsx(ga, { to: u, replace: !0 }) : /* @__PURE__ */ c.jsx(ga, { to: "/live/mission", replace: !0 });
}
function a0() {
  const i = xt(), u = Ot(), o = Ib(i.pathname), r = Wb[o];
  return S.useEffect(() => {
    const f = (m) => {
      const g = m.detail, y = Number(g?.pot);
      y >= 1 && y <= 4 && u(`/live/root?pot=${y}`);
    };
    return window.addEventListener("dsc-dash-select-pot", f), () => window.removeEventListener("dsc-dash-select-pot", f);
  }, [u]), /* @__PURE__ */ c.jsxs("div", { className: "dsc-shell", children: [
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-brand-row", children: [
      /* @__PURE__ */ c.jsxs(Us, { className: "dsc-brand", to: "/live/mission", children: [
        /* @__PURE__ */ c.jsx(Nl, { name: "brand", size: 36, color: "var(--dsc-blue)" }),
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
      /* @__PURE__ */ c.jsx("div", { className: "dsc-muted", style: { fontSize: 12, letterSpacing: "0.08em" }, children: "SURFACE 7.1.0" })
    ] }),
    /* @__PURE__ */ c.jsx(rb, {}),
    /* @__PURE__ */ c.jsx("nav", { className: "dsc-primary-tabs", "aria-label": "Primary", children: Fb.map((f) => /* @__PURE__ */ c.jsxs(
      Us,
      {
        to: f.path,
        className: ({ isActive: m }) => `dsc-tab dsc-tab--${f.id}${m || o === f.id ? " active" : ""}`,
        children: [
          /* @__PURE__ */ c.jsx(Nl, { name: f.icon, size: 15 }),
          f.label
        ]
      },
      f.id
    )) }),
    r.length > 1 ? /* @__PURE__ */ c.jsx("nav", { className: "dsc-secondary-tabs", "aria-label": "Section pages", children: r.map((f) => /* @__PURE__ */ c.jsxs(
      Us,
      {
        to: f.path,
        end: f.path === "/fleet",
        className: ({ isActive: m }) => `dsc-tab${m ? " active" : ""}`,
        children: [
          /* @__PURE__ */ c.jsx(Nl, { name: f.icon, size: 14 }),
          f.label
        ]
      },
      f.id
    )) }) : null,
    /* @__PURE__ */ c.jsxs(jy, { children: [
      /* @__PURE__ */ c.jsx(He, { path: "/", element: /* @__PURE__ */ c.jsx(ga, { to: "/live/mission", replace: !0 }) }),
      /* @__PURE__ */ c.jsx(He, { path: "/live", element: /* @__PURE__ */ c.jsx(ga, { to: "/live/mission", replace: !0 }) }),
      /* @__PURE__ */ c.jsx(He, { path: "/live/mission", element: /* @__PURE__ */ c.jsx(Db, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/live/twin", element: /* @__PURE__ */ c.jsx(Bb, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/live/climate", element: /* @__PURE__ */ c.jsx(qb, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/live/main", element: /* @__PURE__ */ c.jsx(Yb, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/live/clone", element: /* @__PURE__ */ c.jsx(Gb, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/live/root", element: /* @__PURE__ */ c.jsx(Xb, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/live/light", element: /* @__PURE__ */ c.jsx(Vb, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/grow", element: /* @__PURE__ */ c.jsx(ga, { to: "/grow/compose", replace: !0 }) }),
      /* @__PURE__ */ c.jsx(He, { path: "/grow/compose", element: /* @__PURE__ */ c.jsx(Hb, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/grow/research", element: /* @__PURE__ */ c.jsx(Ub, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/grow/roster", element: /* @__PURE__ */ c.jsx(kb, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/tune", element: /* @__PURE__ */ c.jsx(ga, { to: "/tune/learning", replace: !0 }) }),
      /* @__PURE__ */ c.jsx(He, { path: "/tune/learning", element: /* @__PURE__ */ c.jsx($b, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/tune/analytics", element: /* @__PURE__ */ c.jsx(Kb, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/fleet", element: /* @__PURE__ */ c.jsx(Jb, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/ops/*", element: /* @__PURE__ */ c.jsx(va, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/ops", element: /* @__PURE__ */ c.jsx(va, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/plant/*", element: /* @__PURE__ */ c.jsx(va, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/plant", element: /* @__PURE__ */ c.jsx(va, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/advanced/*", element: /* @__PURE__ */ c.jsx(va, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/advanced", element: /* @__PURE__ */ c.jsx(va, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/system", element: /* @__PURE__ */ c.jsx(va, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "*", element: /* @__PURE__ */ c.jsx(ga, { to: "/live/mission", replace: !0 }) })
    ] }),
    /* @__PURE__ */ c.jsx(mb, {})
  ] });
}
function n0({ hass: i }) {
  return /* @__PURE__ */ c.jsx(sb, { hass: i, children: /* @__PURE__ */ c.jsx(pb, { children: /* @__PURE__ */ c.jsx(a0, {}) }) });
}
function i0({
  panel: i
}) {
  const [u, o] = S.useState(() => i.hass);
  return S.useEffect(() => {
    const r = () => o(i.hass);
    return r(), i.addEventListener("hass-updated", r), () => {
      i.removeEventListener("hass-updated", r);
    };
  }, [i]), /* @__PURE__ */ c.jsx(Ky, { children: /* @__PURE__ */ c.jsx(n0, { hass: u }) });
}
class s0 extends HTMLElement {
  constructor() {
    super(...arguments);
    zs(this, "_root", null);
    zs(this, "_hass", null);
    zs(this, "_mounted", !1);
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
${l0}`, this.shadowRoot.appendChild(o);
      const r = document.createElement("div");
      r.className = "dsc-root", r.style.height = "100%", this.shadowRoot.appendChild(r), this._root = Ng.createRoot(r), this._root.render(/* @__PURE__ */ c.jsx(i0, { panel: this })), this._mounted = !0;
    }
  }
  disconnectedCallback() {
    this._root?.unmount(), this._root = null, this._mounted = !1;
  }
}
customElements.get("dsc-hub-panel") || customElements.define("dsc-hub-panel", s0);
export {
  s0 as default
};
//# sourceMappingURL=dsc-hub-panel.js.map
