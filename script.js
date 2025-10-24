// =====================
// Global Variables
// =====================
let scene, camera, renderer, textMesh;
let cubeScene, cubeCamera, cubeRenderer, cube;
const mouse = { x: 0, y: 0 };

// =====================
// Custom Cursor
// =====================
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    
    if (!cursor || !cursorDot) return;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Animate cursor with smooth following
    function animateCursor() {
        // Smooth following effect for outer cursor
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        
        // Faster following for dot
        dotX += (mouseX - dotX) * 0.25;
        dotY += (mouseY - dotY) * 0.25;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Add hover effect for clickable elements
    const hoverElements = document.querySelectorAll('a, button, .btn, .social-icon, .name-3d .letter, .add-skill-btn');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
}

// =====================
// Navigation Functions
// =====================
const navbar = document.getElementById('navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Hamburger menu toggle
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Active nav link on scroll
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// =====================
// Glowing Sphere Animation
// =====================
function initBrainAnimation() {
    const canvas = document.getElementById('brainCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 1200;
    canvas.height = 900;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const sphereRadius = 250;
    
    const particles = [];
    const particleCount = 100;
    const flowingLines = [];
    const lineCount = 30;
    const mouse = { x: centerX, y: centerY };
    
    // Flowing Line class for the sphere
    class FlowingLine {
        constructor() {
            this.angle = Math.random() * Math.PI * 2;
            this.angleSpeed = (Math.random() - 0.5) * 0.02;
            this.phi = Math.random() * Math.PI;
            this.phiSpeed = (Math.random() - 0.5) * 0.01;
            this.points = [];
            this.segmentCount = 20;
            this.offset = Math.random() * 1000;
            
            this.updatePoints();
        }
        
        updatePoints() {
            this.points = [];
            for (let i = 0; i < this.segmentCount; i++) {
                const t = i / this.segmentCount;
                const radius = sphereRadius * (0.3 + t * 0.7) * (0.8 + Math.sin(Date.now() * 0.001 + this.offset) * 0.2);
                
                const x = centerX + radius * Math.sin(this.phi + t * Math.PI) * Math.cos(this.angle + t * 0.5);
                const y = centerY + radius * Math.sin(this.phi + t * Math.PI) * Math.sin(this.angle + t * 0.5);
                
                this.points.push({ x, y });
            }
        }
        
        update() {
            this.angle += this.angleSpeed;
            this.phi += this.phiSpeed;
            this.updatePoints();
        }
        
        draw() {
            if (this.points.length < 2) return;
            
            ctx.beginPath();
            ctx.moveTo(this.points[0].x, this.points[0].y);
            
            for (let i = 1; i < this.points.length; i++) {
                const alpha = i / this.points.length;
                ctx.lineTo(this.points[i].x, this.points[i].y);
            }
            
            ctx.strokeStyle = 'rgba(153, 0, 0, 0.3)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            
            // Draw glowing nodes along the line
            this.points.forEach((point, index) => {
                if (index % 3 === 0) {
                    const alpha = index / this.points.length;
                    const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 3);
                    gradient.addColorStop(0, `rgba(153, 0, 0, ${0.8 * alpha})`);
                    gradient.addColorStop(1, 'rgba(139, 0, 0, 0)');
                    
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
                    ctx.fillStyle = gradient;
                    ctx.fill();
                }
            });
        }
    }
    
    // Initialize flowing lines
    for (let i = 0; i < lineCount; i++) {
        flowingLines.push(new FlowingLine());
    }
    
    // Particle class for sphere
    class Particle {
        constructor() {
            // Random position on sphere surface
            const angle = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const radius = sphereRadius * (0.7 + Math.random() * 0.3);
            
            this.baseAngle = angle;
            this.basePhi = phi;
            this.baseRadius = radius;
            
            this.x = centerX + radius * Math.sin(phi) * Math.cos(angle);
            this.y = centerY + radius * Math.sin(phi) * Math.sin(angle);
            
            this.size = Math.random() * 2.5 + 1.5;
            this.opacity = Math.random() * 0.6 + 0.4;
            this.pulseSpeed = Math.random() * 0.002 + 0.001;
            this.pulseOffset = Math.random() * 1000;
            
            // Rotation speeds
            this.angleSpeed = (Math.random() - 0.5) * 0.005;
            this.phiSpeed = (Math.random() - 0.5) * 0.003;
            
            // Cached gradient for performance
            this.gradient = null;
        }
        
        update() {
            // Rotate particle around sphere
            this.baseAngle += this.angleSpeed;
            this.basePhi += this.phiSpeed;
            
            // Pulsating radius
            const pulse = Math.sin(Date.now() * this.pulseSpeed + this.pulseOffset) * 20;
            const radius = this.baseRadius + pulse;
            
            // Calculate 3D position
            this.x = centerX + radius * Math.sin(this.basePhi) * Math.cos(this.baseAngle);
            this.y = centerY + radius * Math.sin(this.basePhi) * Math.sin(this.baseAngle);
            
            // React to mouse
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distanceSquared = dx * dx + dy * dy;
            const reactionRadius = 120;
            
            if (distanceSquared < reactionRadius * reactionRadius) {
                const distance = Math.sqrt(distanceSquared);
                const force = (reactionRadius - distance) / reactionRadius;
                this.x -= (dx / distance) * force * 10;
                this.y -= (dy / distance) * force * 10;
            }
        }
        
        draw() {
            // Pulsating glow intensity
            const glowIntensity = 0.6 + Math.sin(Date.now() * 0.002 + this.pulseOffset) * 0.3;
            
            // Draw glowing particle
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
            gradient.addColorStop(0, `rgba(153, 0, 0, ${this.opacity * glowIntensity})`);
            gradient.addColorStop(0.4, `rgba(139, 0, 0, ${this.opacity * 0.6})`);
            gradient.addColorStop(1, 'rgba(102, 0, 0, 0)');
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Bright core
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.8})`;
            ctx.fill();
        }
        
        drawConnection(other) {
            const dx = this.x - other.x;
            const dy = this.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(other.x, other.y);
                const alpha = (120 - distance) / 120;
                ctx.strokeStyle = `rgba(153, 0, 0, ${alpha * 0.15})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }
    }
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Optimized mouse tracking with immediate response
    let mouseMoving = false;
    let mouseTimeout;
    
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        mouse.x = (e.clientX - rect.left) * scaleX;
        mouse.y = (e.clientY - rect.top) * scaleY;
        mouseMoving = true;
        
        clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(() => {
            mouseMoving = false;
        }, 100);
    });
    
    canvas.addEventListener('mouseleave', () => {
        mouseMoving = false;
        mouse.x = canvas.width / 2;
        mouse.y = canvas.height / 2;
    });
    
    // Optimized animation loop with sphere effect
    let lastTime = 0;
    const targetFPS = 60;
    const frameDelay = 1000 / targetFPS;
    
    function animate(currentTime) {
        requestAnimationFrame(animate);
        
        const deltaTime = currentTime - lastTime;
        
        if (deltaTime < frameDelay) {
            return;
        }
        
        lastTime = currentTime - (deltaTime % frameDelay);
        
        // Clear with slight trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw flowing lines
        flowingLines.forEach(line => {
            line.update();
            line.draw();
        });
        
        // Update particles
        particles.forEach(particle => {
            particle.update();
        });
        
        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                if (Math.abs(dx) < 120 && Math.abs(dy) < 120) {
                    particles[i].drawConnection(particles[j]);
                }
            }
        }
        
        // Draw particles on top
        particles.forEach(particle => {
            particle.draw();
        });
        
        // Draw bright center cluster
        const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 80);
        centerGradient.addColorStop(0, 'rgba(180, 0, 0, 0.3)');
        centerGradient.addColorStop(0.5, 'rgba(153, 0, 0, 0.2)');
        centerGradient.addColorStop(1, 'rgba(139, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 60 + Math.sin(Date.now() * 0.002) * 10, 0, Math.PI * 2);
        ctx.fillStyle = centerGradient;
        ctx.fill();
    }
    
    animate(0);
}

// =====================
// 3D Interactive Name
// =====================
function init3DName() {
    const nameContainer = document.getElementById('name3d');
    const name = "PRABHAS";
    
    // Create individual letter elements
    name.split('').forEach((letter, index) => {
        const letterSpan = document.createElement('span');
        letterSpan.className = 'letter';
        letterSpan.textContent = letter;
        letterSpan.style.animationDelay = `${index * 0.1}s`;
        nameContainer.appendChild(letterSpan);
    });

    // Optimized mouse tracking for instant 3D effect
    const letters = nameContainer.querySelectorAll('.letter');
    let animationFrameId = null;
    let currentRotation = { x: 0, y: 0 };
    let targetRotation = { x: 0, y: 0 };
    
    nameContainer.addEventListener('mousemove', (e) => {
        const rect = nameContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        // Calculate rotation instantly - increased sensitivity
        targetRotation.x = -(mouseY / rect.height) * 30;
        targetRotation.y = (mouseX / rect.width) * 30;
        
        // Apply transformation immediately for fast movements
        currentRotation.x = targetRotation.x;
        currentRotation.y = targetRotation.y;
        
        nameContainer.style.transform = `rotateX(${currentRotation.x}deg) rotateY(${currentRotation.y}deg)`;
    });

    nameContainer.addEventListener('mouseleave', () => {
        targetRotation.x = 0;
        targetRotation.y = 0;
        
        // Smooth return to center
        const smoothReset = () => {
            currentRotation.x += (targetRotation.x - currentRotation.x) * 0.1;
            currentRotation.y += (targetRotation.y - currentRotation.y) * 0.1;
            
            nameContainer.style.transform = `rotateX(${currentRotation.x}deg) rotateY(${currentRotation.y}deg)`;
            
            if (Math.abs(currentRotation.x) > 0.1 || Math.abs(currentRotation.y) > 0.1) {
                requestAnimationFrame(smoothReset);
            } else {
                currentRotation.x = 0;
                currentRotation.y = 0;
                nameContainer.style.transform = 'rotateX(0deg) rotateY(0deg)';
            }
        };
        smoothReset();
    });

    // No individual letter animations - only the whole name rotates
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// =====================
// 3D Cube for About Section
// =====================
function init3DCube() {
    const canvas = document.getElementById('aiCube');
    if (!canvas) return;

    const width = canvas.parentElement.offsetWidth;
    const height = canvas.parentElement.offsetHeight;

    // Scene setup
    cubeScene = new THREE.Scene();
    cubeCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    cubeCamera.position.z = 3;

    cubeRenderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    cubeRenderer.setSize(width, height);
    cubeRenderer.setPixelRatio(window.devicePixelRatio);

    // Create Robot
    const robot = new THREE.Group();
    
    // Materials
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0x2a2a2a,
        emissive: 0x0a0a0a,
        shininess: 150,
        specular: 0x444444,
        reflectivity: 0.8
    });
    
    const darkMetalMaterial = new THREE.MeshPhongMaterial({
        color: 0x1a1a1a,
        shininess: 100,
        specular: 0x222222
    });
    
    const redGlowMaterial = new THREE.MeshPhongMaterial({
        color: 0x8B0000,
        emissive: 0x660000,
        emissiveIntensity: 1.0
    });
    
    // HEAD - Rounded helmet
    const headMain = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.8),
        bodyMaterial
    );
    headMain.position.y = 1.25;
    
    // Top helmet panel
    const helmetTop = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.08, 0.35),
        darkMetalMaterial
    );
    helmetTop.position.set(0, 1.45, 0);
    
    // Ear pieces (headphone-like)
    const earGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.06, 32);
    const leftEar = new THREE.Mesh(earGeometry, darkMetalMaterial);
    leftEar.rotation.z = Math.PI / 2;
    leftEar.position.set(-0.3, 1.25, 0);
    const rightEar = new THREE.Mesh(earGeometry, darkMetalMaterial);
    rightEar.rotation.z = Math.PI / 2;
    rightEar.position.set(0.3, 1.25, 0);
    
    // Ear ribbed details
    for (let i = 0; i < 5; i++) {
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(0.1 + i * 0.01, 0.008, 8, 32),
            darkMetalMaterial
        );
        ring.rotation.y = Math.PI / 2;
        ring.position.set(-0.3, 1.25, 0);
        robot.add(ring);
        
        const ring2 = ring.clone();
        ring2.position.x = 0.3;
        robot.add(ring2);
    }
    
    // Face plate
    const faceplate = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.25, 0.05),
        bodyMaterial
    );
    faceplate.position.set(0, 1.2, 0.23);
    
    // Eyes (glowing red rectangles)
    const eyeGeometry = new THREE.BoxGeometry(0.12, 0.04, 0.02);
    const leftEye = new THREE.Mesh(eyeGeometry, redGlowMaterial);
    leftEye.position.set(-0.08, 1.25, 0.26);
    const rightEye = new THREE.Mesh(eyeGeometry, redGlowMaterial);
    rightEye.position.set(0.08, 1.25, 0.26);
    
    // Mouth grille
    const mouthGrille = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.08, 0.02),
        darkMetalMaterial
    );
    mouthGrille.position.set(0, 1.12, 0.25);
    
    // Grille details
    for (let i = 0; i < 6; i++) {
        const vent = new THREE.Mesh(
            new THREE.BoxGeometry(0.02, 0.07, 0.01),
            new THREE.MeshBasicMaterial({ color: 0x000000 })
        );
        vent.position.set(-0.08 + i * 0.032, 1.12, 0.26);
        robot.add(vent);
    }
    
    // TORSO - Armored chest
    const torsoMain = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.5, 0.32),
        bodyMaterial
    );
    torsoMain.position.y = 0.7;
    
    // Chest armor plates
    const chestPlateLeft = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.35, 0.05),
        bodyMaterial
    );
    chestPlateLeft.position.set(-0.08, 0.75, 0.165);
    
    const chestPlateRight = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.35, 0.05),
        bodyMaterial
    );
    chestPlateRight.position.set(0.08, 0.75, 0.165);
    
    // Mid-section ribbed joints
    for (let i = 0; i < 4; i++) {
        const rib = new THREE.Mesh(
            new THREE.CylinderGeometry(0.22, 0.22, 0.015, 32),
            darkMetalMaterial
        );
        rib.rotation.x = Math.PI / 2;
        rib.position.set(0, 0.52 + i * 0.05, 0);
        robot.add(rib);
    }
    
    // SHOULDERS - Large armor pads
    const shoulderGeometry = new THREE.BoxGeometry(0.2, 0.15, 0.2);
    const leftShoulder = new THREE.Mesh(shoulderGeometry, bodyMaterial);
    leftShoulder.position.set(-0.35, 0.85, 0);
    const rightShoulder = new THREE.Mesh(shoulderGeometry, bodyMaterial);
    rightShoulder.position.set(0.35, 0.85, 0);
    
    // ARMS - Segmented with joints
    const upperArmGeometry = new THREE.BoxGeometry(0.12, 0.28, 0.12);
    const elbowJointGeometry = new THREE.SphereGeometry(0.07, 16, 16);
    const forearmGeometry = new THREE.BoxGeometry(0.11, 0.28, 0.11);
    
    // Left Arm
    const leftUpperArm = new THREE.Mesh(upperArmGeometry, bodyMaterial);
    leftUpperArm.position.set(-0.35, 0.7, 0);
    const leftElbow = new THREE.Mesh(elbowJointGeometry, darkMetalMaterial);
    leftElbow.position.set(0, -0.16, 0);
    leftUpperArm.add(leftElbow);
    const leftForearm = new THREE.Mesh(forearmGeometry, bodyMaterial);
    leftForearm.position.set(0, -0.3, 0);
    leftUpperArm.add(leftForearm);
    
    // Left hand with articulated fingers
    const leftHand = new THREE.Group();
    const palmGeometry = new THREE.BoxGeometry(0.08, 0.05, 0.1);
    const leftPalm = new THREE.Mesh(palmGeometry, bodyMaterial);
    leftHand.add(leftPalm);
    
    // Create 4 articulated fingers with segments
    for (let i = 0; i < 4; i++) {
        const fingerBase = new THREE.Mesh(
            new THREE.BoxGeometry(0.015, 0.04, 0.015),
            bodyMaterial
        );
        fingerBase.position.set(-0.028 + i * 0.019, -0.04, 0.055);
        
        const fingerTip = new THREE.Mesh(
            new THREE.BoxGeometry(0.013, 0.03, 0.013),
            darkMetalMaterial
        );
        fingerTip.position.set(0, -0.035, 0);
        fingerBase.add(fingerTip);
        
        leftHand.add(fingerBase);
    }
    
    // Thumb
    const thumb = new THREE.Mesh(
        new THREE.BoxGeometry(0.018, 0.035, 0.015),
        bodyMaterial
    );
    thumb.position.set(0.045, -0.025, 0.04);
    thumb.rotation.z = -0.5;
    leftHand.add(thumb);
    
    leftHand.position.set(0, -0.16, 0);
    leftForearm.add(leftHand);
    
    // Right Arm (mirror of left)
    const rightUpperArm = new THREE.Mesh(upperArmGeometry, bodyMaterial);
    rightUpperArm.position.set(0.35, 0.7, 0);
    const rightElbow = new THREE.Mesh(elbowJointGeometry, darkMetalMaterial);
    rightElbow.position.set(0, -0.16, 0);
    rightUpperArm.add(rightElbow);
    const rightForearm = new THREE.Mesh(forearmGeometry, bodyMaterial);
    rightForearm.position.set(0, -0.3, 0);
    rightUpperArm.add(rightForearm);
    
    // Right hand with articulated fingers
    const rightHand = new THREE.Group();
    const rightPalm = new THREE.Mesh(palmGeometry, bodyMaterial);
    rightHand.add(rightPalm);
    
    for (let i = 0; i < 4; i++) {
        const fingerBase = new THREE.Mesh(
            new THREE.BoxGeometry(0.015, 0.04, 0.015),
            bodyMaterial
        );
        fingerBase.position.set(-0.028 + i * 0.019, -0.04, 0.055);
        
        const fingerTip = new THREE.Mesh(
            new THREE.BoxGeometry(0.013, 0.03, 0.013),
            darkMetalMaterial
        );
        fingerTip.position.set(0, -0.035, 0);
        fingerBase.add(fingerTip);
        
        rightHand.add(fingerBase);
    }
    
    const rightThumb = new THREE.Mesh(
        new THREE.BoxGeometry(0.018, 0.035, 0.015),
        bodyMaterial
    );
    rightThumb.position.set(-0.045, -0.025, 0.04);
    rightThumb.rotation.z = 0.5;
    rightHand.add(rightThumb);
    
    rightHand.position.set(0, -0.16, 0);
    rightForearm.add(rightHand);
    
    // LEGS - Thick chibi proportions
    const upperLegGeometry = new THREE.BoxGeometry(0.16, 0.32, 0.16);
    const kneeJointGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const lowerLegGeometry = new THREE.BoxGeometry(0.15, 0.28, 0.15);
    const footGeometry = new THREE.BoxGeometry(0.16, 0.08, 0.22);
    
    // Left Leg
    const leftUpperLeg = new THREE.Mesh(upperLegGeometry, bodyMaterial);
    leftUpperLeg.position.set(-0.13, 0.2, 0);
    const leftKnee = new THREE.Mesh(kneeJointGeometry, darkMetalMaterial);
    leftKnee.position.set(0, -0.18, 0);
    leftUpperLeg.add(leftKnee);
    const leftLowerLeg = new THREE.Mesh(lowerLegGeometry, bodyMaterial);
    leftLowerLeg.position.set(0, -0.32, 0);
    leftUpperLeg.add(leftLowerLeg);
    const leftFoot = new THREE.Mesh(footGeometry, bodyMaterial);
    leftFoot.position.set(0, -0.18, 0.03);
    leftLowerLeg.add(leftFoot);
    
    // Right Leg
    const rightUpperLeg = new THREE.Mesh(upperLegGeometry, bodyMaterial);
    rightUpperLeg.position.set(0.13, 0.2, 0);
    const rightKnee = new THREE.Mesh(kneeJointGeometry, darkMetalMaterial);
    rightKnee.position.set(0, -0.18, 0);
    rightUpperLeg.add(rightKnee);
    const rightLowerLeg = new THREE.Mesh(lowerLegGeometry, bodyMaterial);
    rightLowerLeg.position.set(0, -0.32, 0);
    rightUpperLeg.add(rightLowerLeg);
    const rightFoot = new THREE.Mesh(footGeometry, bodyMaterial);
    rightFoot.position.set(0, -0.18, 0.03);
    rightLowerLeg.add(rightFoot);
    
    // Assemble robot
    robot.add(headMain);
    robot.add(helmetTop);
    robot.add(leftEar);
    robot.add(rightEar);
    robot.add(faceplate);
    robot.add(leftEye);
    robot.add(rightEye);
    robot.add(mouthGrille);
    robot.add(torsoMain);
    robot.add(chestPlateLeft);
    robot.add(chestPlateRight);
    robot.add(leftShoulder);
    robot.add(rightShoulder);
    robot.add(leftUpperArm);
    robot.add(rightUpperArm);
    robot.add(leftUpperLeg);
    robot.add(rightUpperLeg);
    
    // Set initial crouched pose
    robot.position.set(0, -0.4, -1.8);
    robot.scale.set(1.2, 1.2, 1.2);
    robot.rotation.x = 0.1; // Slight forward lean
    
    // Crouch the legs
    leftUpperLeg.rotation.x = 0.3;
    rightUpperLeg.rotation.x = 0.3;
    leftLowerLeg.rotation.x = -0.5;
    rightLowerLeg.rotation.x = -0.5;
    
    // Arms slightly bent and forward
    leftUpperArm.rotation.x = 0.2;
    rightUpperArm.rotation.x = 0.2;
    leftForearm.rotation.x = -0.3;
    rightForearm.rotation.x = -0.3;
    
    cubeScene.add(robot);
    
    // Store references for animation
    cube = robot;
    cube.leftUpperArm = leftUpperArm;
    cube.rightUpperArm = rightUpperArm;
    cube.leftForearm = leftForearm;
    cube.rightForearm = rightForearm;
    cube.leftUpperLeg = leftUpperLeg;
    cube.rightUpperLeg = rightUpperLeg;
    cube.leftLowerLeg = leftLowerLeg;
    cube.rightLowerLeg = rightLowerLeg;

    // Dramatic lighting setup like reference image
    const ambientLight = new THREE.AmbientLight(0x202020, 0.4);
    cubeScene.add(ambientLight);

    // Strong warm golden light from right
    const rightLight = new THREE.DirectionalLight(0xffaa44, 2.0);
    rightLight.position.set(6, 4, 4);
    cubeScene.add(rightLight);
    
    // Cool blue light from left
    const leftLight = new THREE.DirectionalLight(0x4488ff, 1.5);
    leftLight.position.set(-6, 3, 4);
    cubeScene.add(leftLight);
    
    // Subtle red accent from eyes
    const eyeLight = new THREE.PointLight(0xff0000, 0.8, 3);
    eyeLight.position.set(0, 1.25, 0.5);
    robot.add(eyeLight);
    
    // Top rim light
    const topLight = new THREE.DirectionalLight(0x666666, 0.6);
    topLight.position.set(0, 10, 2);
    cubeScene.add(topLight);

    // Animation
    animate3DCube();

    // Responsive resize
    window.addEventListener('resize', () => {
        const newWidth = canvas.parentElement.offsetWidth;
        const newHeight = canvas.parentElement.offsetHeight;
        cubeRenderer.setSize(newWidth, newHeight);
        cubeCamera.aspect = newWidth / newHeight;
        cubeCamera.updateProjectionMatrix();
    });
}

function animate3DCube() {
    requestAnimationFrame(animate3DCube);

    if (cube) {
        const time = Date.now() * 0.001;
        const animationDuration = 8;
        const walkDuration = 4;
        const foldDuration = 2;
        
        const cycleTime = time % animationDuration;
        
        // Base crouched pose maintained throughout
        const baseCrouch = 0.3;
        const baseLowerLeg = -0.5;
        
        if (cycleTime < walkDuration) {
            // Walking animation - maintaining crouched stance
            const walkProgress = cycleTime / walkDuration;
            
            // Move forward 3 steps
            cube.position.z = -1.8 + (walkProgress * 1.5);
            
            // Walking leg motion with crouch
            const legSwing = Math.sin(time * 4) * 0.4;
            cube.leftUpperLeg.rotation.x = baseCrouch + legSwing;
            cube.rightUpperLeg.rotation.x = baseCrouch - legSwing;
            cube.leftLowerLeg.rotation.x = baseLowerLeg + Math.max(0, -legSwing * 0.6);
            cube.rightLowerLeg.rotation.x = baseLowerLeg + Math.max(0, legSwing * 0.6);
            
            // Natural arm swing while walking - relaxed
            cube.leftUpperArm.rotation.x = 0.2 - legSwing * 0.3;
            cube.rightUpperArm.rotation.x = 0.2 + legSwing * 0.3;
            cube.leftUpperArm.rotation.z = 0;
            cube.rightUpperArm.rotation.z = 0;
            cube.leftForearm.rotation.x = -0.3;
            cube.rightForearm.rotation.x = -0.3;
            
        } else if (cycleTime < walkDuration + foldDuration) {
            // Stop walking - return to standing crouch
            const standProgress = (cycleTime - walkDuration) / foldDuration;
            
            // Smooth transition to crouched standing pose
            const legSwing = Math.sin(time * 4) * 0.4 * (1 - standProgress);
            cube.leftUpperLeg.rotation.x = baseCrouch + legSwing;
            cube.rightUpperLeg.rotation.x = baseCrouch - legSwing;
            cube.leftLowerLeg.rotation.x = baseLowerLeg + Math.max(0, -legSwing * 0.6);
            cube.rightLowerLeg.rotation.x = baseLowerLeg + Math.max(0, legSwing * 0.6);
            
            // Fold arms animation
            const foldProgress = Math.min(1, standProgress);
            
            // Raise arms up
            cube.leftUpperArm.rotation.z = foldProgress * Math.PI / 3;
            cube.rightUpperArm.rotation.z = -foldProgress * Math.PI / 3;
            
            // Bend elbows to fold arms
            cube.leftForearm.rotation.x = -0.3 - foldProgress * 0.8;
            cube.rightForearm.rotation.x = -0.3 - foldProgress * 0.8;
            
            // Arms forward slightly
            cube.leftUpperArm.rotation.x = 0.2 - foldProgress * 0.3;
            cube.rightUpperArm.rotation.x = 0.2 - foldProgress * 0.3;
            
        } else {
            // Hold pose and reset
            const holdProgress = (cycleTime - walkDuration - foldDuration) / (animationDuration - walkDuration - foldDuration);
            
            // Maintain crouched standing pose
            cube.leftUpperLeg.rotation.x = baseCrouch;
            cube.rightUpperLeg.rotation.x = baseCrouch;
            cube.leftLowerLeg.rotation.x = baseLowerLeg;
            cube.rightLowerLeg.rotation.x = baseLowerLeg;
            
            // Reset to start position gradually
            if (holdProgress > 0.5) {
                const resetProgress = (holdProgress - 0.5) * 2;
                cube.position.z = -0.3 - (1 - resetProgress) * 1.5;
                
                // Reset arm positions
                const easeOut = 1 - Math.pow(1 - resetProgress, 3);
                cube.leftUpperArm.rotation.z = (1 - easeOut) * Math.PI / 3;
                cube.rightUpperArm.rotation.z = -(1 - easeOut) * Math.PI / 3;
                cube.leftForearm.rotation.x = -0.3 - (1 - easeOut) * 0.8;
                cube.rightForearm.rotation.x = -0.3 - (1 - easeOut) * 0.8;
                cube.leftUpperArm.rotation.x = 0.2 - (1 - easeOut) * 0.3;
                cube.rightUpperArm.rotation.x = 0.2 - (1 - easeOut) * 0.3;
            }
        }
        
        // Subtle breathing motion
        cube.position.y = -0.4 + Math.sin(time * 1.5) * 0.02;
        
        // Slight rotation for better view
        cube.rotation.y = Math.sin(time * 0.3) * 0.15;
    }

    cubeRenderer.render(cubeScene, cubeCamera);
}

// =====================
// Particle Background
// =====================
function initParticles() {
    const canvas = document.getElementById('particles-bg');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = `rgba(139, 0, 0, ${this.opacity * 0.5})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 80) {
                    ctx.strokeStyle = `rgba(139, 0, 0, ${(0.15 - distance / 600) * 0.5})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// =====================
// Typing Effect
// =====================
function typeWriter() {
    const text = 'AI Engineer';
    let charIndex = 0;
    const typingSpeed = 100;
    
    const typingElement = document.querySelector('.typing-text');
    const cursorElement = document.querySelector('.cursor');
    
    if (typingElement) {
        typingElement.textContent = '';
        
        function type() {
            if (charIndex < text.length) {
                typingElement.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(type, typingSpeed);
            } else {
                // Hide cursor after typing completes
                if (cursorElement) {
                    setTimeout(() => {
                        cursorElement.style.display = 'none';
                    }, 500);
                }
            }
        }
        
        type();
    }
}

// =====================
// Scroll Animations
// =====================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all major elements
    document.querySelectorAll('.timeline-item, .project-card, .skill-category, .education-card, .contact-item').forEach(el => {
        observer.observe(el);
    });

    // Separate observer for profile image and title
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.2
    });

    // Observe profile image container and about visual
    const profileImageContainer = document.querySelector('.profile-image-container');
    const aboutVisual = document.querySelector('.about-visual');
    
    if (profileImageContainer) {
        imageObserver.observe(profileImageContainer);
    }
    
    if (aboutVisual) {
        imageObserver.observe(aboutVisual);
    }
}

// =====================
// Smooth Scrolling
// =====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// =====================
// Scroll Indicator
// =====================
const scrollIndicator = document.querySelector('.scroll-indicator');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollIndicator.style.opacity = '0';
    } else {
        scrollIndicator.style.opacity = '1';
    }
});

// =====================
// Add Skill Functionality
// =====================
function initAddSkillButtons() {
    const addSkillButtons = document.querySelectorAll('.add-skill-btn');
    
    addSkillButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            const skillsList = this.previousElementSibling;
            
            // Create a simple prompt-based input (you can enhance this with a modal later)
            const skillName = prompt(`Enter new skill for ${category}:`);
            
            if (skillName && skillName.trim() !== '') {
                // Create new skill item
                const newSkill = document.createElement('div');
                newSkill.className = 'skill-item';
                newSkill.textContent = skillName.trim();
                
                // Add animation for new skill
                newSkill.style.opacity = '0';
                newSkill.style.transform = 'scale(0.8)';
                
                // Append to skills list
                skillsList.appendChild(newSkill);
                
                // Animate in
                setTimeout(() => {
                    newSkill.style.transition = 'all 0.3s ease';
                    newSkill.style.opacity = '1';
                    newSkill.style.transform = 'scale(1)';
                }, 10);
                
                // Save to localStorage (optional - for persistence)
                saveSkillToStorage(category, skillName.trim());
            }
        });
    });
}

// Optional: Save skills to localStorage for persistence across page reloads
function saveSkillToStorage(category, skillName) {
    let skills = JSON.parse(localStorage.getItem('customSkills')) || {};
    
    if (!skills[category]) {
        skills[category] = [];
    }
    
    skills[category].push(skillName);
    localStorage.setItem('customSkills', JSON.stringify(skills));
}

// Optional: Load saved skills from localStorage
function loadSavedSkills() {
    const skills = JSON.parse(localStorage.getItem('customSkills')) || {};
    
    Object.keys(skills).forEach(category => {
        const categoryElement = Array.from(document.querySelectorAll('.add-skill-btn'))
            .find(btn => btn.getAttribute('data-category') === category);
        
        if (categoryElement) {
            const skillsList = categoryElement.previousElementSibling;
            
            skills[category].forEach(skillName => {
                const newSkill = document.createElement('div');
                newSkill.className = 'skill-item';
                newSkill.textContent = skillName;
                skillsList.appendChild(newSkill);
            });
        }
    });
}

// =====================
// Initialize Everything
// =====================
// =====================
// Video Background Switcher with Smooth Transition
// =====================
function initVideoBackground() {
    const video1 = document.getElementById('video1');
    const video2 = document.getElementById('video2');
    
    if (video1 && video2) {
        // Ensure first video plays
        video1.play().catch(err => {
            console.log('Video autoplay prevented:', err);
        });
        
        // Preload second video
        video2.load();
        
        // Track if transition has started
        let transitionStarted = false;
        
        // When red.mp4 is about to end, start smooth transition
        video1.addEventListener('timeupdate', function() {
            // Start transition 0.8 seconds before the end (only once)
            if (!transitionStarted && video1.currentTime >= video1.duration - 0.8) {
                transitionStarted = true;
                
                // Start playing video2
                video2.play().catch(err => {
                    console.log('Video2 play error:', err);
                });
                
                // Use CSS transitions for smooth cross-fade
                video1.style.opacity = '0';
                video2.style.opacity = '1';
                
                // Hide video1 after transition completes
                setTimeout(() => {
                    video1.pause();
                    video1.style.display = 'none';
                }, 600); // Wait for CSS transition to complete (500ms + buffer)
            }
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for DOM to be ready
    setTimeout(() => {
        // initBrainAnimation(); // Removed - using video background
        init3DName();
        // init3DCube(); // Removed - replaced with profile image
        // initParticles(); // Removed - using video background
        typeWriter();
        initScrollAnimations();
        initVideoBackground();
        initCustomCursor();
        loadSavedSkills(); // Load previously saved skills
        initAddSkillButtons(); // Initialize add skill functionality
        initContactForm(); // Initialize contact form
    }, 100);
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease-in-out';
        document.body.style.opacity = '1';
    }, 100);
});

// =====================
// Performance Optimization
// =====================
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            ticking = false;
        });
        ticking = true;
    }
});

// =====================
// Contact Form Handler
// =====================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Create mailto link
            const mailtoLink = `mailto:tsnvprabhas2003@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
            
            // Open mail client
            window.location.href = mailtoLink;
            
            // Optional: Show success message
            alert('Opening your email client...');
            
            // Reset form
            contactForm.reset();
        });
    }
}

// =====================
// Easter Egg - Console Message
// =====================
console.log('%c🤖 Welcome to Prabhas\' AI Portfolio! 🚀', 'color: #8B0000; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with ❤️ using Three.js, Modern CSS, and Vanilla JavaScript', 'color: #660000; font-size: 14px;');
console.log('%cInterested in the code? Check out my GitHub!', 'color: #990000; font-size: 12px;');

