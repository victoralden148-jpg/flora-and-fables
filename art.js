const canvas = document.getElementById('game-canvas');
const scene = new THREE.Scene();
// Background transparan, biarkan CSS yang mengatur langit biru
scene.background = null; 

const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 16; 
// Gunakan Perspective Camera agar terlihat seperti Diorama 3D (seperti referensi)
const camera = new THREE.PerspectiveCamera(35, aspect, 0.1, 100);
camera.position.set(15, 15, 15);
camera.lookAt(0, -1, 0);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// === KUNCI AGAR WARNA TIDAK PUTIH MENYILAUKAN ===
renderer.outputEncoding = THREE.sRGBEncoding; 
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

// === LIGHTING (Sangat Lembut, ala Studio Foto Diorama) ===
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); 
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xfff5e6, 1.2); // Cahaya matahari hangat
dirLight.position.set(10, 20, 10);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
dirLight.shadow.camera.left = -15;
dirLight.shadow.camera.right = 15;
dirLight.shadow.camera.top = 15;
dirLight.shadow.camera.bottom = -15;
scene.add(dirLight);

// Material Vinyl/Toy (Kilau seperti karakter di gambar referensi)
const toyMaterial = (color) => new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.3, // 0.3 Membuatnya berkilau sedikit seperti plastik
    metalness: 0.1, 
});

function createCharacter3D(type, color1, color2) {
    const group = new THREE.Group();
    const mainMat = toyMaterial(color1);
    const secMat = toyMaterial(color2);
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1 });
    const pinkMat = new THREE.MeshStandardMaterial({ color: 0xFF9A9E, roughness: 0.4 });

    const body = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), mainMat);
    body.scale.set(1, 1.1, 0.9); body.position.y = 1.1; body.castShadow = true; group.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.85, 32, 32), mainMat);
    head.position.y = 2.3; head.castShadow = true; group.add(head);

    const eyeGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const lEye = new THREE.Mesh(eyeGeo, blackMat); lEye.position.set(-0.3, 2.4, 0.75); group.add(lEye);
    const rEye = new THREE.Mesh(eyeGeo, blackMat); rEye.position.set(0.3, 2.4, 0.75); group.add(rEye);

    const blushGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const lBlush = new THREE.Mesh(blushGeo, pinkMat); lBlush.position.set(-0.5, 2.25, 0.7); lBlush.scale.set(1.5, 0.8, 0.5); group.add(lBlush);
    const rBlush = new THREE.Mesh(blushGeo, pinkMat); rBlush.position.set(0.5, 2.25, 0.7); rBlush.scale.set(1.5, 0.8, 0.5); group.add(rBlush);

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

    const limbGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const lArm = new THREE.Mesh(limbGeo, mainMat); lArm.position.set(-0.9, 1.3, 0.3); lArm.castShadow = true; group.add(lArm);
    const rArm = new THREE.Mesh(limbGeo, mainMat); rArm.position.set(0.9, 1.3, 0.3); rArm.castShadow = true; group.add(rArm);
    
    const footGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const lFoot = new THREE.Mesh(footGeo, secMat); lFoot.position.set(-0.4, 0.3, 0.4); lFoot.scale.set(1, 0.7, 1.2); lFoot.castShadow = true; group.add(lFoot);
    const rFoot = new THREE.Mesh(footGeo, secMat); rFoot.position.set(0.4, 0.3, 0.4); rFoot.scale.set(1, 0.7, 1.2); rFoot.castShadow = true; group.add(rFoot);

    return group;
}

// Pohon Diorama (Rimbun dan berkilau)
function createTree(x, z, scale = 1) {
    const treeGroup = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 2, 8), toyMaterial('#C4A484'));
    trunk.position.y = 1; trunk.castShadow = true; treeGroup.add(trunk);

    const leafMat = toyMaterial('#7CCCA6');
    const leafGeo = new THREE.IcosahedronGeometry(1, 1);
    
    const l1 = new THREE.Mesh(leafGeo, leafMat); l1.position.set(0, 2.2, 0); l1.scale.set(1.2, 1, 1.2); l1.castShadow = true; treeGroup.add(l1);
    const l2 = new THREE.Mesh(leafGeo, leafMat); l2.position.set(0.6, 1.8, 0.5); l2.scale.set(0.8, 0.8, 0.8); l2.castShadow = true; treeGroup.add(l2);
    const l3 = new THREE.Mesh(leafGeo, leafMat); l3.position.set(-0.6, 1.8, -0.5); l3.scale.set(0.8, 0.8, 0.8); l3.castShadow = true; treeGroup.add(l3);

    treeGroup.position.set(x, 0, z);
    treeGroup.scale.set(scale, scale, scale);
    return treeGroup;
}

function createRock(x, z) {
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.5, 0), toyMaterial('#B0B0B0'));
    rock.position.set(x, 0.2, z); rock.scale.set(1, 0.7, 1); rock.castShadow = true;
    return rock;
}

function createFlower(x, z, color) {
    const group = new THREE.Group();
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.3), toyMaterial('#7CCCA6'));
    stem.position.y = 0.15; group.add(stem);
    const petal = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), toyMaterial(color));
    petal.position.y = 0.3; petal.scale.set(1.5, 0.5, 1.5); group.add(petal);
    group.position.set(x, 0, z);
    return group;
}

window.addEventListener('resize', () => {
    const aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
