// --- ART.JS: 3D Engine, Lighting & Custom Models ---

const canvas = document.getElementById('game-canvas');
const scene = new THREE.Scene();
// Warna langit pastel mint
scene.background = new THREE.Color('#B2EBF2'); 

// Kamera Orthographic yang sudah diperbaiki (Zoom out)
const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 16; // Diperbesar agar seluruh pulau terlihat
const camera = new THREE.OrthographicCamera(
    frustumSize * aspect / -2, frustumSize * aspect / 2,
    frustumSize / 2, frustumSize / -2,
    0.1, 1000
);
camera.position.set(15, 15, 15);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// --- PENCAHAYAAN DIPERBAIKI ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Terang merata
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xfff5e6, 1.0);
dirLight.position.set(10, 20, 5);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
dirLight.shadow.camera.left = -10;
dirLight.shadow.camera.right = 10;
dirLight.shadow.camera.top = 10;
dirLight.shadow.camera.bottom = -10;
scene.add(dirLight);

// Cahaya pantulan
const bounceLight = new THREE.HemisphereLight(0xA8E6CF, 0xFFD3B6, 0.6);
scene.add(bounceLight);

// Material Clay (Tidak memantulkan cahaya berlebihan)
const clayMaterial = (color) => new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.9, // Tinggi agar tidak hitam
    metalness: 0.0, // Nol agar tidak butuh environment map
});

// --- KARAKTER 3D CUSTOM ---
function createCharacter3D(type, color1, color2) {
    const group = new THREE.Group();
    const mainMat = clayMaterial(color1);
    const secMat = clayMaterial(color2);
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5 });
    const pinkMat = new THREE.MeshStandardMaterial({ color: 0xFF9A9E, roughness: 0.8 });

    // Badan
    const body = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), mainMat);
    body.scale.set(1, 1.1, 0.9); body.position.y = 1.1; body.castShadow = true; group.add(body);

    // Kepala
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.85, 32, 32), mainMat);
    head.position.y = 2.3; head.castShadow = true; group.add(head);

    // Mata
    const eyeGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const lEye = new THREE.Mesh(eyeGeo, blackMat); lEye.position.set(-0.3, 2.4, 0.75); group.add(lEye);
    const rEye = new THREE.Mesh(eyeGeo, blackMat); rEye.position.set(0.3, 2.4, 0.75); group.add(rEye);

    // Pipi
    const blushGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const lBlush = new THREE.Mesh(blushGeo, pinkMat); lBlush.position.set(-0.5, 2.25, 0.7); lBlush.scale.set(1.5, 0.8, 0.5); group.add(lBlush);
    const rBlush = new THREE.Mesh(blushGeo, pinkMat); rBlush.position.set(0.5, 2.25, 0.7); rBlush.scale.set(1.5, 0.8, 0.5); group.add(rBlush);

    // Telinga
    if (type === 'bunny') {
        const earGeo = new THREE.CapsuleGeometry(0.2, 0.9, 8, 16);
        const lEar = new THREE.Mesh(earGeo, secMat); lEar.position.set(-0.3, 3.3, 0); lEar.rotation.z = 0.2; lEar.castShadow = true; group.add(lEar);
        const rEar = new THREE.Mesh(earGeo, secMat); rEar.position.set(0.3, 3.3, 0); rEar.rotation.z = -0.2; rEar.castShadow = true; group.add(rEar);
    } else if (type === 'cat') {
        const earGeo = new THREE.ConeGeometry(0.35, 0.6, 16);
        const lEar = new THREE.Mesh(earGeo, secMat); lEar.position.set(-0.5, 2.9, 0); lEar.rotation.z = 0.4; lEar.castShadow = true; group.add(lEar);
        const rEar = new THREE.Mesh(earGeo, secMat); rEar.position.set(0.5, 2.9, 0); rEar.rotation.z = -0.4; rEar.castShadow = true; group.add(rEar);
    } else if (type === 'frog') {
        lEye.scale.set(1.5, 1.5, 1.5); rEye.scale.set(1.5, 1.5, 1.5);
        lEye.position.set(-0.4, 2.9, 0.5); rEye.position.set(0.4, 2.9, 0.5);
    }

    // Tangan & Kaki
    const limbGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const lArm = new THREE.Mesh(limbGeo, mainMat); lArm.position.set(-0.9, 1.3, 0.3); lArm.castShadow = true; group.add(lArm);
    const rArm = new THREE.Mesh(limbGeo, mainMat); rArm.position.set(0.9, 1.3, 0.3); rArm.castShadow = true; group.add(rArm);
    
    const footGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const lFoot = new THREE.Mesh(footGeo, secMat); lFoot.position.set(-0.4, 0.3, 0.4); lFoot.scale.set(1, 0.7, 1.2); lFoot.castShadow = true; group.add(lFoot);
    const rFoot = new THREE.Mesh(footGeo, secMat); rFoot.position.set(0.4, 0.3, 0.4); rFoot.scale.set(1, 0.7, 1.2); rFoot.castShadow = true; group.add(rFoot);

    return group;
}

// --- LINGKUNGAN 3D ---
function createTree(x, z, scale = 1) {
    const treeGroup = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 2, 8), clayMaterial('#C4A484'));
    trunk.position.y = 1; trunk.castShadow = true; treeGroup.add(trunk);

    const leafMat = clayMaterial('#7CCCA6');
    const leafGeo = new THREE.IcosahedronGeometry(1, 1);
    
    const l1 = new THREE.Mesh(leafGeo, leafMat); l1.position.set(0, 2.2, 0); l1.scale.set(1.2, 1, 1.2); l1.castShadow = true; treeGroup.add(l1);
    const l2 = new THREE.Mesh(leafGeo, leafMat); l2.position.set(0.6, 1.8, 0.5); l2.scale.set(0.8, 0.8, 0.8); l2.castShadow = true; treeGroup.add(l2);
    const l3 = new THREE.Mesh(leafGeo, leafMat); l3.position.set(-0.6, 1.8, -0.5); l3.scale.set(0.8, 0.8, 0.8); l3.castShadow = true; treeGroup.add(l3);

    treeGroup.position.set(x, 0, z);
    treeGroup.scale.set(scale, scale, scale);
    return treeGroup;
}

function createRock(x, z) {
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.5, 0), clayMaterial('#B0B0B0'));
    rock.position.set(x, 0.2, z);
    rock.scale.set(1, 0.7, 1);
    rock.castShadow = true; rock.receiveShadow = true;
    return rock;
}

function createFlower(x, z, color) {
    const group = new THREE.Group();
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.3), clayMaterial('#7CCCA6'));
    stem.position.y = 0.15; group.add(stem);
    const petal = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), clayMaterial(color));
    petal.position.y = 0.3; petal.scale.set(1.5, 0.5, 1.5); group.add(petal);
    group.position.set(x, 0, z);
    return group;
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
