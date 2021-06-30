export default class SceneRenderer {
  constructor({ sceneLoader, engineManager, sceneCreator }) {
    
    this.sceneLoader = sceneLoader
    this.engineManager = engineManager
    this.sceneCreator = sceneCreator
  }

  #createScene = () => {
    const scene = this.sceneCreator.createScene()
    return scene
  }

  initializeScene = () => {
    const scene = this.#createScene()
    this.sceneLoader.loadScene(scene)
    this.engineManager.runRenderLoop(scene)
  }
}
