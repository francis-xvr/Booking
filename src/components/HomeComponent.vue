<script setup>
import { onMounted, ref } from 'vue'
import * as THREE from 'three'
import Stats from 'stats.js' // Import stats.js

defineProps({
  msg: String,
})

const count = ref(0)

onMounted(() => {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#ffffff')
  const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 10000)
  
  // Enable anti-aliasing in the renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio) // Set pixel ratio for better quality
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.getElementById('three-canvas').appendChild(renderer.domElement)

  const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1)
  const material = new THREE.MeshBasicMaterial({ color: 0xf0f0f0 }) // Light gray color
  const cube = new THREE.Mesh(geometry, material)
  const cameraAnchor = new THREE.Mesh(geometry, material)
  cameraAnchor.position.set(0, 2, 0) // Center the cube
  scene.add(cube)
  scene.add(cameraAnchor)


  const seatGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.1)

  const baseRadius = 10 // Larger base radius for a less circular arch
  const rowSpacing = 0.8 // Distance between rows
  const elevationStep = 0.4 // Elevation difference between rows
  const seatGap = 0.6 // Desired gap between seats in a row
  const angleRange = Math.PI / 4 // Limit the arch to 45 degrees (from -135 to -90 degrees)

  for (let row = 0; row < 5; row++) { // Loop for 4 rows
    const radius = baseRadius + row * rowSpacing // Increase radius for each row
    const circumference = radius * angleRange // Calculate the circumference of the quarter arch
    const seatsInRow = Math.floor(circumference / seatGap) // Calculate the number of seats based on the gap
    const angleStep = angleRange / seatsInRow // Calculate the angle step for the seats

    for (let i = 0; i < seatsInRow; i++) { // Loop for dynamically calculated seats per row
      const angle = angleStep * i - (2.5 * Math.PI) / 4 // Start from -135 degrees to -90 degrees
      const x = radius * Math.cos(angle)
      const z = radius * Math.sin(angle)
      const newCube = new THREE.Mesh(seatGeometry, material)
      newCube.position.set(x, row * elevationStep, -z) // Elevate each row

      // Make the cube look at the original cube
      newCube.lookAt(cube.position)

      scene.add(newCube)
    }
  }

  // Add axis helper
  const axesHelper = new THREE.AxesHelper(5) // Size of the axes
  scene.add(axesHelper)

  camera.position.z = 15 // Move the camera further away along the z-axis
  camera.position.y = 20 // Adjust the y-axis to ensure a better view of the cubes

  // Mouse movement variables
  let targetX = 0
  let targetY = 0
  let currentX = 0
  let currentY = 15 // Initialize to match camera.position.y
  const dampingFactor = 0.07

  // Mouse move listener
  const onMouseMove = (event) => {
    const { innerWidth, innerHeight } = window
    targetX = (event.clientX / innerWidth) * 2 - 1
    targetY = -(event.clientY / innerHeight) * 2 + 1
  }

  window.addEventListener('mousemove', onMouseMove)

  // Initialize stats.js
  const stats = new Stats()
  stats.showPanel(0) // 0: FPS, 1: MS, 2: MB
  document.body.appendChild(stats.dom)

  const fps = 60 // Target FPS
  const frameInterval = 1000 / fps // Time per frame in milliseconds
  let lastRenderTime = 0 // Track the last render time

  const minCameraY = 4 // Minimum y position for the camera to stay above the seats
  const baseCameraZ = 15 // Original z position of the camera
  const maxCameraZ = 16 // Reduce maximum z position for a less pronounced zoom

  const animate = (time) => {
    requestAnimationFrame(animate)
    // Smooth camera movement with damping (runs at full speed)
    currentX += (targetX - currentX) * dampingFactor
    currentY += (targetY - currentY) * dampingFactor

    camera.position.x = currentX * 2
    camera.position.y = Math.max(currentY * 2 + 3, minCameraY) // Clamp y position to stay above the seats

    // Adjust camera z-position for top view based on cursor movement (reduced zoom factor)
    camera.position.z = baseCameraZ + Math.max(-1, Math.min(1, targetY)) * (maxCameraZ - baseCameraZ) / 3

    camera.lookAt(cameraAnchor.position)    

    // Limit rendering to target FPS
    if (time - lastRenderTime >= frameInterval) {
        stats.begin() // Start measuring FPS
        renderer.render(scene, camera)
        lastRenderTime = time
        stats.end() // End measuring FPS
    }
  }

  animate(0)
})
</script>

<template>
  <div id="three-canvas" style="width: 100%; height: 100%;"></div>
</template>

<style scoped>
#three-canvas {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Position the stats panel */
#stats {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
