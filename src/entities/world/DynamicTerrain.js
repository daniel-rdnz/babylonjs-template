import noise from '../../utils/Noise'
import PluginManager from '../../utils/PluginManager'
export default class DynamicTerrain {
  constructor(scene) {
    this.scene = scene
    this.terrain =  undefined
    new PluginManager(
      'https://cdn.rawgit.com/BabylonJS/Extensions/master/DynamicTerrain/dist/babylon.dynamicTerrain.min.js',
      this.create
    )
  }

  create = () => {
    const url = 'https://www.babylonjs-playground.com/textures/ground.jpg'
    const terrainTexture = new BABYLON.Texture(url, this.scene)
    terrainTexture.uScale = 4.0
    terrainTexture.vScale = terrainTexture.uScale

    const mapSubX = 1000 // point number on X axis
    const mapSubZ = 1000 // point number on Z axis
    const seed = 0.3 // seed
    const noiseScale = 0.03 // noise frequency
    const elevationScale = 6.0
    noise.seed(seed)
    const mapData = new Float32Array(mapSubX * mapSubZ * 3) // x3 float values per point : x, y and z
    const mapColors = new Float32Array(mapSubX * mapSubZ * 3)

    // SPMap with 3 object types
    //const SPmapData = [[], [], []];

    for (let l = 0; l < mapSubZ; l++) {
      for (let w = 0; w < mapSubX; w++) {
        const x = (w - mapSubX * 0.5) * 2.0
        const z = (l - mapSubZ * 0.5) * 2.0
        const y = noise.simplex2(x * noiseScale, z * noiseScale) // altitude
        y *= (0.5 + y) * y * elevationScale

        mapData[3 * (l * mapSubX + w)] = x
        mapData[3 * (l * mapSubX + w) + 1] = y
        mapData[3 * (l * mapSubX + w) + 2] = z

        // colors of the map
        mapColors[l * mapSubX * 3 + w * 3] = 0.5 + Math.random() * 0.2
        mapColors[l * mapSubX * 3 + w * 3 + 1] = 0.5 + Math.random() * 0.4
        mapColors[l * mapSubX * 3 + w * 3 + 2] = 0.5

        // objects of the map
        let index = l * mapSubX + w
        // let's populate randomly
        /*  if (Math.random() > 0.85) {
                let xp = x;
                let yp = y;
                let zp = z;
                
                let ry = Math.random() * 3.6;
                let sx = 0.5 + Math.random();
                let sy = 0.5 + Math.random();
                let sz = 0.5 + Math.random();
                
                SPmapData[index % 3].push(xp, yp, zp, 0, ry, 0, sx, sy, sz);
                } */
      }
    }

    // SPS to depict the objects the SPMap
    /*  const model1 = BABYLON.MeshBuilder.CreateBox("m1", {size: 1}, scene);
        const model2 = BABYLON.MeshBuilder.CreatePolyhedron("m2", {size: 0.5}, scene);
        const model3 = BABYLON.MeshBuilder.CreateSphere("m3", {segments: 3}, scene);

        const sps = new BABYLON.SolidParticleSystem("sps", scene);
        const typ1 = sps.addShape(model1, 1000);
        const typ2 = sps.addShape(model2, 1000);
        const typ3 = sps.addShape(model3, 1000);
        sps.buildMesh();

        model1.dispose();
        model2.dispose();
        model3.dispose(); */

    // Dynamic Terrain
    // ===============
    const terrainSub = 100 // 100 terrain subdivisions
    const params = {
      mapData: mapData, // data map declaration : what data to use ?
      mapSubX: mapSubX, // how are these data stored by rows and columns
      mapSubZ: mapSubZ,
      mapColors: mapColors,
      //SPmapData: SPmapData,           // Object map
      //sps: sps,                       // SPS to render the objects
      terrainSub: terrainSub // how many terrain subdivisions wanted
    }
    this.terrain = new BABYLON.DynamicTerrain('t', params, this.scene)
    const terrainMaterial = new BABYLON.StandardMaterial('tm', this.scene)
    terrainMaterial.diffuseTexture = terrainTexture
    this.terrain.mesh.material = terrainMaterial

    this.terrain.update(true)
  }
}
