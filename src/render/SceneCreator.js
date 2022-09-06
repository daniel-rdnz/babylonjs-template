import { Scene } from '@babylonjs/core/scene'

export default class SceneCreator {
  constructor(engine) {
    this.engine = engine
  }

  createScene = () => {
    window.addEventListener('resize', () => {
      this.engine.resize()
    })
    return new Scene(this.engine)
  }
}
