import { ArcRotateCamera, attachControl, HemisphericLight, CreateBox, Vector3 } from 'babylonjs'
import { Scene } from 'babylonjs'
import GameSceneLoader from 'root/scenes/GameSceneLoader'


describe('GameSceneLoader', () => {
  it('constructor', () => {
    const gameSceneLoader = new GameSceneLoader('CANVAS')
    expect(gameSceneLoader.canvas).toBe('CANVAS')
  })

  it('loadScene', () => {
    const gameSceneLoader = new GameSceneLoader('CANVAS')
    gameSceneLoader.loadScene(new Scene('ENGINE'))

    //expect(ArcRotateCamera).toHaveBeenCalledTimes(1)
    //expect(Vector3).toHaveBeenCalledTimes(3)
    //expect(HemisphericLight).toHaveBeenCalledTimes(1)
    //expect(CreateBox).toHaveBeenCalledTimes(1)

    //expect(ArcRotateCamera).toHaveBeenCalledWith('camera', -Math.PI / 2, Math.PI / 2.5, 3, {})
    //expect(HemisphericLight).toHaveBeenCalledWith('light', {})
    //expect(attachControl).toHaveBeenCalledWith('CANVAS', true)
    /*expect(Vector3.mock.calls).toEqual([
      [0, -0.75, 0],
      [0, 0, 0],
      [0, 1, 0]
    ])**/
  })
})
