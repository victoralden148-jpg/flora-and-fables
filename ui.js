// --- UI.JS: Game Logic & State Management ---

// Database Karakter (24 Karakter dengan Warna Custom untuk 3D)
const CHARACTERS = [
    { id: 1, name: "Ember Fox", element: "Fire", rarity: 4, type: "cat", color1: "#FF9A9E", color2: "#FFD3B6", lore: "Rubah hangat dari kawah gunung." },
    { id: 2, name: "Tide Turtle", element: "Water", rarity: 3, type: "frog", color1: "#A8E6CF", color2: "#7CCCA6", lore: "Membawa terumbu karang di punggungnya." },
    { id: 3, name: "Spore Sprout", element: "Earth", rarity: 1, type: "bunny", color1: "#E8DCC4", color2: "#D4C4A8", lore: "Jamur kecil yang suka tempat lembab." },
    { id: 4, name: "Gale Sparrow", element: "Air", rarity: 2, type: "bunny", color1: "#E0F7FA", color2: "#B2EBF2", lore: "Terbang sangat cepat meninggalkan debu peri." },
    { id: 5, name: "Lumen Bunny", element: "Light", rarity: 5, type: "bunny", color1: "#FFF9E6", color2: "#FFECB3", lore: "Bulu halusnya bersinar dalam gelap." },
    { id: 6, name: "Umbra Cat", element: "Shadow", rarity: 4, type: "cat", color1: "#4A4A4A", color2: "#333333", lore: "Bisa melebur ke dalam bayangan." },
    // (Duplicate ID 7-24 dengan variasi warna pastel agar tetap 3D tanpa aset luar)
    { id: 7, name: "Pebble Pup", element: "Earth", rarity: 2, type: "cat", color1: "#D4C4A8", color2: "#E8DCC4", lore: "Suka mengunyah batu." },
    { id: 8, name: "Flare Drake", element: "Fire", rarity: 5, type: "frog", color1: "#FF9A9E", color2: "#FFD3B6", lore: "Legenda dari inti bintang." },
    { id: 9, name: "Dew Frog", element: "Water", rarity: 1, type: "frog", color1: "#A8E6CF", color2: "#E0F7FA", lore: "Minum embun pagi." },
    { id: 10, name: "Breeze Bee", element: "Air", rarity: 3, type: "bunny", color1: "#FFECB3", color2: "#FFF9E6", lore: "Penyerbuk pulau melayang." },
    { id: 11, name: "Solar Cub", element: "Light", rarity: 4, type: "cat", color1: "#FFD3B6", color2: "#FFECB3", lore: "Berjemur untuk mengisi daya." },
    { id: 12, name: "Void Bat", element: "Shadow", rarity: 3, type: "frog", color1: "#333333", color2: "#4A4A4A", lore: "Navigasi menggunakan cahaya bintang." },
    { id: 13, name: "Cactus Chick", element: "Earth", rarity: 2, type: "bunny", color1: "#7CCCA6", color2: "#A8E6CF", lore: "Menyimpan air di bulunya." },
    { id: 14, name: "Cinder Snake", element: "Fire", rarity: 3, type: "cat", color1: "#FF9A9E", color2: "#FFD3B6", lore: "Sisiknya hangat disentuh." },
    { id: 15, name: "Aqua Otter", element: "Water", rarity: 4, type: "frog", color1: "#B2EBF2", color2: "#E0F7FA", lore: "Mengoleksi kerang." },
    { id: 16, name: "Cloud Sheep", element: "Air", rarity: 3, type: "bunny", color1: "#FFFFFF", color2: "#E0F7FA", lore: "Bulunya dari awan." },
    { id: 17, name: "Star Mouse", element: "Light", rarity: 2, type: "cat", color1: "#FFF9E6", color2: "#FFECB3", lore: "Mengumpulkan bintang jatuh." },
    { id: 18, name: "Gloom Owl", element: "Shadow", rarity: 4, type: "cat", color1: "#4A4A4A", color2: "#333333", lore: "Suaranya menenangkan." },
    { id: 19, name: "Moss Bear", element: "Earth", rarity: 3, type: "frog", color1: "#7CCCA6", color2: "#A8E6CF", lore: "Tidur puluhan tahun." },
    { id: 20, name: "Magma Mole", element: "Fire", rarity: 2, type: "bunny", color1: "#FF9A9E", color2: "#FFD3B6", lore: "Menggali dengan cakar panas." },
    { id: 21, name: "Coral Crab", element: "Water", rarity: 1, type: "cat", color1: "#FFD3B6", color2: "#FF9A9E", lore: "Cangkangnya mirip karang." },
    { id: 22, name: "Zephyr Lynx", element: "Air", rarity: 5, type: "cat", color1: "#E0F7FA", color2: "#B2EBF2", lore: "Berlari di udara tipis." },
    { id: 23, name: "Aura Deer", element: "Light", rarity: 5, type: "bunny", color1: "#FFF9E6", color2: "#FFECB3", lore: "Tanduknya kristal sihir." },
    { id: 24, name: "Phantom Crow", element: "Shadow", rarity: 4, type: "frog", color1: "#333333", color2: "#4A4A4A", lore: "Membawa pesan terlupakan." }
];

const INGREDIENTS = ["Moonpetal", "Starfruit", "Emberroot", "Dewdrop", "Windleaf"];

// State Game
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
        loadFarmScene(state.farm); // Update 3D Ladang
    }
}

// Setup Navigasi
const navBtns = document.querySelectorAll('.nav-btn');
const views = document.querySelectorAll('.view');

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        navBtns.forEach(b => b.classList.remove('active'));
        views.forEach(v => v.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(btn.dataset.target).classList.add('active');

        // Trigger pemuatan scene 3D yang sesuai
        if (btn.dataset.target === 'view-alchemy') {
            loadAlchemyScene();
            document.querySelector('header').style.display = 'flex';
        } else if (btn.dataset.target === 'view-farm') {
            loadFarmScene(state.farm);
            document.querySelector('header').style.display = 'flex';
        } else {
            clearScene(); // Kosongkan canvas untuk UI Collection
            document.querySelector('header').style.display = 'flex';
        }
    });
});

// --- LOGIKA ALCHEMY ---
let selectedIngredients = [];
const ingContainer = document.getElementById('ingredients-container');
const brewBtn = document.getElementById('brew-btn');

INGREDIENTS.forEach((ing, i) => {
    const btn = document.createElement('button');
    btn.className = 'ing-btn';
    btn.innerHTML = `<span>${ing.substring(0, 4)}</span>`;
    btn.onclick = () => {
        if (selectedIngredients.includes(ing) || selectedIngredients.length >= 3) return;
        selectedIngredients.push(ing);
        btn.classList.add('selected');
        if (selectedIngredients.length === 3) brewBtn.disabled = false;
    };
    ingContainer.appendChild(btn);
});

brewBtn.onclick = () => {
    state.inventory.seeds++;
    selectedIngredients = [];
    brewBtn.disabled = true;
    document.querySelectorAll('.ing-btn').forEach(b => b.classList.remove('selected'));
    
    // Animasi UI
    showModal(`<h2>Berhasil!</h2><p style="margin:20px 0; font-size:1.2rem; color:#7CCCA6;">Benih Ajaib 3D telah dibuat!</p><button class="primary-btn" style="position:relative; margin-top:10px;" onclick="closeModal()">Lanjut</button>`);
    saveGame();
};

// --- LOGIKA FARM (Interaksi via raycast 3D / tombol overlay) ---
// Untuk menjaga UI bersih dan 3D terlihat, kita gunakan event listener di UI tak terlihat
document.getElementById('view-farm').addEventListener('click', (e) => {
    // Kalkulasi klik sederhana berdasarkan layar (untuk demo)
    // Di game nyata, gunakan THREE.Raycaster. Untuk simplifikasi:
    const plots = state.farm;
    let changed = false;

    plots.forEach((plot, i) => {
        if (plot.status === 'empty' && state.inventory.seeds > 0) {
            // Logika auto-plant pada klik pertama
            plot.status = 'planted';
            plot.seedId = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)].id;
            state.inventory.seeds--;
            changed = true;
        } else if (plot.status === 'planted') {
            plot.status = 'watered'; // Ubah ke watered, timer akan mature
            setTimeout(() => {
                plot.status = 'grown';
                saveGame();
            }, 3000);
            changed = true;
        } else if (plot.status === 'grown') {
            // Panen
            state.inventory.fruits.push(plot.seedId);
            plot.status = 'empty';
            plot.seedId = null;
            changed = true;
        }
    });

    if (changed) saveGame();
});

// --- UI COLLECTION & GACHA CARD ---
function renderCollectionUI() {
    const container = document.getElementById('collection-grid');
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
            // Fitur klik untuk melihat karakter dalam 3D di Canvas
            card.onclick = () => {
                show3DCharacter(char);
            };
        }
        container.appendChild(card);
    });
}

// Menampilkan Karakter di Canvas 3D saat Card diklik
function show3DCharacter(char) {
    clearScene();
    // Sembunyikan UI (header) agar karakter terlihat jelas
    document.querySelector('header').style.display = 'none';
    
    const char3D = createCharacter3D(char.type, char.color1, char.color2);
    char3D.position.set(0, 0, 0);
    current3DSceneGroup.add(char3D);
    
    showModal(`
        <h2 style="color:${char.color1}">${char.name}</h2>
        <p style="font-size:0.9rem; margin:15px 0;">Sentuh tombol di bawah untuk menutup.</p>
        <button class="primary-btn" style="position:relative;" onclick="closeModal(); document.querySelector('header').style.display='flex'; loadAlchemyScene();">Kembali</button>
    `);
}

// --- HATCHING FRUIT (Jika buah diklik) ---
// (Dalam demo ini, saat panen langsung diberikan ke inventory, logika hatch bisa ditambahkan)
document.getElementById('fruit-count').addEventListener('click', () => {
    if (state.inventory.fruits.length > 0) {
        const charId = state.inventory.fruits.pop(); // Ambil satu
        if (!state.collection.includes(charId)) {
            state.collection.push(charId);
        }
        
        const char = CHARACTERS.find(c => c.id === charId);
        
        // Animasi Hatch 3D
        clearScene();
        const egg = createCharacter3D('bunny', '#FFFFFF', '#E0F7FA'); // Model telur
        current3DSceneGroup.add(egg);

        showModal(`
            <h2>Menetas!</h2>
            <div style="font-size:4rem; margin:20px 0;" class="animate-bounce">🥚</div>
            <div id="hatch-result" class="hidden">
                <h3 style="color:${char.color1}">${char.name}</h3>
                <p style="font-size:0.8rem;">${char.lore}</p>
            </div>
            <button class="primary-btn" style="position:relative; margin-top:15px;" onclick="closeModal(); loadFarmScene(state.farm)">Koleksi</button>
        `);

        setTimeout(() => {
            document.querySelector('#modal-content h2').innerText = 'Karakter Baru!';
            document.querySelector('.animate-bounce').style.display = 'none';
            document.getElementById('hatch-result').classList.remove('hidden');
            
            // Ganti Model Telur 3D dengan Model Karakter
            clearScene();
            const newChar = createCharacter3D(char.type, char.color1, char.color2);
            current3DSceneGroup.add(newChar);
        }, 2000);

        saveGame();
    }
});

// --- UTILS UI ---
const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');

function showModal(html) {
    modalContent.innerHTML = html;
    modalOverlay.classList.add('show');
}

function closeModal() {
    modalOverlay.classList.remove('show');
}
window.closeModal = closeModal;

function updateUIStats() {
    document.getElementById('seed-count').innerText = `🌱 ${state.inventory.seeds}`;
    document.getElementById('fruit-count').innerText = `🍎 ${state.inventory.fruits.length}`;
}

// --- CHEAT CODE (Klik Logo 5x) ---
let clickTimes = [];
document.getElementById('game-logo').addEventListener('click', () => {
    const now = Date.now();
    clickTimes.push(now);
    clickTimes = clickTimes.filter(t => now - t < 2000); // Reset jika jeda 2 detik

    if (clickTimes.length >= 5) {
        clickTimes = [];
        const code = prompt("Masukkan Dev Code:");
        if (code === "ALCHEMY-GODMODE-24") {
            state.collection = CHARACTERS.map(c => c.id);
            state.inventory.seeds += 10;
            saveGame();
            showModal(`<h2>GOD MODE</h2><p style="margin:20px 0;">Semua 24 Karakter 3D berhasil dibuka!</p><button class="primary-btn" style="position:relative;" onclick="closeModal()">Mantap</button>`);
        }
    }
});

// Inisialisasi Awal
loadAlchemyScene();
updateUIStats();
renderCollectionUI();
