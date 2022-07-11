import { HemisphericLight } from 'babylonjs'
import noise from '../../utils/Noise'
import { normalize } from '../../utils/helper'

export default class SPSterrain {
  constructor() {}

  create(scene, tileSize, rows, cols, dayStateMachine, sheetHeight = 6, sheetWidth = 6) {
    const groundMat = new BABYLON.StandardMaterial('groundMaterial', scene)
    groundMat.specularColor = new BABYLON.Color3(0, 0, 0)
    groundMat.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8)
    groundMat.diffuseTexture = new BABYLON.Texture('./assets/images/red_hood_tile.png', scene)
    const light = new HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this.scene)
    const nightLight = new HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this.scene)
    const plane = BABYLON.MeshBuilder.CreateGround('plane', { width: tileSize, height: tileSize })
    const SPS = new BABYLON.SolidParticleSystem('SPS', scene, { isPickable: true })

    SPS.addShape(plane, rows * cols)

    const mesh = SPS.buildMesh()
    nightLight.excludedMeshes.push(mesh)
    nightLight.intensity = 0
    mesh.material = groundMat
    plane.dispose()
    SPS.initParticles = () => {
      for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
          const particle = SPS.particles[row + rows * col]
          particle.indexNum = row + rows * col
          particle.position.x = (row - rows / 2) * tileSize - tileSize * 0.5
          particle.position.z = (col - cols / 2) * tileSize + tileSize * 1.5

          const u = Math.floor(normalize(noise.simplex2(col / 16, row / 16)) * 2)
          const v = Math.floor(normalize(noise.simplex2(col / 64, row / 64)) * 2) + 4
          particle.uvs.x = u / sheetWidth
          particle.uvs.z = (u + 1) / sheetWidth - 0.001
          particle.uvs.y = v / sheetHeight
          particle.uvs.w = (v + 1) / sheetHeight - 0.001
          particle.position.y = -4
        }
      }
      SPS.isAlwaysVisible = true
      return SPS
    }

    SPS.initParticles()
    SPS.setParticles()
    const groundContainer = BABYLON.MeshBuilder.CreateBox(
      'Ground',
      { width: tileSize * rows, height: 1, depth: tileSize * cols },
      scene
    )
    groundContainer.position.y = -1
    groundContainer.physicsImpostor = new BABYLON.PhysicsImpostor(
      groundContainer,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0.3, restitution: 0 },
      scene
    )
    groundContainer.visibility = 0

    const getDark = () => {
      if (dayStateMachine.currentState !== 'sunSet') {
        return false
      }

      if (light.intensity <= 0) {
        dayStateMachine.currentState = dayStateMachine.transition({ type: 'END' })
      }

      light.intensity -= 0.005
      nightLight.intensity += 0.005
    }

    const getBright = () => {
      if (dayStateMachine.currentState !== 'sunDawn') {
        return false
      }

      if (light.intensity >= 1) {
        dayStateMachine.currentState = dayStateMachine.transition({ type: 'END' })
      }

      light.intensity += 0.005
      nightLight.intensity -= 0.005
    }

    scene.registerBeforeRender(() => {
      getDark()
      getBright()
    })

    return {
      terrain: {
        getHeightFromMap: () => 0
      }
    }
  }
}
