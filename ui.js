/* UI v2: overrides of render functions from app.js (floating-island home, workshop alchemy, custom farm, card collection) */
(function () {
  'use strict';
  let hi = 0;
  const unl = () => CHARACTERS.filter(c => unlocked(c.id));

  window.renderHome = function () {
    const u = unl(), lk = !u.length, ch = lk ? CHARACTERS[0] : u[((hi % u.length) + u.length) % u.length], B = BIOME(ch);
    const st = $('stage');
    st.style.background = `linear-gradient(${B.s[0]},${B.s[1]})`;
    st.innerHTML = `<div class="sun"></div>${island(ch.id, lk)}` + Array.from({ length: 14 }, (_, i) => `<i class="fly" style="left:${(i * 37) % 96}%;top:${(i * 53) % 80}%;animation-delay:${i * .4}s"></i>`).join('');
    $('hero-name').textContent = lk ? 'A mystery island awaits' : `${ch.name} · ${ch.biome}`;
    $('bar-fill').style.width = (u.length / CHARACTERS.length * 100) + '%';
    $('home-msg').textContent = lk ? 'Brew your first seed in the workshop.' : `${u.length}/24 friends found. Swipe to visit their islands.`;
  };
  $('prev').addEventListener('click', () => { hi--; renderHome(); });
  $('next').addEventListener('click', () => { hi++; renderHome(); });
  $('stage').addEventListener('click', () => { SFX.success(); });

  window.renderAlchemy = function () {
    if (!$('scene').firstChild) $('scene').innerHTML = alchScene();
    const q1 = $('lq1'), q2 = $('lq2');
    q1.setAttribute('stop-color', selected.length ? ING[selected[selected.length - 1]][1] : '#b6ff6a');
    q2.setAttribute('stop-color', selected.length ? ING[selected[0]][2] : '#3fbf3a');
    $('slots').innerHTML = [0, 1, 2].map(i => `<div class="slot" data-slot="${i}">${selected[i] !== undefined ? bottle(selected[i]) : ''}</div>`).join('');
    $('ingredients').innerHTML = ING.map((g, i) => `<button class="ing" data-ing="${i}">${bottle(i)}<small>${g[0]}</small></button>`).join('');
    $('recipes').innerHTML = S.known.length
      ? S.known.map(id => `<span class="chip rc">${CHARACTERS[id].recipe.split('').map(i => `<b class="dot" style="background:${ING[i][1]}"></b>`).join('')}<i class="sd">${seedArt(id)}</i>${CHARACTERS[id].name}</span>`).join('')
      : '<span class="chip">No recipes yet. Experiment!</span>';
  };
  $('btn-mix').addEventListener('click', () => { const s = $('scene'); s.classList.add('mixing'); setTimeout(() => s.classList.remove('mixing'), 900); });

  window.renderFarm = function () {
    const box = $('plots');
    if (box.children.length !== 5) box.innerHTML = S.plots.map((_, i) => `<button class="plot" data-plot="${i}"></button>`).join('');
    S.plots.forEach((p, i) => {
      const b = box.children[i], label = plotInfo(p)[1], sig = p.st + p.id;
      const pr = p.st === 'grow' ? Math.min(1, 1 - (p.readyAt - Date.now()) / GROW_MS) : 0;
      if (b.dataset.sig !== sig) { b.dataset.sig = sig; b.className = 'plot ' + p.st; b.innerHTML = (p.st === 'empty' ? '<span class="plus">+</span>' : plantArt(p.id, p.st, pr)) + `<small>${label}</small>`; }
      else { b.querySelector('small').textContent = label; const g = b.querySelector('.gt'); if (g) g.setAttribute('transform', `translate(50 84) scale(${.2 + .45 * pr})`); }
    });
    const ids = Object.keys(S.seeds).filter(id => S.seeds[id] > 0);
    $('seedbag').innerHTML = ids.length ? ids.map(id => `<span class="chip rc"><i class="sd">${seedArt(+id)}</i>${CHARACTERS[id].name} ×${S.seeds[id]}</span>`).join('') : '<span class="chip">No seeds. Visit the workshop.</span>';
  };

  window.renderCards = function () {
    const cnt = CHARACTERS.filter(c => unlocked(c.id)).length;
    $('stats').textContent = cnt + ' / 24';
    $('cards').innerHTML = CHARACTERS.map(c => {
      const un = unlocked(c.id), ad = isAdult(c.id), P = PAL[c.element];
      return `<article class="tcard ${un ? '' : 'lk'}" style="--c:${P[0]};--c2:${P[1]}"><div class="no">${String(c.id + 1).padStart(3, '0')}</div><div class="crowns">${'♛'.repeat(c.rarity)}</div><div class="wm">${c.element.toUpperCase()}</div><div class="big">${creature(c.id, ad)}</div><div class="foot"><div class="mini">${creature(c.id, false)}</div>${eico(c.element)}</div><h4>${un ? c.name : '???'}</h4><p>${un ? c.lore : c.biome}</p><div class="stg">${un ? (ad ? 'Adult' : 'Baby ' + S.hatched[c.id] + '/' + EVOLVE_AT) : 'Locked'}</div></article>`;
    }).join('');
    $('col-prog').innerHTML = `<div class="lv">${cnt}</div><div class="track"><i style="width:${cnt / 24 * 100}%"></i>${[6, 12, 18, 24].map(m => `<b class="ms ${cnt >= m ? 'on' : ''}" style="left:${m / 24 * 100}%"><em>${m}</em></b>`).join('')}</div>`;
  };

  // Particle bursts on big moments
  function burst() {
    for (let i = 0; i < 26; i++) {
      const s = document.createElement('i'), t = Math.random() * 6.28, r = 80 + Math.random() * 140;
      s.className = 'pt'; s.style.cssText = `--dx:${Math.cos(t) * r}px;--dy:${Math.sin(t) * r - 60}px;background:hsl(${Math.random() * 360} 90% 70%)`;
      document.body.appendChild(s); setTimeout(() => s.remove(), 1200);
    }
  }
  ['success', 'harvest', 'hatch', 'evolve'].forEach(k => { const f = SFX[k]; SFX[k] = () => { f(); burst(); }; });

  renderAll();
})();
