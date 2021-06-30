import SceneRenderer from './render/SceneRenderer'
import SceneCreator from './render/SceneCreator'
import GameSceneLoader from './scenes/GameSceneLoader'
import EngineManager from './render/EngineManager'

const canvas = document.getElementById('renderCanvas')

const initializeGame = () => {
  const sceneLoader = new GameSceneLoader(canvas)
  const engineManager = new EngineManager(canvas)
  const sceneCreator = new SceneCreator(engineManager.createDefaultEngine())

  const sceneRenderer = new SceneRenderer({ sceneLoader, engineManager, sceneCreator })
  sceneRenderer.initializeScene()
}

initializeGame()
