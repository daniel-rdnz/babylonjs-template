import SceneRenderer from './render/SceneRenderer'
import GameSceneLoader from './scenes/GameSceneLoader'
import EngineCreator from './render/EngineCreator'

const canvas =  document.getElementById('renderCanvas') 

const initializeGame = () => {
  
  const sceneRenderer = new SceneRenderer({
    canvas: canvas,
    sceneLoader: new GameSceneLoader(canvas),
    engine: new EngineCreator(canvas).createDefaultEngine()
  })
  sceneRenderer.initializeScene()
}

initializeGame()
