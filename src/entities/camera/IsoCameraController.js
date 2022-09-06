import { TargetCamera } from '@babylonjs/core/Cameras/targetCamera'
import { Vector3 } from '@babylonjs/core/Maths'

export default class IsoCameraController {
  constructor(scene, canvas, settings) {
    const { target } = settings
    this.scene = scene
    this.canvas = canvas
    this.target = target
    this._camera = this.setCamera(this.scene, this.camera)
  }

  setCamera = (scene, canvas) => {
    const cameraZoom = 35
    const camera = new TargetCamera('PlayerCamera', new Vector3(cameraZoom, cameraZoom, -cameraZoom), scene)
    const engine = scene.getEngine()
    camera.parent = this.target
    camera.mode = 1
    camera.orthoTop = cameraZoom 
    camera.orthoBottom = -cameraZoom
    camera.orthoLeft = -cameraZoom * engine.getScreenAspectRatio() 
    camera.orthoRight = cameraZoom * engine.getScreenAspectRatio() 
    camera.setTarget(new Vector3(0, -1, 0))
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
