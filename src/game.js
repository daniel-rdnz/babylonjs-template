import SceneRenderer from './SceneRenderer'
import GameSceneLoader from './GameSceneLoader'
import EngineCreator from './EngineCreator'

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
