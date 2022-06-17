export default class Animator {
  constructor(scene, { name, texture, size, staggerFrame, spriteMap, activeAnimation = 'idle' }) {
    this.activeAnimation = activeAnimation
    const guy = BABYLON.Mesh.CreatePlane(name, size, scene)
    guy.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y
    const guyTexture = new BABYLON.Texture(texture, scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE)
    let gameFrame = 0
    guyTexture.hasAlpha = true
    guyTexture.uScale = 1 / spriteMap.columns
    guyTexture.vScale = 1 / spriteMap.rows
    guyTexture.uOffset = 0
    const guyMaterial = new BABYLON.StandardMaterial(`${name}-material`, this.scene)
    guyMaterial.transparencyMode = BABYLON.Material.MATERIAL_ALPHATESTANDBLEND
    guyMaterial.useAlphaFromDiffuseTexture = true
    guyMaterial.diffuseTexture = guyTexture
    guyMaterial.specularColor = new BABYLON.Color3(0, 0, 0)
    guy.material = guyMaterial

    scene.registerBeforeRender(() => {
      gameFrame++
      let animationData = spriteMap.animations[this.activeAnimation]
      const animationLength = animationData.frames.length
      const frame = animationData.frames[Math.floor(gameFrame / staggerFrame) % animationLength]
      guyTexture.uOffset = frame / spriteMap.rows
      guyTexture.vOffset = animationData.row / spriteMap.rows
    })
    this.guy = guy
  }

  set parent(parent) {
    this.guy.parent = parent
  }

  set animation(activeAnimation) {
    this.activeAnimation = activeAnimation
  }
}
