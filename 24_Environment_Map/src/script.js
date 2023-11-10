import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { GroundProjectedSkybox } from 'three/addons/objects/GroundProjectedSkybox.js'

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const rgbeLoader = new RGBELoader()
const textureLoader = new THREE.TextureLoader()

const cubeTextureLoader = new THREE.CubeTextureLoader()

/**
 * Environment map
 */
// LDR cube texture
// const environmentMap = cubeTextureLoader.load([
//     '/environmentMaps/0/px.png',
//     '/environmentMaps/0/nx.png',
//     '/environmentMaps/0/py.png',
//     '/environmentMaps/0/ny.png',
//     '/environmentMaps/0/pz.png',
//     '/environmentMaps/0/nz.png'
// ])

// HDR LOADER
// rgbeLoader.load("/environmentMaps/2/2k.hdr", (env) => {
//     env.mapping = THREE.EquirectangularReflectionMapping;

//     scene.environment = env
//     // scene.background = env

//     const skyBox = new GroundProjectedSkybox(env);
//     skyBox.radius = 120;
//     skyBox.height = 11;
//     skyBox.scale.setScalar(50)
//     scene.add(skyBox)

//     gui.add(skyBox, "radius", 1, 200, 0.1).name("skyboxRadius");
//     gui.add(skyBox, "height", 1, 200, 0.1).name("skyboxHeight");
// })

/**
 * Base
 */
// Debug
const gui = new GUI()
var global = {};

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


// Real Time Environment Map
const environmentMap = textureLoader.load('/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg')
environmentMap.mapping = THREE.EquirectangularReflectionMapping
environmentMap.colorSpace = THREE.SRGBColorSpace

scene.background = environmentMap

// Holy Donut

const holyDonut = new THREE.Mesh(
    new THREE.TorusGeometry(8, 0.5),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(10, 4, 2) })
)
holyDonut.layers.enable(1)
holyDonut.position.y = 3.5
holyDonut.position.x = - 2
scene.add(holyDonut)

// Cube render target
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
    type: THREE.FloatType
})
scene.environment = cubeRenderTarget.texture

const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget)
cubeCamera.layers.set(1)

// scene.environment = environmentMap;
// scene.background = environmentMap;

// Blur env map
// scene.backgroundBlurriness = 0.1
gui.add(scene, "backgroundBlurriness").min(0).max(1).step(0.001)

// bright internse background
// scene.backgroundIntensity = 1
gui.add(scene, "backgroundIntensity").min(0).max(10).step(0.1)

global.envMapIntensity = 1;

// Update all material
const updateAllMAterials = () => {
    scene.traverse((child) => {
        if (child.isMesh && child.material.isMeshStandardMaterial) {
            child.material.envMapIntensity = global.envMapIntensity
        }
    })
}

gui.add(global, "envMapIntensity").min(0).max(10).step(0.001).onChange(updateAllMAterials)

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
    new THREE.MeshStandardMaterial({ roughness: 0, metalness: 1, color: 0xaaaaaa })
)
// torusKnot.material.envMap = environmentMap;
torusKnot.position.y = 4
torusKnot.position.x = - 6
scene.add(torusKnot)

gltfLoader.load(
    "/models/FlightHelmet/glTF/FlightHelmet.gltf",
    (gltf) => {
        gltf.scene.scale.set(10, 10, 10)
        scene.add(gltf.scene)
        updateAllMAterials()
    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () => {
    // Time
    const elapsedTime = clock.getElapsedTime()

    // real time env map
    if (holyDonut) {
        holyDonut.rotation.x = Math.sin(elapsedTime) * 2
        cubeCamera.update(renderer, scene)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()