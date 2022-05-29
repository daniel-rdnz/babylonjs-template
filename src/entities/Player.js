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
    this.setFlashLight()
    this.updatePlayer()
  }

  setFlashLight = () => {
    const spotLight = new BABYLON.SpotLight(
      'flashLight',
      new BABYLON.Vector3(0,  0, 1),
      new BABYLON.Vector3(0, 0, 1),
      Math.PI,
      20,
      this.scene
    )
    const lightTexture = new BABYLON.Texture(
      'https://miro.medium.com/max/1000/1*vHH6EdKYFPTkKal-zKxK5Q.gif',
      this.scene
    )
/*     lightTexture.uScale = 0
    lightTexture.vScale = lightTexture.uScale  */
    spotLight.projectionTexture = lightTexture
    spotLight.intensity = 8
    //spotLight.setDirectionToTarget(new BABYLON.Vector3(1, 0, 1));
    spotLight.parent = this.camera
  }

  updatePlayer = () => {
    /*  this.scene.registerBeforeRender(() => {
      this.FPSCameraController.updateCameraPosition(this.body)
    }) */
  }
}
