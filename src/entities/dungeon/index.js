import Node from '../../utils/bsp/node'
import { MeshBuilder } from 'babylonjs'
import { getRandom } from '../../utils/helper'
import Room from './room'

const VERTICAL = 0
const HORIZONTAL = 1

export default class Dungeon {
  constructor({ width, height, deepLevel, scene }) {
    this.root = new Node({ value: { width, height, x: 0, z: 0 } })
    this.createChilds(this.root, 0, deepLevel)
    this.scene = scene
    console.log(this.root)
  }

  createChilds = (node, level, deepLevel) => {
    if (level === deepLevel) {
      this.createRoom(node)
      return false
    }
    const direction = node.value.width > node.value.height ? VERTICAL : HORIZONTAL //Math.random() < 0.5 ? VERTICAL : HORIZONTAL
    const parentHeight = node.value.height
    const parentWidth = node.value.width

    if (direction == VERTICAL) {
      const leftWith = getRandom(parentWidth * 0.3, parentWidth * 0.8)
      const rightWith = parentWidth - leftWith

      node.left = new Node({
        parent: node,
        value: { width: leftWith, height: parentHeight, x: node.value.x, z: node.value.z }
      })
      node.right = new Node({
        parent: node,
        value: { width: rightWith, height: parentHeight, x: leftWith, z: node.value.z }
      })
    }
    if (direction == HORIZONTAL) {
      const leftHeight = getRandom(parentHeight * 0.3, parentHeight * 0.8)
      const rightHeight = parentHeight - leftHeight

      node.left = new Node({
        parent: node,
        value: { width: parentWidth, height: leftHeight, x: node.value.x, z: node.value.z }
      })
      node.right = new Node({
        parent: node,
        value: { width: parentWidth, height: rightHeight, x: node.value.x, z: leftHeight }
      })
    }
    
    this.createChilds(node.left, level + 1, deepLevel)
    this.createChilds(node.right, level + 1, deepLevel)
  }
  createRoom = (node) => {
    const config = {
      width: getRandom(node.value.width * 0.4, node.value.width * 0.8),
      height: 10,
      depth: getRandom(node.value.height * 0.4, node.value.height * 0.8)
    }
    const box = MeshBuilder.CreateBox('box', config, this.scene)
    box.position.x = node.value.x 
    box.position.z = node.value.z

    console.log(node, box.position, config)
  }
}
