import { UniversalCamera, Vector3 } from 'babylonjs'

export default class FPSCameraController {
  constructor(scene, canvas) {
    this.scene = scene
    this.canvas = canvas
    this._camera = this.setCamera(this.scene, this.camera)
  }

  setCamera = (scene, canvas) => {
    const camera = new UniversalCamera('PlayerCamera', new Vector3(0, 2, -25), scene)

    camera.setTarget(new Vector3(0, 0, 0))
    camera.applyGravity = true
    camera.ellipsoid = new Vector3(0.4, 0.8, 0.4)
    camera.checkCollisions = true
    camera.attachControl(canvas, true)

    return camera
  }

  updateCameraPosition = (body) => {
    this.camera.position.x = body.position.x
    this.camera.position.y = body.position.y + 1.0
    this.camera.position.z = body.position.z
    //pointer.position = camera.getTarget()
  }

  get camera()  {
      return this._camera
  }
}
