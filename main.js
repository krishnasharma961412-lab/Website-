// Three.js Stars
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 12;
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg-canvas'), antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const geo = new THREE.BufferGeometry();
const count = 4000;
const pos = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 70;
geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
const mat = new THREE.PointsMaterial({ size: 0.132, color: 0xffffff, transparent: true, opacity: 0.7 });
const stars = new THREE.Points(geo, mat);
scene.add(stars);

const mousePlanet = document.getElementById('mouse-follower-planet');
let mx = 0, my = 0, lastS = 0;
let pX = 0, pY = 0; // Planet current position
let tX = 0, tY = 0; // Target mouse position

document.addEventListener('mousemove', e => {
    mx = (e.clientX - window.innerWidth / 2) / 100;
    my = (e.clientY - window.innerHeight / 2) / 100;
    tX = e.clientX;
    tY = e.clientY;

    if (Date.now() - lastS > 60) {
        createSprinkle(e.clientX, e.clientY);
        lastS = Date.now();
    }
});

function createSprinkle(x, y) {
    const s = document.createElement('div');
    s.className = 'sprinkle';
    s.style.left = x + 'px';
    s.style.top = y + 'px';
    const size = 3 + Math.random() * 6;
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    // Increased white ones (70% white, 30% blue)
    s.style.background = Math.random() > 0.7 ? '#2563eb' : '#fff';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 700);
}

function animate() {
    requestAnimationFrame(animate);
    stars.rotation.y += 0.0002;
    camera.position.x += (-mx * 0.1 - camera.position.x) * 0.06;
    camera.position.y += (my * 0.1 - camera.position.y) * 0.06;
    camera.lookAt(0, 0, 0);

    // Smooth latency for mouse planet follower (Lerp)
    if (mousePlanet) {
        pX += (tX - pX) * 0.15;
        pY += (tY - pY) * 0.15;
        mousePlanet.style.left = pX + 'px';
        mousePlanet.style.top = pY + 'px';
    }

    renderer.render(scene, camera);
}
animate();

// Menu
const toggle = o => {
    document.getElementById('side-menu').classList.toggle('open', o);
    document.getElementById('side-menu-overlay').classList.toggle('show', o);
};
document.getElementById('menu-toggle').onclick = () => toggle(true);
document.getElementById('side-menu-overlay').onclick = () => toggle(false);
document.querySelectorAll('.menu-link').forEach(l => l.onclick = () => toggle(false));

// Loader
window.addEventListener('load', () => setTimeout(() => document.getElementById('loader').classList.add('fade-out'), 800));
setTimeout(() => document.getElementById('loader').classList.add('fade-out'), 4000);

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// WhatsApp Contact Form Handler
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
        if (!data.name || !data.email || !data.city) {
            alert('Please fill in all required fields (Name, Email, City)');
            return;
        }
        const text = `Hellow!! \nI am *${data.name}*\nThese are my credentials\nEmail: ${data.email}\n*Contact:* ${data.phone}\n*City:* ${data.city}\n*Company:* ${data.company}\n*LinkedIn:* ${data.linkedin}`;
        window.open(`https://wa.me/919933760243?text=${encodeURIComponent(text)}`, '_blank');
    });
}
