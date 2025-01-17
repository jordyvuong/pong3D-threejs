import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'; // Importation du loader MTL

export class Pong {
  constructor(scene, scoreboard, maxScore = 5) {
    this.scene = scene;
    this.scoreboard = scoreboard;
    this.maxScore = maxScore;

    this.keys = { z: false, s: false, ArrowUp: false, ArrowDown: false };
    this.scores = [0, 0];
    this.ballVelocity = { x: 0.2, z: 0.2 };

    this.gameOver = false;

    this.initEnvironment();
    this.initEventListeners();
  }

  initEnvironment() {
    const textureLoader = new THREE.TextureLoader();
    const textureRoot = './assets/textures/Blue_Ice_001_SD/';
    const textureToLoad = {
      map: 'Blue_Ice_001_COLOR.jpg',
      aoMap: 'Blue_Ice_001_OCC.jpg',
      displacementMap: 'Blue_Ice_001_DISP.png',
      normalMap: 'Blue_Ice_001_NORM.jpg',
      roughnessMap: 'Blue_Ice_001_ROUGH.jpg',
    };
    
    const textures = Object.fromEntries(
      Object.entries(textureToLoad).map(([textureKey, texturePath]) => {
        const texture = textureLoader.load(textureRoot + texturePath);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        return [textureKey, texture];
      })
    );
    
    const floorMaterial = new THREE.MeshStandardMaterial({
      map: textures.map,
      aoMap: textures.aoMap,
      displacementMap: textures.displacementMap,
      normalMap: textures.normalMap,
      roughnessMap: textures.roughnessMap,
      displacementScale: 0.1,
    });

    const floorGeometry = new THREE.BoxGeometry(20, 0.1, 10);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    this.scene.add(floor);

    const ambientLight = new THREE.AmbientLight(0xffffff, 3 );
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    this.scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load('./assets/Tai_Chi_Ball_.gltf', (gltf) => {
      this.ball = gltf.scene;
      this.ball.scale.set(0.5, 0.5, 0.5);
      this.ball.position.set(0, 0.5, 0);
      this.scene.add(this.ball);
    });

    const mtlLoader = new MTLLoader();
    mtlLoader.load('./assets/padel/obj/objPaddle.mtl', (materials) => {
      materials.preload(); 
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      this.players = [];
      for (let i = 0; i < 2; i++) {
        objLoader.load('./assets/padel/obj/objPaddle.obj', (object) => {
          const paddle = object;
          paddle.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              if (child.material instanceof Array) {
                child.material.forEach((material, i) => {
                  const materialParams = {};
                  if (material.map !== null) {
                    materialParams.map = material.map;
                  } else {
                    materialParams.color = material.color;
                  }

                  child.material[i] = new THREE.MeshPhongMaterial(materialParams); // Create a new material for each
                });
              }
            }
          });

          paddle.scale.set(0.2, 0.2, 0.2);
          paddle.position.set(i === 0 ? -9 : 9, 1, 0);
          paddle.rotation.z = Math.PI / 2; 
          paddle.rotation.x = Math.PI / 4; 
          paddle.rotation.y = Math.PI / 1;
          this.players.push(paddle);
          this.scene.add(paddle);
        });
      }
    });

  }

  initEventListeners() {
    window.addEventListener('keydown', (e) => {
      if (this.keys.hasOwnProperty(e.key)) this.keys[e.key] = true;
    });

    window.addEventListener('keyup', (e) => {
      if (this.keys.hasOwnProperty(e.key)) this.keys[e.key] = false;
    });

    window.addEventListener('keydown', (e) => {
      if (this.gameOver && e.key === 'Enter') {
        this.resetGame();
      }
    });
  }

  update() {
    if (this.gameOver) return;

    if (this.keys.z) this.players[0].position.z -= 0.1;
    if (this.keys.s) this.players[0].position.z += 0.1;
    if (this.keys.ArrowUp) this.players[1].position.z -= 0.1;
    if (this.keys.ArrowDown) this.players[1].position.z += 0.1;

    this.players.forEach((paddle) => {
      paddle.position.z = Math.max(Math.min(paddle.position.z, 4), -4);
    });

    this.ball.position.x += this.ballVelocity.x;
    this.ball.position.z += this.ballVelocity.z;

    if (this.ball.position.z >= 4.5 || this.ball.position.z <= -4.5) {
      this.ballVelocity.z *= -1;
    }

    this.players.forEach((paddle, index) => {
      const paddleBounds = {
        xMin: paddle.position.x - 0.25,
        xMax: paddle.position.x + 0.25,
        zMin: paddle.position.z - 1.5,
        zMax: paddle.position.z + 1.5,
      };

      if (
        this.ball.position.x >= paddleBounds.xMin &&
        this.ball.position.x <= paddleBounds.xMax &&
        this.ball.position.z >= paddleBounds.zMin &&
        this.ball.position.z <= paddleBounds.zMax
      ) {
        this.ballVelocity.x *= -1;
      }
    });

    if (this.ball.position.x >= 10) {
      this.scores[0]++;
      this.checkGameOver();
      this.resetBall();
    } else if (this.ball.position.x <= -10) {
      this.scores[1]++;
      this.checkGameOver();
      this.resetBall();
    }

    if (!this.gameOver) {
      this.scoreboard.innerText = `Joueur 1: ${this.scores[0]} | Joueur 2: ${this.scores[1]}`;
    }
  }

  checkGameOver() {
    if (this.scores[0] >= this.maxScore || this.scores[1] >= this.maxScore) {
      this.gameOver = true;
      const winner = this.scores[0] >= this.maxScore ? 'Le joueur 1' : 'Le joueur 2';
      this.scoreboard.innerText = `${winner} a gagné ! Appuyez sur Entrée pour rejouer.`;
    }
  }

  resetBall() {
    this.ball.position.set(0, 0.5, 0);
  
    this.ballVelocity = {
      x: Math.random() > 0.2 ? 0.2 : -0.2,
      z: (Math.random() - 0.5) * 0.3 
    };
  }

  resetGame() {
    this.scores = [0, 0];
    this.gameOver = false;
    this.resetBall();
    this.scoreboard.innerText = `Joueur 1: ${this.scores[0]} | Joueur 2: ${this.scores[1]}`;
  }
}