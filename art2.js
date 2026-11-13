// --- ART2.JS: Scene Management & Render Loop ---

let current3DSceneGroup = new THREE.Group();
scene.add(current3DSceneGroup);

function clearScene() {
    while(current3DSceneGroup.children.length > 0){ 
        current3DSceneGroup.remove(current3DSceneGroup.children[0]); 
    }
}

function buildBaseIsland(radius) {
    // Rumput Atas
    const grass = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius - 0.5, 1, 32), clayMaterial('#A8E6CF'));
    grass.position.y = -0.5; grass.receiveShadow = true; current3DSceneGroup.add(grass);

    // Tanah Bawah
    const dirt = new THREE.Mesh(new THREE.CylinderGeometry(radius - 0.5, radius - 2, 2, 32), clayMaterial('#D4C4A8'));
    dirt.position.y = -2; dirt.castShadow = true; dirt.receiveShadow = true; current3DSceneGroup.add(dirt);

    // Pohon-pohon di sekeliling
    current3DSceneGroup.add(createTree(-radius + 1.5, -radius + 1.5, 1.2));
    current3DSceneGroup.add(createTree(radius - 1.5, -radius + 2, 1));
    current3DSceneGroup.add(createTree(radius - 2, radius - 1.5, 0.9));
    current3DSceneGroup.add(createTree(-radius + 2, radius - 2, 1.1)); // Tambahan pohon
    
    current3DSceneGroup.add(createRock(-radius + 2, radius - 3));
    current3DSceneGroup.add(createRock(radius - 1, -1));
    
    for(let i=0; i<20; i++) {
        const x = (Math.random() - 0.5) * (radius * 1.5);
        const z = (Math.random() - 0.5) * (radius * 1.5);
        const colors = ['#FFD3B6', '#FF9A9E', '#FFFFFF'];
        current3DSceneGroup.add(createFlower(x, z, colors[i%3]));
    }
}

function loadAlchemyScene() {
    clearScene();
    buildBaseIsland(6);

    // Kuali (Warna abu-abu gelap, BUKAN hitam, agar tidak kontras)
    const cauldronMat = new THREE.MeshStandardMaterial({ color: '#666666', roughness: 0.7, metalness: 0.2 });
    const cauldron = new THREE.Mesh(new THREE.SphereGeometry(2.2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.8), cauldronMat);
    cauldron.rotation.x = Math.PI; cauldron.position.y = 1.6; cauldron.castShadow = true; cauldron.receiveShadow = true;
    current3DSceneGroup.add(cauldron);

    // Cairan Ajaib (Neon Mint)
    const liquidMat = new THREE.MeshStandardMaterial({ color: '#A8E6CF', emissive: '#A8E6CF', emissiveIntensity: 0.6, transparent: true, opacity: 0.9 });
    const liquid = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 0.2, 32), liquidMat);
    liquid.position.y = 1.8;
    current3DSceneGroup.add(liquid);

    // Gelembung
    for(let i=0; i<6; i++){
        const b = new THREE.Mesh(new THREE.SphereGeometry(0.15 + Math.random()*0.1, 16, 16), new THREE.MeshStandardMaterial({ color: '#fff', transparent:true, opacity:0.8 }));
        b.position.set((Math.random()-0.5)*2.5, 1.9, (Math.random()-0.5)*2.5);
        b.userData.speed = 0.02 + Math.random()*0.02;
        b.userData.resetY = 1.9;
        current3DSceneGroup.add(b);
    }
}

function loadFarmScene(farmState) {
    clearScene();
    buildBaseIsland(7);

    const positions = [
        [-2.5, 0, -2.5], [2.5, 0, -2.5], 
        [-2.5, 0, 2.5], [2.5, 0, 2.5], 
        [0, 0, 0]
    ];

    farmState.forEach((plot, index) => {
        const pos = positions[index];
        
        const pot = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.2, 16), clayMaterial('#C4A484'));
        pot.position.set(pos[0], 0.1, pos[2]); pot.receiveShadow = true;
        current3DSceneGroup.add(pot);

        if (plot.status === 'planted') {
            const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.6, 8), clayMaterial('#7CCCA6'));
            stem.position.set(pos[0], 0.5, pos[2]); stem.castShadow = true; current3DSceneGroup.add(stem);
            const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), clayMaterial('#A8E6CF'));
            leaf.position.set(pos[0] + 0.1, 0.7, pos[2]); leaf.scale.set(1, 0.5, 1); current3DSceneGroup.add(leaf);
        } else if (plot.status === 'grown') {
            const tree = createTree(pos[0], pos[2], 0.6);
            const fruit = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), clayMaterial('#FF9A9E'));
            fruit.position.set(0, 1.2, 0.8); fruit.castShadow = true; tree.add(fruit);
            current3DSceneGroup.add(tree);
        }
    });
}

function renderLoop() {
    requestAnimationFrame(renderLoop);
    current3DSceneGroup.children.forEach(child => {
        if (child.geometry && child.geometry.type === 'SphereGeometry' && child.userData.speed) {
            child.position.y += child.userData.speed;
            child.scale.multiplyScalar(1.005);
            if (child.position.y > 4) {
                child.position.y = child.userData.resetY;
                child.scale.set(1,1,1);
            }
        }
    });
    renderer.render(scene, camera);
}
renderLoop();
