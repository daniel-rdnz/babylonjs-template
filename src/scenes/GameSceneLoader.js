import { HemisphericLight, Vector3, CannonJSPlugin } from 'babylonjs'
import Player from '../entities/Player'
//import Dungeon from '../entities/dungeon'
import DynamicTerrain from '../entities/world/DynamicTerrain'
import * as cannon from 'cannon'

export default class GameSceneLoader {
  constructor(canvas) {
    this.canvas = canvas
  }

  configureScene = (scene) => {
    this.player = new Player(scene, this.canvas)

    this.setPhysics(scene)
    this.setAmbient(scene, { withfog: true })

    //new Dungeon({ width: 300, height: 100, deepLevel: 3, scene})
    const dynamicTerrain = new DynamicTerrain(scene)

    const camElevation = 2.0
    let camAltitude = 0.0
    scene.registerBeforeRender(() => {
      if (dynamicTerrain.terrain) {
        camAltitude =
          dynamicTerrain.terrain.getHeightFromMap(this.player.camera.position.x, this.player.camera.position.z) +
          camElevation
        this.player.camera.position.y = camAltitude
        this.fogEmiter.position.x = this.player.camera.position.x
        this.fogEmiter.position.y = this.player.camera.position.y - 2
        this.fogEmiter.position.z = this.player.camera.position.z
        
      }
    })
  }

  setPhysics(scene) {
    const cannonPlugin = new CannonJSPlugin(true, 10, cannon)
    const gravityVector = new Vector3(0, -0.75, 0)

    scene.collisionsEnabled = true
    scene.enablePhysics(gravityVector, cannonPlugin)
    scene.gravity = gravityVector
  }

  setAmbient = (scene, { withfog = false }) => {
    /*   const light = new HemisphericLight('light', new Vector3(0, 1, 0))
    light.intensity = 0.8
    light.groundColor = new BABYLON.Color3(0.8, 0, 0)
    light.diffuse = new BABYLON.Color3(0.5, 0.8, 0.6) */

    if (withfog) {
      // Fog
      scene.fogMode = BABYLON.Scene.FOGMODE_EXP
      //BABYLON.Scene.FOGMODE_NONE;
      //BABYLON.Scene.FOGMODE_EXP;
      //BABYLON.Scene.FOGMODE_EXP2;
      //BABYLON.Scene.FOGMODE_LINEAR;

      const fogTexture = new BABYLON.Texture(
        'https://raw.githubusercontent.com/aWeirdo/Babylon.js/master/smoke_15.png',
        scene
      )
      const particleSystem = new BABYLON.ParticleSystem('particles', 2500, scene)
      /*      particleSystem.minEmitBox = new BABYLON.Vector3(-10, 2, -10) 
      particleSystem.maxEmitBox = new BABYLON.Vector3(10, -2, 10)  */
      particleSystem.particleTexture = fogTexture.clone()
      //fountain.parent = this.player.camera
      // particleSystem.emitter = fountain

      particleSystem.color1 = new BABYLON.Color4(0.8, 0.8, 0.8, 0.1)
      particleSystem.color2 = new BABYLON.Color4(0.95, 0.95, 0.95, 0.15)
      particleSystem.colorDead = new BABYLON.Color4(0.9, 0.9, 0.9, 0.1)
      particleSystem.minSize = 3.5
      particleSystem.maxSize = 5.0
      particleSystem.emitRate = 100
      particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD
      particleSystem.gravity = new BABYLON.Vector3(0, 0, 0)
      particleSystem.direction1 = new BABYLON.Vector3(0, 0, 0)
      particleSystem.direction2 = new BABYLON.Vector3(0, 0, 0)
      particleSystem.minAngularSpeed = -0.5
      particleSystem.maxAngularSpeed = 0.5
      particleSystem.minEmitPower = 0.1
      particleSystem.maxEmitPower = 0.5
      particleSystem.updateSpeed = 0.05
      particleSystem.minLifeTime = 0.5;
      particleSystem.maxLifeTime = 2; 
      

      // Where the sun particles come from
      const sunEmitter = new BABYLON.HemisphericParticleEmitter()
      sunEmitter.radius = 6
      sunEmitter.radiusRange = 0

      // Assign particles to emitters
      //const coreSphere = BABYLON.MeshBuilder.CreateSphere('coreSphere', { diameter: 2.01, segments: 64 }, scene)
      
      
      const fountain = BABYLON.Mesh.CreateBox("foutain", 4, scene);
      particleSystem.emitter = fountain
      particleSystem.particleEmitterType = sunEmitter

      particleSystem.start()
      this.fogEmiter = fountain

      scene.fogColor = new BABYLON.Color3(0, 0, 0)
      //scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3)
      scene.clearColor = new BABYLON.Color3(0, 0, 0)
      scene.fogDensity = 0.03

      /*  scene.registerBeforeRender(() => {
        fountain.position.z += 0.01
      }) */

      //Only if LINEAR
      /* scene.fogStart = 15.0;
      scene.fogEnd = 20.0; */
    }
  }

  loadScene = (scene) => {
    this.configureScene(scene)
  }
}
