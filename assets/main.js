import * as THREE from 'three';
import { Pong } from './pong.js';

const scene = new THREE.Scene();

const camera1 = new THREE.PerspectiveCamera(60, window.innerWidth / 2 / window.innerHeight, 0.1, 1000);
const camera2 = new THREE.PerspectiveCamera(60, window.innerWidth / 2 / window.innerHeight, 0.1, 1000);

camera1.position.set(-15, 10, 0); 
camera1.lookAt(0, 0, 0); 

camera2.position.set(15, 10, 0); 
camera2.lookAt(0, 0, 0); 

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scoreboard = document.createElement('div');
scoreboard.classList.add('scoreboard');
document.body.appendChild(scoreboard);

const pong = new Pong(scene, scoreboard);

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera1.aspect = window.innerWidth / 2 / window.innerHeight;
  camera1.updateProjectionMatrix();

  camera2.aspect = window.innerWidth / 2 / window.innerHeight;
  camera2.updateProjectionMatrix();
});

function animate() {
  requestAnimationFrame(animate);
  pong.update();

  renderer.setViewport(0, 0, window.innerWidth / 2, window.innerHeight);
  renderer.setScissor(0, 0, window.innerWidth / 2, window.innerHeight);
  renderer.setScissorTest(true);
  renderer.render(scene, camera1);

  renderer.setViewport(window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
  renderer.setScissor(window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
  renderer.setScissorTest(true);
  renderer.render(scene, camera2);

  renderer.setScissorTest(false); 
}

animate();