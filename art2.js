let current3DSceneGroup = new THREE.Group();
scene.add(current3DSceneGroup);

function clearScene() {
    while(current3DSceneGroup.children.length > 0){ 
        current3DSceneGroup.remove(current3DSceneGroup.children[0]); 
    }
}

// Membuat Pulau Melayang yang Tebal (Rumput, Tanah, Batu)
function buildBaseIsland(radius) {
    // 1. Rumput Atas (Hijau Cerah)
    const grass = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius - 0.5, 1, 32), toyMaterial('#7CCCA6'));
    grass.position.y = -0.5; grass.receiveShadow = true; current3DSceneGroup.add(grass);

    // 2. Tanah Coklat
    const dirt = new THREE.Mesh(new THREE.CylinderGeometry(radius - 0.5, radius - 1.5, 1.5, 32), toyMaterial('#D4C4A8'));
    dirt.position.y = -1.75; dirt.castShadow = true; current3DSceneGroup.add(dirt);

    // 3. Batu Bawah (Mengerucut ke bawah)
    const rockBase = new THREE.Mesh(new THREE.CylinderGeometry(radius - 1.5, 0.5, 3, 32), toyMaterial('#A0A0A0'));
    rockBase.position.y = -4; rockBase.castShadow = true; current3DSceneGroup.add(rockBase);

    // Dekorasi Pohon & Bunga di pinggir
    current3DSceneGroup.add(createTree(-radius + 1.5, -radius + 1.5, 1.2));
    current3DSceneGroup.add(createTree(radius - 1.5, -radius + 2, 1));
    current3DSceneGroup.add(createTree(radius - 2, radius - 1.5, 0.9));
    current3DSceneGroup.add(createTree(-radius + 2, radius - 2, 1.1));
    
    current3DSceneGroup.add(createRock(-radius + 2, radius - 3));
    current3DSceneGroup.add(createRock(radius - 1, -1));
    
    for(let i=0; i<20; i++) {
        const x = (Math.random() - 0.5) * (radius * 1.5);
        const z = (Math.random() - 0.5) * (radius * 1.5);
        const colors = ['#FFD3B6', '#FF9A9E', '#FFFFFF'];
        current3DSceneGroup.add(createFlower(x, z, colors[i%3]));
    }
    
    // Tambahkan Awan 3D di bawah pulau (seperti referensi)
    const cloudMat = new THREE.MeshStandardMaterial({color: 0xffffff, roughness: 1});
    for(let j=0; j<8; j++){
        const cloudGroup = new THREE.Group();
        for(let k=0; k<4; k++){
            const puff = new THREE.Mesh(new THREE.SphereGeometry(1 + Math.random(), 8, 8), cloudMat);
            puff.position.set((Math.random()-0.5)*2, (Math.random()-0.5), (Math.random()-0.5)*2);
            cloudGroup.add(puff);
        }
        // Posisi awan melayang di bawah pulau
        cloudGroup.position.set((Math.random()-0.5)*25, -8 - Math.random()*5, (Math.random()-0.5)*25);
        current3DSceneGroup.add(cloudGroup);
    }
}

function loadAlchemyScene() {
    clearScene();
    buildBaseIsland(6);

    // Kuali
    const cauldronMat = toyMaterial('#666666');
    const cauldron = new THREE.Mesh(new THREE.SphereGeometry(2.2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.8), cauldronMat);
    cauldron.rotation.x = Math.PI; cauldron.position.y = 1.6; cauldron.castShadow = true;
    current3DSceneGroup.add(cauldron);

    // Cairan
    const liquidMat = new THREE.MeshStandardMaterial({ color: '#A8E6CF', transparent: true, opacity: 0.9 });
    const liquid = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 0.2, 32), liquidMat);
    liquid.position.y = 1.8;
    current3DSceneGroup.add(liquid);

    for(let i=0; i<6; i++){
        const b = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), new THREE.MeshStandardMaterial({ color: '#fff', transparent:true }));
        b.position.set((Math.random()-0.5)*2.5, 1.9, (Math.random()-0.5)*2.5);
        b.userData.speed = 0.02;
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
        
        const pot = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.3, 16), toyMaterial('#8B5A2B')); // Coklat tua
        pot.position.set(pos[0], 0.15, pos[2]); pot.receiveShadow = true;
        current3DSceneGroup.add(pot);

        if (plot.status === 'planted') {
            const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.6, 8), toyMaterial('#7CCCA6'));
            stem.position.set(pos[0], 0.6, pos[2]); stem.castShadow = true;
            current3DSceneGroup.add(stem);
        } else if (plot.status === 'grown') {
            const tree = createTree(pos[0], pos[2], 0.6);
            const fruit = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), toyMaterial('#FF9A9E'));
            fruit.position.set(0, 1.2, 0.8); fruit.castShadow = true;
            tree.add(fruit);
            current3DSceneGroup.add(tree);
        }
    });
}

function renderLoop() {
    requestAnimationFrame(renderLoop);
    // Animasi melayang untuk awan/pulau bisa ditambahkan di sini
    current3DSceneGroup.children.forEach(child => {
        if (child.geometry && child.geometry.type === 'SphereGeometry' && child.userData.speed) {
            child.position.y += child.userData.speed;
            if (child.position.y > 4) child.position.y = child.userData.resetY;
        }
    });
    renderer.render(scene, camera);
}
renderLoop();
