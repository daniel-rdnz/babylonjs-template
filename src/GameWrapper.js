import React, { useEffect, useRef } from 'react'
import SceneCreator from './render/SceneCreator'
import GameSceneLoader from './scenes/GameSceneLoader'
import EngineManager from './render/EngineManager'

const GameWrapper = () => {
  const reactCanvas = useRef(null)
  useEffect(() => {
    const { current: canvas } = reactCanvas

    const sceneLoader = new GameSceneLoader(canvas)
    const engineManager = new EngineManager(canvas)
    const sceneCreator = new SceneCreator(engineManager.createDefaultEngine())

    const scene = sceneCreator.createScene()
    sceneLoader.loadScene(scene)
    engineManager.runRenderLoop(scene)

  }, [])

  return <canvas ref={reactCanvas} id='renderCanvas' touch-action='none' />
}

export default GameWrapper;

