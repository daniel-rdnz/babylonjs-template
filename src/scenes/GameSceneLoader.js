import { HemisphericLight, MeshBuilder, Vector3, PhysicsImpostor, Color3, CannonJSPlugin } from 'babylonjs'
import Player from '../entities/Player'
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

    this.player = new Player(scene, this.canvas)
    const myGround = MeshBuilder.CreateGround('myGround', { width: 200, height: 200, subdivsions: 4 }, scene)

    myGround.position.y = -1
    myGround.checkCollisions = true
    myGround.physicsImpostor = new PhysicsImpostor(
      myGround,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0.5, friction: 0.1 },
      scene
    )
  }

  loadScene = (scene) => {
    this.configureScene(scene)
    const light = new HemisphericLight('light', new Vector3(0, 1, 0))
    const box = MeshBuilder.CreateBox('box', {})
  }
}
