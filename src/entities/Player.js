import FPSCameraController from './camera/FPSCameraController'
import MouseController from './MouseController'

export default class Player {
  constructor(scene, canvas, settings = { Camera: FPSCameraController }) {
    const { Camera } = settings
    this.scene = scene
    this.canvas = canvas
    this.camera = null
    this.body = null
    this.moveController = null
    this.mouseController = null
    this.cameraController = null
    this.settings = settings
    this.initializePlayer(Camera)

    scene.registerBeforeRender(() => {
      if(this.body)
      this.body.position.x += 0.05
    })
  }

  initializePlayer = (Camera) => {
    this.createBody()
    this.settings.graphics.parent = this.body
    this.cameraController = new Camera(this.scene, this.canvas, {
      target: this.body
    })
    this.camera = this.cameraController.camera
    this.mouseController = new MouseController(this.scene, this.canvas)
  }

  createBody = () => {
    this.body = BABYLON.Mesh.CreateBox('body', 4, this.scene)
    this.body.position.y = 2
    this.body.visibility = 0
  }
}
