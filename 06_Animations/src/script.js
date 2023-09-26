import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

// Animation
// let time = Date.now();
const clock = new THREE.Clock()


const ticks = () => {

    // Using Date Function

    // const currentTime = Date.now();
    // const delatTime = currentTime - time;
    // time = currentTime;

    // mesh.rotation.y += 0.01 * delatTime

    // Using Three.js Clock

    const elapsedTime = clock.getElapsedTime();

    // mesh.rotation.y = elapsedTime * Math.PI * 2; // To Rotate Cube fully every second
    // mesh.position.x = Math.sin(elapsedTime);
    // mesh.position.y = Math.cos(elapsedTime);

    camera.position.x = Math.sin(elapsedTime);
    camera.position.y = Math.cos(elapsedTime);
    camera.lookAt(mesh.position)

    renderer.render(scene, camera)

    window.requestAnimationFrame(ticks)
}

ticks()