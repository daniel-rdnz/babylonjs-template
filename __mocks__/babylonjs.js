export const Scene = jest.fn().mockImplementation(() => {
  return { Scene: 'SCENE', enablePhysics: jest.fn() }
})

export const runRenderLoop = jest.fn()

export const Engine = jest.fn().mockImplementation(() => {
  return { runRenderLoop, name: 'ENGINE' }
})

export const attachControl = jest.fn()
export const setTarget = jest.fn()
export const UniversalCamera = jest.fn().mockImplementation(() => {
  return { attachControl, setTarget }
})

export const HemisphericLight = jest.fn().mockImplementation(() => {
  return {}
})

export const CreateBox = jest.fn()
export const MeshBuilder = {
  CreateBox
}

export const Zero = jest.fn()
export const Vector3 = jest.fn().mockImplementation(() => {
  return { Zero }
})

export const Color3 = jest.fn().mockImplementation(() => {
  return 'RED'
})
