export const Scene = jest.fn().mockImplementation(() => {
  return { Scene: 'SCENE', enablePhysics: jest.fn() }
})

export const runRenderLoop = jest.fn()

export const Engine = jest.fn().mockImplementation(() => {
  return { runRenderLoop, name: 'ENGINE' }
})

export const attachControl = jest.fn()

export const ArcRotateCamera = jest.fn().mockImplementation(() => {
  return { attachControl }
})

export const HemisphericLight = jest.fn().mockImplementation(() => {
  return {}
})

export const CreateBox = jest.fn()
export const MeshBuilder = {
  CreateBox
}

export const Vector3 = jest.fn().mockImplementation(() => {
  return {}
})

export const Color3 = jest.fn().mockImplementation(() => {
  return 'RED'
})
