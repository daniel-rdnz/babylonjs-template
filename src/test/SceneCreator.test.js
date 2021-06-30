import { Scene } from 'babylonjs'
import SceneCreator from 'root/render/SceneCreator'

describe('SceneCreator', () => {
  it('constructor', () => {
    const sceneCreator = new SceneCreator('ENGINE')
    expect(sceneCreator.engine).toEqual('ENGINE')
  })
  it('createScene', () => {
    jest.mock('babylonjs')
    const sceneCreator = new SceneCreator('ENGINE')
    const scene = sceneCreator.createScene()

    expect(Scene).toHaveBeenCalledTimes(1)
    expect(Scene).toHaveBeenCalledWith('ENGINE')
    expect(scene.Scene).toEqual('SCENE')
  })
})
