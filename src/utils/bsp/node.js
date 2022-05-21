export default class Node {
  constructor({ parent = null, left = null, right = null, value }) {
    //this.parent = parent
    this.value = value
    this.left = left
    this.right = right
  }

  get isLeaf() {
    return Boolean(this.left && this.right)
  }

  get isRoot() {
    return this.parent === null
  }
}
