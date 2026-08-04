(function (root) {
  'use strict';

  var THREE = root && root.THREE;
  if (!THREE) {
    if (root && root.console && root.console.warn) {
      root.console.warn('dsc-dash-fx: THREE must be loaded first.');
    }
    return;
  }
  if (THREE.DSCDashFX) return;

  function setTextureSRGB(texture) {
    if ('colorSpace' in texture && THREE.SRGBColorSpace) {
      texture.colorSpace = THREE.SRGBColorSpace;
    } else if ('encoding' in texture && THREE.sRGBEncoding) {
      texture.encoding = THREE.sRGBEncoding;
    }
    return texture;
  }

  function createSoftSpriteTexture(size) {
    size = size == null ? 64 : Math.max(2, Math.floor(size));
    var canvas = root.document
      ? root.document.createElement('canvas')
      : typeof OffscreenCanvas !== 'undefined'
        ? new OffscreenCanvas(size, size)
        : null;

    if (!canvas) {
      throw new Error('dsc-dash-fx: canvas support is required.');
    }

    canvas.width = size;
    canvas.height = size;
    var ctx = canvas.getContext('2d');
    var half = size * 0.5;
    var gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.18, 'rgba(255,255,255,0.95)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.35)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    var texture = new THREE.CanvasTexture(canvas);
    texture.name = 'DSCDashFX.SoftSprite';
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return setTextureSRGB(texture);
  }

  function FullScreenQuad(material) {
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.scene = new THREE.Scene();
    this.geometry = new THREE.PlaneGeometry(2, 2);
    this.mesh = new THREE.Mesh(this.geometry, material);
    this.mesh.frustumCulled = false;
    this.scene.add(this.mesh);
  }

  Object.defineProperty(FullScreenQuad.prototype, 'material', {
    get: function () { return this.mesh.material; },
    set: function (value) { this.mesh.material = value; }
  });

  FullScreenQuad.prototype.render = function (renderer) {
    renderer.render(this.scene, this.camera);
  };

  FullScreenQuad.prototype.dispose = function () {
    this.geometry.dispose();
  };

  function makeTarget(width, height, name, useHalfFloat) {
    var options = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      depthBuffer: false,
      stencilBuffer: false
    };
    if (useHalfFloat && THREE.HalfFloatType) options.type = THREE.HalfFloatType;
    var target = new THREE.WebGLRenderTarget(width, height, options);
    target.texture.name = name;
    target.texture.generateMipmaps = false;
    return target;
  }

  function createComposer(renderer, scene, camera) {
    var mipCount = 5;
    var width = 1;
    var height = 1;
    var disposed = false;
    var oldTarget = null;
    var oldAutoClear = true;
    var oldClearAlpha = 1;
    var oldClearColor = new THREE.Color();
    var useHalfFloat = !!THREE.HalfFloatType;

    var sceneTarget = makeTarget(1, 1, 'DSCDashFX.Scene', useHalfFloat);
    sceneTarget.depthBuffer = true;
    sceneTarget.depthTexture = null;
    var brightTarget = makeTarget(1, 1, 'DSCDashFX.Bright', useHalfFloat);
    var horizontalTargets = [];
    var verticalTargets = [];
    var i;
    for (i = 0; i < mipCount; i++) {
      horizontalTargets.push(makeTarget(1, 1, 'DSCDashFX.BlurH' + i, useHalfFloat));
      verticalTargets.push(makeTarget(1, 1, 'DSCDashFX.BlurV' + i, useHalfFloat));
    }

    var vertexShader = [
      'varying vec2 vUv;',
      'void main() {',
      '  vUv = uv;',
      '  gl_Position = vec4(position.xy, 0.0, 1.0);',
      '}'
    ].join('\n');

    var highPassMaterial = new THREE.ShaderMaterial({
      name: 'DSCDashFX.HighPass',
      uniforms: {
        tInput: { value: sceneTarget.texture },
        uThreshold: { value: 0.85 }
      },
      vertexShader: vertexShader,
      fragmentShader: [
        'uniform sampler2D tInput;',
        'uniform float uThreshold;',
        'varying vec2 vUv;',
        'void main() {',
        '  vec4 c = texture2D(tInput, vUv);',
        '  float brightness = max(max(c.r, c.g), c.b);',
        '  float knee = max(0.03, uThreshold * 0.18);',
        '  float contribution = smoothstep(uThreshold - knee, uThreshold + knee, brightness);',
        '  gl_FragColor = vec4(c.rgb * contribution, contribution);',
        '}'
      ].join('\n'),
      depthTest: false,
      depthWrite: false,
      toneMapped: false
    });

    var blurMaterial = new THREE.ShaderMaterial({
      name: 'DSCDashFX.GaussianBlur',
      uniforms: {
        tInput: { value: null },
        uDirection: { value: new THREE.Vector2(1, 0) },
        uTexelSize: { value: new THREE.Vector2(1, 1) }
      },
      vertexShader: vertexShader,
      fragmentShader: [
        'uniform sampler2D tInput;',
        'uniform vec2 uDirection;',
        'uniform vec2 uTexelSize;',
        'varying vec2 vUv;',
        'void main() {',
        '  vec2 stepUV = uDirection * uTexelSize;',
        '  vec4 sum = texture2D(tInput, vUv) * 0.227027;',
        '  sum += texture2D(tInput, vUv + stepUV * 1.384615) * 0.316216;',
        '  sum += texture2D(tInput, vUv - stepUV * 1.384615) * 0.316216;',
        '  sum += texture2D(tInput, vUv + stepUV * 3.230769) * 0.070270;',
        '  sum += texture2D(tInput, vUv - stepUV * 3.230769) * 0.070270;',
        '  gl_FragColor = sum;',
        '}'
      ].join('\n'),
      depthTest: false,
      depthWrite: false,
      toneMapped: false
    });

    var compositeUniforms = {
      tScene: { value: sceneTarget.texture },
      tBloom0: { value: verticalTargets[0].texture },
      tBloom1: { value: verticalTargets[1].texture },
      tBloom2: { value: verticalTargets[2].texture },
      tBloom3: { value: verticalTargets[3].texture },
      tBloom4: { value: verticalTargets[4].texture },
      uStrength: { value: 0.55 },
      uRadius: { value: 0.4 }
    };
    var compositeMaterial = new THREE.ShaderMaterial({
      name: 'DSCDashFX.Composite',
      uniforms: compositeUniforms,
      vertexShader: vertexShader,
      fragmentShader: [
        'uniform sampler2D tScene;',
        'uniform sampler2D tBloom0;',
        'uniform sampler2D tBloom1;',
        'uniform sampler2D tBloom2;',
        'uniform sampler2D tBloom3;',
        'uniform sampler2D tBloom4;',
        'uniform float uStrength;',
        'uniform float uRadius;',
        'varying vec2 vUv;',
        'void main() {',
        '  vec3 sceneColor = texture2D(tScene, vUv).rgb;',
        '  float r = clamp(uRadius, 0.0, 1.0);',
        '  vec3 tight = texture2D(tBloom0, vUv).rgb * 0.38',
        '    + texture2D(tBloom1, vUv).rgb * 0.27;',
        '  vec3 wide = texture2D(tBloom2, vUv).rgb * 0.18',
        '    + texture2D(tBloom3, vUv).rgb * 0.11',
        '    + texture2D(tBloom4, vUv).rgb * 0.06;',
        '  vec3 bloom = mix(tight, wide * 2.2, r);',
        '  gl_FragColor = vec4(sceneColor + bloom * uStrength, 1.0);',
        '  #include <tonemapping_fragment>',
        '  #include <colorspace_fragment>',
        '}'
      ].join('\n'),
      depthTest: false,
      depthWrite: false,
      toneMapped: true
    });

    var quad = new FullScreenQuad(highPassMaterial);
    var bloomPass = {};
    Object.defineProperties(bloomPass, {
      threshold: {
        enumerable: true,
        get: function () { return highPassMaterial.uniforms.uThreshold.value; },
        set: function (v) { highPassMaterial.uniforms.uThreshold.value = Number(v); }
      },
      strength: {
        enumerable: true,
        get: function () { return compositeUniforms.uStrength.value; },
        set: function (v) { compositeUniforms.uStrength.value = Number(v); }
      },
      radius: {
        enumerable: true,
        get: function () { return compositeUniforms.uRadius.value; },
        set: function (v) { compositeUniforms.uRadius.value = Number(v); }
      }
    });
    bloomPass.threshold = 0.85;
    bloomPass.strength = 0.55;
    bloomPass.radius = 0.4;

    function setSize(w, h) {
      if (disposed) return;
      width = Math.max(1, Math.floor(w));
      height = Math.max(1, Math.floor(h));
      sceneTarget.setSize(width, height);

      var mipW = Math.max(1, Math.floor(width / 2));
      var mipH = Math.max(1, Math.floor(height / 2));
      brightTarget.setSize(mipW, mipH);
      for (var level = 0; level < mipCount; level++) {
        horizontalTargets[level].setSize(mipW, mipH);
        verticalTargets[level].setSize(mipW, mipH);
        mipW = Math.max(1, Math.floor(mipW / 2));
        mipH = Math.max(1, Math.floor(mipH / 2));
      }
    }

    function render() {
      if (disposed) return;
      oldTarget = renderer.getRenderTarget();
      oldAutoClear = renderer.autoClear;
      oldClearAlpha = renderer.getClearAlpha();
      renderer.getClearColor(oldClearColor);
      renderer.autoClear = true;

      renderer.setRenderTarget(sceneTarget);
      renderer.clear(true, true, true);
      renderer.render(scene, camera);

      quad.material = highPassMaterial;
      highPassMaterial.uniforms.tInput.value = sceneTarget.texture;
      renderer.setRenderTarget(brightTarget);
      renderer.clear();
      quad.render(renderer);

      var inputTexture = brightTarget.texture;
      for (var level = 0; level < mipCount; level++) {
        var tw = horizontalTargets[level].width;
        var th = horizontalTargets[level].height;
        blurMaterial.uniforms.tInput.value = inputTexture;
        blurMaterial.uniforms.uTexelSize.value.set(1 / tw, 1 / th);
        blurMaterial.uniforms.uDirection.value.set(1, 0);
        quad.material = blurMaterial;
        renderer.setRenderTarget(horizontalTargets[level]);
        renderer.clear();
        quad.render(renderer);

        blurMaterial.uniforms.tInput.value = horizontalTargets[level].texture;
        blurMaterial.uniforms.uDirection.value.set(0, 1);
        renderer.setRenderTarget(verticalTargets[level]);
        renderer.clear();
        quad.render(renderer);
        inputTexture = verticalTargets[level].texture;
      }

      quad.material = compositeMaterial;
      renderer.setRenderTarget(oldTarget);
      if (oldTarget === null) renderer.clear();
      quad.render(renderer);

      renderer.autoClear = oldAutoClear;
      renderer.setClearColor(oldClearColor, oldClearAlpha);
      renderer.setRenderTarget(oldTarget);
    }

    function dispose() {
      if (disposed) return;
      disposed = true;
      sceneTarget.dispose();
      brightTarget.dispose();
      for (var level = 0; level < mipCount; level++) {
        horizontalTargets[level].dispose();
        verticalTargets[level].dispose();
      }
      highPassMaterial.dispose();
      blurMaterial.dispose();
      compositeMaterial.dispose();
      quad.dispose();
    }

    setSize(
      renderer.domElement ? renderer.domElement.width : 1,
      renderer.domElement ? renderer.domElement.height : 1
    );

    var composer = {
      render: render,
      setSize: setSize,
      dispose: dispose,
      readBuffer: sceneTarget,
      writeBuffer: sceneTarget
    };

    return {
      composer: composer,
      bloomPass: bloomPass,
      setSize: setSize,
      render: render,
      dispose: dispose
    };
  }

  function makeFlowRibbon(curve, opts) {
    opts = opts || {};
    var radius = opts.radius == null ? 0.04 : opts.radius;
    var tubular = opts.tubular == null ? 64 : Math.max(4, Math.floor(opts.tubular));
    var color = opts.color == null ? 0xffffff : opts.color;
    var opacity = opts.opacity == null ? 0.85 : opts.opacity;
    var dashArray = opts.dashArray || [0.14, 0.09];
    if (typeof dashArray === 'number') dashArray = [dashArray, dashArray];

    var geometry = new THREE.TubeGeometry(curve, tubular, radius, 6, false);
    var uniforms = {
      uDashOffset: { value: opts.dashOffset || 0 },
      uOpacity: { value: opacity },
      uColor: { value: new THREE.Color(color) },
      uDashArray: {
        value: new THREE.Vector2(
          Math.max(0.0001, dashArray[0]),
          Math.max(0.0001, dashArray[1])
        )
      }
    };
    var material = new THREE.ShaderMaterial({
      name: 'DSCDashFX.FlowRibbon',
      uniforms: uniforms,
      vertexShader: [
        'varying vec2 vUv;',
        'varying float vFacing;',
        'void main() {',
        '  vUv = uv;',
        '  vec3 n = normalize(normalMatrix * normal);',
        '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
        '  vFacing = 0.35 + 0.65 * abs(dot(n, normalize(-mv.xyz)));',
        '  gl_Position = projectionMatrix * mv;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform float uDashOffset;',
        'uniform float uOpacity;',
        'uniform vec3 uColor;',
        'uniform vec2 uDashArray;',
        'varying vec2 vUv;',
        'varying float vFacing;',
        'void main() {',
        '  float period = max(0.0002, uDashArray.x + uDashArray.y);',
        '  float phase = mod(vUv.x + uDashOffset, period);',
        '  float edge = max(fwidth(phase), 0.0015);',
        '  float dash = 1.0 - smoothstep(uDashArray.x - edge, uDashArray.x + edge, phase);',
        '  float rim = 0.72 + 0.28 * sin(vUv.y * 6.2831853);',
        '  float alpha = uOpacity * dash * rim * vFacing;',
        '  if (alpha < 0.004) discard;',
        '  gl_FragColor = vec4(uColor, alpha);',
        '  #include <tonemapping_fragment>',
        '  #include <colorspace_fragment>',
        '}'
      ].join('\n'),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      toneMapped: true
    });

    material.userData.uDashOffset = uniforms.uDashOffset;
    material.userData.uOpacity = uniforms.uOpacity;
    material.userData.uColor = uniforms.uColor;
    material.userData.uDashArray = uniforms.uDashArray;
    Object.defineProperty(material.userData, 'dashOffset', {
      enumerable: true,
      get: function () { return uniforms.uDashOffset.value; },
      set: function (value) { uniforms.uDashOffset.value = value; }
    });

    var mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'DSCDashFX.FlowRibbon';
    return mesh;
  }

  function createCurlHaze(renderer, count) {
    count = count == null ? 800 : Math.max(1, Math.floor(count));
    var positions = new Float32Array(count * 3);
    var seeds = new Float32Array(count * 3);
    var i;
    for (i = 0; i < count; i++) {
      var j = i * 3;
      positions[j] = (Math.random() - 0.5) * 12;
      positions[j + 1] = (Math.random() - 0.5) * 5;
      positions[j + 2] = (Math.random() - 0.5) * 12;
      seeds[j] = Math.random() * 6.2831853;
      seeds[j + 1] = 0.25 + Math.random() * 0.75;
      seeds[j + 2] = Math.random();
    }

    var geometry = new THREE.BufferGeometry();
    var positionAttribute = new THREE.BufferAttribute(positions, 3);
    positionAttribute.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute('position', positionAttribute);
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 3));
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 10);

    var uniforms = {
      uOpacity: { value: 0.14 },
      uPointSize: { value: 16 * (renderer.getPixelRatio ? renderer.getPixelRatio() : 1) },
      uColor: { value: new THREE.Color(0x8fcfff) }
    };
    var material = new THREE.ShaderMaterial({
      name: 'DSCDashFX.CurlHaze',
      uniforms: uniforms,
      vertexShader: [
        'attribute vec3 aSeed;',
        'varying float vAlpha;',
        'uniform float uPointSize;',
        'void main() {',
        '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
        '  float depthScale = clamp(90.0 / max(1.0, -mv.z), 0.5, 4.0);',
        '  gl_PointSize = uPointSize * mix(0.35, 0.9, aSeed.z) * depthScale;',
        '  vAlpha = mix(0.35, 1.0, aSeed.z);',
        '  gl_Position = projectionMatrix * mv;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform vec3 uColor;',
        'uniform float uOpacity;',
        'varying float vAlpha;',
        'void main() {',
        '  vec2 p = gl_PointCoord - 0.5;',
        '  float d = length(p) * 2.0;',
        '  float glow = exp(-4.8 * d * d) * (1.0 - smoothstep(0.72, 1.0, d));',
        '  gl_FragColor = vec4(uColor, glow * uOpacity * vAlpha);',
        '}'
      ].join('\n'),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false
    });
    var points = new THREE.Points(geometry, material);
    points.name = 'DSCDashFX.CurlHaze';
    points.frustumCulled = false;

    var elapsed = 0;
    var disposed = false;
    function update(dt, intensity) {
      if (disposed) return;
      dt = Math.min(Math.max(Number(dt) || 0, 0), 0.05);
      intensity = intensity == null ? 1 : Math.max(0, Number(intensity) || 0);
      elapsed += dt;
      var speed = dt * (0.22 + intensity * 0.34);
      for (var index = 0; index < count; index++) {
        var p = index * 3;
        var x = positions[p];
        var y = positions[p + 1];
        var z = positions[p + 2];
        var phase = seeds[p] + elapsed * (0.08 + seeds[p + 1] * 0.08);

        var vx = Math.sin(y * 0.72 + phase) - Math.cos(z * 0.48 - phase);
        var vy = Math.sin(z * 0.55 + phase * 0.7) - Math.cos(x * 0.42 + phase);
        var vz = Math.sin(x * 0.63 - phase * 0.8) - Math.cos(y * 0.57 + phase);
        positions[p] = x + vx * speed;
        positions[p + 1] = y + vy * speed * 0.58 + dt * 0.035;
        positions[p + 2] = z + vz * speed;

        if (positions[p] > 6) positions[p] = -6;
        else if (positions[p] < -6) positions[p] = 6;
        if (positions[p + 1] > 2.5) positions[p + 1] = -2.5;
        else if (positions[p + 1] < -2.5) positions[p + 1] = 2.5;
        if (positions[p + 2] > 6) positions[p + 2] = -6;
        else if (positions[p + 2] < -6) positions[p + 2] = 6;
      }
      positionAttribute.needsUpdate = true;
      uniforms.uOpacity.value = Math.min(0.32, 0.045 + intensity * 0.095);
    }

    function dispose() {
      if (disposed) return;
      disposed = true;
      geometry.dispose();
      material.dispose();
    }

    return { points: points, update: update, dispose: dispose };
  }

  function createColorRamp(stops) {
    var source = Array.isArray(stops) && stops.length
      ? stops.slice()
      : [{ t: 0, color: 0x000000 }, { t: 1, color: 0xffffff }];
    source.sort(function (a, b) { return a.t - b.t; });

    var size = 256;
    var data = new Uint8Array(size * 4);
    function channels(value) {
      var hex = typeof value === 'number'
        ? value >>> 0
        : new THREE.Color(value).getHex(THREE.SRGBColorSpace);
      return [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255];
    }

    var segment = 0;
    for (var i = 0; i < size; i++) {
      var t = i / (size - 1);
      while (segment < source.length - 2 && t > source[segment + 1].t) segment++;
      var a = source[segment];
      var b = source[Math.min(segment + 1, source.length - 1)];
      var span = Math.max(0.000001, b.t - a.t);
      var mix = Math.max(0, Math.min(1, (t - a.t) / span));
      var ca = channels(a.color);
      var cb = channels(b.color);
      var offset = i * 4;
      data[offset] = Math.round(ca[0] + (cb[0] - ca[0]) * mix);
      data[offset + 1] = Math.round(ca[1] + (cb[1] - ca[1]) * mix);
      data[offset + 2] = Math.round(ca[2] + (cb[2] - ca[2]) * mix);
      data[offset + 3] = 255;
    }

    var texture = new THREE.DataTexture(data, size, 1, THREE.RGBAFormat, THREE.UnsignedByteType);
    texture.name = 'DSCDashFX.ColorRamp';
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    return setTextureSRGB(texture);
  }

  THREE.DSCDashFX = Object.freeze({
    createSoftSpriteTexture: createSoftSpriteTexture,
    createComposer: createComposer,
    makeFlowRibbon: makeFlowRibbon,
    createCurlHaze: createCurlHaze,
    createColorRamp: createColorRamp
  });
})(typeof globalThis !== 'undefined' ? globalThis : this);
