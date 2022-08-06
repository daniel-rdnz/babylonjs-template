import { HemisphericLight, Vector3 } from 'babylonjs'
import noise from '../../utils/Noise'
import { normalize } from '../../utils/helper'

export default class SPSterrain {
  constructor() {

  }

  create(scene, tileSize, rows, cols, dayStateMachine, sheetHeight = 6, sheetWidth = 6) {
    noise.seed(Math.random() * 15000)
    const groundHeight = -8
    const cameraLimit = 80
    const treesCount = 300

    const groundMat = new BABYLON.StandardMaterial('groundMaterial', scene)
    groundMat.specularColor = new BABYLON.Color3(0, 0, 0)
    groundMat.diffuseColor = new BABYLON.Color3(1, 1, 1)

    const groundTexture = new BABYLON.Texture(
      './assets/images/red_hood_tile.png',
      scene,
      false,
      true,
      BABYLON.Texture.NEAREST_SAMPLINGMODE
    )
    groundTexture.hasAlpha = true
    groundMat.diffuseTexture = groundTexture

    const light = new HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this.scene)
    const nightLight = new HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this.scene)

    const plane = BABYLON.MeshBuilder.CreateGround('plane', { width: tileSize, height: tileSize })
    const forest = BABYLON.Mesh.CreatePlane('forest', tileSize * 2, scene)
    forest.position.y = -30

    const SPS = new BABYLON.SolidParticleSystem('SPS', scene, { isPickable: true })
    const SPSForest = new BABYLON.SolidParticleSystem('SPSForest', scene, { isPickable: true })
    //SPSForest.billboard = true

    SPS.addShape(plane, rows * cols)
    SPSForest.addShape(forest, treesCount)

    const bodys = []

    const mesh = SPS.buildMesh()
    const meshForest = SPSForest.buildMesh()

    nightLight.excludedMeshes.push(mesh)
    nightLight.excludedMeshes.push(meshForest)
    nightLight.intensity = 0
    mesh.material = groundMat
    meshForest.material = groundMat

    plane.dispose()
    forest.dispose()

    const player = scene.getNodeByName('guy').parent

    SPS.initParticles = () => {
      for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
          const particle = SPS.particles[row + rows * col]
          particle.indexNum = row + rows * col
          particle.position.x = (row - rows / 2) * tileSize - tileSize * 0.5
          particle.position.z = (col - cols / 2) * tileSize + tileSize * 1.5

          const u = Math.floor(normalize(noise.simplex2(col / 16, row / 16)) * 2)
          const v = 5 //Math.floor(normalize(noise.simplex2(col / 16, row / 16)) * 2) + 4

          if (v == 5) {
            setForest(row, col, particle.position)
          }
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

    let ixForest = 0
    const setForest = (row, col, position) => {
      const isBeetweenXLimit = Math.abs(player.position.x - position.x) < cameraLimit && Math.abs(position.x) > 10
      const isBeetweenZLimit = Math.abs(player.position.z - position.z) < cameraLimit && Math.abs(position.z) > 10
      const originalNoise = noise.simplex2(col / 8, row / 8)
      const noiseForest = normalize(originalNoise)

      if (isBeetweenXLimit && isBeetweenZLimit && noiseForest < 0.55) {
        const forestParticle = SPSForest.particles[ixForest]
        const body = bodys[ixForest]

        forestParticle.position.x = position.x + originalNoise * 5
        forestParticle.position.z = position.z + originalNoise * 5
        forestParticle.position.y = 0
        forestParticle.isVisible = true

        forestParticle.rotation.y = -Math.PI / 4

        forestParticle.uvs.x = 0 / 3 + 0.001
        forestParticle.uvs.z = 1 / 3 - 0.001
        forestParticle.uvs.y = 1 / 3 + 0.001
        forestParticle.uvs.w = 2 / 3 - 0.001

        body.position.x = forestParticle.position.x
        body.position.z = forestParticle.position.z
        body.position.y = -4

        ixForest++
      } else {

      }
    }

    SPSForest.initParticles = () => {
      SPSForest.position = player.position
      for (let ix = 0; ix < treesCount; ix++) {
        const forest = SPSForest.particles[ix]
        forest.position.y = -30
        forest.isVisible = false

        const body = BABYLON.Mesh.CreateBox('', 1, scene)
        body.position.y = 15
        body.applyGravity = false
        body.visibility = 0
        body.physicsImpostor = new BABYLON.PhysicsImpostor(
          body,
          BABYLON.PhysicsImpostor.BoxImpostor,
          { mass: 0, friction: 0.5, restitution: 0 },
          scene
        )
        bodys.push(body)
      }
      SPSForest.isAlwaysVisible = true
      SPSForest.depthSortParticles = false
    }

    SPSForest.initParticles()
    SPS.initParticles()
    SPSForest.setParticles()
    SPS.setParticles()

    scene.registerBeforeRender(() => {
      const isBeetweenXLimit = Math.abs(player.position.x - SPSForest.position.x) < 10
      const isBeetweenZLimit = Math.abs(player.position.z - SPSForest.position.z) < 10

      if (isBeetweenXLimit && isBeetweenZLimit) {
        return false
      }

      ixForest = 0

      for (let ix = 0; ix < treesCount; ix++) {
        const forest = SPSForest.particles[ix]
        forest.isVisible = false
      }

      SPS.initParticles()
      SPS.setParticles()
    })

    const groundContainer = BABYLON.MeshBuilder.CreateBox(
      'Ground',
      { width: tileSize * rows, height: 1, depth: tileSize * cols },
      scene
    )
    groundContainer.position.y = groundHeight
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
      SPSForest.setParticles()
    })

    return {
      terrain: {
        getHeightFromMap: () => 0
      }
    }
  }
}
