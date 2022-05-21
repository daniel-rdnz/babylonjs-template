import { HemisphericLight, MeshBuilder, Vector3, PhysicsImpostor, CannonJSPlugin } from 'babylonjs'
import Player from '../entities/Player'
import Dungeon from '../entities/dungeon'
import DynamicTerrain from '../entities/world/DynamicTerrain'
import * as cannon from 'cannon'

export default class GameSceneLoader {
  constructor(canvas) {
    this.canvas = canvas
  }
  configureScene = (scene) => {
    const cannonPlugin = new CannonJSPlugin(true, 10, cannon)
    const gravityVector = new Vector3(0, -0.75, 0)

    scene.collisionsEnabled = true
    scene.enablePhysics(gravityVector, cannonPlugin)
    scene.gravity = gravityVector

    this.player = new Player(scene, this.canvas)
    /*     const myGround = MeshBuilder.CreateGround('myGround', { width: 200, height: 200, subdivsions: 4 }, scene)

    myGround.position.y = -1
    myGround.checkCollisions = true

    const box = MeshBuilder.CreateBox('box', { size: 2 }, scene)
    box.checkCollisions = true */

    //new Dungeon({ width: 300, height: 100, deepLevel: 3, scene})
    const dynamicTerrain = new DynamicTerrain(scene)
    
    const camElevation = 2.0;
    let camAltitude = 0.0;
    scene.registerBeforeRender(() => {
      if (dynamicTerrain.terrain) {
        camAltitude = dynamicTerrain.terrain.getHeightFromMap(this.player.camera.position.x, this.player.camera.position.z) + camElevation
        this.player.camera.position.y = camAltitude
      }
    })
  }

  loadScene = (scene) => {
    this.configureScene(scene)
    const light = new HemisphericLight('light', new Vector3(0, 1, 0))
  }
}
