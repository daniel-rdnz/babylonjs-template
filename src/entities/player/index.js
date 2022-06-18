import IsoCameraController from '../camera/IsoCameraController'
import MouseController from './MouseController'
import MoveController from './MoveController'
import Animator from '../animator'
import playerSpriteMap from '../../assets/maps/player.json'
import noise from '../../utils/Noise'

export default class Player {
  constructor(scene, canvas, settings = { speed: 0.1 }) {
    const { speed } = settings
    this.scene = scene
    this.canvas = canvas
    this.camera = null
    this.body = null
    this.moveController = null
    this.mouseController = null
    this.cameraController = null
    this.animator = null
    this.initializePlayer()
    let step = 0

    scene.registerBeforeRender(() => {
      step++
      this.move(speed, step)
    })
  }

  initializePlayer = () => {
    this.createBody()
    this.animator = new Animator(this.scene, {
      textureUrl: 'assets/images/bath-guy-anim.png',
      name: 'guy',
      size: 4,
      spriteMap: playerSpriteMap
    })
    this.animator.parent = this.body
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

  move = (speed, step) => {
    const noiseDir = Math.random() > 0.5 ? 1 : -1
    noise.seed(0.6)
    const zoom = 16
    const perlin = noise.simplex2(step / zoom, step / zoom)
    const noiseX = noiseDir * (perlin > 0.5 ? perlin : 0) * 3
    const noiseZ = noiseDir * (perlin > 0.5 ? perlin : 0) * 3
    if (this.moveController?.direction.x || this.moveController?.direction.z) {
      this.animator.animation = 'walk'
      this.body.position.x += this.moveController.direction.x * speed + noiseX
      this.body.position.z += this.moveController.direction.z * speed + noiseZ
      return false
    }

    this.body.position.x += (this.moveController.direction.x + noiseX) * speed
    this.body.position.z += (this.moveController.direction.z + noiseZ) * speed
    this.animator.animation = 'idle'
  }
}
