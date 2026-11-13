const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = 'sine'; osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    osc.start(); osc.stop(audioCtx.currentTime + 0.1);
}

const CHARACTERS = [
    { id: 1, name: "Ember Fox", element: "Api", rarity: 4, type: "cat", color1: "#FF9A9E", color2: "#FFD3B6" },
    { id: 2, name: "Tide Turtle", element: "Air", rarity: 3, type: "frog", color1: "#A8E6CF", color2: "#7CCCA6" },
    { id: 3, name: "Spore Sprout", element: "Tanah", rarity: 1, type: "bunny", color1: "#E8DCC4", color2: "#D4C4A8" },
    { id: 4, name: "Gale Sparrow", element: "Angin", rarity: 2, type: "bunny", color1: "#E0F7FA", color2: "#B2EBF2" },
    { id: 5, name: "Lumen Bunny", element: "Cahaya", rarity: 5, type: "bunny", color1: "#FFF9E6", color2: "#FFECB3" }
];

const INGREDIENTS = ["Bulan", "Bintang", "Semak", "Dewd", "Angin"]; 

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

const navBtns = document.querySelectorAll('.nav-btn');
const views = document.querySelectorAll('.view');

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        playSound();
        navBtns.forEach(b => b.classList.remove('active'));
        views.forEach(v => v.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(btn.dataset.target).classList.add('active');

        if (btn.dataset.target === 'view-alchemy') loadAlchemyScene();
        else if (btn.dataset.target === 'view-farm') loadFarmScene(state.farm);
        else clearScene();
    });
});

let selectedIngredients = [];
const ingContainer = document.getElementById('ingredients-container');
const brewBtn = document.getElementById('brew-btn');

INGREDIENTS.forEach((ing) => {
    const btn = document.createElement('button');
    btn.className = 'ing-btn';
    btn.innerText = ing;
    btn.onclick = () => {
        if (selectedIngredients.includes(ing) || selectedIngredients.length >= 3) return;
        playSound();
        selectedIngredients.push(ing);
        btn.classList.add('selected');
        if (selectedIngredients.length === 3) brewBtn.disabled = false;
    };
    ingContainer.appendChild(btn);
});

brewBtn.onclick = () => {
    playSound();
    state.inventory.seeds++;
    selectedIngredients = [];
    brewBtn.disabled = true;
    document.querySelectorAll('.ing-btn').forEach(b => b.classList.remove('selected'));
    showModal(`<h2>Berhasil!</h2><p style="margin:20px 0; font-weight:bold;">Benih telah dibuat!</p><button class="primary-btn" style="position:relative; margin-top:10px;" onclick="closeModal()">Ambil</button>`);
    saveGame();
};

document.querySelectorAll('.plot-zone').forEach(zone => {
    zone.onclick = () => {
        const index = parseInt(zone.dataset.index);
        const plot = state.farm[index];

        if (plot.status === 'empty' && state.inventory.seeds > 0) {
            playSound();
            plot.status = 'planted';
            plot.seedId = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)].id;
            state.inventory.seeds--;
            saveGame();
        } else if (plot.status === 'planted') {
            playSound();
            plot.status = 'watered';
            saveGame();
            setTimeout(() => {
                if(plot.status === 'watered') {
                    plot.status = 'grown';
                    saveGame();
                }
            }, 3000);
        } else if (plot.status === 'grown') {
            playSound();
            state.inventory.fruits.push(plot.seedId);
            plot.status = 'empty';
            plot.seedId = null;
            saveGame();
        }
    };
});

function renderCollectionUI() {
    const container = document.getElementById('collection-grid');
    if(!container) return;
    container.innerHTML = '';

    CHARACTERS.forEach(char => {
        const isUnlocked = state.collection.includes(char.id);
        const card = document.createElement('div');
        card.className = `gacha-card ${isUnlocked ? 'unlocked' : 'locked'}`;
        
        card.innerHTML = `
            <div class="name">${isUnlocked ? char.name : '???'}</div>
            <div class="element" style="background:${char.color1}">${isUnlocked ? char.element : '???'}</div>
        `;
        
        if (isUnlocked) card.onclick = () => { playSound(); show3DCharacter(char); };
        container.appendChild(card);
    });
}

function show3DCharacter(char) {
    clearScene();
    document.querySelector('header').style.display = 'none';
    current3DSceneGroup.add(createCharacter3D(char.type, char.color1, char.color2));
    
    showModal(`
        <h2 style="color:${char.color1}">${char.name}</h2>
        <button class="primary-btn" style="position:relative; margin-top:15px;" onclick="closeModal(); document.querySelector('header').style.display='flex'; loadAlchemyScene();">Kembali</button>
    `);
}

document.getElementById('fruit-count').parentElement.addEventListener('click', () => {
    if (state.inventory.fruits.length > 0) {
        playSound();
        const charId = state.inventory.fruits.pop();
        if (!state.collection.includes(charId)) state.collection.push(charId);
        
        const char = CHARACTERS.find(c => c.id === charId);
        clearScene();
        current3DSceneGroup.add(createCharacter3D('bunny', '#FFFFFF', '#E0F7FA'));

        showModal(`
            <h2>Menetas!</h2>
            <div id="hatch-result" class="hidden">
                <h3 style="color:${char.color1}">${char.name}</h3>
            </div>
            <button class="primary-btn" style="position:relative; margin-top:15px;" onclick="closeModal(); loadFarmScene(state.farm)">Koleksi</button>
        `);

        setTimeout(() => {
            document.querySelector('#modal-content h2').innerText = 'Karakter Baru!';
            document.getElementById('hatch-result').classList.remove('hidden');
            clearScene();
            current3DSceneGroup.add(createCharacter3D(char.type, char.color1, char.color2));
        }, 1500);
        saveGame();
    }
});

const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');
function showModal(html) { modalContent.innerHTML = html; modalOverlay.classList.add('show'); }
function closeModal() { modalOverlay.classList.remove('show'); }
window.closeModal = closeModal;

function updateUIStats() {
    document.getElementById('seed-count').innerText = state.inventory.seeds;
    document.getElementById('fruit-count').innerText = state.inventory.fruits.length;
}

let clickTimes = [];
document.getElementById('game-logo').addEventListener('click', () => {
    const now = Date.now();
    clickTimes.push(now);
    clickTimes = clickTimes.filter(t => now - t < 2000);
    if (clickTimes.length >= 5) {
        clickTimes = [];
        const code = prompt("Dev Code:");
        if (code === "ALCHEMY-GODMODE-24") {
            playSound();
            state.collection = CHARACTERS.map(c => c.id);
            state.inventory.seeds += 10;
            saveGame();
        }
    }
});

// Inisialisasi
loadAlchemyScene();
updateUIStats();
renderCollectionUI();
