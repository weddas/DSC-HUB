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

    // DepthTexture soft-intersection is optional. Prefer it when the FBO is
    // complete; otherwise bloom still runs and particles use view-Z fade.
    // Never attach DepthTexture on HalfFloat targets (incomplete FBO → black).
    var sceneTarget = makeTarget(1, 1, 'DSCDashFX.Scene', false);
    sceneTarget.depthBuffer = true;
    sceneTarget.stencilBuffer = false;
    var depthTexture = null;
    var depthAttachmentFailed = false;
    function attachDepthTexture() {
      if (!THREE.DepthTexture || depthAttachmentFailed) return;
      try {
        depthTexture = new THREE.DepthTexture(1, 1);
        depthTexture.name = 'DSCDashFX.Depth';
        if (THREE.DepthFormat != null) depthTexture.format = THREE.DepthFormat;
        var isWebGL2 = !!(renderer.capabilities && renderer.capabilities.isWebGL2);
        if (isWebGL2 && THREE.UnsignedIntType != null) depthTexture.type = THREE.UnsignedIntType;
        else if (THREE.UnsignedShortType != null) depthTexture.type = THREE.UnsignedShortType;
        depthTexture.minFilter = THREE.NearestFilter;
        depthTexture.magFilter = THREE.NearestFilter;
        depthTexture.generateMipmaps = false;
        sceneTarget.depthTexture = depthTexture;
      } catch (err) {
        depthTexture = null;
        sceneTarget.depthTexture = null;
        depthAttachmentFailed = true;
        if (root.console && root.console.warn) {
          root.console.warn('dsc-dash-fx: DepthTexture unavailable, soft particles use view-Z fade only', err);
        }
      }
    }
    attachDepthTexture();
    // Default: detach immediately unless FEATURES.depthSoftParticles opt-in.
    // Soft-particle shaders still sample tDepth when enableDepthTexture() reattaches.
    if (depthTexture && !FEATURES.depthSoftParticles) {
      try { sceneTarget.depthTexture = null; } catch (_) {}
      try { depthTexture.dispose(); } catch (_) {}
      depthTexture = null;
    }

    function enableDepthTexture(force) {
      if (force) FEATURES.depthSoftParticles = true;
      if (!FEATURES.depthSoftParticles) return false;
      depthAttachmentFailed = false;
      if (!depthTexture) attachDepthTexture();
      syncSoftParticleUniforms();
      return !!depthTexture;
    }
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

    var softParticleMaterials = [];
    // depthAttachmentFailed declared with DepthTexture setup above

    function registerSoftParticleMaterial(material) {
      if (material && softParticleMaterials.indexOf(material) < 0) {
        softParticleMaterials.push(material);
      }
    }

    function syncSoftParticleUniforms() {
      var near = camera.near || 0.1;
      var far = camera.far || 80;
      for (var i = 0; i < softParticleMaterials.length; i++) {
        var uniforms = softParticleMaterials[i].uniforms;
        if (!uniforms) continue;
        if (uniforms.tDepth) uniforms.tDepth.value = depthTexture;
        if (uniforms.uResolution) uniforms.uResolution.value.set(width, height);
        if (uniforms.uCameraNear) uniforms.uCameraNear.value = near;
        if (uniforms.uCameraFar) uniforms.uCameraFar.value = far;
        if (uniforms.uHasDepth) uniforms.uHasDepth.value = depthTexture ? 1 : 0;
      }
    }

    function disableDepthTexture(reason) {
      if (depthAttachmentFailed && !depthTexture) return;
      depthAttachmentFailed = true;
      try {
        sceneTarget.depthTexture = null;
      } catch (_) {}
      if (depthTexture) {
        try { depthTexture.dispose(); } catch (_) {}
      }
      depthTexture = null;
      for (var i = 0; i < softParticleMaterials.length; i++) {
        var uniforms = softParticleMaterials[i].uniforms;
        if (uniforms && uniforms.uHasDepth) uniforms.uHasDepth.value = 0;
        if (uniforms && uniforms.tDepth) uniforms.tDepth.value = null;
      }
      if (root.console && root.console.warn) {
        root.console.warn('dsc-dash-fx: DepthTexture disabled (' + reason + '); solids still render');
      }
    }

    function setSize(w, h) {
      if (disposed) return;
      width = Math.max(1, Math.floor(w));
      height = Math.max(1, Math.floor(h));
      sceneTarget.setSize(width, height);
      if (depthTexture) {
        depthTexture.image = depthTexture.image || {};
        depthTexture.image.width = width;
        depthTexture.image.height = height;
        depthTexture.needsUpdate = true;
      }

      var mipW = Math.max(1, Math.floor(width / 2));
      var mipH = Math.max(1, Math.floor(height / 2));
      brightTarget.setSize(mipW, mipH);
      for (var level = 0; level < mipCount; level++) {
        horizontalTargets[level].setSize(mipW, mipH);
        verticalTargets[level].setSize(mipW, mipH);
        mipW = Math.max(1, Math.floor(mipW / 2));
        mipH = Math.max(1, Math.floor(mipH / 2));
      }

      if (depthTexture && !depthAttachmentFailed) {
        try {
          var gl = renderer.getContext();
          var prev = renderer.getRenderTarget();
          renderer.setRenderTarget(sceneTarget);
          var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
          renderer.setRenderTarget(prev);
          if (status !== gl.FRAMEBUFFER_COMPLETE) {
            disableDepthTexture('FBO status ' + status);
            sceneTarget.setSize(width, height);
          }
        } catch (err) {
          disableDepthTexture('FBO check threw');
        }
      }
    }

    function render() {
      if (disposed) return;
      oldTarget = renderer.getRenderTarget();
      oldAutoClear = renderer.autoClear;
      oldClearAlpha = renderer.getClearAlpha();
      renderer.getClearColor(oldClearColor);
      renderer.autoClear = true;

      var prevMask = camera.layers.mask;
      try {
        syncSoftParticleUniforms();
        renderer.setRenderTarget(sceneTarget);
        renderer.clear(true, true, true);
        if (depthTexture) {
          // Depth soft-particles: solids first (layer 0), then air (layer 1)
          camera.layers.set(0);
          renderer.render(scene, camera);
          camera.layers.set(1);
          renderer.autoClear = false;
          renderer.setRenderTarget(sceneTarget);
          renderer.render(scene, camera);
        } else {
          // Safe path: one pass, all layers (particles stay on layer 0 when no depth tex)
          camera.layers.enable(0);
          camera.layers.enable(1);
          renderer.render(scene, camera);
        }
      } catch (err) {
        camera.layers.mask = prevMask;
        disableDepthTexture('scene pass threw');
        renderer.setRenderTarget(oldTarget);
        renderer.autoClear = oldAutoClear;
        renderer.setClearColor(oldClearColor, oldClearAlpha);
        camera.layers.enable(0);
        camera.layers.enable(1);
        renderer.render(scene, camera);
        camera.layers.mask = prevMask;
        return;
      }
      camera.layers.mask = prevMask;

      quad.material = highPassMaterial;
      highPassMaterial.uniforms.tInput.value = sceneTarget.texture;
      renderer.setRenderTarget(brightTarget);
      renderer.autoClear = true;
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
      if (depthTexture) depthTexture.dispose();
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
      dispose: dispose,
      get depthTexture() { return depthTexture; },
      disableDepthTexture: disableDepthTexture,
      enableDepthTexture: enableDepthTexture,
      registerSoftParticleMaterial: registerSoftParticleMaterial
    };
  }

  var _tmpTangent = new THREE.Vector3();
  var _tmpSide = new THREE.Vector3();
  var _tmpUp = new THREE.Vector3(0, 1, 0);
  var _tmpPoint = new THREE.Vector3();

  var FEATURES = {
    meshLineRibbon: true,
    gpuCurlHaze: true,
    tubeRibbonFallback: false,
    cpuCurlHazeFallback: false,
    // WebKit/Chromium: DepthTexture on color FBO often breaks opaque depth clears.
    // Keep false by default; enableDepthTexture() / FEATURES.depthSoftParticles for opt-in.
    depthSoftParticles: false
  };

  function buildMeshLineGeometry(curve, segments, radius) {
    segments = Math.max(4, Math.floor(segments));
    radius = Math.max(0.0001, radius);
    var count = segments + 1;
    var positions = new Float32Array(count * 6);
    var previous = new Float32Array(count * 6);
    var next = new Float32Array(count * 6);
    var sideAttr = new Float32Array(count * 2);
    var uvs = new Float32Array(count * 4);
    var indices = new Uint16Array(segments * 6);
    var point = _tmpPoint;
    var i;
    var ii = 0;
    var pts = [];

    for (i = 0; i < count; i++) {
      curve.getPoint(i / segments, point);
      pts.push(point.clone());
    }

    for (i = 0; i < count; i++) {
      var curr = pts[i];
      var prev = pts[i === 0 ? i : i - 1];
      var nxt = pts[i === count - 1 ? i : i + 1];
      var vi = i * 2;
      var t = i / segments;

      positions[vi * 3] = curr.x;
      positions[vi * 3 + 1] = curr.y;
      positions[vi * 3 + 2] = curr.z;
      positions[(vi + 1) * 3] = curr.x;
      positions[(vi + 1) * 3 + 1] = curr.y;
      positions[(vi + 1) * 3 + 2] = curr.z;

      previous[vi * 3] = prev.x;
      previous[vi * 3 + 1] = prev.y;
      previous[vi * 3 + 2] = prev.z;
      previous[(vi + 1) * 3] = prev.x;
      previous[(vi + 1) * 3 + 1] = prev.y;
      previous[(vi + 1) * 3 + 2] = prev.z;

      next[vi * 3] = nxt.x;
      next[vi * 3 + 1] = nxt.y;
      next[vi * 3 + 2] = nxt.z;
      next[(vi + 1) * 3] = nxt.x;
      next[(vi + 1) * 3 + 1] = nxt.y;
      next[(vi + 1) * 3 + 2] = nxt.z;

      sideAttr[vi] = 1;
      sideAttr[vi + 1] = -1;
      uvs[vi * 2] = t;
      uvs[vi * 2 + 1] = 0;
      uvs[(vi + 1) * 2] = t;
      uvs[(vi + 1) * 2 + 1] = 1;

      if (i > 0) {
        var base = (i - 1) * 2;
        indices[ii++] = base;
        indices[ii++] = base + 1;
        indices[ii++] = base + 2;
        indices[ii++] = base + 1;
        indices[ii++] = base + 3;
        indices[ii++] = base + 2;
      }
    }

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('previous', new THREE.BufferAttribute(previous, 3));
    geometry.setAttribute('next', new THREE.BufferAttribute(next, 3));
    geometry.setAttribute('side', new THREE.BufferAttribute(sideAttr, 1));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.userData.meshLineRadius = radius;
    return geometry;
  }

  function rebuildFlowRibbonGeometry(mesh, curve, tubular, radius) {
    if (!mesh || !curve) return null;
    var meta = mesh.userData && mesh.userData.flowRibbon;
    if (meta) {
      meta.tubular = tubular == null ? meta.tubular : Math.max(4, Math.floor(tubular));
      meta.radius = radius == null ? meta.radius : radius;
      meta.curve = curve;
    }
    var geometry = FEATURES.meshLineRibbon && !FEATURES.tubeRibbonFallback
      ? buildMeshLineGeometry(curve, meta ? meta.tubular : tubular, meta ? meta.radius : radius)
      : new THREE.TubeGeometry(
        curve,
        meta ? meta.tubular : tubular,
        meta ? meta.radius : radius,
        6,
        false
      );
    if (mesh.geometry) mesh.geometry.dispose();
    mesh.geometry = geometry;
    return geometry;
  }

  function makeFlowRibbon(curve, opts) {
    opts = opts || {};
    var radius = opts.radius == null ? 0.04 : opts.radius;
    var tubular = opts.tubular == null ? 64 : Math.max(4, Math.floor(opts.tubular));
    var color = opts.color == null ? 0xffffff : opts.color;
    var opacity = opts.opacity == null ? 0.85 : opts.opacity;
    var dashArray = opts.dashArray || [0.14, 0.09];
    if (typeof dashArray === 'number') dashArray = [dashArray, dashArray];

    var geometry;
    try {
      geometry = FEATURES.meshLineRibbon && !FEATURES.tubeRibbonFallback
        ? buildMeshLineGeometry(curve, tubular, radius)
        : new THREE.TubeGeometry(curve, tubular, radius, 6, false);
    } catch (err) {
      FEATURES.meshLineRibbon = false;
      FEATURES.tubeRibbonFallback = true;
      geometry = new THREE.TubeGeometry(curve, tubular, radius, 6, false);
    }

    var uniforms = {
      uDashOffset: { value: opts.dashOffset || 0 },
      uOpacity: { value: opacity },
      uColor: { value: new THREE.Color(color) },
      uDashArray: {
        value: new THREE.Vector2(
          Math.max(0.0001, dashArray[0]),
          Math.max(0.0001, dashArray[1])
        )
      },
      uLineWidth: { value: radius * 180 },
      uResolution: {
        value: new THREE.Vector2(
          (typeof root !== 'undefined' && root.innerWidth) || 1280,
          (typeof root !== 'undefined' && root.innerHeight) || 720
        )
      }
    };
    var useMeshLine = !!(FEATURES.meshLineRibbon && !FEATURES.tubeRibbonFallback && geometry.getAttribute('previous'));
    var material = new THREE.ShaderMaterial({
      name: 'DSCDashFX.FlowRibbon',
      uniforms: uniforms,
      vertexShader: useMeshLine
        ? [
          'attribute vec3 previous;',
          'attribute vec3 next;',
          'attribute float side;',
          'uniform float uLineWidth;',
          'uniform vec2 uResolution;',
          'varying vec2 vUv;',
          'varying float vFacing;',
          'void main() {',
          '  vUv = uv;',
          '  vec4 currProj = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
          '  vec4 prevProj = projectionMatrix * modelViewMatrix * vec4(previous, 1.0);',
          '  vec4 nextProj = projectionMatrix * modelViewMatrix * vec4(next, 1.0);',
          '  vec2 curr = currProj.xy / max(0.0001, currProj.w);',
          '  vec2 prev = prevProj.xy / max(0.0001, prevProj.w);',
          '  vec2 nextp = nextProj.xy / max(0.0001, nextProj.w);',
          '  vec2 dir = normalize(nextp - prev);',
          '  if (length(nextp - curr) < 0.00001) dir = normalize(curr - prev);',
          '  else if (length(curr - prev) < 0.00001) dir = normalize(nextp - curr);',
          '  vec2 normal = vec2(-dir.y, dir.x);',
          '  float aspect = uResolution.x / max(1.0, uResolution.y);',
          '  normal.x /= aspect;',
          '  float pixelWidth = uLineWidth / max(1.0, uResolution.y);',
          '  currProj.xy += normal * side * pixelWidth * currProj.w;',
          '  vFacing = 0.55 + 0.45 * abs(side);',
          '  gl_Position = currProj;',
          '}'
        ].join('\n')
        : [
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
    material.userData.uLineWidth = uniforms.uLineWidth;
    material.userData.uResolution = uniforms.uResolution;
    Object.defineProperty(material.userData, 'dashOffset', {
      enumerable: true,
      get: function () { return uniforms.uDashOffset.value; },
      set: function (value) { uniforms.uDashOffset.value = value; }
    });

    var mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'DSCDashFX.FlowRibbon';
    mesh.userData.flowRibbon = { curve: curve, tubular: tubular, radius: radius, meshLine: useMeshLine };
    mesh.userData.rebuildFlowRibbon = function (nextRadius) {
      var r = nextRadius == null ? mesh.userData.flowRibbon.radius : nextRadius;
      mesh.userData.flowRibbon.radius = r;
      if (uniforms.uLineWidth) uniforms.uLineWidth.value = r * 180;
      return rebuildFlowRibbonGeometry(
        mesh,
        mesh.userData.flowRibbon.curve,
        mesh.userData.flowRibbon.tubular,
        r
      );
    };
    return mesh;
  }

  function createCurlHazeCpuFallback(renderer, count, positions, seeds, positionAttribute) {
    var uniforms = {
      uOpacity: { value: 0.14 },
      uPointSize: { value: 16 * (renderer.getPixelRatio ? renderer.getPixelRatio() : 1) },
      uColor: { value: new THREE.Color(0x8fcfff) },
      tDepth: { value: null },
      uHasDepth: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uCameraNear: { value: 0.1 },
      uCameraFar: { value: 80 },
      uSoftness: { value: 0.85 }
    };
    var material = new THREE.ShaderMaterial({
      name: 'DSCDashFX.CurlHaze',
      uniforms: uniforms,
      vertexShader: [
        'attribute vec3 aSeed;',
        'varying float vAlpha;',
        'varying float vViewZ;',
        'uniform float uPointSize;',
        'void main() {',
        '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
        '  vViewZ = -mv.z;',
        '  float depthScale = clamp(90.0 / max(1.0, vViewZ), 0.5, 4.0);',
        '  gl_PointSize = uPointSize * mix(0.35, 0.9, aSeed.z) * depthScale;',
        '  vAlpha = mix(0.35, 1.0, aSeed.z);',
        '  gl_Position = projectionMatrix * mv;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform vec3 uColor;',
        'uniform float uOpacity;',
        'uniform sampler2D tDepth;',
        'uniform float uHasDepth;',
        'uniform vec2 uResolution;',
        'uniform float uCameraNear;',
        'uniform float uCameraFar;',
        'uniform float uSoftness;',
        'varying float vAlpha;',
        'varying float vViewZ;',
        'float perspDepthToViewZ(float d, float near, float far) {',
        '  float z = d * 2.0 - 1.0;',
        '  return (2.0 * near * far) / (far + near - z * (far - near));',
        '}',
        'void main() {',
        '  vec2 p = gl_PointCoord - 0.5;',
        '  float d = length(p) * 2.0;',
        '  float glow = exp(-4.8 * d * d) * (1.0 - smoothstep(0.72, 1.0, d));',
        '  float alpha = glow * uOpacity * vAlpha;',
        '  if (uHasDepth > 0.5) {',
        '    vec2 screenUv = gl_FragCoord.xy / uResolution;',
        '    float sceneD = texture2D(tDepth, screenUv).x;',
        '    float sceneZ = perspDepthToViewZ(sceneD, uCameraNear, uCameraFar);',
        '    float dz = sceneZ - vViewZ;',
        '    alpha *= smoothstep(0.0, uSoftness, dz);',
        '  }',
        '  if (alpha < 0.004) discard;',
        '  gl_FragColor = vec4(uColor, alpha);',
        '}'
      ].join('\n'),
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false
    });
    var cpuGeometry = new THREE.BufferGeometry();
    cpuGeometry.setAttribute('position', positionAttribute);
    cpuGeometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 3));
    cpuGeometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 10);
    var points = new THREE.Points(cpuGeometry, material);
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
      points.geometry.dispose();
      material.dispose();
    }

    return { points: points, material: material, update: update, dispose: dispose };
  }

  function createCurlHaze(renderer, count) {
    count = count == null ? 800 : Math.max(1, Math.floor(count));
    var bases = new Float32Array(count * 3);
    var seeds = new Float32Array(count * 3);
    var i;
    for (i = 0; i < count; i++) {
      var j = i * 3;
      bases[j] = (Math.random() - 0.5) * 12;
      bases[j + 1] = (Math.random() - 0.5) * 5;
      bases[j + 2] = (Math.random() - 0.5) * 12;
      seeds[j] = Math.random() * 6.2831853;
      seeds[j + 1] = 0.25 + Math.random() * 0.75;
      seeds[j + 2] = Math.random();
    }

    if (!FEATURES.gpuCurlHaze || FEATURES.cpuCurlHazeFallback) {
      var cpuPositions = bases.slice();
      var cpuAttribute = new THREE.BufferAttribute(cpuPositions, 3);
      cpuAttribute.setUsage(THREE.DynamicDrawUsage);
      FEATURES.cpuCurlHazeFallback = true;
      return createCurlHazeCpuFallback(renderer, count, cpuPositions, seeds, cpuAttribute);
    }

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('aBasePosition', new THREE.BufferAttribute(bases, 3));
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 3));
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(count * 3), 3)
    );
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 10);

    var uniforms = {
      uOpacity: { value: 0.14 },
      uPointSize: { value: 16 * (renderer.getPixelRatio ? renderer.getPixelRatio() : 1) },
      uColor: { value: new THREE.Color(0x8fcfff) },
      uTime: { value: 0 },
      uIntensity: { value: 1 },
      tDepth: { value: null },
      uHasDepth: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uCameraNear: { value: 0.1 },
      uCameraFar: { value: 80 },
      uSoftness: { value: 0.85 }
    };
    var material = new THREE.ShaderMaterial({
      name: 'DSCDashFX.CurlHaze',
      uniforms: uniforms,
      vertexShader: [
        'attribute vec3 aBasePosition;',
        'attribute vec3 aSeed;',
        'uniform float uTime;',
        'uniform float uIntensity;',
        'varying float vAlpha;',
        'varying float vViewZ;',
        'uniform float uPointSize;',
        'vec3 wrapVolume(vec3 p) {',
        '  p.x = mod(p.x + 6.0, 12.0) - 6.0;',
        '  p.y = mod(p.y + 2.5, 5.0) - 2.5;',
        '  p.z = mod(p.z + 6.0, 12.0) - 6.0;',
        '  return p;',
        '}',
        'vec3 curlVelocity(vec3 p, float phase) {',
        '  return vec3(',
        '    sin(p.y * 0.72 + phase) - cos(p.z * 0.48 - phase),',
        '    sin(p.z * 0.55 + phase * 0.7) - cos(p.x * 0.42 + phase),',
        '    sin(p.x * 0.63 - phase * 0.8) - cos(p.y * 0.57 + phase)',
        '  );',
        '}',
        'vec3 advectCurl(vec3 base, float time, vec3 seed, float intensity) {',
        '  float phase = seed.x + time * (0.08 + seed.y * 0.08);',
        '  float t = time * (0.22 + intensity * 0.34);',
        '  vec3 p = base;',
        '  vec3 v0 = curlVelocity(p, phase);',
        '  vec3 v1 = curlVelocity(p + v0 * 0.45, phase + 0.37);',
        '  vec3 v2 = curlVelocity(p + v1 * 0.45, phase + 0.74);',
        '  vec3 drift = (v0 + v1 + v2) * (t * 0.33);',
        '  drift.y = drift.y * 0.58 + time * 0.035;',
        '  return wrapVolume(base + drift);',
        '}',
        'void main() {',
        '  vec3 worldPos = advectCurl(aBasePosition, uTime, aSeed, uIntensity);',
        '  vec4 mv = modelViewMatrix * vec4(worldPos, 1.0);',
        '  vViewZ = -mv.z;',
        '  float depthScale = clamp(90.0 / max(1.0, vViewZ), 0.5, 4.0);',
        '  gl_PointSize = uPointSize * mix(0.35, 0.9, aSeed.z) * depthScale;',
        '  vAlpha = mix(0.35, 1.0, aSeed.z);',
        '  gl_Position = projectionMatrix * mv;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform vec3 uColor;',
        'uniform float uOpacity;',
        'uniform sampler2D tDepth;',
        'uniform float uHasDepth;',
        'uniform vec2 uResolution;',
        'uniform float uCameraNear;',
        'uniform float uCameraFar;',
        'uniform float uSoftness;',
        'varying float vAlpha;',
        'varying float vViewZ;',
        'float perspDepthToViewZ(float d, float near, float far) {',
        '  float z = d * 2.0 - 1.0;',
        '  return (2.0 * near * far) / (far + near - z * (far - near));',
        '}',
        'void main() {',
        '  vec2 p = gl_PointCoord - 0.5;',
        '  float d = length(p) * 2.0;',
        '  float glow = exp(-4.8 * d * d) * (1.0 - smoothstep(0.72, 1.0, d));',
        '  float alpha = glow * uOpacity * vAlpha;',
        '  if (uHasDepth > 0.5) {',
        '    vec2 screenUv = gl_FragCoord.xy / uResolution;',
        '    float sceneD = texture2D(tDepth, screenUv).x;',
        '    float sceneZ = perspDepthToViewZ(sceneD, uCameraNear, uCameraFar);',
        '    float dz = sceneZ - vViewZ;',
        '    alpha *= smoothstep(0.0, uSoftness, dz);',
        '  }',
        '  if (alpha < 0.004) discard;',
        '  gl_FragColor = vec4(uColor, alpha);',
        '}'
      ].join('\n'),
      transparent: true,
      depthWrite: false,
      depthTest: false,
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
      uniforms.uTime.value = elapsed;
      uniforms.uIntensity.value = intensity;
      uniforms.uOpacity.value = Math.min(0.32, 0.045 + intensity * 0.095);
    }

    function dispose() {
      if (disposed) return;
      disposed = true;
      geometry.dispose();
      material.dispose();
    }

    return { points: points, material: material, update: update, dispose: dispose };
  }

  /** GPU (or CPU fallback) curl confined to an AABB — for in-tent mixing, not room fog. */
  function createConfinedCurlHaze(renderer, opts) {
    opts = opts || {};
    var count = opts.count == null ? 64 : Math.max(8, Math.floor(opts.count));
    var center = opts.center || new THREE.Vector3(0, 1, 0);
    var half = opts.halfExtents || new THREE.Vector3(1, 0.8, 0.8);
    var color = opts.color == null ? 0x8fcfff : opts.color;

    var bases = new Float32Array(count * 3);
    var seeds = new Float32Array(count * 3);
    var i;
    for (i = 0; i < count; i++) {
      var j = i * 3;
      bases[j] = (Math.random() * 2 - 1) * half.x;
      bases[j + 1] = (Math.random() * 2 - 1) * half.y;
      bases[j + 2] = (Math.random() * 2 - 1) * half.z;
      seeds[j] = Math.random() * 6.2831853;
      seeds[j + 1] = 0.25 + Math.random() * 0.75;
      seeds[j + 2] = Math.random();
    }

    function wrapLocal(p, hx, hy, hz) {
      if (p > hx) return p - hx * 2;
      if (p < -hx) return p + hx * 2;
      return p;
    }

    if (!FEATURES.gpuCurlHaze || FEATURES.cpuCurlHazeFallback) {
      var cpuPositions = bases.slice();
      for (i = 0; i < count; i++) {
        cpuPositions[i * 3] += center.x;
        cpuPositions[i * 3 + 1] += center.y;
        cpuPositions[i * 3 + 2] += center.z;
      }
      var cpuAttribute = new THREE.BufferAttribute(cpuPositions, 3);
      cpuAttribute.setUsage(THREE.DynamicDrawUsage);
      var fallback = createCurlHazeCpuFallback(renderer, count, cpuPositions, seeds, cpuAttribute);
      fallback.material.uniforms.uColor.value.set(color);
      var baseUpdate = fallback.update;
      fallback.update = function (dt, intensity) {
        baseUpdate(dt, intensity);
        // Re-confine after free curl step
        var pos = cpuPositions;
        for (var k = 0; k < count; k++) {
          var p = k * 3;
          var lx = pos[p] - center.x;
          var ly = pos[p + 1] - center.y;
          var lz = pos[p + 2] - center.z;
          lx = wrapLocal(lx, half.x, half.y, half.z);
          ly = wrapLocal(ly, half.y, half.x, half.z);
          lz = wrapLocal(lz, half.z, half.x, half.y);
          pos[p] = center.x + lx;
          pos[p + 1] = center.y + ly;
          pos[p + 2] = center.z + lz;
        }
        cpuAttribute.needsUpdate = true;
        fallback.material.uniforms.uOpacity.value = Math.min(0.42, 0.06 + (intensity || 0) * 0.28);
      };
      return fallback;
    }

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('aBasePosition', new THREE.BufferAttribute(bases, 3));
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 3));
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    geometry.boundingSphere = new THREE.Sphere(center.clone(), half.length() + 0.5);

    var uniforms = {
      uOpacity: { value: 0.14 },
      uPointSize: { value: 12 * (renderer.getPixelRatio ? renderer.getPixelRatio() : 1) },
      uColor: { value: new THREE.Color(color) },
      uTime: { value: 0 },
      uIntensity: { value: 1 },
      uCenter: { value: center.clone() },
      uHalf: { value: half.clone() },
      tDepth: { value: null },
      uHasDepth: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uCameraNear: { value: 0.1 },
      uCameraFar: { value: 80 },
      uSoftness: { value: 0.85 }
    };
    var material = new THREE.ShaderMaterial({
      name: 'DSCDashFX.ConfinedCurl',
      uniforms: uniforms,
      vertexShader: [
        'attribute vec3 aBasePosition;',
        'attribute vec3 aSeed;',
        'uniform float uTime;',
        'uniform float uIntensity;',
        'uniform vec3 uCenter;',
        'uniform vec3 uHalf;',
        'varying float vAlpha;',
        'varying float vViewZ;',
        'uniform float uPointSize;',
        'vec3 curlVelocity(vec3 p, float phase) {',
        '  return vec3(',
        '    sin(p.y * 1.4 + phase) - cos(p.z * 1.1 - phase),',
        '    sin(p.z * 1.2 + phase * 0.7) - cos(p.x * 0.9 + phase),',
        '    sin(p.x * 1.3 - phase * 0.8) - cos(p.y * 1.05 + phase)',
        '  );',
        '}',
        'float wrap1(float v, float h) {',
        '  float span = max(0.001, h * 2.0);',
        '  return mod(v + h, span) - h;',
        '}',
        'void main() {',
        '  float phase = aSeed.x + uTime * (0.1 + aSeed.y * 0.1);',
        '  float t = uTime * (0.18 + uIntensity * 0.28);',
        '  vec3 p = aBasePosition;',
        '  vec3 v0 = curlVelocity(p, phase);',
        '  vec3 v1 = curlVelocity(p + v0 * 0.35, phase + 0.4);',
        '  vec3 drift = (v0 + v1) * (t * 0.28);',
        '  p = aBasePosition + drift;',
        '  p.x = wrap1(p.x, uHalf.x);',
        '  p.y = wrap1(p.y, uHalf.y);',
        '  p.z = wrap1(p.z, uHalf.z);',
        '  vec3 worldPos = uCenter + p;',
        '  vec4 mv = modelViewMatrix * vec4(worldPos, 1.0);',
        '  vViewZ = -mv.z;',
        '  float depthScale = clamp(70.0 / max(1.0, vViewZ), 0.5, 3.5);',
        '  gl_PointSize = uPointSize * mix(0.4, 0.95, aSeed.z) * depthScale;',
        '  vAlpha = mix(0.4, 1.0, aSeed.z);',
        '  gl_Position = projectionMatrix * mv;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform vec3 uColor;',
        'uniform float uOpacity;',
        'varying float vAlpha;',
        'varying float vViewZ;',
        'void main() {',
        '  vec2 p = gl_PointCoord - 0.5;',
        '  float d = length(p) * 2.0;',
        '  float glow = exp(-5.2 * d * d) * (1.0 - smoothstep(0.7, 1.0, d));',
        '  float alpha = glow * uOpacity * vAlpha * smoothstep(0.2, 1.2, vViewZ);',
        '  if (alpha < 0.004) discard;',
        '  gl_FragColor = vec4(uColor, alpha);',
        '}'
      ].join('\n'),
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending,
      toneMapped: false
    });

    var points = new THREE.Points(geometry, material);
    points.name = 'DSCDashFX.ConfinedCurl';
    points.frustumCulled = false;
    var elapsed = 0;
    var disposed = false;
    return {
      points: points,
      material: material,
      update: function (dt, intensity) {
        if (disposed) return;
        elapsed += Math.min(Math.max(Number(dt) || 0, 0), 0.05);
        uniforms.uTime.value = elapsed;
        uniforms.uIntensity.value = intensity == null ? 1 : Math.max(0, Number(intensity) || 0);
        uniforms.uOpacity.value = Math.min(0.42, 0.06 + uniforms.uIntensity.value * 0.28);
      },
      dispose: function () {
        if (disposed) return;
        disposed = true;
        geometry.dispose();
        material.dispose();
      }
    };
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

  function loadSimpleGltf(url, onLoad, onError) {
    function fail(err) {
      if (typeof onError === 'function') onError(err);
    }
    if (!root.fetch) {
      fail(new Error('fetch unavailable'));
      return;
    }
    root.fetch(url, { cache: 'force-cache' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (json) {
        var bufferDef = json.buffers && json.buffers[0];
        if (!bufferDef || !bufferDef.uri) throw new Error('missing buffer');
        var b64 = String(bufferDef.uri).split(',')[1];
        if (!b64) throw new Error('expected data URI buffer');
        var binary = root.atob(b64);
        var bytes = new Uint8Array(binary.length);
        for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

        var posAcc = json.accessors[0];
        var idxAcc = json.accessors[1];
        var posView = json.bufferViews[posAcc.bufferView];
        var idxView = json.bufferViews[idxAcc.bufferView];
        var pos = new Float32Array(
          bytes.buffer,
          posView.byteOffset || 0,
          posAcc.count * 3
        );
        var idx = new Uint16Array(
          bytes.buffer,
          idxView.byteOffset || 0,
          idxAcc.count
        );
        var geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(pos.slice(), 3));
        geometry.setIndex(new THREE.BufferAttribute(idx.slice(), 1));
        geometry.computeVertexNormals();
        var material = new THREE.MeshStandardMaterial({
          color: 0x90a4ae,
          metalness: 0.72,
          roughness: 0.32
        });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = (json.nodes && json.nodes[0] && json.nodes[0].name) || 'DSCDashFX.GltfAccent';
        if (typeof onLoad === 'function') onLoad(mesh);
      })
      .catch(fail);
  }

  THREE.DSCDashFX = Object.freeze({
    FEATURES: FEATURES,
    createSoftSpriteTexture: createSoftSpriteTexture,
    createComposer: createComposer,
    makeFlowRibbon: makeFlowRibbon,
    rebuildFlowRibbonGeometry: rebuildFlowRibbonGeometry,
    createCurlHaze: createCurlHaze,
    createConfinedCurlHaze: createConfinedCurlHaze,
    createColorRamp: createColorRamp,
    loadSimpleGltf: loadSimpleGltf
  });
})(typeof globalThis !== 'undefined' ? globalThis : this);
