import { Engine } from 'babylonjs'

export default class EngineManager {
  constructor(canvas) {
    this.canvas = canvas
    this.engine = null
  }
  createDefaultEngine = () => {
    this.engine = new Engine(this.canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      disableWebGL2Support: false
    })
    return this.engine
  }

  runRenderLoop = (scene) => {
    this.engine.runRenderLoop(() => {
      if (scene && scene.activeCamera) {
        scene.render()
      }
    })
  }
}
