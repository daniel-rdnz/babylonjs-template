import IsoCameraController from '../camera/IsoCameraController'
import MouseController from './MouseController'
import MoveController from './MoveController'
import Animator from '../animator'
import playerSpriteMap from '../../assets/maps/player.json'
import noise from '../../utils/Noise'

export default class Player {
  constructor(scene, canvas, settings = { speed: 2}) {
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
    this.body.position.y = 4
    this.body.visibility = 0
    this.body.applyGravity = true
    this.body.physicsImpostor = new BABYLON.PhysicsImpostor(
      this.body,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 1, friction: 0.5, restitution: 0 },
      this.scene
    )
  }

  move = (speed, step) => {
    this.body.rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 1, 0), 0)

    //const distortionCamera = Math.cos(step / 10)

    //const zoom = 64
    //const distortionWalk = noise.simplex2(step / zoom, step / zoom) //Math.cos(step / 50)

    /*    this.body.rotate(new BABYLON.Vector3(1, 0, 0), distortionCamera * 0.005, BABYLON.Space.LOCAL)
    this.body.rotate(new BABYLON.Vector3(0, 0, 1), distortionCamera * 0.005, BABYLON.Space.LOCAL) */

    if (this.moveController?.direction.x || this.moveController?.direction.z) {
      this.animator.animation = 'walk'
      //const drunkDir = this.moveController.direction //.add(new BABYLON.Vector3(distortionWalk, 0, distortionWalk))
      /* this.body.position.x += drunkDir.x * speed
      this.body.position.z += drunkDir.z * speed */
      if (this.body.physicsImpostor.getLinearVelocity().length() < 8)
        this.body.physicsImpostor.applyImpulse(
          this.moveController.direction.scale(speed),
          this.body.getAbsolutePosition()
        )

      
      console.log()
      return false
    }
    this.animator.animation = 'idle'
  }
}
