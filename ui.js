// --- UI.JS: Game Logic, Sound & State ---

// --- WEB AUDIO API (Suara Tanpa File Luar) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);

    if (type === 'click') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'success') {
        osc.type = 'triangle'; osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.setValueAtTime(600, audioCtx.currentTime + 0.1);
        osc.frequency.setValueAtTime(800, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.4);
        osc.start(); osc.stop(audioCtx.currentTime + 0.4);
    }
}

const CHARACTERS = [
    { id: 1, name: "Ember Fox", element: "Api", rarity: 4, type: "cat", color1: "#FF9A9E", color2: "#FFD3B6", lore: "Rubah hangat dari kawah gunung." },
    { id: 2, name: "Tide Turtle", element: "Air", rarity: 3, type: "frog", color1: "#A8E6CF", color2: "#7CCCA6", lore: "Membawa terumbu karang di punggungnya." },
    { id: 3, name: "Spore Sprout", element: "Tanah", rarity: 1, type: "bunny", color1: "#E8DCC4", color2: "#D4C4A8", lore: "Jamur kecil yang suka tempat lembab." },
    { id: 4, name: "Gale Sparrow", element: "Angin", rarity: 2, type: "bunny", color1: "#E0F7FA", color2: "#B2EBF2", lore: "Terbang sangat cepat meninggalkan debu peri." },
    { id: 5, name: "Lumen Bunny", element: "Cahaya", rarity: 5, type: "bunny", color1: "#FFF9E6", color2: "#FFECB3", lore: "Bulu halusnya bersinar dalam gelap." },
    { id: 6, name: "Umbra Cat", element: "Bayangan", rarity: 4, type: "cat", color1: "#4A4A4A", color2: "#333333", lore: "Bisa melebur ke dalam bayangan." },
    // (Karakter 7-24 disembunyikan untuk menghemat tempat, Anda bisa menambahkannya kembali persis seperti sebelumnya)
];

const INGREDIENTS = ["Bulan", "Bintang", "Semak", "Dewd", "Angin"]; // Teks tanpa emoji

let state = JSON.parse(localStorage.getItem('floraFables3D')) || {
    inventory: { seeds: 0, fruits: [] },
    farm: Array(5).fill().map(() => ({ status: 'empty', seedId: null })),
    collection: []
};

function saveGame() {
    localStorage.setItem('floraFables3D', JSON.stringify(state));
    updateUIStats();
    renderCollectionUI();
    if(document.getElementById('view-farm').classList.contains('active')){
        loadFarmScene(state.farm);
    }
}

// Navigasi
const navBtns = document.querySelectorAll('.nav-btn');
const views = document.querySelectorAll('.view');

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        playSound('click');
        navBtns.forEach(b => b.classList.remove('active'));
        views.forEach(v => v.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(btn.dataset.target).classList.add('active');

        if (btn.dataset.target === 'view-alchemy') {
            loadAlchemyScene();
        } else if (btn.dataset.target === 'view-farm') {
            loadFarmScene(state.farm);
        } else {
            clearScene(); // Sembunyikan 3D untuk UI Collection
        }
    });
});

// --- ALCHEMY LOGIC ---
let selectedIngredients = [];
const ingContainer = document.getElementById('ingredients-container');
const brewBtn = document.getElementById('brew-btn');

INGREDIENTS.forEach((ing, i) => {
    const btn = document.createElement('button');
    btn.className = 'ing-btn';
    btn.innerText = ing;
    btn.onclick = () => {
        if (selectedIngredients.includes(ing) || selectedIngredients.length >= 3) return;
        playSound('click');
        selectedIngredients.push(ing);
        btn.classList.add('selected');
        if (selectedIngredients.length === 3) brewBtn.disabled = false;
    };
    ingContainer.appendChild(btn);
});

brewBtn.onclick = () => {
    playSound('success');
    state.inventory.seeds++;
    selectedIngredients = [];
    brewBtn.disabled = true;
    document.querySelectorAll('.ing-btn').forEach(b => b.classList.remove('selected'));
    
    showModal(`<h2>Berhasil!</h2><p style="margin:20px 0; font-size:1.1rem; color:#7CCCA6; font-weight:bold;">Benih 3D telah dibuat!</p><button class="primary-btn" style="position:relative; margin-top:10px;" onclick="closeModal()">Ambil</button>`);
    saveGame();
};

// --- FARM LOGIC (Menggunakan HTML Click Zones) ---
document.querySelectorAll('.plot-zone').forEach(zone => {
    zone.onclick = () => {
        const index = parseInt(zone.dataset.index);
        const plot = state.farm[index];

        if (plot.status === 'empty' && state.inventory.seeds > 0) {
            playSound('click');
            plot.status = 'planted';
            plot.seedId = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)].id;
            state.inventory.seeds--;
            saveGame();
        } else if (plot.status === 'planted') {
            playSound('success');
            plot.status = 'watered';
            saveGame();
            setTimeout(() => {
                if(plot.status === 'watered') {
                    plot.status = 'grown';
                    saveGame();
                }
            }, 3000);
        } else if (plot.status === 'grown') {
            playSound('success');
            state.inventory.fruits.push(plot.seedId);
            plot.status = 'empty';
            plot.seedId = null;
            saveGame();
        }
    };
});

// --- UI COLLECTION ---
function renderCollectionUI() {
    const container = document.getElementById('collection-grid');
    if(!container) return;
    container.innerHTML = '';

    CHARACTERS.forEach(char => {
        const isUnlocked = state.collection.includes(char.id);
        const card = document.createElement('div');
        card.className = `gacha-card ${isUnlocked ? 'unlocked' : 'locked'}`;
        
        card.innerHTML = `
            <div class="rarity">${'★'.repeat(char.rarity)}</div>
            <div class="name">${isUnlocked ? char.name : '???'}</div>
            <div class="element" style="background:${char.color1}">${isUnlocked ? char.element : '???'}</div>
            ${isUnlocked ? `<div class="lore">"${char.lore}"</div>` : ''}
        `;
        
        if (isUnlocked) {
            card.onclick = () => { playSound('click'); show3DCharacter(char); };
        }
        container.appendChild(card);
    });
}

function show3DCharacter(char) {
    clearScene();
    document.querySelector('header').style.display = 'none';
    
    const char3D = createCharacter3D(char.type, char.color1, char.color2);
    char3D.position.set(0, 0, 0);
    current3DSceneGroup.add(char3D);
    
    showModal(`
        <h2 style="color:${char.color1}">${char.name}</h2>
        <p style="font-size:0.9rem; margin:15px 0;">${char.lore}</p>
        <button class="primary-btn" style="position:relative;" onclick="closeModal(); document.querySelector('header').style.display='flex'; loadAlchemyScene();">Kembali</button>
    `);
}

// --- HATCHING FRUIT ---
document.getElementById('fruit-count').parentElement.addEventListener('click', () => {
    if (state.inventory.fruits.length > 0) {
        playSound('success');
        const charId = state.inventory.fruits.pop();
        if (!state.collection.includes(charId)) state.collection.push(charId);
        
        const char = CHARACTERS.find(c => c.id === charId);
        clearScene();
        const egg = createCharacter3D('bunny', '#FFFFFF', '#E0F7FA'); // Model telur
        current3DSceneGroup.add(egg);

        showModal(`
            <h2>Menetas!</h2>
            <div style="font-size:4rem; margin:20px 0; animation: bounce 1s infinite;">🥚</div>
            <div id="hatch-result" class="hidden">
                <h3 style="color:${char.color1}">${char.name}</h3>
                <p style="font-size:0.8rem;">${char.lore}</p>
            </div>
            <button class="primary-btn" style="position:relative; margin-top:15px;" onclick="closeModal(); loadFarmScene(state.farm)">Koleksi</button>
        `);

        setTimeout(() => {
            document.querySelector('#modal-content h2').innerText = 'Karakter Baru!';
            document.querySelector('#modal-content div').style.display = 'none';
            document.getElementById('hatch-result').classList.remove('hidden');
            
            clearScene();
            const newChar = createCharacter3D(char.type, char.color1, char.color2);
            current3DSceneGroup.add(newChar);
        }, 2000);
        saveGame();
    }
});

// --- UTILS & MODAL ---
const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');

function showModal(html) { modalContent.innerHTML = html; modalOverlay.classList.add('show'); }
function closeModal() { modalOverlay.classList.remove('show'); }
window.closeModal = closeModal;

function updateUIStats() {
    document.getElementById('seed-count').innerText = state.inventory.seeds;
    document.getElementById('fruit-count').innerText = state.inventory.fruits.length;
}

// --- CHEAT CODE ---
let clickTimes = [];
document.getElementById('game-logo').addEventListener('click', () => {
    const now = Date.now();
    clickTimes.push(now);
    clickTimes = clickTimes.filter(t => now - t < 2000);
    if (clickTimes.length >= 5) {
        clickTimes = [];
        const code = prompt("Masukkan Dev Code:");
        if (code === "ALCHEMY-GODMODE-24") {
            playSound('success');
            state.collection = CHARACTERS.map(c => c.id);
            state.inventory.seeds += 10;
            saveGame();
            showModal(`<h2>GOD MODE</h2><p style="margin:20px 0;">Semua Karakter dibuka!</p><button class="primary-btn" style="position:relative;" onclick="closeModal()">Mantap</button>`);
        }
    }
});

// Inisialisasi
loadAlchemyScene();
updateUIStats();
renderCollectionUI();
