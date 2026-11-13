// --- ART.JS: 3D Engine, Lighting & Custom Models ---

const canvas = document.getElementById('game-canvas');
const scene = new THREE.Scene();
// Background sky pastel ala PuffPals
scene.background = new THREE.Color('#A8E6CF'); 
scene.fog = new THREE.FogExp2('#A8E6CF', 0.015);

// Kamera
const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 12;
const camera = new THREE.OrthographicCamera(
    frustumSize * aspect / -2, frustumSize * aspect / 2,
    frustumSize / 2, frustumSize / -2,
    0.1, 1000
);
// Sudut pandang isometrik manis
camera.position.set(15, 15, 15);
camera.lookAt(0, 1, 0);

// Renderer dengan Bayangan Lembut (Soft Shadows)
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// --- PENCAHAYAAN (Lighting) ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Cahaya Matahari (Warm)
const dirLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
dirLight.position.set(10, 20, 10);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.left = -15;
dirLight.shadow.camera.right = 15;
dirLight.shadow.camera.top = 15;
dirLight.shadow.camera.bottom = -15;
dirLight.shadow.bias = -0.0005;
scene.add(dirLight);

// Cahaya Langit (Mint & Peach Bounce Light)
const bounceLight = new THREE.HemisphereLight(0xA8E6CF, 0xFFD3B6, 0.8);
scene.add(bounceLight);

// Material Dasar (Tekstur Tanah Liat/Clay)
const matteMaterial = (color) => new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.6, // Sedikit kasar seperti clay
    metalness: 0.05,
    flatShading: false
});

// --- FACTORY: PEMBUATAN KARAKTER 3D CUSTOM ---
function createCharacter3D(type, color1, color2) {
    const group = new THREE.Group();
    const mainMat = matteMaterial(color1);
    const secMat = matteMaterial(color2);
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.2 });
    const pinkMat = new THREE.MeshStandardMaterial({ color: 0xFF9A9E, roughness: 0.5 });

    // 1. Badan (Bulat Telur)
    const body = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), mainMat);
    body.scale.set(1, 1.1, 0.9);
    body.position.y = 1;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // 2. Kepala
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.85, 32, 32), mainMat);
    head.position.y = 2.2;
    head.castShadow = true;
    group.add(head);

    // 3. Mata (Lebih detail)
    const eyeGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const leftEye = new THREE.Mesh(eyeGeo, blackMat);
    leftEye.position.set(-0.3, 2.3, 0.75);
    group.add(leftEye);
    const rightEye = new THREE.Mesh(eyeGeo, blackMat);
    rightEye.position.set(0.3, 2.3, 0.75);
    group.add(rightEye);

    // 4. Pipi Merona (Blush)
    const blushGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const leftBlush = new THREE.Mesh(blushGeo, pinkMat);
    leftBlush.position.set(-0.5, 2.15, 0.7);
    leftBlush.scale.set(1.5, 0.8, 0.5);
    group.add(leftBlush);
    const rightBlush = new THREE.Mesh(blushGeo, pinkMat);
    rightBlush.position.set(0.5, 2.15, 0.7);
    rightBlush.scale.set(1.5, 0.8, 0.5);
    group.add(rightBlush);

    // 5. Telinga / Tanduk
    if (type === 'bunny') {
        const earGeo = new THREE.CapsuleGeometry(0.2, 0.9, 8, 16);
        const lEar = new THREE.Mesh(earGeo, secMat);
        lEar.position.set(-0.3, 3.2, 0); lEar.rotation.z = 0.2; lEar.castShadow = true;
        group.add(lEar);
        const rEar = new THREE.Mesh(earGeo, secMat);
        rEar.position.set(0.3, 3.2, 0); rEar.rotation.z = -0.2; rEar.castShadow = true;
        group.add(rEar);
    } else if (type === 'cat') {
        const earGeo = new THREE.ConeGeometry(0.35, 0.6, 16);
        const lEar = new THREE.Mesh(earGeo, secMat);
        lEar.position.set(-0.5, 2.9, 0); lEar.rotation.z = 0.4; lEar.castShadow = true;
        group.add(lEar);
        const rEar = new THREE.Mesh(earGeo, secMat);
        rEar.position.set(0.5, 2.9, 0); rEar.rotation.z = -0.4; rEar.castShadow = true;
        group.add(rEar);
    } else if (type === 'frog') {
        leftEye.scale.set(1.5, 1.5, 1.5); rightEye.scale.set(1.5, 1.5, 1.5);
        leftEye.position.set(-0.4, 2.8, 0.5); rightEye.position.set(0.4, 2.8, 0.5);
    }

    // 6. Tangan & Kaki
    const limbGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const lArm = new THREE.Mesh(limbGeo, mainMat); lArm.position.set(-0.9, 1.2, 0.3); lArm.castShadow = true; group.add(lArm);
    const rArm = new THREE.Mesh(limbGeo, mainMat); rArm.position.set(0.9, 1.2, 0.3); rArm.castShadow = true; group.add(rArm);
    
    const footGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const lFoot = new THREE.Mesh(footGeo, secMat); lFoot.position.set(-0.4, 0.2, 0.4); lFoot.scale.set(1, 0.7, 1.2); lFoot.castShadow = true; group.add(lFoot);
    const rFoot = new THREE.Mesh(footGeo, secMat); rFoot.position.set(0.4, 0.2, 0.4); rFoot.scale.set(1, 0.7, 1.2); rFoot.castShadow = true; group.add(rFoot);

    return group;
}

// --- FACTORY: PEMBUATAN LINGKUNGAN (Pohon, Batu, Rumput) ---
function createTree(x, z, scale = 1) {
    const treeGroup = new THREE.Group();
    
    // Batang
    const trunkMat = matteMaterial('#C4A484');
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 2, 8), trunkMat);
    trunk.position.y = 1;
    trunk.castShadow = true;
    treeGroup.add(trunk);

    // Daun (Kumpulan bola-bola hijau)
    const leafMat = matteMaterial('#7CCCA6');
    const leafGeo = new THREE.IcosahedronGeometry(1, 1); // Bentuk sedikit kasar agar natural
    
    const leaf1 = new THREE.Mesh(leafGeo, leafMat);
    leaf1.position.set(0, 2.2, 0); leaf1.scale.set(1.2, 1, 1.2); leaf1.castShadow = true;
    treeGroup.add(leaf1);
    
    const leaf2 = new THREE.Mesh(leafGeo, leafMat);
    leaf2.position.set(0.6, 1.8, 0.5); leaf2.scale.set(0.8, 0.8, 0.8); leaf2.castShadow = true;
    treeGroup.add(leaf2);

    const leaf3 = new THREE.Mesh(leafGeo, leafMat);
    leaf3.position.set(-0.6, 1.8, -0.5); leaf3.scale.set(0.8, 0.8, 0.8); leaf3.castShadow = true;
    treeGroup.add(leaf3);

    treeGroup.position.set(x, 0, z);
    treeGroup.scale.set(scale, scale, scale);
    return treeGroup;
}

function createRock(x, z) {
    const rockMat = matteMaterial('#B0B0B0');
    const rockGeo = new THREE.DodecahedronGeometry(0.5, 0);
    const rock = new THREE.Mesh(rockGeo, rockMat);
    rock.position.set(x, 0.2, z);
    rock.scale.set(1, 0.7, 1);
    rock.rotation.set(Math.random(), Math.random(), Math.random());
    rock.castShadow = true;
    rock.receiveShadow = true;
    return rock;
}

function createFlower(x, z, color) {
    const group = new THREE.Group();
    const stemMat = matteMaterial('#7CCCA6');
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.3), stemMat);
    stem.position.y = 0.15;
    group.add(stem);
    
    const petalMat = matteMaterial(color);
    const petal = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), petalMat);
    petal.position.y = 0.3;
    petal.scale.set(1.5, 0.5, 1.5);
    group.add(petal);

    group.position.set(x, 0, z);
    return group;
}
