import { Scene } from 'babylonjs'

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
