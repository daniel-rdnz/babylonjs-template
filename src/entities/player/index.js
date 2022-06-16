import IsoCameraController from '../camera/IsoCameraController'
import MouseController from './MouseController'
import MoveController from './MoveController'

export default class Player {
  constructor(scene, canvas, settings = { speed: 0.05 }) {
    const { speed } = settings
    this.scene = scene
    this.canvas = canvas
    this.camera = null
    this.body = null
    this.moveController = null
    this.mouseController = null
    this.cameraController = null
    this.settings = settings
    this.initializePlayer()

    scene.registerBeforeRender(() => {
      this.move(speed)
    })
  }

  initializePlayer = () => {
    this.createBody()
    this.settings.graphics.parent = this.body
    this.cameraController = new IsoCameraController(this.scene, this.canvas, {
      target: this.body
    })
    this.camera = this.cameraController.camera
    this.mouseController = new MouseController(this.scene, this.canvas)
    this.moveController = new MoveController(this.body)
  }

  createBody = () => {
    this.body = BABYLON.Mesh.CreateBox('body', 4, this.scene)
    this.body.position.y = 2
    this.body.visibility = 0
  }

  move = (speed) => {
    if (this.moveController) {
      this.body.position.x += this.moveController.direction.x * speed
      this.body.position.z += this.moveController.direction.z * speed
    }
  }
}