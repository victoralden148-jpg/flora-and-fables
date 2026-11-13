// --- ART2.JS: Scene Management & Animasi ---

let current3DSceneGroup = new THREE.Group();
scene.add(current3DSceneGroup);

// Fungsi untuk membersihkan scene saat pindah tab
function clearScene() {
    while(current3DSceneGroup.children.length > 0){ 
        current3DSceneGroup.remove(current3DSceneGroup.children[0]); 
    }
}

// 1. Scene Alchemy (Kuali Sihir)
function loadAlchemyScene() {
    clearScene();
    
    // Alas Tanah
    const baseGeo = new THREE.CylinderGeometry(4, 4, 0.5, 32);
    const baseMat = matteMaterial('#E8DCC4');
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -1;
    base.receiveShadow = true;
    current3DSceneGroup.add(base);

    // Kuali
    const cauldronGeo = new THREE.SphereGeometry(2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const cauldronMat = new THREE.MeshStandardMaterial({ color: '#4A4A4A', roughness: 0.8, metalness: 0.5 });
    const cauldron = new THREE.Mesh(cauldronGeo, cauldronMat);
    cauldron.rotation.x = Math.PI;
    cauldron.position.y = 0.5;
    cauldron.castShadow = true;
    current3DSceneGroup.add(cauldron);

    // Cairan Ajaib di Kuali
    const liquidGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.2, 32);
    const liquidMat = new THREE.MeshStandardMaterial({ 
        color: '#A8E6CF', 
        emissive: '#A8E6CF', 
        emissiveIntensity: 0.5,
        transparent: true, opacity: 0.8 
    });
    const liquid = new THREE.Mesh(liquidGeo, liquidMat);
    liquid.position.y = 0.8;
    current3DSceneGroup.add(liquid);

    // Gelembung 3D
    for(let i=0; i<5; i++){
        const bGeo = new THREE.SphereGeometry(0.2, 16, 16);
        const bMat = new THREE.MeshStandardMaterial({ color: '#fff', transparent:true, opacity:0.6 });
        const b = new THREE.Mesh(bGeo, bMat);
        b.position.set((Math.random()-0.5)*2, 1, (Math.random()-0.5)*2);
        b.userData.speed = 0.01 + Math.random()*0.02;
        b.userData.resetY = 1;
        current3DSceneGroup.add(b);
    }
}

// 2. Scene Farm (Ladang 3D)
// Parameter: Array state ladang (empty, planted, grown)
function loadFarmScene(farmState) {
    clearScene();
    
    // Pulau Melayang (Dasar)
    const islandGeo = new THREE.CylinderGeometry(5, 3, 1, 32);
    const islandMat = matteMaterial('#A8E6CF'); // Rumput hijau mint
    const island = new THREE.Mesh(islandGeo, islandMat);
    island.position.y = -1;
    island.receiveShadow = true;
    current3DSceneGroup.add(island);

    // Tanah
    const dirtGeo = new THREE.CylinderGeometry(4.5, 4, 0.2, 32);
    const dirtMat = matteMaterial('#E8DCC4');
    const dirt = new THREE.Mesh(dirtGeo, dirtMat);
    dirt.position.y = -0.4;
    dirt.receiveShadow = true;
    current3DSceneGroup.add(dirt);

    // 5 Plot Tanaman
    const positions = [
        [-2, 0, -1.5], [2, 0, -1.5], 
        [-2, 0, 1.5], [2, 0, 1.5], 
        [0, 0, 0] // Tengah
    ];

    farmState.forEach((plot, index) => {
        const pos = positions[index];
        
        // Dasar Pot (Lubang)
        const potGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 16);
        const potMat = matteMaterial('#D4C4A8');
        const pot = new THREE.Mesh(potGeo, potMat);
        pot.position.set(pos[0], 0, pos[2]);
        pot.receiveShadow = true;
        current3DSceneGroup.add(pot);

        if (plot.status === 'planted') {
            // Batang Hijau
            const stemGeo = new THREE.CylinderGeometry(0.1, 0.15, 0.8, 8);
            const stem = new THREE.Mesh(stemGeo, matteMaterial('#7CCCA6'));
            stem.position.set(pos[0], 0.4, pos[2]);
            stem.castShadow = true;
            current3DSceneGroup.add(stem);
        } else if (plot.status === 'grown') {
            // Pohon/Pohon Besar + Buah
            const treeGeo = new THREE.SphereGeometry(0.8, 16, 16);
            const treeMat = matteMaterial('#FFD3B6'); // Warna peach
            const tree = new THREE.Mesh(treeGeo, treeMat);
            tree.position.set(pos[0], 1, pos[2]);
            tree.castShadow = true;
            current3DSceneGroup.add(tree);

            const fruitGeo = new THREE.SphereGeometry(0.2, 16, 16);
            const fruitMat = new THREE.MeshStandardMaterial({ color: '#FF9A9E', roughness: 0.2 });
            const fruit = new THREE.Mesh(fruitGeo, fruitMat);
            fruit.position.set(pos[0] + 0.5, 1.2, pos[2] + 0.5);
            current3DSceneGroup.add(fruit);
        }
    });
}

// Render Loop
let clock = new THREE.Clock();
function renderLoop() {
    requestAnimationFrame(renderLoop);
    const time = Date.now();

    // Animasi Gelembung kuali
    current3DSceneGroup.children.forEach(child => {
        if (child.geometry && child.geometry.type === 'SphereGeometry' && child.position.y < 3 && child.userData.speed) {
            child.position.y += child.userData.speed;
            child.scale.multiplyScalar(1.01);
            if (child.position.y > 2.5) {
                child.position.y = child.userData.resetY;
                child.scale.set(1,1,1);
            }
        }
    });

    // Rotasi kamera lambat (Opsional, buat estetik)
    // camera.position.x = 10 * Math.sin(time * 0.0005);
    // camera.position.z = 10 * Math.cos(time * 0.0005);
    // camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
}
renderLoop();
