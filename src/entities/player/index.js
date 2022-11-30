import MouseController from './MouseController'
import MoveController from './MoveController'
import Animator from '../animator'
import playerSpriteMap from '../../assets/maps/player.json'
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";


export default class Player {
  constructor(scene, canvas, children = [], settings = { stepMagnitud: 24, size: 6}) {
    const { stepMagnitud, size } = settings
    this.scene = scene
    this.canvas = canvas
    this.camera = null
    this.body = null
    this.moveController = null
    this.mouseController = null
    this.cameraController = null
    this.animator = null
    this.stepMagnitud = stepMagnitud
    this.initializePlayer(children, size)
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
    this.moveController = new MoveController(this.body, this.stepMagnitud)
  }

  createBody = (size) => {
    this.body = MeshBuilder.CreateBox('body', {size}, this.scene)
    this.body.position.y = 0
    this.body.visibility = 0
    this.body.applyGravity = true
  }

  addChild = (child) => {
    child.parent = this.body
  }
}
