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
  })
})
