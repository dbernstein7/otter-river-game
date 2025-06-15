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
        // Renderer setup
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        document.body.appendChild(this.renderer.domElement);

        // Setup camera
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        this.scene.add(directionalLight);

        // Add a subtle point light for better depth
        const pointLight = new THREE.PointLight(0xffffff, 0.5);
        pointLight.position.set(0, 10, 0);
        this.scene.add(pointLight);

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
        const riverGeometry = new THREE.PlaneGeometry(20, 100);
        const riverMaterial = new THREE.MeshStandardMaterial({
            color: 0x0077be,
            metalness: 0.1,
            roughness: 0.2,
            transparent: true,
            opacity: 0.8
        });
        this.river = new THREE.Mesh(riverGeometry, riverMaterial);
        this.river.rotation.x = -Math.PI / 2;
        this.river.position.z = -50;
        this.river.receiveShadow = true;
        this.scene.add(this.river);

        // Add water animation
        const waterGeometry = new THREE.PlaneGeometry(20, 100, 32, 32);
        const waterMaterial = new THREE.MeshStandardMaterial({
            color: 0x0077be,
            metalness: 0.3,
            roughness: 0.1,
            transparent: true,
            opacity: 0.6
        });
        const water = new THREE.Mesh(waterGeometry, waterMaterial);
        water.rotation.x = -Math.PI / 2;
        water.position.z = -50;
        water.position.y = 0.1;
        water.receiveShadow = true;
        this.scene.add(water);
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

        // Animate water
        const time = Date.now() * 0.001;
        const water = this.scene.getObjectByName('water');
        if (water) {
            water.geometry.vertices?.forEach((vertex, i) => {
                vertex.z = Math.sin(time + i * 0.1) * 0.1;
            });
            water.geometry.verticesNeedUpdate = true;
        }

        this.updateParticles();
        this.renderer.render(this.scene, this.camera);
    }

    createEnvironment() {
        // Add skybox
        const skyboxGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
        const skyboxMaterials = [
            new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide }), // right
            new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide }), // left
            new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide }), // top
            new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide }), // bottom
            new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide }), // front
            new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide })  // back
        ];
        const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterials);
        this.scene.add(skybox);

        // Add ground
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x7CFC00,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.5;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Add trees
        for (let i = 0; i < 10; i++) {
            const tree = this.createTree();
            tree.position.x = (Math.random() - 0.5) * 40;
            tree.position.z = -Math.random() * 80;
            this.scene.add(tree);
        }

        // Add rocks
        for (let i = 0; i < 15; i++) {
            const rock = this.createRock();
            rock.position.x = (Math.random() - 0.5) * 30;
            rock.position.z = -Math.random() * 90;
            this.scene.add(rock);
        }
    }

    createTree() {
        const tree = new THREE.Group();

        // Tree trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.7, 4, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.9
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 2;
        trunk.castShadow = true;
        tree.add(trunk);

        // Tree top
        const topGeometry = new THREE.ConeGeometry(2, 4, 8);
        const topMaterial = new THREE.MeshStandardMaterial({
            color: 0x228B22,
            roughness: 0.8
        });
        const top = new THREE.Mesh(topGeometry, topMaterial);
        top.position.y = 5;
        top.castShadow = true;
        tree.add(top);

        return tree;
    }

    createRock() {
        const rockGeometry = new THREE.DodecahedronGeometry(Math.random() * 0.5 + 0.5);
        const rockMaterial = new THREE.MeshStandardMaterial({
            color: 0x808080,
            roughness: 0.9,
            metalness: 0.1
        });
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        rock.castShadow = true;
        return rock;
    }

    createWaterSplash(x, z) {
        const particleCount = 20;
        const particles = new THREE.Group();

        for (let i = 0; i < particleCount; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
            const particleMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.8
            });
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            // Random initial position
            particle.position.set(
                x + (Math.random() - 0.5) * 0.5,
                0.1,
                z + (Math.random() - 0.5) * 0.5
            );
            
            // Random velocity
            particle.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.2,
                Math.random() * 0.3,
                (Math.random() - 0.5) * 0.2
            );
            
            particle.userData.life = 1.0; // Life in seconds
            particles.add(particle);
        }

        this.scene.add(particles);
        return particles;
    }

    updateParticles() {
        this.scene.children.forEach(child => {
            if (child instanceof THREE.Group && child.userData.isParticleGroup) {
                child.children.forEach(particle => {
                    particle.userData.life -= 0.016; // Assuming 60fps
                    if (particle.userData.life <= 0) {
                        child.remove(particle);
                    } else {
                        particle.position.add(particle.userData.velocity);
                        particle.userData.velocity.y -= 0.01; // Gravity
                        particle.material.opacity = particle.userData.life;
                    }
                });
                
                if (child.children.length === 0) {
                    this.scene.remove(child);
                }
            }
        });
    }

    moveOtter(direction) {
        // ... existing movement code ...
        
        // Create splash effect when moving
        if (direction !== 0) {
            const splash = this.createWaterSplash(this.otter.position.x, this.otter.position.z);
            splash.userData.isParticleGroup = true;
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('game-container');
    if (container) {
        new OtterRiverGame(container);
    }
}); 