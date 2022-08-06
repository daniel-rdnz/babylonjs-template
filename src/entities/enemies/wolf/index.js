import Animator from '../../animator'
import playerSpriteMap from '../../../assets/maps/player.json'

export default class Wolf {
  constructor(scene, canvas, children = [], settings = { speed: 0.1, size: 6},) {
    const { speed, size } = settings
    this.scene = scene
    this.canvas = canvas
    this.body = null
    this.animator = null
    this.initialize(children, size)

    scene.registerBeforeRender(() => {
      this.move(speed)
    })
  }

  initialize = (children, size) => {
    this.createBody(size)
    this.animator = new Animator(this.scene, {
      textureUrl: 'assets/images/red_hood_WOLF.png',
      name: 'wolf',
      size: size,
      spriteMap: playerSpriteMap
    })
    this.animator.parent = this.body
    this.animator.animation = 'idle'
    children.forEach( child => this.addChild(child))
  }

  createBody = (size) => {
    this.body = BABYLON.Mesh.CreateBox('body', size, this.scene)
    this.body.position.y = 15
    this.body.visibility = 0
    this.body.applyGravity = true
    this.body.physicsImpostor = new BABYLON.PhysicsImpostor(
      this.body,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 1, friction: 0.5, restitution: 0 },
      this.scene
    )
  }

  addChild = (child) => {
    child.parent = this.body
  }

  move = (speed) => {
  }
}
