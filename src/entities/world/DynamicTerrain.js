import noise from '../../utils/Noise'
import PluginManager from '../../utils/PluginManager'
export default class DynamicTerrain {
  constructor(scene) {
    this.scene = scene
    this.terrain = undefined
    new PluginManager(
      'https://cdn.rawgit.com/BabylonJS/Extensions/master/DynamicTerrain/dist/babylon.dynamicTerrain.min.js',
      this.create
    )
  }

  create = () => {
    const url = 'assets/images/bath-tile.png'
    const terrainTexture = new BABYLON.Texture(url, this.scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE)
    terrainTexture.uScale = 32 //1 / 8
    terrainTexture.vScale = terrainTexture.uScale
    /*     terrainTexture.uOffset = (1 / 8 * 2) + 1 / 16
    terrainTexture.vOffset = 1 / 8 * 6 */

    const mapSubX = 500 // point number on X axis
    const mapSubZ = 500 // point number on Z axis
    const seed = 0.3 // seed
    const noiseZoom = 512 // noise frequency
    const elevationScale = 20.0
    noise.seed(seed)
    const mapData = new Float32Array(mapSubX * mapSubZ * 3) // x3 float values per point : x, y and z
    const mapColors = new Float32Array(mapSubX * mapSubZ * 3)
    //const mapUVs = new Float32Array(mapSubX * mapSubZ * 2)
    // SPMap with 3 object types
    const SPmapData = [[], [], []]

    for (let l = 0; l < mapSubZ; l++) {
      for (let w = 0; w < mapSubX; w++) {
        const x = (w - mapSubX * 0.25) * 4.0
        const z = (l - mapSubZ * 0.25) * 4.0
        const y = 0/* noise.simplex2(x / 512, z / 512) + noise.simplex2(x / 64, z / 64) + noise.simplex2(x / 32, z / 32)// altitude

        if(y > 0.5 ) {
         y = (0.5 + y)  *  y * elevationScale
        }
        else {
          if(y > 0.3)
          y = (y + noise.simplex2(x / 16, z / 16)) * elevationScale / 8
          else 
          y = (y) * elevationScale / 8

          if (Math.random() > 0.92) {
            let xp = x
            let yp = y
            let zp = z
  
            let ry = Math.random() * 3.6
            let sx = 0.5 + Math.random() * 2.5
            let sy = 0.5 + Math.random() * 2.5
            let sz = 0.5 + Math.random() * 2.5
  
            SPmapData[2].push(xp, yp, zp, 0, ry, 0, sx, sy, sz)
          }
        } */
       // y =  y > 0.5 ? (0.5 + y)  *  y * elevationScale : (y + noise.simplex2(x / 16, z / 16)) * elevationScale / 8

        //console.log(x, z)
        mapData[3 * (l * mapSubX + w)] = x
        mapData[3 * (l * mapSubX + w) + 1] = y
        mapData[3 * (l * mapSubX + w) + 2] = z

        // colors of the map
        mapColors[l * mapSubX * 3 + w * 3] = 0.5 + Math.random() * 0.2
        mapColors[l * mapSubX * 3 + w * 3 + 1] = 0.5 + Math.random() * 0.4
        mapColors[l * mapSubX * 3 + w * 3 + 2] = 0.5

        /*  mapUVs[2 * (l * mapSubX + w)] = 1// u
        mapUVs[2 * (l * mapSubX + w) + 1] = 1// v
 */
        // objects of the map
        //let index = l * mapSubX + w
        // let's populate randomly
        
      }
    }
    const terrainMaterial = new BABYLON.StandardMaterial('tm', this.scene)
    terrainMaterial.diffuseTexture = terrainTexture
    terrainMaterial.ambientColor = new BABYLON.Color3(0,0,0)
    terrainMaterial.specularColor = new BABYLON.Color3(0,0,0)

    const rockTexture = new BABYLON.Texture(url, this.scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE)
    rockTexture.uScale = 2 //1 / 8
    rockTexture.vScale = rockTexture.uScale
    const rockMaterial = new BABYLON.StandardMaterial('tm', this.scene)
    rockMaterial.diffuseTexture = rockTexture
    rockMaterial.ambientColor = new BABYLON.Color3(0,0,0)
    rockMaterial.specularColor = new BABYLON.Color3(0,0,0)

    // SPS to depict the objects the SPMap
    const model1 = BABYLON.MeshBuilder.CreateBox('m1', { size: 1 }, this.scene)
    const model2 = BABYLON.MeshBuilder.CreatePolyhedron('m2', { size: 0.5 }, this.scene)
    const model3 = BABYLON.MeshBuilder.CreateSphere('m3', { segments: 3 }, this.scene)
    model3.material = rockMaterial

    const sps = new BABYLON.SolidParticleSystem('sps', this.scene, { useModelMaterial: true})
    const typ1 = sps.addShape(model1, 1000)
    const typ2 = sps.addShape(model2, 1000)
    const typ3 = sps.addShape(model3, 1000)
    sps.buildMesh()

    model1.dispose()
    model2.dispose()
    model3.dispose()

    // Dynamic Terrain
    // ===============
    const terrainSub = 50 // 100 terrain subdivisions
    const params = {
      mapData: mapData, // data map declaration : what data to use ?
      mapSubX: mapSubX, // how are these data stored by rows and columns
      mapSubZ: mapSubZ,
      //mapColors: mapColors,
      SPmapData: SPmapData, // Object map
      sps: sps, // SPS to render the objects
      terrainSub: terrainSub // how many terrain subdivisions wanted
    }
    this.terrain = new BABYLON.DynamicTerrain('t', params, this.scene)
    this.terrain.mesh.material = terrainMaterial
    //this.terrain .receiveShadows = true;
/*     this.terrain.checkCollisions = true;
    this.terrain.mesh.checkCollisions = true; */
    this.terrain.update(true)
  }
}
