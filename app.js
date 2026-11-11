/* Flora & Fables - game logic (vanilla JS, localStorage) */
'use strict';

const KEY = 'floraFables_v1';
const GROW_MS = 10000;       // demo growth time (10s). Set to 0 for instant growth.
const EVOLVE_AT = 3;         // hatches needed to reach adult form
const DEV_CODE = 'ALCHEMY-GODMODE-24';

/* ---------- Data ---------- */
const INGREDIENTS = [['🍓', 'Berry'], ['💧', 'Dew'], ['🍄', 'Spore'], ['❄️', 'Frost'], ['🌸', 'Bloom'], ['🌙', 'Moon']];
const ELEMENTS = { Fire: ['🔥', '#ffb59a'], Water: ['💧', '#a8d8f0'], Nature: ['🌿', '#b8e8c8'], Ice: ['❄️', '#c9e9f5'], Light: ['✨', '#fff0a8'], Shadow: ['🌙', '#cdb8f0'] };

// [name, element, rarity, biome, baby emoji, adult emoji, lore]
const CHARACTERS = [
  ['Cinderkit', 'Fire', 3, 'Meadow', '🐱', '🦊', 'Born from a warm hearth stone, it purrs sparks.'],
  ['Honeybub', 'Light', 3, 'Meadow', '🐝', '🦚', 'Its hum makes flowers bloom a day early.'],
  ['Pebblepaw', 'Nature', 3, 'Meadow', '🐹', '🦫', 'Carries one lucky pebble in each cheek.'],
  ['Bloomhop', 'Nature', 3, 'Meadow', '🐰', '🦌', 'Wherever it hops, clover follows.'],
  ['Tidepip', 'Water', 3, 'Coral Reef', '🐠', '🦈', 'Tiny but brave, it guards the shallows.'],
  ['Corallow', 'Water', 4, 'Coral Reef', '🐚', '🐙', 'Its shell sings the sea back to sleep.'],
  ['Shellbo', 'Water', 3, 'Coral Reef', '🐢', '🐊', 'Slow and wise, it remembers every tide.'],
  ['Spritz', 'Water', 4, 'Coral Reef', '🦐', '🦞', 'Sprays rainbows when it is happy.'],
  ['Sporekin', 'Nature', 3, 'Whisper Forest', '🍄', '🐗', 'Sleeps under mushroom caps and dreams of rain.'],
  ['Mossling', 'Nature', 4, 'Whisper Forest', '🐸', '🦎', 'Its back grows a tiny garden.'],
  ['Owlette', 'Light', 4, 'Whisper Forest', '🐥', '🦉', 'Hoots lullabies at dusk.'],
  ['Thornlet', 'Nature', 5, 'Whisper Forest', '🌱', '🦖', 'A legendary sprout, guardian of the oldest tree.'],
  ['Frostpup', 'Ice', 3, 'Frost Hollow', '🐧', '🐻‍❄️', 'Slides on its belly everywhere it goes.'],
  ['Snowpuff', 'Ice', 4, 'Frost Hollow', '🐑', '🦬', 'A walking snow cloud, soft as a sigh.'],
  ['Icicub', 'Ice', 4, 'Frost Hollow', '🐕', '🐺', 'Howls make icicles chime.'],
  ['Aurorin', 'Ice', 5, 'Frost Hollow', '❄️', '🦄', 'Paints the sky in ribbons of green and pink.'],
  ['Emberlet', 'Fire', 3, 'Sunbaked Dunes', '🐜', '🦂', 'Keeps a cinder lantern lit at its tail.'],
  ['Sunscale', 'Fire', 4, 'Sunbaked Dunes', '🦔', '🐪', 'Stores sunlight to share on cold nights.'],
  ['Cactip', 'Nature', 3, 'Sunbaked Dunes', '🌵', '🦜', 'Prickly outside, very cuddly inside.'],
  ['Magmaw', 'Fire', 5, 'Sunbaked Dunes', '🔥', '🐲', 'The dune dragon, born once every hundred summers.'],
  ['Glowmoth', 'Light', 4, 'Glow Isle', '🐛', '🦋', 'Wings light the path for lost travelers.'],
  ['Lumifin', 'Light', 4, 'Glow Isle', '🐟', '🐋', 'Swims through the night sky like a lantern.'],
  ['Duskmew', 'Shadow', 4, 'Glow Isle', '🦇', '🐈‍⬛', 'Naps inside shadows and steals your socks.'],
  ['Nyxling', 'Shadow', 5, 'Glow Isle', '👻', '🐉', 'A star-eater that only appears on moonless nights.']
].map((c, i) => ({ id: i, name: c[0], element: c[1], rarity: c[2], biome: c[3], baby: c[4], adult: c[5], lore: c[6] }));

// Recipes: every 3-ingredient combo (order ignored) -> assign 24 deterministic ones
const COMBOS = [];
for (let a = 0; a < 6; a++) for (let b = a; b < 6; b++) for (let c = b; c < 6; c++) COMBOS.push('' + a + b + c);
CHARACTERS.forEach((c, i) => { c.recipe = COMBOS[i * 2]; });

/* ---------- State ---------- */
function freshState() {
  return { seeds: {}, known: [], hatched: {}, plots: Array.from({ length: 5 }, () => ({ st: 'empty' })) };
}
function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && Array.isArray(s.plots) && s.plots.length === 5) return s;
  } catch (e) { /* ignore corrupt/blocked storage */ }
  return freshState();
}
function save() {
  S.savedAt = Date.now();
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage unavailable */ }
  if (window.cloudPush) window.cloudPush(); // sync ke Supabase (debounced)
}

let S = load();
let selected = [];
const $ = id => document.getElementById(id);
const isAdult = id => (S.hatched[id] || 0) >= EVOLVE_AT;
const unlocked = id => (S.hatched[id] || 0) > 0;

/* ---------- Helpers ---------- */
let toastTimer;
function toast(t) {
  const el = $('toast'); el.textContent = t; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
}
function openModal(html) { $('modal-body').innerHTML = html; $('modal').classList.remove('hidden'); }
function closeModal() { $('modal').classList.add('hidden'); }
const recipeEmoji = r => r.split('').map(i => INGREDIENTS[i][0]).join('');

/* ---------- Navigation ---------- */
document.querySelectorAll('.nav button').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.nav button').forEach(x => x.classList.toggle('active', x === b));
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === 'page-' + b.dataset.page));
  renderAll();
}));

/* ---------- Alchemy ---------- */
function renderAlchemy() {
  $('slots').innerHTML = [0, 1, 2].map(i =>
    `<div class="slot" data-slot="${i}">${selected[i] !== undefined ? INGREDIENTS[selected[i]][0] : ''}</div>`).join('');
  $('ingredients').innerHTML = INGREDIENTS.map((g, i) =>
    `<button class="ing" data-ing="${i}">${g[0]}<small>${g[1]}</small></button>`).join('');
  $('recipes').innerHTML = S.known.length
    ? S.known.map(id => `<span class="chip">${recipeEmoji(CHARACTERS[id].recipe)} → ${CHARACTERS[id].baby} ${CHARACTERS[id].name}</span>`).join('')
    : '<span class="chip">No recipes discovered yet. Experiment!</span>';
}
$('ingredients').addEventListener('click', e => {
  const b = e.target.closest('[data-ing]'); if (!b) return;
  if (selected.length >= 3) return toast('Cauldron is full. Mix or clear.');
  selected.push(+b.dataset.ing); renderAlchemy();
});
$('slots').addEventListener('click', e => {
  const s = e.target.closest('[data-slot]'); if (!s) return;
  selected.splice(+s.dataset.slot, 1); renderAlchemy();
});
$('btn-clear').addEventListener('click', () => { selected = []; $('alchemy-msg').textContent = 'Pick 3 ingredients, then mix.'; renderAlchemy(); });
$('btn-mix').addEventListener('click', () => {
  if (selected.length < 3) return toast('Add 3 ingredients first.');
  const key = selected.slice().sort().join('');
  const hit = CHARACTERS.find(c => c.recipe === key);
  if (hit) {
    S.seeds[hit.id] = (S.seeds[hit.id] || 0) + 1;
    const first = !S.known.includes(hit.id);
    if (first) S.known.push(hit.id);
    SFX.success(); $('alchemy-msg').textContent = `✨ ${first ? 'New recipe! ' : ''}You made a ${hit.name} seed.`;
    save();
  } else {
    // Hint: how close is the best recipe (count of matching ingredients)?
    const best = Math.max(...CHARACTERS.map(c => {
      const pool = c.recipe.split(''); let n = 0;
      selected.forEach(i => { const k = pool.indexOf('' + i); if (k > -1) { pool.splice(k, 1); n++; } });
      return n;
    }));
    SFX.fail(); $('alchemy-msg').textContent = `💨 Fizzle! Closest recipe shares ${best}/3 ingredients.`;
  }
  selected = []; renderAlchemy();
});

/* ---------- Farm ---------- */
function plotInfo(p) {
  const ch = p.id !== undefined ? CHARACTERS[p.id] : null;
  if (p.st === 'empty') return ['➕', 'Plant'];
  if (p.st === 'seed') return ['🌰', 'Water me'];
  if (p.st === 'grow') {
    const left = Math.ceil((p.readyAt - Date.now()) / 1000);
    if (left > 0) return ['🌱', left + 's'];
    p.st = 'ready'; save();
  }
  if (p.st === 'ready') return ['🌳', 'Harvest'];
  return [ch.baby === '' ? '🥚' : '🍑', 'Hatch!'];
}
function renderFarm() {
  $('plots').innerHTML = S.plots.map((p, i) => {
    const [em, label] = plotInfo(p);
    return `<button class="plot ${p.st}" data-plot="${i}">${em}<small>${label}</small></button>`;
  }).join('');
  const ids = Object.keys(S.seeds).filter(id => S.seeds[id] > 0);
  $('seedbag').innerHTML = ids.length
    ? ids.map(id => `<span class="chip">🌰 ${CHARACTERS[id].name} ×${S.seeds[id]}</span>`).join('')
    : '<span class="chip">No seeds. Visit the cauldron.</span>';
}
$('plots').addEventListener('click', e => {
  const b = e.target.closest('[data-plot]'); if (!b) return;
  const i = +b.dataset.plot, p = S.plots[i];
  plotInfo(p); // refresh state if growth finished
  if (p.st === 'empty') {
    const ids = Object.keys(S.seeds).filter(id => S.seeds[id] > 0);
    if (!ids.length) return toast('No seeds yet. Brew some in the cauldron.');
    openModal('<h3>Choose a seed</h3>' + ids.map(id =>
      `<button class="btn ghost seed-opt" data-plant="${i}:${id}"><span>🌰 ${CHARACTERS[id].name}</span><span>×${S.seeds[id]}</span></button>`).join('') +
      '<button class="btn ghost" data-close>Cancel</button>');
  } else if (p.st === 'seed') {
    p.st = 'grow'; p.readyAt = Date.now() + GROW_MS; save(); SFX.water(); toast('💧 Watered!');
  } else if (p.st === 'grow') {
    toast('Still growing…');
  } else if (p.st === 'ready') {
    p.st = 'fruit'; save(); SFX.harvest(); toast('Harvested a fruit!');
  } else if (p.st === 'fruit') {
    hatch(i);
  }
  renderFarm();
});
function hatch(i) {
  const p = S.plots[i], ch = CHARACTERS[p.id];
  S.hatched[ch.id] = (S.hatched[ch.id] || 0) + 1;
  const n = S.hatched[ch.id], evolved = n === EVOLVE_AT;
  (evolved ? SFX.evolve : SFX.hatch)();
  S.plots[i] = { st: 'empty' }; save();
  openModal(`<div class="big">${creature(ch.id, evolved)}</div>
    <h3>${evolved ? ch.name + ' evolved!' : (n === 1 ? 'A new friend hatched!' : ch.name + ' hatched again!')}</h3>
    <p>${ch.name} · ${ELEMENTS[ch.element][0]} ${ch.element}<br>${'★'.repeat(ch.rarity)}</p>
    <p>${ch.lore}</p>
    <button class="btn" data-close>Yay!</button>`);
  renderAll();
}

/* Modal events (delegated) */
$('modal').addEventListener('click', e => {
  const plant = e.target.closest('[data-plant]');
  if (plant) {
    const [i, id] = plant.dataset.plant.split(':').map(Number);
    if (S.plots[i].st === 'empty' && S.seeds[id] > 0) {
      S.seeds[id]--; S.plots[i] = { st: 'seed', id }; save(); closeModal(); renderFarm(); toast('Planted! Tap to water.');
    }
    return;
  }
  if (e.target.closest('[data-close]') || e.target === $('modal')) closeModal();
});

/* ---------- Collection ---------- */
function renderCards() {
  const count = CHARACTERS.filter(c => unlocked(c.id)).length;
  $('stats').textContent = `${count} / ${CHARACTERS.length}`;
  $('cards').innerHTML = CHARACTERS.map(c => {
    if (!unlocked(c.id)) {
      return `<div class="card locked"><div class="face sil">${creature(c.id, false)}</div><h3>???</h3><div class="meta">${c.biome}</div></div>`;
    }
    const [eIcon, color] = ELEMENTS[c.element], adult = isAdult(c.id);
    return `<div class="card r${c.rarity}" style="--c:${color}">
      <span class="el">${eIcon}</span>
      <div class="face">${creature(c.id, adult)}</div>
      <div class="stars">${'★'.repeat(c.rarity)}</div>
      <h3>${c.name}</h3>
      <div class="meta">${c.element} · ${c.biome}</div>
      <p class="lore">${c.lore}</p>
      <span class="stage">${adult ? 'Adult' : 'Baby ' + S.hatched[c.id] + '/' + EVOLVE_AT}</span>
    </div>`;
  }).join('');
}

/* ---------- Render all ---------- */
function renderHome() {
  const un = CHARACTERS.filter(c => unlocked(c.id)), best = un.slice().sort((a, b) => b.rarity - a.rarity)[0];
  const ch = best || CHARACTERS[0];
  $('hero-art').innerHTML = creature(ch.id, best ? isAdult(ch.id) : false);
  $('hero-art').classList.toggle('sil', !best);
  $('hero-name').textContent = best ? `${ch.name} ${'★'.repeat(ch.rarity)}` : 'A mystery friend awaits';
  $('bar-fill').style.width = (un.length / CHARACTERS.length * 100) + '%';
  $('home-msg').textContent = best ? `${un.length}/24 friends found. Keep brewing!` : 'Brew your first seed in the cauldron.';
}
$('hero-art').addEventListener('click', () => { const h = $('hero-art'); SFX.success(); h.classList.remove('hop'); void h.offsetWidth; h.classList.add('hop'); });
function renderAll() { renderHome(); renderAlchemy(); renderFarm(); renderCards(); }
setInterval(() => { if ($('page-farm').classList.contains('active')) renderFarm(); }, 1000);

/* ---------- Developer cheat code ---------- */
// Tap the logo 5 times within 2 seconds to open the prompt.
let taps = [];
$('logo').addEventListener('click', () => {
  const now = Date.now();
  taps = taps.filter(t => now - t < 2000); taps.push(now);
  if (taps.length < 5) return;
  taps = [];
  const code = prompt('Enter Dev Code');
  if (code && code.trim().toUpperCase() === DEV_CODE) {
    CHARACTERS.forEach(c => {
      S.hatched[c.id] = Math.max(S.hatched[c.id] || 0, EVOLVE_AT); // adult
      S.seeds[c.id] = Math.max(S.seeds[c.id] || 0, 1);              // seed in inventory
      if (!S.known.includes(c.id)) S.known.push(c.id);
    });
    save(); renderAll(); SFX.evolve(); toast('🌟 God mode: all 24 adults unlocked!');
  } else if (code !== null) toast('Invalid code.');
});

renderAll();

/* ---------- Cloud save (Supabase) ---------- */
if (window.cloudInit) {
  window.cloudInit(() => S, s => {
    S = s;
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ }
    renderAll(); toast('☁️ Progress dimuat dari cloud');
  });
}
