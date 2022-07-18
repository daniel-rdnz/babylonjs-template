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
    const cameraZoom = 20
    const camera = new TargetCamera('PlayerCamera', new BABYLON.Vector3(cameraZoom * 2, cameraZoom * 2, -cameraZoom * 2), scene)
    const engine = scene.getEngine()
    camera.parent = this.target
    camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA
    camera.orthoTop = cameraZoom 
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

  get camera() {
    return this._camera
  }
}
