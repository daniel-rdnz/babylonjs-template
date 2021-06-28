import * as BABYLON from 'babylonjs'

export default class EngineCreator {
  constructor(canvas) {
    this.canvas = canvas
  }
  createDefaultEngine = () => {
    return new BABYLON.Engine(this.canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      disableWebGL2Support: false
    })
  }
}
