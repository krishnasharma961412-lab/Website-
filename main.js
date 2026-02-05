// --- PERFORMANCE CONFIG ---
const STAR_COUNT = 4000; // Match original for smooth interaction
const PARALLAX_STRENGTH = 0.152; // 25% total increase for reactive mouse interaction
const EASE_FACTOR = 0.08;

// --- STATE ---
let mouseX = 0;
let mouseY = 0;
let targetCameraX = 0;
let targetCameraY = 0;

// --- THREE.JS INITIALIZATION ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg-canvas'),
    antialias: true,
    alpha: true
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

// --- STAR FIELD GENERATION ---
const starGeometry = new THREE.BufferGeometry();
const starPositions = new Float32Array(STAR_COUNT * 3);
const starColors = new Float32Array(STAR_COUNT * 3);

const colors = [
    new THREE.Color(0x2553d6), // Brand Blue
    new THREE.Color(0xFFFFFF), // White
    new THREE.Color(0x444444)  // Dim Gray
];

for (let i = 0; i < STAR_COUNT; i++) {
    const i3 = i * 3;
    starPositions[i3] = (Math.random() - 0.5) * 60;
    starPositions[i3 + 1] = (Math.random() - 0.5) * 60;
    starPositions[i3 + 2] = (Math.random() - 0.5) * 60;

    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    starColors[i3] = randomColor.r;
    starColors[i3 + 1] = randomColor.g;
    starColors[i3 + 2] = randomColor.b;
}

starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

const starMaterial = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
});

const starMesh = new THREE.Points(starGeometry, starMaterial);
scene.add(starMesh);

// --- BUBBLE EFFECT LOGIC ---
const bubbleColors = ['rgba(255, 255, 255, 0.9)', 'rgba(30, 64, 175, 0.8)', 'rgba(255, 255, 255, 0.7)', 'rgba(37, 99, 235, 0.6)'];

function createBubble(x, y) {
    const bubble = document.createElement('div');
    bubble.className = 'cursor-pop';
    bubble.style.left = `${x}px`;
    bubble.style.top = `${y}px`;

    // Random color from dark blue and white palette
    const color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
    bubble.style.background = color;

    // Add unique random drift
    const driftX = (Math.random() - 0.5) * 50;
    const driftY = (Math.random() - 0.5) * 50;
    bubble.style.setProperty('--drift-x', `${driftX}px`);
    bubble.style.setProperty('--drift-y', `${driftY}px`);

    // Random size variation
    const size = 8 + Math.random() * 10;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;

    document.body.appendChild(bubble);

    setTimeout(() => {
        bubble.remove();
    }, 900);
}

// --- ANIMATION LOOP ---
const animate = () => {
    requestAnimationFrame(animate);

    starMesh.rotation.y += 0.0003;
    starMesh.rotation.x += 0.0001;

    // Smoother Reverse Parallax
    targetCameraX = -mouseX * PARALLAX_STRENGTH;
    targetCameraY = mouseY * PARALLAX_STRENGTH;

    camera.position.x += (targetCameraX - camera.position.x) * EASE_FACTOR;
    camera.position.y += (targetCameraY - camera.position.y) * EASE_FACTOR;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
};

// --- INTERACTION LOGIC ---

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) / 100;
    mouseY = (e.clientY - window.innerHeight / 2) / 100;

    // Enhanced bubble spawning - 50% more bubbles
    if (Math.random() > 0.5) {
        createBubble(e.clientX, e.clientY);
    }

    updateReactiveElements(e.clientX, e.clientY);
});

const reactiveElements = document.querySelectorAll('.reactive');
const updateReactiveElements = (mx, my) => {
    reactiveElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const ex = rect.left + rect.width / 2;
        const ey = rect.top + rect.height / 2;

        const distance = Math.hypot(mx - ex, my - ey);
        const maxDist = 300;

        if (distance < maxDist) {
            const glow = 1 - (distance / maxDist);
            const intensity = glow * 30;

            el.style.textShadow = `0 0 ${intensity}px rgba(37, 83, 214, ${glow})`;
            el.style.transform = `scale(${1 + (glow * 0.07)})`;
        } else {
            el.style.textShadow = 'none';
            el.style.transform = 'scale(1)';
        }
    });
};

// Side Menu
const menuToggle = document.getElementById('menu-toggle');
const menuClose = document.getElementById('menu-close');
const sideMenu = document.getElementById('side-menu');
const overlay = document.getElementById('side-menu-overlay');

const toggleMenu = (open) => {
    if (open) {
        sideMenu.classList.add('open');
        overlay.classList.add('show');
    } else {
        sideMenu.classList.remove('open');
        overlay.classList.remove('show');
    }
};

if (menuToggle) menuToggle.addEventListener('click', () => toggleMenu(true));
if (menuClose) menuClose.addEventListener('click', () => toggleMenu(false));
if (overlay) overlay.addEventListener('click', () => toggleMenu(false));

// Lifecycle
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Contact Logic - WhatsApp Handler (AumVerse pattern)
const getVal = (id) => document.getElementById(id)?.value.trim() || '';

const whatsappBtn = document.getElementById('whatsapp-btn');
if (whatsappBtn) {
    whatsappBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const data = {
            name: getVal('name'),
            email: getVal('email'),
            phone: getVal('contact-number') || 'N/A',
            city: getVal('city'),
            company: getVal('company-name') || 'N/A',
            linkedin: getVal('linkedin') || 'N/A'
        };

        // Validate required fields
        if (!data.name || !data.email || !data.city) {
            alert('Please fill in all required fields (Name, Email, City)');
            return;
        }

        const text = `*New Inquiry from UdaanxAI*\n\n` +
            `*Name:* ${data.name}\n` +
            `*Email:* ${data.email}\n` +
            `*Contact:* ${data.phone}\n` +
            `*City:* ${data.city}\n` +
            `*Company:* ${data.company}\n` +
            `*LinkedIn:* ${data.linkedin}`;

        const waUrl = `https://wa.me/919933760243?text=${encodeURIComponent(text)}`;
        window.open(waUrl, '_blank');
    });
}

animate();
