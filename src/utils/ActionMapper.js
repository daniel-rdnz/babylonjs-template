import { keyActionMap } from './Constants'

export default class ActionMapper {
  static getAction(keyCode) {
    return keyActionMap[keyCode]
  }
}
