import { actions } from '../../utils/Constants'
import { Vector3 } from '@babylonjs/core/Maths'
import { Animation } from '@babylonjs/core/Animations'
import ActionMapper from '../../utils/ActionMapper'

export default class MoveController {
  constructor(body, stepMagnitud = 24) {
    this._direction = new Vector3(0, 0, 0)
    this.actionStrategy = null
    this.body = body
    this.setActionStrategy()
    this.setEventListeners()
    this.forwardAxis = 'z'
    this.stepMagnitud = stepMagnitud
    this.isMoveComplete = true;
  }

  onKeyUp = (event) => {
    const { keyCode } = event
    this.processKeyAction({ keyCode, moveMagnitud: 1 })
  }

  setEventListeners = () => {
    document.addEventListener('keydown', this.onKeyUp, false)
  }

  setActionStrategy() {
    this.actionStrategy = {
      [actions.UP]: (moveMagnitud) => this.moveForward(moveMagnitud),
      [actions.DOWN]: (moveMagnitud) => this.moveForward(-moveMagnitud),
      [actions.LEFT]: (moveMagnitud) => this.moveLateral(-moveMagnitud),
      [actions.RIGHT]: (moveMagnitud) => this.moveLateral(moveMagnitud)
    }
  }

  processKeyAction = ({ keyCode, moveMagnitud = 0 }) => {
    const action = ActionMapper.getAction(keyCode)
    const hasActionStrategy = !!this.actionStrategy[action]
    if (!hasActionStrategy) {
      return
    }

    this.actionStrategy[action](moveMagnitud)
  }

  moveForward(moveMagnitud) {
    if(!this.isMoveComplete) {
      return
    }
    this.isMoveComplete = false
    const origin = this.body.position?.[this.forwardAxis]
    const direction = this.body.forward[this.forwardAxis]
    Animation.CreateAndStartAnimation(
      'moveAnimation',
      this.body,
      `position.${this.forwardAxis}`,
      60,
      30,
      origin,
      origin + (24 * direction * moveMagnitud),
      Animation.ANIMATIONLOOPMODE_CONSTANT,
      undefined,
      () => {
        this.isMoveComplete = true
      }
    )
  }

  moveLateral(moveMagnitud) {
    if(!this.isMoveComplete) {
      return
    }
    this.isMoveComplete = false
    Animation.CreateAndStartAnimation(
      'rotationAnimation',
      this.body,
      'rotation.y',
      60,
      30,
      this.body.rotation.y,
      this.body.rotation.y + (Math.PI / 2) * moveMagnitud,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
      undefined,
      () => {
        this.forwardAxis = this.forwardAxis === 'x' ? 'z' :'x'
        this.isMoveComplete = true
      }
    )
  }
}
