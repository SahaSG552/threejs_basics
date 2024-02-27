import '/Работа/РАБОЧИЕ ПРОЕКТЫ/JavaScript/Projects/threejs_basics/style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// Variables
let cabGlobalParams = {
    cabHeight: 720,
    cabWidth: 150,
    cabDepth: 530,
    cabWallOffset: 40
}

function degToRad(deg) {
    return deg / 180 * Math.PI
}

// Cursor
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX - screen.width / 2
    cursor.y = event.clientY - screen.height / 2
    // console.log(cursor.x, cursor.y)
})

// Scene
const scene = new THREE.Scene()

// Geometry
const geometry = new THREE.BoxGeometry(cabGlobalParams.cabWidth, cabGlobalParams.cabHeight, cabGlobalParams.cabDepth)
const material = new THREE.MeshBasicMaterial({ color: 0x4e4e56, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
mesh.position.set(cabGlobalParams.cabWidth / 2, cabGlobalParams.cabHeight / 2, cabGlobalParams.cabDepth / 2 + cabGlobalParams.cabWallOffset)
//mesh.rotation.y = degToRad(45)
//mesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), 360 / 10 * Math.PI)
scene.add(mesh)

// Screen
const screen = {
    width: window.innerWidth,
    height: window.innerHeight
}
const aspectRatio = screen.width / screen.height

// Camera
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 5000)
// const camera = new THREE.OrthographicCamera(-1000 * aspectRatio, 1000 * aspectRatio, 1000, -1000)
// camera.position.set(0, 0, 0)
camera.position.x = cabGlobalParams.cabWidth / 2
camera.position.z = cabGlobalParams.cabDepth + 1000
camera.position.y = cabGlobalParams.cabHeight / 2
scene.add(camera)

// Axes
const axesLength = 1000
const pointsX = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(axesLength, 0, 0)]
const pointsY = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, axesLength)]
const pointsZ = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, axesLength, 0)]
const lineMaterialX = new THREE.LineBasicMaterial({ color: 0xac1616 })
const lineMaterialY = new THREE.LineBasicMaterial({ color: 0x075300 }) // #4e4e56
const lineMaterialZ = new THREE.LineBasicMaterial({ color: 0x1111a6 })
const linePointsX = new THREE.BufferGeometry().setFromPoints(pointsX)
const linePointsY = new THREE.BufferGeometry().setFromPoints(pointsY)
const linePointsZ = new THREE.BufferGeometry().setFromPoints(pointsZ)
const xAxe = new THREE.Line(linePointsX, lineMaterialX)
const yAxe = new THREE.Line(linePointsY, lineMaterialY)
const zAxe = new THREE.Line(linePointsZ, lineMaterialZ)
const axesGroup = new THREE.Group()
axesGroup.add(xAxe)
axesGroup.add(yAxe)
axesGroup.add(zAxe)
scene.add(axesGroup)


// Canvas
const canvas = document.querySelector('.webgl')
// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.target.set(200, 300, 0)
controls.update()
// Renderer
const renderer = new THREE.WebGL1Renderer({ canvas: canvas })
renderer.setSize(screen.width, screen.height)
// renderer.render(scene, camera)

console.log(`H${cabGlobalParams.cabHeight}_W${cabGlobalParams.cabWidth}_D${cabGlobalParams.cabDepth}`)

// Camera control

const loop = () => {
    //console.log(camera.position.distanceTo(mesh.position))
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(loop)
}


/*
const loop = () => {
    // Update Camera
    camera.position.x = Math.sin(-cursor.x * 0.009) * 1000
    camera.position.z = cabGlobalParams.cabDepth / 2 + Math.cos(-cursor.x * 0.009) * 1000
    camera.position.y = cabGlobalParams.cabHeight + cursor.y * 5
    camera.lookAt(mesh.position)

    renderer.render(scene, camera)
    window.requestAnimationFrame(loop)
}
*/

loop()