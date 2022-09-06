import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { Texture } from '@babylonjs/core/Materials/Textures/texture'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'
import { TransformNode } from '@babylonjs/core/Meshes/transformNode'
import { Color3 } from '@babylonjs/core/Maths'

export default class Animator {
  constructor(scene, { name, textureUrl, size, spriteMap, activeAnimation = 'idle' }) {
    this.activeAnimation = activeAnimation
    this.gameFrame = 0

    const canvas = this.createCanvas(scene, name, size)
    const texture = this.createTexture(scene, textureUrl, spriteMap.columns, spriteMap.rows)
    const material = this.createMaterial(scene, name, texture)
    canvas.material = material

    scene.registerBeforeRender(() => {
      this.animate(spriteMap, texture)
    })
    this.canvas = canvas
  }

  createCanvas(scene, name, size) {
    const canvas = MeshBuilder.CreatePlane(name, {size}, scene)
    canvas.billboardMode = TransformNode.BILLBOARDMODE_Y
    return canvas
  }

  createTexture(scene, textureUrl, columns, rows) {
    const texture = new Texture(textureUrl, scene, false, true, Texture.NEAREST_SAMPLINGMODE)
    texture.hasAlpha = true
    texture.uScale = 1 / columns
    texture.vScale = 1 / rows
    return texture
  }

  createMaterial(scene, name, texture) {
    const material = new StandardMaterial(`${name}-material`, scene)
    //material.transparencyMode = BABYLON.Material.MATERIAL_ALPHATESTANDBLEND
    material.useAlphaFromDiffuseTexture = true
    material.diffuseTexture = texture
    //material.specularColor = new BABYLON.Color3(0, 0, 0)
    //material.disableLighting = true;
    material.emissiveColor = Color3.White()
    material.diffuseColor = new Color3(1, 1, 1)
    return material
  }

  animate(spriteMap, texture) {
    this.gameFrame++
    let animationData = spriteMap.animations[this.activeAnimation]
    const animationLength = animationData.frames.length
    const frameIndex = Math.floor(this.gameFrame / animationData.staggerFrame) % animationLength
    const frame = animationData.frames[frameIndex]
    texture.uOffset = frame / spriteMap.rows
    texture.vOffset = animationData.row / spriteMap.rows
  }

  set parent(parent) {
    this.canvas.parent = parent
  }

  set animation(activeAnimation) {
    this.activeAnimation = activeAnimation
  }
}
