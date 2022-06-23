import { TargetCamera, Effect, PostProcess } from 'babylonjs'

export default class IsoCameraController {
  constructor(scene, canvas, settings) {
    const { target } = settings
    this.scene = scene
    this.canvas = canvas
    this.target = target
    this._camera = this.setCamera(this.scene, this.camera)
    //this.setPixelated(this._camera)
  }

  setCamera = (scene, canvas) => {
    const cameraZoom = 15
    const camera = new TargetCamera('PlayerCamera', new BABYLON.Vector3(cameraZoom, cameraZoom, -cameraZoom), scene)
    const engine = scene.getEngine()
    camera.parent = this.target
    camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA
    camera.orthoTop = cameraZoom - 4
    camera.orthoBottom = -cameraZoom
    camera.orthoLeft = -cameraZoom * engine.getScreenAspectRatio()
    camera.orthoRight = cameraZoom * engine.getScreenAspectRatio()
    camera.setTarget(new BABYLON.Vector3(0, 2, 0))
    camera.attachControl(canvas, true)

    window.addEventListener('resize', () => {
      camera.orthoLeft = -cameraZoom * engine.getScreenAspectRatio()
      camera.orthoRight = cameraZoom * engine.getScreenAspectRatio()
    })

    return camera
  }

  setPixelated = (camera) => {
    BABYLON.Effect.ShadersStore.pixelatedVertexShader =
      `precision highp float;

      // Attributes
      attribute vec3 position;
      attribute vec3 normal;
      attribute vec2 uv;
      
      // Uniforms
      uniform mat4 worldViewProjection;
      
      // Varyings
      varying vec2 vUV;
      
      void main(void) {
          gl_Position = worldViewProjection * vec4(position, 1.0);
          vUV = uv;
      }`
    BABYLON.Effect.ShadersStore.pixelatedPixelShader =
      `
      precision highp float;
      varying vec2 vUV;
      uniform sampler2D textureSampler;
      uniform float u_time;
      uniform float uPlaneRatio;
      
      void main() {

        vec2 uv = vUV;

        vec2 frontImageUV = vec2(
          (uv.x + sin(u_time * 0.04) * sin(uv.y * 10.) * 0.03),
          (uv.y + sin(u_time * 0.03) * cos(uv.x * 15.) * 0.05)
        );
        
        float pixel_w=10., pixel_h=10., rt_w=3000., rt_h=3000.;

        vec3 tc=vec3(1.,0.,0.);

        float dx=pixel_w*(1./rt_w),dy=pixel_h*(1./rt_h);

        vec2 coord=vec2(dx*floor(vUV.x/dx),dy*floor(vUV.y/dy));

        //vec2 coord=vec2(frontImageUV.x * 0.5 + 0.5, dy*floor(vUV.y/dy));

        tc=texture2D(textureSampler, coord).xyz;

        gl_FragColor=vec4(tc,1.);
      }`
    /* BABYLON.Effect.ShadersStore.pixelatedFragmentShader =
      `precision highp float;
 
      // Varyings
      varying vec2 vUV;
      
      // Uniforms
      uniform float uPlaneRatio;
      uniform sampler2D u_frontTexture;
      uniform sampler2D u_backTexture;
      uniform float u_time;
      uniform float u_maskVisibility;
      uniform vec2 u_maskPosition;
      
      vec3 Rectangle(in vec2 size, in vec2 st, in vec2 p, in vec3 c) {
        float top = step(1. - (p.y + size.y), 1. - st.y);
        float right = step(1. - (p.x + size.x), 1. - st.x);
        float bottom = step(p.y, st.y);
        float left = step(p.x, st.x);
        return top * right * bottom * left * c;
      }
      
      void main() {
        vec2 uv = vUV - 0.5;
        uv.x *= uPlaneRatio;
        vec3 color = vec3(0.0);
      
        vec2 maskUV = vec2(
          uv.x + sin(u_time * 0.03) * sin(uv.y * 5.0) * 0.15,
          uv.y + cos(u_time * 0.03) * cos(uv.x * 10.0) * 0.15
        );
      
        vec2 maskSize = vec2(0.3, 0.3);
      
        vec2 maskPosition = vec2(
          u_maskPosition.x * uPlaneRatio - 0.15,
          u_maskPosition.y - 0.15
        );
        
        vec3 maskColor = vec3(u_maskVisibility);
      
        vec3 mask = Rectangle(maskSize, maskUV, maskPosition, maskColor);
      
        vec2 frontImageUV = vec2(
          (uv.x + sin(u_time * 0.04) * sin(uv.y * 10.) * 0.03),
          (uv.y + sin(u_time * 0.03) * cos(uv.x * 15.) * 0.05)
        );
      
        vec3 frontImage = texture2D(u_frontTexture, frontImageUV * 0.5 + 0.5).rgb * mask;
        vec3 backImage = texture2D(u_backTexture, uv * 0.5 + 0.5).rgb * (1.0 - mask);
      
        color = backImage + frontImage;
      
        gl_FragColor = vec4(color, 1.0);
      }` */
    
     //new PostProcess('pixelated', 'pixelated', null, null, 1, camera)
  }

  get camera() {
    return this._camera
  }
}
