import SceneRenderer from 'root/render/SceneRenderer'

describe('SceneRenderer', () => {
  
  const sceneLoader = { loadScene: jest.fn() }

  const engineManager = { runRenderLoop: jest.fn() }

  const sceneCreator = { createScene: jest.fn().mockReturnValue('SCENE') }

  it('constructor', () => {
    const sceneRenderer = new SceneRenderer({ sceneLoader, engineManager, sceneCreator })

    expect(sceneRenderer.sceneLoader).toBeDefined()
    expect(sceneRenderer.engineManager).toBeDefined()
    expect(sceneRenderer.sceneCreator).toBeDefined()
  })

  it('initializeScene', () => {
    const sceneRenderer = new SceneRenderer({ sceneLoader, engineManager, sceneCreator })

    sceneRenderer.initializeScene()

    expect(sceneLoader.loadScene).toHaveBeenCalledTimes(1)
    expect(sceneCreator.createScene).toHaveBeenCalledTimes(1)
    expect(engineManager.runRenderLoop.mock.calls).toEqual([['SCENE']])
  })
})
