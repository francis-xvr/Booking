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
  cube.position.set(0, 0, -8) // Center the cube
  const cameraAnchor = new THREE.Mesh(geometry, material)
  cameraAnchor.position.set(0, 2, 0) // Center the cube
  scene.add(cube)
  scene.add(cameraAnchor)

  // Add an elliptical plane resembling a cricket ground
  const groundGeometry = new THREE.CircleGeometry(13, 64) // Radius 10, 64 segments for smoothness
  const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22 }) // Green color resembling grass
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2 // Rotate to lie flat on the xz-plane
  ground.position.z = -1.5 // Adjust position to move the ground further from the origin
  ground.scale.set(1.5, 1, 1) // Scale to make it elliptical with longer axis on x-axis
  scene.add(ground)

  const seatGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.1)

  const baseRadius = 20 // Larger base radius for a less circular arch
  const rowSpacing = 0.7 // Distance between rows
  const elevationStep = 0.4 // Elevation difference between rows
  const seatGap = 0.6 // Desired gap between seats in a row
  const angleRange = Math.PI / 8 // Limit the arch to 45 degrees (from -135 to -90 degrees)

  const raycaster = new THREE.Raycaster() // Initialize raycaster
  const mouse = new THREE.Vector2() // Track mouse position
  let hoveredSeat = null // Track the currently hovered seat
  let clickedSeat = null // Track the currently clicked seat

  const seats = [] // Store all seat meshes for raycasting

  // Remove elevationOffset and adjust z-axis offset
  for (let row = 0; row < 5; row++) { // Loop for 4 rows
    const radius = baseRadius + row * rowSpacing // Increase radius for each row
    const circumference = radius * angleRange // Calculate the circumference of the quarter arch
    const seatsInRow = Math.floor(circumference / seatGap) // Calculate the number of seats based on the gap
    const angleStep = angleRange / seatsInRow // Calculate the angle step for the seats

    for (let i = 0; i < seatsInRow; i++) { // Loop for dynamically calculated seats per row
      const angle = angleStep * i - (2.25 * Math.PI) / 4 // Start from -135 degrees to -90 degrees
      const x = radius * Math.cos(angle)
      const z = radius * Math.sin(angle)// Increase z-axis offset to move seats further from origin
      const seatMaterial = new THREE.MeshBasicMaterial({ color: 0xf0f0f0 }) // Create a unique material for each seat
      const newCube = new THREE.Mesh(seatGeometry, seatMaterial)
      newCube.position.set(x, row * elevationStep, -z - 8) // Adjust z position

      // Make the cube look at the original cube
      newCube.lookAt(cube.position)

      scene.add(newCube)
      seats.push(newCube) // Add seat to the array
    }
  }

  // Add axis helper
//   const axesHelper = new THREE.AxesHelper(5) // Size of the axes
//   scene.add(axesHelper)

  camera.position.z = 15 // Move the camera further away along the z-axis
  camera.position.y = 25 // Adjust the y-axis to ensure a better view of the cubes

  // Mouse movement variables
  let targetX = 0
  let targetY = 0
  let currentX = 0
  let currentY = 1 // Initialize to match camera.position.y
  const dampingFactor = 0.07

  // Mouse move listener
  const onMouseMove = (event) => {
    const { innerWidth, innerHeight } = window
    targetX = (event.clientX / innerWidth) * 2 - 1
    targetY = -(event.clientY / innerHeight) * 2 // Normalize targetY to the full height of the window

    // Update mouse position for raycasting
    mouse.x = (event.clientX / innerWidth) * 2 - 1
    mouse.y = -(event.clientY / innerHeight) * 2
  }

  window.addEventListener('mousemove', onMouseMove)

  const onMouseClick = () => {
    if (hoveredSeat) {
      if (hoveredSeat.material.color.getHex() === 0xff0000) {
        // If the seat is already red, revert to the original color
        hoveredSeat.material.color.set(0xf0f0f0)
      } else {
        // Otherwise, set the seat color to red
        hoveredSeat.material.color.set(0xff0000)
      }
    }
  }

  window.addEventListener('click', onMouseClick)

  // Initialize stats.js
//   const stats = new Stats()
//   stats.showPanel(0) // 0: FPS, 1: MS, 2: MB
//   document.body.appendChild(stats.dom)

  const fps = 60 // Target FPS
  const frameInterval = 1000 / fps // Time per frame in milliseconds
  let lastRenderTime = 0 // Track the last render time

  const minCameraY = 6 // Minimum y position for the camera to stay above the seats
  const baseCameraZ = 18 // Original z position of the camera
//   const maxCameraZ = 18 // Reduce maximum z position for a less pronounced zoom

  const originalCubeZ = cameraAnchor.position.z // Store the original z position of the cube

  let minSeatX = Infinity
  let maxSeatX = -Infinity
  let minSeatZ = Infinity
  let maxSeatZ = -Infinity

  // Calculate the bounds of the seats
  for (const seat of seats) {
    minSeatX = Math.min(minSeatX, seat.position.x)
    maxSeatX = Math.max(maxSeatX, seat.position.x)
    minSeatZ = Math.min(minSeatZ, seat.position.z)
    maxSeatZ = Math.max(maxSeatZ, seat.position.z)
  }

  // Add some padding to the bounds
  const padding = 2
  minSeatX -= padding
  maxSeatX += padding
  minSeatZ -= padding
  maxSeatZ += padding

  const animate = (time) => {
    requestAnimationFrame(animate)
    // Smooth camera movement with damping (runs at full speed)
    currentX += (targetX - currentX) * dampingFactor
    currentY += (targetY - currentY) * dampingFactor

    // Pan the camera above the seats in a plane parallel to the seat's elevation plane
    camera.position.x = Math.max(minSeatX, Math.min(maxSeatX, currentX * 5)) // Clamp x position
    camera.position.z = Math.max(minSeatZ, Math.min(maxSeatZ, baseCameraZ - currentY * 10)) // Reverse z movement for zoom-in on cursor up
    camera.position.y = 4 // Keep the camera at a fixed height above the seats

    camera.lookAt(cameraAnchor.position)

    // Raycasting to detect hovered seat
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(seats)

    if (intersects.length > 0) {
      const intersectedSeat = intersects[0].object
      if (hoveredSeat !== intersectedSeat) {
        if (hoveredSeat && hoveredSeat.material.color.getHex() !== 0xff0000) {
          hoveredSeat.material.color.set(0xf0f0f0) // Revert previous seat color if not clicked
        }
        if (intersectedSeat.material.color.getHex() !== 0xff0000) {
          intersectedSeat.material.color.set(0xffff00) // Set hovered seat color to yellow if not clicked
        }
        hoveredSeat = intersectedSeat
      }
    } else if (hoveredSeat && hoveredSeat.material.color.getHex() !== 0xff0000) {
      hoveredSeat.material.color.set(0xf0f0f0) // Revert color when no seat is hovered and not clicked
      hoveredSeat = null
    }

    // Limit rendering to target FPS
    if (time - lastRenderTime >= frameInterval) {
      renderer.render(scene, camera)
      lastRenderTime = time
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
