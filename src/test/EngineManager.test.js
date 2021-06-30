import { Engine, runRenderLoop } from 'babylonjs'
import EngineManager from 'root/render/EngineManager'

beforeEach(() => {
    runRenderLoop.mockClear();
    Engine.mockClear();
  });

describe('EngineManager', () => {
  it('constructor', () => {
    const engineManager = new EngineManager('CANVAS')
    expect(engineManager.canvas).toBe('CANVAS')
    expect(engineManager.engine).toBeNull()
  })

  it('createDefaultEngine', () => {
    const engineManager = new EngineManager('CANVAS')
    const engine = engineManager.createDefaultEngine()

    expect(Engine).toHaveBeenCalledTimes(1);
    expect(engine).toBeDefined()
    expect(engine.name).toBe('ENGINE')
  })

  it('runRenderLoop', () => {
    const engineManager = new EngineManager('CANVAS')
    const engine = engineManager.createDefaultEngine()
    engine.runRenderLoop('SCENE')
    expect(runRenderLoop).toHaveBeenCalledTimes(1);
    expect(runRenderLoop).toHaveBeenCalledWith('SCENE');
  })
})
