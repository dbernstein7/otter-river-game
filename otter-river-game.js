import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class OtterRiverGame {
    constructor(container) {
        this.container = container;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.clock = new THREE.Clock();
        this.obstacles = [];
        this.score = 0;
        this.gameOver = false;
        this.otter = null;
        this.river = null;
        
        this.init();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x87CEEB); // Sky blue background
        this.container.appendChild(this.renderer.domElement);

        // Setup camera
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 10, 5);
        this.scene.add(directionalLight);

        // Create river
        this.createRiver();

        // Load otter model
        this.loadOtter();

        // Add event listeners
        window.addEventListener('resize', this.onWindowResize.bind(this));
        window.addEventListener('touchmove', this.onTouchMove.bind(this));

        // Start game loop
        this.animate();
    }

    createRiver() {
        const riverGeometry = new THREE.PlaneGeometry(10, 100);
        const riverMaterial = new THREE.MeshPhongMaterial({
            color: 0x0077be,
            side: THREE.DoubleSide
        });
        this.river = new THREE.Mesh(riverGeometry, riverMaterial);
        this.river.rotation.x = -Math.PI / 2;
        this.river.position.z = -50;
        this.scene.add(this.river);
    }

    loadOtter() {
        const loader = new GLTFLoader();
        // Placeholder for otter model - you'll need to add your own model
        const geometry = new THREE.BoxGeometry(1, 1, 2);
        const material = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        this.otter = new THREE.Mesh(geometry, material);
        this.otter.position.y = 0.5;
        this.scene.add(this.otter);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onTouchMove(event) {
        if (this.gameOver) return;
        
        const touch = event.touches[0];
        const x = (touch.clientX / window.innerWidth) * 2 - 1;
        this.otter.position.x = x * 5;
    }

    spawnObstacle() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        const obstacle = new THREE.Mesh(geometry, material);
        
        obstacle.position.x = (Math.random() - 0.5) * 8;
        obstacle.position.z = -100;
        obstacle.position.y = 0.5;
        
        this.scene.add(obstacle);
        this.obstacles.push(obstacle);
    }

    updateObstacles() {
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            obstacle.position.z += 0.2;

            // Check collision
            if (this.checkCollision(this.otter, obstacle)) {
                this.gameOver = true;
                this.showGameOver();
            }

            // Remove obstacles that are behind the camera
            if (obstacle.position.z > 10) {
                this.scene.remove(obstacle);
                this.obstacles.splice(i, 1);
                this.score++;
                this.updateScore();
            }
        }
    }

    checkCollision(otter, obstacle) {
        const distance = otter.position.distanceTo(obstacle.position);
        return distance < 1;
    }

    showGameOver() {
        const gameOverDiv = document.createElement('div');
        gameOverDiv.style.position = 'absolute';
        gameOverDiv.style.top = '50%';
        gameOverDiv.style.left = '50%';
        gameOverDiv.style.transform = 'translate(-50%, -50%)';
        gameOverDiv.style.color = 'white';
        gameOverDiv.style.fontSize = '48px';
        gameOverDiv.style.textAlign = 'center';
        gameOverDiv.innerHTML = `Game Over!<br>Score: ${this.score}<br>Tap to restart`;
        
        this.container.appendChild(gameOverDiv);
        
        this.container.addEventListener('click', () => {
            location.reload();
        }, { once: true });
    }

    updateScore() {
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = `Score: ${this.score}`;
        }
    }

    animate() {
        if (this.gameOver) return;

        requestAnimationFrame(this.animate.bind(this));

        // Spawn obstacles randomly
        if (Math.random() < 0.02) {
            this.spawnObstacle();
        }

        this.updateObstacles();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('game-container');
    if (container) {
        new OtterRiverGame(container);
    }
}); 