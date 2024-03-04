import '/Работа/РАБОЧИЕ ПРОЕКТЫ/JavaScript/Projects/threejs_basics/style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'



// Variables
const cabParams = {
    height: 720,
    width: 500,
    depth: 530,
    wallOffset: 40,
    floorOffset: 100
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
})

// Scene
const scene = new THREE.Scene()

// Geometry
const cabGeo = new THREE.BoxGeometry(cabParams.width, cabParams.height, cabParams.depth)
const edgeGeo = new THREE.EdgesGeometry(cabGeo)
const cabColor = { color: 0x7fffd4 }
const edgeMat = new THREE.LineBasicMaterial({ color: cabColor.color, linewidth: 3 })
const cabMat = new THREE.MeshBasicMaterial({ color: cabColor.color, transparent: true, opacity: 0.3 })
const cabBox = new THREE.Mesh(cabGeo, cabMat)
const cabEdges = new THREE.LineSegments(edgeGeo, edgeMat)
const cabGroup = new THREE.Group()
cabGroup.add(cabBox, cabEdges)
//cabGroup.add(cabEdges)
cabGroup.position.set(cabParams.width / 2, cabParams.height / 2 + cabParams.floorOffset, cabParams.depth / 2 + cabParams.wallOffset)
//mesh.rotation.y = degToRad(45)
//mesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), 360 / 10 * Math.PI)
scene.add(cabGroup)

// Double Click Edge Visibility event
window.addEventListener('dblclick', () => {
    const edgeVisibility = cabGroup.children[1].visible
    cabGroup.children[1].visible = !edgeVisibility
})

// Screen
const screen = {
    width: window.innerWidth,
    height: window.innerHeight
}
const aspectRatio = screen.width / screen.height

// Camera
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 5000)
camera.position.x = cabParams.width / 2
camera.position.z = cabParams.depth + 1000
camera.position.y = cabParams.height / 2
scene.add(camera)

// Axes
const axesLength = 1000
const axesGroup = new THREE.Group()
const axesColors = [0xac1616, 0x075300, 0x1111a6]
const axesPoints = [
    [new THREE.Vector3(0, 0, 0), new THREE.Vector3(axesLength, 0, 0)],
    [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, axesLength)],
    [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, axesLength, 0)]
]

axesPoints.forEach((points, index) => {
    const axesLines = new THREE.BufferGeometry().setFromPoints(points)
    const axesMaterials = new THREE.LineBasicMaterial({ color: axesColors[index], linewidth: 5 })
    const axe = new THREE.Line(axesLines, axesMaterials)
    axesGroup.add(axe)
})
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
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.render(scene, camera)
// controls.enabled = false
console.log(`H${cabParams.height}_W${cabParams.width}_D${cabParams.depth}`)


window.addEventListener('resize', () => {
    // Update Screen
    screen.width = window.innerWidth
    screen.height = window.innerHeight
    // Update Camera
    camera.aspect = screen.width / screen.height
    //aspectRatio = camera.aspect
    camera.updateProjectionMatrix()
    //Update Renderer
    renderer.setSize(screen.width, screen.height)
})

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
    camera.position.z = cabParams.depth / 2 + Math.cos(-cursor.x * 0.009) * 1000
    camera.position.y = cabParams.height + cursor.y * 5
    camera.lookAt(cabGroup.position)

    renderer.render(scene, camera)
    window.requestAnimationFrame(loop)
}
*/

loop()

// GUI
const gui = new dat.GUI()

gui
    .add(cabGroup.position, 'y')
    .min(cabParams.height / 2)
    .max(1200)
    .step(1)
    .name('Elevation')

gui
    .add(cabEdges, 'visible')
    .name('Wireframe')
gui
    .addColor(cabColor, 'color')
    .onChange(() => {
        cabMat.color.set(cabColor.color)
        edgeMat.color.set(cabColor.color)
    })
