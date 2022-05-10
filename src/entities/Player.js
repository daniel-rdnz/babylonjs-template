import FPSCameraController from './FPSCameraController'
import MouseController from './MouseController'

export default class Player {
  constructor(scene, canvas) {
    this.scene = scene
    this.canvas = canvas
    this.camera = null
    this.body = null
    this.moveController = null
    this.mouseController = null
    this.FPSCameraController = null
    this.initializePlayer()
  }

  initializePlayer = () => {
    this.FPSCameraController = new FPSCameraController(this.scene, this.canvas)
    this.camera = this.FPSCameraController.camera
    this.mouseController = new MouseController(this.scene, this.canvas)
    this.updatePlayer()
  }

  updatePlayer = () => {
   /*  this.scene.registerBeforeRender(() => {
      this.FPSCameraController.updateCameraPosition(this.body)
    }) */
  }
}
