import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */

// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
// const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)


// mesh.position.x = 0.7;
// mesh.position.y = -0.6;
// mesh.position.z = 1;
// mesh.position.set(0.7, -0.6, 1)
// console.log(mesh.position.normalize());
// console.log(mesh.position.length()); 

// Scale
// mesh.scale.set(2, 0.5, 0.5)

// Rotation
// mesh.rotation.reorder("YXZ")
// mesh.rotation.x = Math.PI * 0.25;
// mesh.rotation.y = Math.PI * 0.25;

// Group
const group = new THREE.Group();
group.scale.y = 2;
group.position.y = 1;
group.rotation.y = 1;
scene.add(group);

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: "red" }),
)

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: "green" }),
)

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: "blue" }),
)

group.add(cube1)
cube2.position.x = 2;
group.add(cube2)
cube3.position.x = -2;
group.add(cube3)

// Axes Helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper)


/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)
// camera.position.set(1, 1, 3);
// camera.lookAt(mesh.position)
// console.log(mesh.position.distanceTo(camera.position));

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)