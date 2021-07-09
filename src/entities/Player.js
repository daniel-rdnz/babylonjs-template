import { Vector3, Mesh, PhysicsImpostor } from 'babylonjs'
import FPSCameraController from './FPSCameraController'
import MoveController from './MoveController'
import MouseController from './MouseController'

export default class Player {
  constructor(scene, canvas, speed = 20) {
    this.scene = scene
    this.canvas = canvas
    this.camera = null
    this.body = null
    this.moveController = null
    this.mouseController = null
    this.FPSCameraController = null
    this.speed = speed
    this.initializePlayer()
  }

  setBody = () => {
    const body = Mesh.CreateBox('hero', 2.0, this.scene, false, Mesh.FRONTSIDE)
    body.position.x = 0.0
    body.position.y = 1.0
    body.position.z = 0.0
    body.physicsImpostor = new PhysicsImpostor(
      body,
      PhysicsImpostor.BoxImpostor,
      { mass: 1, restitution: 0.0, friction: 0.1 },
      this.scene
    )

    return body
  }

  updateBody = (move) => {
    this.body.physicsImpostor.physicsBody.velocity.x = move.x
    this.body.physicsImpostor.physicsBody.velocity.z = move.z
    this.body.physicsImpostor.physicsBody.velocity.y = move.y
  }

  calculateFowardVector = (cameraTarget, cameraPosition) => {
    const forward = cameraTarget.subtract(cameraPosition).normalize()
    forward.y = 0
    return forward
  }

  calculateRightVector = (cameraUp, forward) => {
    const right = Vector3.Cross(forward, cameraUp).normalize()
    right.y = 0
    return right
  }

  calculateMove = ({ forward, right, direction, cameraUp }) => {
    return forward.scale(direction.x).subtract(right.scale(direction.z)).subtract(cameraUp.scale(direction.y))
  }

  initializePlayer = () => {
    this.FPSCameraController = new FPSCameraController(this.scene, this.canvas)
    this.camera = this.FPSCameraController.camera
    this.body = this.setBody()
    this.moveController = new MoveController()
    this.mouseController = new MouseController(this.scene, this.canvas)
    this.updatePlayer()
  }

  updatePlayer = () => {
    this.scene.registerBeforeRender(() => {
      this.FPSCameraController.updateCameraPosition(this.body)

      const forward = this.calculateFowardVector(this.camera.getTarget(), this.camera.position)
      const right = this.calculateRightVector(this.camera.upVector, forward)
      const direction = this.moveController.direction.scale(this.speed)

      const move = this.calculateMove({ forward, right, direction, cameraUp: this.camera.upVector })

      this.updateBody(move)
    })
  }
}
