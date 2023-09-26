import * as THREE from 'three';

// Scene
const scene = new THREE.Scene()

// Mesh/Object

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "red" });
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Size 
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3;
camera.position.x = 1;
camera.position.y = -1;
scene.add(camera);

// Renderer
const canvas = document.querySelector(".webgl");

const renderer = new THREE.WebGLRenderer({
    canvas
});
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)