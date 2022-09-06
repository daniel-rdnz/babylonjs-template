import { actions } from '../../utils/Constants'
import { Vector3 } from '@babylonjs/core/Maths'
import ActionMapper from '../../utils/ActionMapper'

export default class MoveController {
  constructor() {
    this._direction = new Vector3(0, 0, 0)
    this.actionStrategy = null
    this.setActionStrategy()
    this.setEventListeners()
  }

  onKeyDown = (event) => {
    const { keyCode } = event
    this.processKeyAction({ keyCode, moveMagnitud: 1 })
  }

  onKeyUp = (event) => {
    const { keyCode } = event
    this.processKeyAction({ keyCode, moveMagnitud: 0 })
  }

  setEventListeners = () => {
    document.addEventListener('keydown', this.onKeyDown, false)
    document.addEventListener('keyup', this.onKeyUp, false)
  }

  setActionStrategy() {
    this.actionStrategy = {
      [actions.UP]: (moveMagnitud) => this.moveFoward(-moveMagnitud),
      [actions.DOWN]: (moveMagnitud) => this.moveFoward(moveMagnitud),
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

  moveFoward(moveMagnitud) {
    this._direction.x = moveMagnitud
  }

  moveLateral(moveMagnitud) {
    this._direction.z = moveMagnitud
  }

  get direction() {
    return this._direction.normalize()
  }
}
