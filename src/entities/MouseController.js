export default class MouseController {
  islocked = false
  scene = null
  constructor(scene, canvas) {
    this.canvas = canvas
    this.scene = scene
    this.setEventListeners()
    this.setMousePointer()
  }

  pointerlockchange = () => {
    this.isLocked =
      document.mozPointerLockElement ||
      document.webkitPointerLockElement ||
      document.msPointerLockElement ||
      document.pointerLockElement ||
      null
  }

  setMousePointer = () => {
    this.scene.onPointerDown = (evt) => {
      if (!this.isLocked) {
        this.canvas.requestPointerLock =
          this.canvas.requestPointerLock ||
          this.canvas.msRequestPointerLock ||
          this.canvas.mozRequestPointerLock ||
          this.canvas.webkitRequestPointerLock
        if (this.canvas.requestPointerLock) {
          this.canvas.requestPointerLock()
        }
      }
      //continue with shooting requests or whatever :P
      //evt === 1 (mouse wheel click (not scrolling))
      //evt === 2 (right mouse click)
    }
  }

  setEventListeners = () => {
    document.addEventListener('pointerlockchange', this.pointerlockchange, false)
    document.addEventListener('mspointerlockchange', this.pointerlockchange, false)
    document.addEventListener('mozpointerlockchange', this.pointerlockchange, false)
    document.addEventListener('webkitpointerlockchange', this.pointerlockchange, false)
  }
}
