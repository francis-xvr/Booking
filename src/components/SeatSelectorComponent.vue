<script setup>
import {onMounted, ref} from 'vue' 
import * as THREE from 'three'

defineProps ({
msg: String,
})

const count = ref(0)
const canvasRef = ref(null)
const target = {x: 0, z: 0}
const velocity ={x:0, z: 0}
const cameraPos={x:0, z: 5}
const damping = 0.05
const dampingz = 0.05
const momentum = 0.08
const boxSize = 10;
const clampPadding = 1;

const cameraHeight = boxSize / 3; // camera at center height of box
const cameraOffset = boxSize; // camera at center height of box

// Move minX, maxX, minZ, max to module scope so both onMouseMove and animate can use them
const minX = -boxSize/2 + clampPadding;
const maxX = boxSize/2 - clampPadding;
const minZ = -boxSize/2 + clampPadding;
const maxZ = boxSize/2 - clampPadding;

function clamp(val, min, max) {
    return Math.max(min, Math.min (max, val))
}
function onMouseMove(e) {
    // Normalize mouse position to (0, 1]
    const normX = e.clientX / window.innerWidth;
    const normZ = e.clientY / window.innerHeight;
    // Reverse mapping: left mouse moves camera right, up mouse moves camera back
    target.x = minX + (maxX - minX) * normX;
    target.z = minZ + (maxZ - minZ) * normZ;
}

onMounted(() => {
const scene = new THREE. Scene();
scene. background = new THREE. Color (0xf5f5f5);
const camera = new THREE.PerspectiveCamera(50, window. innerWidth/window. innerHeight, 0.1, 1000);
// Start camera at center of box, looking out through open face
camera.position.set(cameraPos.x, cameraHeight, cameraOffset); 
camera.lookAt (0, cameraHeight, -30);

const renderer = new THREE.WebGLRenderer({ canvas: canvasRef. value, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Create a red box (room) with one open face (front)
const boxGeometry = new THREE.BoxGeometry(boxSize*2, boxSize, boxSize*1.5);
// Fix: Use THREE.MeshStandardMaterial for better lighting, add ambient light
const boxMaterials = [
    new THREE.MeshStandardMaterial({ color: 'red', side: THREE.BackSide}), // left
    new THREE.MeshStandardMaterial({ color: 'red', side: THREE.BackSide }), // right
    new THREE.MeshStandardMaterial({ color: 'red', side: THREE.BackSide }), // top
    new THREE.MeshStandardMaterial({ color: 'red', side: THREE.BackSide }), // bottom
    new THREE.MeshStandardMaterial({ color: 'red', side: THREE.BackSide, transparent: true, opacity: 0}), // front (open face)
    new THREE.MeshStandardMaterial({ color: 'red', side: THREE.BackSide, transparent: true, opacity: 0}) //
];

const box = new THREE.Mesh(boxGeometry, boxMaterials);
// Position box and camera 10 units away from origin in z axis
const boxZ = 50;
box.position.set (0, cameraHeight, boxZ); 
scene.add(box);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, boxSize, boxSize);
scene.add(directionalLight);

const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

const stadiumShape = new THREE.Shape();
stadiumShape.absellipse(0, 0, boxSize * 6, boxSize * 10, 0, Math.PI * 2, false, 0);
const stadiumGeom = new THREE. ShapeGeometry (stadiumShape);
const stadiumMat = new THREE.MeshStandardMaterial({ color: 0x228B22, side: THREE.DoubleSide }); // green
const stadiumMesh = new THREE.Mesh(stadiumGeom, stadiumMat);
stadiumMesh.position.set (0, -4, -52); // at origin
stadiumMesh.rotation.x = -Math.PI / 2;
scene.add(stadiumMesh);

const pitchGeom = new THREE.PlaneGeometry(25, 14);
const pitchMat = new THREE.MeshStandardMaterial({ color: 0xdeb887, side: THREE.DoubleSide }); // brown
const pitchMesh = new THREE.Mesh(pitchGeom, pitchMat);
pitchMesh.position.set(0, -4 + 0.01, -52); // slightly above stadium
pitchMesh.rotation.x = -Math.PI / 2;
scene.add(pitchMesh);

window.addEventListener ('mousemove', onMouseMove);

function animate() {
    velocity.x = velocity.x * momentum + (target.x - cameraPos.x) * damping;
    velocity.z = velocity.z * momentum + (target.z - cameraPos.z) * dampingz;
    cameraPos.x += velocity.x; cameraPos.z += velocity.z;
    // Clamp camera position to box bounds
    cameraPos.x = clamp(cameraPos.x, minX, maxX);
    cameraPos.z = clamp (cameraPos.z, minZ, maxZ);
    // Move camera further back along z axis so box floor is visible
    camera.position.set(cameraPos.x, cameraHeight, cameraPos.z + cameraOffset + boxZ); 
    camera.lookAt(0, 0, boxZ - 30);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();
});

</script>

<template>
    <canvas ref="canvasRef" style="width: 100vw;height:100vh;display:block;"></canvas>
</template>

<style scoped> 
canvas{
position: fixed;
top: 0; left: 0;
width: 100vw; height: 100vh; display: block;
margin: 0; padding: 0; border: none;
}
</style>