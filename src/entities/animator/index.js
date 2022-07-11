export default class Animator {
  constructor(scene, { name, textureUrl, size, spriteMap, activeAnimation = 'idle' }) {
    this.activeAnimation = activeAnimation
    this.gameFrame = 0
    
    const canvas = this.createCanvas(scene, name, size)
    const texture = this.createTexture(scene, textureUrl, spriteMap.columns, spriteMap.rows)
    const material =this.createMaterial(scene, name, texture)
    canvas.material = material

    scene.registerBeforeRender(() => {
        this.animate(spriteMap, texture)
    })
    this.canvas = canvas
  }

  createCanvas(scene, name, size) {
    const canvas = BABYLON.Mesh.CreatePlane(name, size, scene)
    canvas.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y
    return canvas
  }

  createTexture(scene, textureUrl, columns, rows) {
    const texture = new BABYLON.Texture(textureUrl, scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE)
    texture.hasAlpha = true
    texture.uScale = 1 / columns
    texture.vScale = 1 / rows
    return texture
  }

  createMaterial(scene, name, texture) {
    const material = new BABYLON.StandardMaterial(`${name}-material`, scene)
    material.transparencyMode = BABYLON.Material.MATERIAL_ALPHATESTANDBLEND
    material.useAlphaFromDiffuseTexture = true
    material.diffuseTexture = texture
    material.specularColor = new BABYLON.Color3(0, 0, 0)
    material.diffuseColor = new BABYLON.Color3(1, 1, 1)
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
