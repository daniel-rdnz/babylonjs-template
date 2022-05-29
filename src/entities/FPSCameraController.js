import { Vector3, Effect, PostProcess, FreeCamera, DefaultRenderingPipeline } from 'babylonjs'

export default class FPSCameraController {
  constructor(scene, canvas, withCrtEffect = true, withGrain = true, withPixelated = false) {
    this.scene = scene
    this.canvas = canvas
    this._camera = this.setCamera(this.scene, this.camera)

    if(withPixelated) {
      this.setPixelated(this._camera)
    }
    if (withGrain) {
      this.setGrain(scene, this._camera)
    }
    if (withCrtEffect) {
      this.setCrtEffet(this._camera)
    } 
  }

  setPixelated = (camera) => {
    BABYLON.Effect.ShadersStore.pixelatedVertexShader =
      'precision highp float;attribute vec3 position;attribute vec2 uv;uniform mat4 worldViewProjection;varying vec2 vUV;void main(){gl_Position=worldViewProjection*vec4(position,1.),vUV=uv;}'
    BABYLON.Effect.ShadersStore.pixelatedPixelShader =
      'precision highp float;varying vec2 vUV;uniform sampler2D textureSampler;void main(){float pixel_w=30.,pixel_h=30.,rt_w=3000.,rt_h=3000.;vec3 tc=vec3(1.,0.,0.);float dx=pixel_w*(1./rt_w),dy=pixel_h*(1./rt_h);vec2 coord=vec2(dx*floor(vUV.x/dx),dy*floor(vUV.y/dy));tc=texture2D(textureSampler,coord).xyz;gl_FragColor=vec4(tc,1.);}'
    new PostProcess('pixelated', 'pixelated', null, null, 1, camera)
  }

  setGrain = (scene, camera) => {
    const pipeline = new DefaultRenderingPipeline('defaultPipeline', true, scene, [camera])
    pipeline.grainEnabled = true
    pipeline.grain.intensity = 35
    pipeline.grain.animated = true
  }

  setCrtEffet = (camera) => {
    Effect.ShadersStore['crtFragmentShader'] = `
    #ifdef GL_ES
        precision highp float;
    #endif

    #define PI 3.1415926538

    // Samplers
    varying vec2 vUV;
    uniform sampler2D textureSampler;

    // Parameters
    uniform vec2 curvature;
    uniform vec2 screenResolution;
    uniform vec2 scanLineOpacity;
    uniform float vignetteOpacity;
    uniform float brightness;
    uniform float vignetteRoundness;


    vec2 curveRemapUV(vec2 uv)
    {
        // as we near the edge of our screen apply greater distortion using a sinusoid.

        uv = uv * 2.0 - 1.0;
		vec2 offset = abs(uv.yx) / vec2(curvature.x, curvature.y);
		uv = uv + uv * offset * offset;
		uv = uv * 0.5 + 0.5;
        return uv;
    }

    vec4 scanLineIntensity(float uv, float resolution, float opacity)
    {
        float intensity = sin(uv * resolution * PI * 2.0);
        intensity = ((0.5 * intensity) + 0.5) * 0.9 + 0.1;
        return vec4(vec3(pow(intensity, opacity)), 1.0);
    }

    vec4 vignetteIntensity(vec2 uv, vec2 resolution, float opacity, float roundness)
    {
        float intensity = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
        return vec4(vec3(clamp(pow((resolution.x / roundness) * intensity, opacity), 0.0, 1.0)), 1.0);
    }

    void main(void) 
    {
        vec2 remappedUV = curveRemapUV(vec2(vUV.x, vUV.y));
        vec4 baseColor = texture2D(textureSampler, remappedUV);

        baseColor *= vignetteIntensity(remappedUV, screenResolution, vignetteOpacity, vignetteRoundness);

        baseColor *= scanLineIntensity(remappedUV.x, screenResolution.y, scanLineOpacity.x);
        baseColor *= scanLineIntensity(remappedUV.y, screenResolution.x, scanLineOpacity.y);

        baseColor *= vec4(vec3(brightness), 1.0);

        if (remappedUV.x < 0.0 || remappedUV.y < 0.0 || remappedUV.x > 1.0 || remappedUV.y > 1.0){
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        } else {
            gl_FragColor = baseColor;
        }
    }
    `

    var postProcess = new PostProcess(
      'CRTShaderPostProcess',
      'crt',
      ['curvature', 'screenResolution', 'scanLineOpacity', 'vignetteOpacity', 'brightness', 'vignetteRoundness'],
      null,
      0.25,
      camera
    )
    postProcess.onApply = function (effect) {
      effect.setFloat2('curvature', 10.0, 10.0)
      effect.setFloat2('screenResolution', 180, 180)
      effect.setFloat2('scanLineOpacity', 1, 1)
      effect.setFloat('vignetteOpacity', 1)
      effect.setFloat('brightness', 1)
      effect.setFloat('vignetteRoundness', 1.0)
    }
  }

  setCamera = (scene, canvas) => {
    const camera = new FreeCamera('PlayerCamera', new Vector3(0, 20, 0), scene)

    camera.inertia = 0;
    camera.applyGravity = false
    camera.ellipsoid = new Vector3(1.0, 1.0, 1.0)
    camera.checkCollisions = true
    camera._needMoveForGravity = true
    camera.angularSensibility = 500
    camera.keysUp = [87] // W
    camera.keysDown = [83] // S
    camera.keysLeft = [65] // A
    camera.keysRight = [68] // D
    camera.speed = 2
    camera.attachControl(canvas, true)

    return camera
  }

  updateCameraPosition = (body) => {
    /* this.camera.position.x = body.position.x
    this.camera.position.y = body.position.y + 1.0
    this.camera.position.z = body.position.z */
    //pointer.position = camera.getTarget()
  }

  get camera() {
    return this._camera
  }
}
