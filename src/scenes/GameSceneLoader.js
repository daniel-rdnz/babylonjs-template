import { Color3, Vector3, Matrix } from '@babylonjs/core/Maths'
import { BabylonFileLoaderConfiguration } from '@babylonjs/core'
import Player from '../entities/player'
import * as CANNON from 'cannon'
import SPSterrain from '../entities/world/SPSTerrain'
/* import StateMachine from '../entities/stateMachine'
import { machine, actions } from '../entities/stateMachine/machines/daySystem' */
import FPSCameraController from '../entities/camera/FPsCameraController'

export default class GameSceneLoader {
  constructor(canvas) {
    this.canvas = canvas
    //document.addEventListener('keydown', this.onKeyDown, false)
  }

  configureScene = (scene) => {
    const withfog = false
    this.setPhysics(scene)
    this.player = new Player(scene, this.canvas, [], {stepMagnitud: 24, size: 6})

    this.setAmbient(scene, { withfog })

    /*   const dayStateMachine = new StateMachine()
    dayStateMachine.createMachine(machine, actions)
    dayStateMachine.transition({ type: 'BEGIN' })
 */
    this.dynamicTerrain = new SPSterrain()
    this.dynamicTerrain.create(scene, 24, 25, 25)

    /*     this.cameraController = new IsoCameraController(scene, this.canvas, {
      target: this.player.body,
      cameraZoom: 55
    }) */

    const camera = new FPSCameraController(scene, this.canvas)
    this.player.addChild(camera._camera)

    const screenPosition = new Vector3(Math.floor(this.canvas.width / 2), 0, Math.floor(this.canvas.height / 2) + 200)

    scene.updateTransformMatrix()
    const vector = Vector3.Unproject(
      screenPosition,
      scene.getEngine().getRenderWidth(),
      scene.getEngine().getRenderHeight(),
      Matrix.Identity(),
      scene.getViewMatrix(),
      scene.getProjectionMatrix()
    )
    this.player.position = vector
  }

/*   onKeyDown = (event) => {
    const { key } = event
    if (key === 'z') {
      //this.cameraController.zoom++
      dynamicTerrain.position.y += 50
    }
    if (key === 'x') {
      this.cameraController.zoom--
    }
  } */

  setPhysics(scene) {
    //const cannonPlugin = new CannonJSPlugin(true, 10, cannon)
    //const gravityVector = new Vector3(0, -7, 0)

    scene.collisionsEnabled = true
    //scene.enablePhysics(gravityVector, cannonPlugin)
    BabylonFileLoaderConfiguration.LoaderInjectedPhysicsEngine = CANNON
    //scene.gravity = gravityVector
  }

  setAmbient = (scene, { withfog = false }) => {
    scene.clearColor = new Color3(0, 0, 0)
    scene.fogMode = 3
    scene.fogDensity = 0.001
    scene.fogStart = 120.0
    scene.fogEnd = 140.0
    scene.fogColor = new Color3(0, 0, 0)
  }

  loadScene = (scene) => {
    this.configureScene(scene)
  }
}
