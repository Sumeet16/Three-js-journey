import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as lil from "lil-gui";

THREE.ColorManagement.enabled = false

const gui = new lil.GUI();

// Texture Loading
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader;

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/3.png')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
// const materials = new THREE.MeshBasicMaterial();
// materials.map = doorColorTexture;
// materials.color = new THREE.Color("red")
// materials.transparent = true;
// materials.alphaMap = doorAlphaTexture;
// materials.side = THREE.DoubleSide;

// const materials = new THREE.MeshNormalMaterial();

// const materials = new THREE.MeshMatcapMaterial();
// materials.matcap = matcapTexture;
// materials.side = THREE.DoubleSide;

// const materials = new THREE.MeshDepthMaterial();

// const materials = new THREE.MeshLambertMaterial();

// const materials = new THREE.MeshPhongMaterial();
// materials.shininess = 100;
// materials.specular = new THREE.Color(0x1188ff);

// const materials = new THREE.MeshToonMaterial();
// materials.gradientMap = gradientTexture

// const materials = new THREE.MeshStandardMaterial();
// materials.metalness = 0;
// materials.roughness = 1;
// materials.map = doorColorTexture;
// materials.aoMap = doorAmbientOcclusionTexture;
// materials.aoMapIntensity = 0.1;
// materials.displacementMap = doorHeightTexture;
// materials.displacementScale = 0.05;
// materials.metalnessMap = doorMetalnessTexture;
// materials.roughnessMap = doorRoughnessTexture;
// materials.normalMap = doorNormalTexture;
// materials.normalScale.set(0.5, 0.5); 
// materials.transparent = true;
// materials.alphaMap = doorAlphaTexture;


const materials = new THREE.MeshStandardMaterial();
materials.metalness = 0.7;
materials.roughness = 0.2;
materials.envMap = environmentMapTexture;
materials.side = THREE.DoubleSide;


gui.add(materials, "metalness", 0, 1, 0.0001);
gui.add(materials, "roughness", 0, 1, 0.0001);
gui.add(materials, "aoMapIntensity", 0, 10, 0.0001);
gui.add(materials, "displacementScale", 0, 1, 0.0001);

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    materials
)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    materials
)

plane.position.x = -1.5

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 16, 32),
    materials
)

torus.position.x = 1.5

// scene.add(plane)

scene.add(sphere, plane, torus)

// Lights

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

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
camera.position.z = 2
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update Objects
    sphere.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    plane.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()