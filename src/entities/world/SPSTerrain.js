import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'
import { Color3, Vector3 } from '@babylonjs/core/Maths'
import { Texture } from '@babylonjs/core/Materials/Textures/texture'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import {SolidParticleSystem} from '@babylonjs/core/Particles/solidParticleSystem'
import { Node } from '@babylonjs/core/node'
import noise from '../../utils/Noise'

export default class SPSterrain extends Node {
  constructor() {
    super()
  }

  create(scene, tileSize, rows, cols, dayStateMachine, sheetHeight = 6, sheetWidth = 6) {
    noise.seed(Math.random() * 15000)
    const groundHeight = -8

    const groundMat = new StandardMaterial('groundMaterial', scene)
    groundMat.specularColor = new Color3(0, 0, 0)
    groundMat.diffuseColor = new Color3(1, 1, 1)

    const groundTexture = new Texture(
      './assets/images/assets.png',
      scene,
      false,
      true,
      Texture.NEAREST_SAMPLINGMODE
    )
    groundTexture.hasAlpha = true
    groundMat.diffuseTexture = groundTexture

    const light = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene)
    const nightLight = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene)

    const plane = MeshBuilder.CreateGround('plane', { width: tileSize, height: tileSize })

    const SPS = new SolidParticleSystem('SPS', scene, { isPickable: true })
    SPS.parent = this
    console.log(SPS)
    //SPSForest.billboard = true

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

          const u = 0//Math.floor(normalize(noise.simplex2(col / 16, row / 16)) * 2)
          const v = 5 //Math.floor(normalize(noise.simplex2(col / 16, row / 16)) * 2) + 4

          particle.uvs.x = u / sheetWidth + 0.001
          particle.uvs.z = (u + 1) / sheetWidth - 0.001
          particle.uvs.y = v / sheetHeight + 0.001
          particle.uvs.w = (v + 1) / sheetHeight - 0.001
          particle.position.y = groundHeight
        }
      }
      SPS.isAlwaysVisible = true
      return SPS
    }
    
    SPS.initParticles()
    SPS.setParticles()

    scene.registerBeforeRender(() => {
      SPS.initParticles()
      SPS.setParticles()
    })

    const groundContainer = MeshBuilder.CreateBox(
      'Ground',
      { width: tileSize * rows, height: 1, depth: tileSize * cols },
      scene
    )
    groundContainer.position.y = groundHeight
/*     groundContainer.physicsImpostor = new BABYLON.PhysicsImpostor(
      groundContainer,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0.3, restitution: 0 },
      scene
    ) */
    groundContainer.visibility = 0

    return {
      terrain: {
        getHeightFromMap: () => 0
      }
    }
  }
}
