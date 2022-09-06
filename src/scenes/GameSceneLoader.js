import { Color3 } from '@babylonjs/core/Maths'
import { BabylonFileLoaderConfiguration } from "@babylonjs/core";
import Player from '../entities/player'
import * as CANNON  from 'cannon'
import SPSterrain from '../entities/world/SPSTerrain'
import StateMachine from '../entities/stateMachine'
import { machine, actions } from '../entities/stateMachine/machines/daySystem'


export default class GameSceneLoader {
  constructor(canvas) {
    this.canvas = canvas
  }

  configureScene = (scene) => {
    const withfog = false
    this.setPhysics(scene)
    this.player = new Player(scene, this.canvas)
    this.setAmbient(scene, { withfog })

    const dayStateMachine = new StateMachine()
    dayStateMachine.createMachine(machine, actions)
    dayStateMachine.transition({ type: 'BEGIN' })

    const dynamicTerrain = new SPSterrain()
    dynamicTerrain.create(scene, 8, 9, 9, dayStateMachine)
  }

  setPhysics(scene) {
    
    //const cannonPlugin = new CannonJSPlugin(true, 10, cannon)
    //const gravityVector = new Vector3(0, -7, 0)

    scene.collisionsEnabled = true
    //scene.enablePhysics(gravityVector, cannonPlugin)
    debugger;
    BabylonFileLoaderConfiguration.LoaderInjectedPhysicsEngine = CANNON;
    //scene.gravity = gravityVector
  }

  setAmbient = (scene, { withfog = false }) => {
    scene.clearColor = new Color3(1, 1, 1)
  }

  loadScene = (scene) => {
    this.configureScene(scene)
  }
}
