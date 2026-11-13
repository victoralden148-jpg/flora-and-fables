// --- ART.JS: 3D Engine & Character Factory ---

const canvas = document.getElementById('game-canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#E0F7FA'); // Langit pastel
scene.fog = new THREE.FogExp2('#E0F7FA', 0.02);

// Kamera Isometrik
const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 10;
const camera = new THREE.OrthographicCamera(
    frustumSize * aspect / -2, frustumSize * aspect / 2,
    frustumSize / 2, frustumSize / -2,
    0.1, 1000
);
camera.position.set(10, 10, 10);
camera.lookAt(0, 0, 0);

// Renderer dengan Antialias & Shadow
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Bayangan lembut

// --- PENCAHAYAAN (Kunci Grafik Bagus) ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xfff5e6, 0.8);
dirLight.position.set(10, 20, 10);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
dirLight.shadow.camera.left = -10;
dirLight.shadow.camera.right = 10;
dirLight.shadow.camera.top = 10;
dirLight.shadow.camera.bottom = -10;
scene.add(dirLight);

// Cahaya ambient warna-warni untuk *bounce light* (estetik)
const bounceLight = new THREE.HemisphereLight(0xA8E6CF, 0xFFD3B6, 0.5);
scene.add(bounceLight);

// Material dasar untuk 3D clay/plastik mengkilap
const matteMaterial = (color) => new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.4, // Tidak terlalu kasar
    metalness: 0.1, // Sedikit kilau
    flatShading: false
});

// --- FACTORY FUNCTIONS (Membuat model 3D dari kode) ---

// 1. Membuat Karakter Lucu (Blob/Binatang)
function createCharacter3D(type, color1, color2) {
    const group = new THREE.Group();
    
    // Body (Bulat telur)
    const bodyGeo = new THREE.SphereGeometry(1, 32, 32);
    const bodyMat = matteMaterial(color1);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.scale.set(1, 1.2, 1);
    body.position.y = 1;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Kepala (Bulat)
    const headGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const headMat = matteMaterial(color1);
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 2.2;
    head.castShadow = true;
    group.add(head);

    // Mata
    const eyeGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.1 });
    
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.3, 2.3, 0.7);
    group.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.3, 2.3, 0.7);
    group.add(rightEye);

    // Telinga / Tanduk (Custom berdasarkan tipe)
    if (type === 'bunny') {
        const earGeo = new THREE.CapsuleGeometry(0.2, 0.8, 4, 16);
        const leftEar = new THREE.Mesh(earGeo, matteMaterial(color2));
        leftEar.position.set(-0.3, 3.1, 0);
        leftEar.rotation.z = 0.2;
        leftEar.castShadow = true;
        group.add(leftEar);
        
        const rightEar = new THREE.Mesh(earGeo, matteMaterial(color2));
        rightEar.position.set(0.3, 3.1, 0);
        rightEar.rotation.z = -0.2;
        rightEar.castShadow = true;
        group.add(rightEar);
    } else if (type === 'cat') {
        const earGeo = new THREE.ConeGeometry(0.3, 0.5, 16);
        const leftEar = new THREE.Mesh(earGeo, matteMaterial(color2));
        leftEar.position.set(-0.5, 2.9, 0);
        leftEar.rotation.z = 0.3;
        leftEar.castShadow = true;
        group.add(leftEar);
        
        const rightEar = new THREE.Mesh(earGeo, matteMaterial(color2));
        rightEar.position.set(0.5, 2.9, 0);
        rightEar.rotation.z = -0.3;
        rightEar.castShadow = true;
        group.add(rightEar);
    } else if (type === 'frog') {
         // Mata kodok di atas kepala
         leftEye.position.set(-0.4, 2.8, 0.4);
         rightEye.position.set(0.4, 2.8, 0.4);
         leftEye.scale.set(2,2,2);
         rightEye.scale.set(2,2,2);
    }

    // Kaki kecil
    const legGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const legMat = matteMaterial(color2);
    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.set(-0.5, 0.2, 0);
    leftLeg.castShadow = true;
    group.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeo, legMat);
    rightLeg.position.set(0.5, 0.2, 0);
    rightLeg.castShadow = true;
    group.add(rightLeg);

    return group;
}

// Animasi melayang (bobbing)
function animateFloating(obj, time) {
    obj.position.y += Math.sin(time * 0.002) * 0.002;
}

// Handle Resize
window.addEventListener('resize', () => {
    const aspect = window.innerWidth / window.innerHeight;
    camera.left = -frustumSize * aspect / 2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = -frustumSize / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
