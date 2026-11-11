/* Worlds: custom floating islands, trees, seeds, fruits, potion bottles and the alchemy scene (all SVG) */
(function () {
  'use strict';
  const BI = {
    'Meadow': { s: ['#74d7ff', '#ffe6f4'], g: '#8be26b', r: '#c0805a', t: 0 },
    'Coral Reef': { s: ['#35b6e8', '#c9f7ff'], g: '#5fe0c8', r: '#e0768f', t: 1 },
    'Whisper Forest': { s: ['#2f9e6a', '#d9ffb9'], g: '#4cc860', r: '#6f4d36', t: 2 },
    'Frost Hollow': { s: ['#7aa8ff', '#f2f9ff'], g: '#eaf7ff', r: '#78a8dc', t: 3 },
    'Sunbaked Dunes': { s: ['#ff9455', '#ffe7a6'], g: '#f2c96c', r: '#c96c3c', t: 4 },
    'Glow Isle': { s: ['#1b1050', '#8a45e8'], g: '#5ae6cc', r: '#4a2f8a', t: 5 }
  };
  window.BIOME = c => BI[c.biome];
  const MK = { Fire: 'M0-7Q8 0 0 6Q-8 0 0-7Z', Water: 'M0-7C6 1 6 6 0 6C-6 6-6 1 0-7Z', Nature: 'M-6 4Q-6-6 6-6Q6 4-6 4Z', Ice: 'M0-7L2-2 7 0 2 2 0 7-2 2-7 0-2-2Z', Light: 'M0-6A6 6 0 1 0 .1-6Z', Shadow: 'M3-7A7 7 0 1 0 3 7A5 5 0 1 1 3-7Z' };
  window.eico = el => `<svg viewBox="-10 -10 20 20" class="eico"><circle r="9.5" fill="${PAL[el][0]}" stroke="${PAL[el][2]}" stroke-width="1.5"/><path d="${MK[el]}" fill="#fff"/></svg>`;

  // Tree drawn with its base at (0,0), about 90 units tall. Type depends on biome; colours on the character's element.
  window.tree = function (id) {
    const c = CHARACTERS[id], t = BI[c.biome].t, [m, l, d, a] = PAL[c.element], v = id % 3;
    const trunk = `<path d="M-7 0Q-4 -30 -2 -48H4Q6 -30 9 0Z" fill="#8a5a3c" stroke="#5b3a26" stroke-width="2"/>`;
    const T = [
      trunk + `<g stroke="${d}" stroke-width="2"><circle cx="-24" cy="-48" r="18" fill="${a}"/><circle cx="18" cy="-50" r="19" fill="${a}"/><circle cx="-4" cy="-64" r="${26 + v * 2}" fill="${a}"/></g><circle cx="-12" cy="-74" r="7" fill="#fff" opacity=".45"/><g fill="#fff"><circle cx="10" cy="-60" r="3"/><circle cx="-22" cy="-52" r="3"/><circle cx="22" cy="-44" r="2.5"/></g>`,
      `<g stroke="${a}" stroke-width="7" fill="none" stroke-linecap="round"><path d="M0 0Q-6 -30 -24 -52M0 0Q0 -40 2 -74M0 0Q8 -30 28 -56M-12 -26Q-26 -30 -34 -42"/></g><g fill="${l}" stroke="${d}" stroke-width="1.5"><circle cx="-24" cy="-54" r="6"/><circle cx="2" cy="-76" r="7"/><circle cx="28" cy="-58" r="6"/><circle cx="-34" cy="-44" r="5"/></g>`,
      `<rect x="-4" y="-14" width="8" height="14" fill="#6f4d36"/><g stroke="${d}" stroke-width="2" fill="${m}"><path d="M-32 -14L-4 -54L24 -14Z"/><path d="M-24 -40L-4 -76L16 -40Z"/><path d="M-16 -62L-4 -94L8 -62Z"/></g><circle cx="-4" cy="-96" r="4" fill="${a}"/>`,
      `<g stroke="${d}" stroke-width="2"><path d="M-14 0L-20 -50L-6 -80L6 -40Z" fill="#bfeaff"/><path d="M4 0L2 -66L20 -94L30 -36Z" fill="${a}" opacity=".9"/><path d="M-28 0L-36 -34L-18 -20Z" fill="#fff"/></g><path d="M-10 -40L-8 -66" stroke="#fff" stroke-width="3" opacity=".7"/>`,
      `<g stroke="#2f8f3a" stroke-width="2.5" fill="#6fd05a"><rect x="-24" y="-60" width="12" height="32" rx="6"/><rect x="12" y="-52" width="12" height="28" rx="6"/><rect x="-9" y="-76" width="18" height="76" rx="9"/></g><circle cx="0" cy="-80" r="7" fill="${a}" stroke="${d}" stroke-width="1.5"/><path d="M-4 -50v8M4 -34v8" stroke="#2f8f3a" stroke-width="2"/>`,
      `<path d="M-4 0Q-2 -30 0 -44H4Q6 -30 9 0Z" fill="#cdb8f0" stroke="#5b3a8a" stroke-width="2"/><path d="M-42 -44Q-4 -104 38 -44Q-4 -34 -42 -44Z" fill="${m}" stroke="${d}" stroke-width="2.5"/><g fill="#fff" opacity=".85"><circle cx="-20" cy="-60" r="4"/><circle cx="8" cy="-70" r="5"/><circle cx="24" cy="-54" r="3"/></g><g stroke="${a}" stroke-width="2"><path d="M-30 -44V-26M-8 -40V-20M16 -40V-24"/></g><g fill="${a}" class="tw"><circle cx="-30" cy="-24" r="3"/><circle cx="-8" cy="-18" r="3"/><circle cx="16" cy="-22" r="3"/></g>`
    ][t];
    return `<g class="sway">${T}</g>`;
  };

  window.island = function (id, lk) {
    const c = CHARACTERS[id], B = BI[c.biome], [m, l, d, a] = PAL[c.element], u = 'i' + id;
    const cr = creature(id, !lk && isAdult(id)).replace('<svg ', '<svg x="58" y="54" width="118" height="118" ');
    return `<svg viewBox="0 0 300 300" class="isl"><defs><linearGradient id="${u}r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${B.r}"/><stop offset="1" stop-color="#3a2150"/></linearGradient></defs>
<g class="far"><ellipse cx="34" cy="66" rx="24" ry="7" fill="${B.g}"/><path d="M10 68Q34 94 58 68L40 92Z" fill="${B.r}"/></g><g class="far f2"><ellipse cx="262" cy="96" rx="18" ry="6" fill="${B.g}"/><path d="M244 98Q262 118 280 98L266 116Z" fill="${B.r}"/></g>
<g class="cloud" fill="#fff" opacity=".85"><ellipse cx="40" cy="236" rx="34" ry="13"/><ellipse cx="64" cy="228" rx="22" ry="14"/><ellipse cx="258" cy="250" rx="34" ry="13"/><ellipse cx="240" cy="242" rx="20" ry="13"/></g>
<path d="M26 150Q150 196 274 150L250 206Q220 250 190 262L150 296L112 262Q82 250 50 206Z" fill="url(#${u}r)" stroke="#2a1648" stroke-width="3" stroke-linejoin="round"/>
<path d="M70 190L110 232M150 202V282M230 190L190 238" stroke="#fff" opacity=".2" stroke-width="3"/><path d="M136 278L150 302L164 278Z" fill="${a}" stroke="#2a1648" stroke-width="2"/><path d="M108 262L116 280L126 262Z" fill="${l}" stroke="#2a1648" stroke-width="2"/>
<path class="wf" d="M238 170Q250 214 234 266" stroke="#aef0ff" stroke-width="10" fill="none" stroke-linecap="round" stroke-dasharray="10 8"/>
<ellipse cx="150" cy="150" rx="124" ry="42" fill="${B.g}" stroke="#2a1648" stroke-width="3"/><ellipse cx="138" cy="140" rx="98" ry="27" fill="#fff" opacity=".22"/>
<g fill="${a}" stroke="#fff" stroke-width="1.5"><circle cx="46" cy="152" r="4"/><circle cx="262" cy="150" r="4"/><circle cx="120" cy="182" r="3.5"/><circle cx="186" cy="176" r="3.5"/></g>
<ellipse cx="100" cy="172" rx="34" ry="10" fill="#7fe0ff" stroke="#fff" stroke-width="2"/><path d="M84 171Q92 167 100 171" stroke="#fff" stroke-width="2" fill="none"/>
<g transform="translate(224 156)">${tree(id)}</g><g class="${lk ? 'sil' : ''}">${cr}</g></svg>`;
  };

  window.seedArt = function (id) {
    const c = CHARACTERS[id], [m, l, d, a] = PAL[c.element], u = 's' + id + Math.random().toString(36).slice(2, 5);
    const body = ['M30 6C46 22 52 36 46 50C42 60 18 60 14 50C8 36 14 22 30 6Z', 'M30 8A22 22 0 1 1 29.9 8Z', 'M30 6L38 22L54 24L42 36L46 52L30 44L14 52L18 36L6 24L22 22Z'][id % 3];
    return `<svg viewBox="0 0 60 66" class="seed"><defs><radialGradient id="${u}" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="${l}"/><stop offset=".5" stop-color="${m}"/><stop offset="1" stop-color="${d}"/></radialGradient></defs><path d="${body}" fill="url(#${u})" stroke="${d}" stroke-width="2.4" stroke-linejoin="round"/><path d="M22 26Q30 20 38 26M24 36Q30 32 36 36" stroke="${a}" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="22" cy="20" rx="4" ry="2.5" fill="#fff" opacity=".6"/><circle cx="30" cy="44" r="3" fill="${a}"/></svg>`;
  };
  window.fruitArt = function (id) {
    const c = CHARACTERS[id], [m, l, d, a] = PAL[c.element], u = 'f' + id + Math.random().toString(36).slice(2, 5);
    const body = ['M30 10C60 8 62 48 44 58C36 62 24 62 16 58C-2 48 0 8 30 10Z', 'M30 20C40 4 62 14 56 36C52 50 38 58 30 62C22 58 8 50 4 36C-2 14 20 4 30 20Z', 'M30 8C40 8 42 20 46 30C58 48 46 62 30 62C14 62 2 48 14 30C18 20 20 8 30 8Z'][id % 3];
    return `<svg viewBox="0 0 60 66" class="fruit"><defs><radialGradient id="${u}" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="${l}"/><stop offset=".45" stop-color="${a}"/><stop offset="1" stop-color="${m}"/></radialGradient></defs><path d="M30 12Q30 3 36 0" stroke="#4a8a3a" stroke-width="3" fill="none"/><path d="M34 6Q48 0 50 10Q38 14 34 6Z" fill="#6fdc8c" stroke="#278a4f" stroke-width="1.5"/><path d="${body}" fill="url(#${u})" stroke="${d}" stroke-width="2.4" stroke-linejoin="round"/><g fill="${l}" opacity=".8"><circle cx="22" cy="38" r="3"/><circle cx="38" cy="44" r="2.5"/><circle cx="34" cy="30" r="2"/></g><ellipse cx="20" cy="22" rx="5" ry="3" fill="#fff" opacity=".7" transform="rotate(-30 20 22)"/></svg>`;
  };
  // Farm plot art: stage = seed | grow | ready | fruit
  window.plantArt = function (id, st, pr) {
    const inner = (s, x, y, w) => s.replace('<svg ', `<svg x="${x}" y="${y}" width="${w}" height="${w}" `);
    let g = '';
    if (st === 'seed') g = inner(seedArt(id), 32, 52, 36);
    else if (st === 'grow') g = `<g class="gt" transform="translate(50 84) scale(${.2 + .45 * pr})">${tree(id)}</g>`;
    else if (st === 'ready') g = `<g transform="translate(50 84) scale(.66)">${tree(id)}</g>${inner(fruitArt(id), 56, 22, 18)}${inner(fruitArt(id), 22, 36, 16)}`;
    else g = `<g class="glowf">${inner(fruitArt(id), 20, 14, 60)}</g>`;
    return `<svg viewBox="0 0 100 100" class="pl"><ellipse cx="50" cy="88" rx="34" ry="9" fill="#5a3a24" stroke="#2a1648" stroke-width="2"/><ellipse cx="50" cy="85" rx="28" ry="6" fill="#7a5234"/>${g}</svg>`;
  };

  // Potion bottles = the 6 ingredients
  window.ING = [['Berry Elixir', '#ff9cc0', '#ff4f8a'], ['Dew Drop', '#8fdcff', '#2f8fe8'], ['Spore Brew', '#b6f08a', '#2fa84f'], ['Frost Tonic', '#d8f8ff', '#6fb8f0'], ['Bloom Nectar', '#ffd29a', '#ff8f4f'], ['Moon Draught', '#cbb4ff', '#6a4fd6']];
  window.bottle = function (i) {
    const [, c1, c2] = ING[i], u = 'b' + i + Math.random().toString(36).slice(2, 5);
    const sh = ['M30 76C4 58 6 36 20 36C26 36 30 42 30 42C30 42 34 36 40 36C54 36 56 58 30 76Z', 'M30 32C30 32 8 54 12 64C16 78 44 78 48 64C52 54 30 32 30 32Z', 'M30 42C6 42 4 74 30 76C56 74 54 42 30 42Z', 'M30 32L52 54L30 80L8 54Z', 'M30 36A21 21 0 1 1 29.9 36Z', 'M42 38A22 22 0 1 0 42 78A17 17 0 1 1 42 38Z'][i];
    return `<svg viewBox="0 0 60 84" class="btl"><defs><linearGradient id="${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect x="25" y="14" width="10" height="22" rx="3" fill="#ffffff44" stroke="#fff" stroke-width="1.5"/><rect x="22" y="5" width="16" height="11" rx="3" fill="#d9a066" stroke="#8a5a3c" stroke-width="1.5"/><path d="${sh}" fill="url(#${u})" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/><ellipse cx="22" cy="52" rx="4" ry="8" fill="#fff" opacity=".55"/><circle class="bub" cx="34" cy="62" r="2.6" fill="#fff" opacity=".75"/></svg>`;
  };
  // Witch workshop (shelf, hat, pumpkin, crystal ball, candles, bubbling cauldron)
  window.alchScene = function () {
    return `<svg viewBox="0 0 360 400" class="ascn"><defs><linearGradient id="aw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a3fd0"/><stop offset="1" stop-color="#d98cff"/></linearGradient><radialGradient id="liqg"><stop id="lq1" offset="0" stop-color="#b6ff6a"/><stop id="lq2" offset="1" stop-color="#3fbf3a"/></radialGradient><radialGradient id="glo"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#ff9cf2" stop-opacity="0"/></radialGradient></defs>
<rect width="360" height="400" rx="26" fill="url(#aw)"/><g fill="#fff" class="tw"><circle cx="40" cy="30" r="2"/><circle cx="200" cy="24" r="2.5"/><circle cx="320" cy="50" r="2"/><circle cx="110" cy="56" r="1.5"/></g>
<path d="M240 112Q270 70 300 36Q306 80 330 112Z" fill="#9b6bff" stroke="#4b2fa8" stroke-width="3"/><path d="M226 114Q290 100 344 114Q300 126 226 114Z" fill="#ff8fc4" stroke="#4b2fa8" stroke-width="3"/><path d="M290 100l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z" fill="#ffd43b"/>
<ellipse cx="58" cy="102" rx="26" ry="18" fill="#ff8a2a" stroke="#8a3d08" stroke-width="3"/><path d="M44 102Q58 88 72 102M58 86V118" stroke="#c4560a" stroke-width="2" fill="none"/><path d="M58 86Q58 78 66 76" stroke="#4a8a3a" stroke-width="4" fill="none"/>
<circle cx="150" cy="84" r="26" fill="#f0c6ff" stroke="#fff" stroke-width="3"/><circle class="aura" cx="150" cy="84" r="32" fill="url(#glo)"/><path d="M150 68l3 11 11 3-11 3-3 11-3-11-11-3 11-3z" fill="#fff"/><rect x="128" y="106" width="44" height="9" rx="4" fill="#d9a028"/>
<g><rect x="196" y="82" width="12" height="30" rx="3" fill="#fff4d6" stroke="#8a6a3c" stroke-width="2"/><path class="flame" d="M202 64Q196 76 202 80Q208 76 202 64Z" fill="#ffb347"/><rect x="214" y="92" width="12" height="20" rx="3" fill="#cdb8ff" stroke="#6a4fd6" stroke-width="2"/><path class="flame f2" d="M220 76Q214 86 220 90Q226 86 220 76Z" fill="#ffb347"/></g>
<path d="M10 118H350V138Q180 152 10 138Z" fill="#ff9a3c" stroke="#7a3d10" stroke-width="3"/>
<ellipse cx="180" cy="378" rx="116" ry="14" fill="#000" opacity=".3"/>
<g class="fire"><path d="M100 372Q92 340 116 330Q112 352 128 356Q120 340 136 322Q140 352 150 370Z" fill="#ff7a2a"/><path d="M170 374Q164 336 186 318Q184 346 200 352Q196 336 214 326Q214 354 226 372Z" fill="#ffb347"/><path d="M230 372Q240 342 258 336Q252 356 262 362Z" fill="#ff7a2a"/></g>
<path d="M70 252Q60 346 128 364H232Q300 346 290 252Z" fill="#3f4fa8" stroke="#1d1250" stroke-width="4"/><path d="M96 300Q180 334 264 300" stroke="#8fa0ff" stroke-width="5" fill="none" opacity=".6" stroke-linecap="round"/><path d="M180 312l8 14 16 2-12 10 3 16-15-8-15 8 3-16-12-10 16-2z" fill="#7b8cff" stroke="#1d1250" stroke-width="2"/>
<circle cx="64" cy="280" r="13" fill="none" stroke="#1d1250" stroke-width="6"/><circle cx="296" cy="280" r="13" fill="none" stroke="#1d1250" stroke-width="6"/>
<ellipse cx="180" cy="252" rx="112" ry="26" fill="#2c3880" stroke="#1d1250" stroke-width="4"/><ellipse cx="180" cy="254" rx="94" ry="19" fill="url(#liqg)"/>
<g fill="#fff" opacity=".8"><circle class="bb" cx="140" cy="250" r="6"/><circle class="bb b2" cx="190" cy="256" r="8"/><circle class="bb b3" cx="226" cy="250" r="5"/><circle class="bb b4" cx="168" cy="258" r="4"/></g></svg>`;
  };
})();
