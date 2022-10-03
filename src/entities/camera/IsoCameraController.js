import { TargetCamera } from '@babylonjs/core/Cameras/targetCamera'
import { Vector3 } from '@babylonjs/core/Maths'

export default class IsoCameraController {
  constructor(scene, canvas, settings) {
    const { target, cameraZoom } = settings
    this._camera = this.setCamera(scene, canvas, cameraZoom, target)
  }

  setCamera = (scene, canvas, cameraZoom, target) => {
    const camera = new TargetCamera('PlayerCamera', new Vector3(cameraZoom, cameraZoom, -cameraZoom), scene)
    const engine = scene.getEngine()
    camera.parent = target
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

  set zoom(zoom) {
    const engine = this.camera.getScene().getEngine()
    this.camera.orthoTop = zoom 
    this.camera.orthoBottom = -zoom
    this.camera.orthoLeft = -zoom * engine.getScreenAspectRatio() 
    this.camera.orthoRight = zoom * engine.getScreenAspectRatio() 
  }

  get zoom() {
    return this.camera.orthoTop
  }

  get camera() {
    return this._camera
  }
}
