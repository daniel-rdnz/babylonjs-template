import { Scene } from 'babylonjs'

export default class SceneCreator {
  constructor(engine) {
    this.engine = engine
  }

  createScene = () => {
    return new Scene(this.engine)
  }
}
