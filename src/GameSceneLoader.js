import * as BABYLON from 'babylonjs'

export default class GameSceneLoader {
  constructor(canvas) {
    this.canvas = canvas
  }
  loadScene = () => {
    const camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 3, new BABYLON.Vector3(0, 0, 0))
    camera.attachControl(this.canvas, true)

    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0))
    const box = BABYLON.MeshBuilder.CreateBox('box', {})
  }


}
