import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import './style.css';


// Start of the code
THREE.ColorManagement.enabled = false

// Texture
// const image = new Image()
// const texture = new THREE.Texture(image)

// image.onload = () => {
//     texture.needsUpdate = true
// }

// image.src = '/textures/door/color.jpg';

// Easier way to load texture
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {
    console.log("Start");
}
loadingManager.onLoad = () => {
    console.log("Loading ");
}
loadingManager.onProgress = () => {
    console.log("Progress");
}
loadingManager.onError = () => {
    console.log("Error");
}

const textureLoader = new THREE.TextureLoader(loadingManager);
const texture = textureLoader.load('/textures/minecraft.png');

// texture.repeat.x = 2;
// texture.repeat.y = 3;
// texture.wrapS = THREE.RepeatWrapping;
// texture.wrapT = THREE.RepeatWrapping;

// For Mirror Effect
// texture.wrapS = THREE.MirroredRepeatWrapping;
// texture.wrapT = THREE.MirroredRepeatWrapping;

// Texture offset
// texture.offset.x = 0.5
// texture.offset.y = 0.5

// Rotate Texture
// texture.rotation = Math.PI / 4
// texture.center.x = 0.5
// texture.center.y = 0.5

// Turn off the mipmapping feature
texture.generateMipmaps = false; 
// To reduce blur
texture.minFilter = THREE.NearestFilter
texture.magFilter = THREE.NearestFilter


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ map: texture })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// After instantiating the renderer
renderer.outputColorSpace = THREE.LinearSRGBColorSpace

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()