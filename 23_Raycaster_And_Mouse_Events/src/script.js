import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'


THREE.ColorManagement.enabled = false

/**
 * Model
 */
const gltfLoader = new GLTFLoader()

var model = null

gltfLoader.load(
    './models/Duck/glTF-Binary/Duck.glb',
    (gltf) => {
        model = gltf.scene
        model.position.y = - 1.2
        scene.add(model)
    }
)

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

object1.updateMatrixWorld()
object2.updateMatrixWorld()
object3.updateMatrixWorld()

scene.add(object1, object2, object3)

// Lighting

const ambientLight = new THREE.AmbientLight("#ffffff", 0.3)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight("#ffffff", 0.7)
directionalLight.position.set(1, 2, 3);
scene.add(directionalLight)

// Raycaster
const rayCaster = new THREE.Raycaster();

// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// const rayDirection = new THREE.Vector3(10, 0, 0);
// rayDirection.normalize()

// rayCaster.set(rayOrigin, rayDirection);

// const intersect = rayCaster.intersectObject(object2);
// console.log(intersect);

// const intersects = rayCaster.intersectObjects([object1, object2, object3]);
// console.log(intersects);

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

//  Mouse
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (_event) => {
    mouse.x = _event.clientX / sizes.width * 2 - 1
    mouse.y = - (_event.clientY / sizes.height) * 2 + 1
})

window.addEventListener("click", () => {
    if (currentIntersect) {
        console.log("Click");
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
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

var currentIntersect = null

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

    // Cast Ray
    rayCaster.setFromCamera(mouse, camera);

    const objects = [object1, object2, object3];

    // const rayOrigin = new THREE.Vector3(-3, 0, 0);
    // const rayDirection = new THREE.Vector3(1, 0, 0);
    // rayDirection.normalize();

    // rayCaster.set(rayOrigin, rayDirection)

    const intersects = rayCaster.intersectObjects(objects);
    // // console.log(intersects);

    for (const object of objects) {
        object.material.color.set("#ff0000")
    }

    for (const intersect of intersects) {
        intersect.object.material.color.set("#0000ff")
    }

    if (intersects.length) {

        if (currentIntersect === null) {
            console.log("Mouse Entered");
        }

        currentIntersect = intersects[0];
    } else {

        if (currentIntersect) {
            console.log("Mouse Leave");
        }

        currentIntersect = null
    }

    // Testing castion on model
    if (model) {
        const modelIntersect = rayCaster.intersectObject(model);

        if (modelIntersect.length) {
            model.scale.set(1.2, 1.2, 1.2);
        } else {
            model.scale.set(1, 1, 1);
        }
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()