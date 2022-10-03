import MouseController from './MouseController'
import MoveController from './MoveController'
import Animator from '../animator'
import playerSpriteMap from '../../assets/maps/player.json'
import { Vector3, Quaternion } from '@babylonjs/core/Maths'
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";


export default class Player {
  constructor(scene, canvas, children = [], settings = { speed: 0.1, size: 6},) {
    const { speed, size } = settings
    this.scene = scene
    this.canvas = canvas
    this.camera = null
    this.body = null
    this.moveController = null
    this.mouseController = null
    this.cameraController = null
    this.animator = null
    this.initializePlayer(children, size)

    scene.registerBeforeRender(() => {
      this.move(speed)
    })
  }

  initializePlayer = (children, size) => {
    this.createBody(size)
    this.animator = new Animator(this.scene, {
      textureUrl: 'assets/images/assets.png',
      name: 'guy',
      size: size,
      spriteMap: playerSpriteMap
    })
    this.animator.parent = this.body
    children.forEach( child => this.addChild(child))
    
    this.mouseController = new MouseController(this.scene, this.canvas)
    this.moveController = new MoveController(this.body)
  }

  createBody = (size) => {
    this.body = MeshBuilder.CreateBox('body', {size}, this.scene)
    this.body.position.y = 6
    this.body.visibility = 0
    this.body.applyGravity = true
/*     this.body.physicsImpostor = new PhysicsImpostor(
      this.body,
      PhysicsImpostor.BoxImpostor,
      { mass: 1, friction: 0.5, restitution: 0 },
      this.scene
    ) */
  }

  addChild = (child) => {
    child.parent = this.body
  }

  move = (speed) => {
    this.body.rotationQuaternion = Quaternion.RotationAxis(new Vector3(0, 1, 0), 0)

    /*    this.body.rotate(new BABYLON.Vector3(1, 0, 0), distortionCamera * 0.005, BABYLON.Space.LOCAL)
    this.body.rotate(new BABYLON.Vector3(0, 0, 1), distortionCamera * 0.005, BABYLON.Space.LOCAL) */

    if (this.moveController?.direction.x || this.moveController?.direction.z) {
      this.animator.animation = 'walk'
      const drunkDir = this.moveController.direction //.add(new BABYLON.Vector3(distortionWalk, 0, distortionWalk))
      this.body.position.x += drunkDir.x * speed
      this.body.position.z += drunkDir.z * speed

      
      console.log()
      return false
    }
    this.animator.animation = 'idle'
  }
}
