import * as BABYLON from 'babylonjs'

export default class SceneRenderer {
  constructor({ canvas, sceneLoader, engine }) {
    this.canvas = canvas
    this.sceneLoader = sceneLoader
    this.engine = engine
  }

  createScene = () => {
    const scene = new BABYLON.Scene(this.engine)
    this.sceneLoader.loadScene()

    return scene
  }

  initializeScene = () => {
    this.scene = this.createScene()
    this.engine.runRenderLoop(() => {
      if (this.scene && this.scene.activeCamera) {
        this.scene.render()
      }
    })
  }

}
