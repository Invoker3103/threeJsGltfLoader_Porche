import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Set up basic scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5).normalize();
scene.add(directionalLight);

// Create controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// Variables to hold car and road
let car;
let road;

// Load the car model
const carLoader = new GLTFLoader();
carLoader.load(
  "/models/PorcheCar/scene.gltf",
  function (gltf) {
    car = gltf.scene;
    car.scale.set(2, 2, 2); // Scale the car to make it larger
    car.position.set(0, 3, 0); // Adjust the position to be on the road
    car.name = "Car"; // Name the car object for easy access
    scene.add(car);

    // Position the camera
    camera.position.set(0, 5, 10);
    camera.lookAt(car.position);

    animate();
  },
  undefined,
  function (error) {
    console.error("An error occurred while loading the car model:", error);
  }
);

// Load the buildings model
const buildingsLoader = new GLTFLoader();
buildingsLoader.load(
  "/models/low_poly_night_city_building_skyline/scene.gltf",
  function (gltf) {
    const buildings = gltf.scene;
    buildings.scale.set(2, 2, 2); // Adjust the scale if needed
    buildings.position.set(0, 0, -50); // Position the buildings behind or around the car
    scene.add(buildings);
  },
  undefined,
  function (error) {
    console.error(
      "An error occurred while loading the buildings model:",
      error
    );
  }
);

// Load the road model
const roadLoader = new GLTFLoader();
roadLoader.load(
  "/models/overpass/scene.gltf",
  function (gltf) {
    road = gltf.scene;
    road.scale.set(10, 10, 10); // Adjust the scale based on your road model
    road.position.set(0, 0, -100); // Position the road behind the car
    scene.add(road);

    // Ensure the car is correctly positioned on the road
    if (car) {
      car.position.y = road.position.y + 0.5; // Adjust this value based on the road and car model dimensions
    }
  },
  undefined,
  function (error) {
    console.error("An error occurred while loading the road model:", error);
  }
);

// Handle keyboard input
const keys = {};
document.addEventListener("keydown", (event) => {
  keys[event.code] = true;
});
document.addEventListener("keyup", (event) => {
  keys[event.code] = false;
});

// Movement speed
const speed = 0.9;

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Move the car forward when space key is pressed
  if (car && keys["Space"]) {
    car.position.z += speed; // Move the car forward
  }

  // Update controls
  controls.update();

  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
