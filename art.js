/* Creature art v2: 24 unique cel-shaded chibi monsters (SVG). Body, ears, pattern, tail, mouth and element crest all vary per id. */
(function () {
  'use strict';
  const P = { Fire: ['#ff8a5c', '#ffe3c0', '#b83a22', '#ffd43b'], Water: ['#4cc9f0', '#d6f7ff', '#1f6fb8', '#8b6bff'], Nature: ['#6fdc8c', '#e8ffd6', '#278a4f', '#ff8fc4'], Ice: ['#a8e6ff', '#f6fdff', '#4a96d6', '#7b8cff'], Light: ['#ffe27a', '#fffbe6', '#d98a1c', '#ff8fc4'], Shadow: ['#a58bff', '#ece4ff', '#4b2fa8', '#ff6fd1'] };
  window.PAL = P;
  // [path, eyeY, eyeSpacing, headTopY]
  const BODY = [
    ['M50 26C74 26 82 50 80 66C78 84 22 84 20 66C18 50 26 26 50 26Z', 54, 14, 26],
    ['M50 16C70 16 76 46 76 66C76 86 24 86 24 66C24 46 30 16 50 16Z', 46, 13, 16],
    ['M50 34C82 34 92 56 88 70C84 84 16 84 12 70C8 56 18 34 50 34Z', 56, 17, 34],
    ['M50 22C66 22 74 36 76 52C80 70 86 84 50 86C14 84 20 70 24 52C26 36 34 22 50 22Z', 48, 14, 22],
    ['M30 30H70Q84 30 84 46V66Q84 84 66 84H34Q16 84 16 66V46Q16 30 30 30Z', 52, 15, 30],
    ['M50 16A24 24 0 1 1 49.9 16ZM50 52C80 50 82 88 50 90C18 88 20 50 50 52Z', 38, 13, 16]
  ];
  let n = 0;
  window.creature = function (id, adult) {
    const c = CHARACTERS[id], [m, l, d, a] = P[c.element], u = 'c' + (n++), [bp, ey, es, ty] = BODY[id % 6];
    const ek = (id * 5 + id % 3) % 6, pt = (id * 3) % 4, mo = id % 3, tk = id % 3, my = ey + 14;
    const both = s => `${s}<g transform="translate(100 0) scale(-1 1)">${s}</g>`;
    const ears = [
      `<circle cx="30" cy="${ty + 6}" r="11" fill="${m}"/><circle cx="30" cy="${ty + 6}" r="5" fill="${a}" opacity=".55" stroke="none"/>`,
      `<path d="M20 ${ty + 12}L26 ${ty - 20}L46 ${ty + 6}Z" fill="${m}"/><path d="M26 ${ty + 4}L28 ${ty - 10}L38 ${ty + 2}Z" fill="${a}" opacity=".6" stroke="none"/>`,
      `<ellipse cx="34" cy="${ty - 10}" rx="8" ry="20" transform="rotate(-12 34 ${ty - 10})" fill="${m}"/><ellipse cx="34" cy="${ty - 8}" rx="4" ry="14" transform="rotate(-12 34 ${ty - 8})" fill="${a}" opacity=".55" stroke="none"/>`,
      `<path d="M34 ${ty + 8}Q24 ${ty - 18} 42 ${ty - 22}Q38 ${ty - 8} 48 ${ty + 2}Z" fill="${l}"/>`,
      `<path d="M40 ${ty + 4}Q30 ${ty - 14} 20 ${ty - 18}" stroke="${d}" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="20" cy="${ty - 18}" r="5.5" fill="${a}"/>`,
      `<path d="M40 ${ty + 4}Q20 ${ty - 10} 28 ${ty - 26}Q46 ${ty - 14} 40 ${ty + 4}Z" fill="#6fdc8c"/>`][ek];
    const crest = {
      Fire: `<path d="M44 ${ty + 2}Q40 ${ty - 14} 50 ${ty - 20}Q60 ${ty - 14} 56 ${ty + 2}Z" fill="#ffb347"/><path d="M47 ${ty + 2}Q47 ${ty - 8} 50 ${ty - 11}Q53 ${ty - 8} 53 ${ty + 2}Z" fill="#fff2a0" stroke="none"/>`,
      Water: `<path d="M43 ${ty + 4}Q50 ${ty - 18} 57 ${ty + 4}Z" fill="${l}"/>`,
      Nature: `<path d="M50 ${ty + 4}Q44 ${ty - 14} 32 ${ty - 12}Q38 ${ty} 50 ${ty + 4}ZM50 ${ty + 4}Q56 ${ty - 14} 68 ${ty - 12}Q62 ${ty} 50 ${ty + 4}Z" fill="#7be07f"/>`,
      Ice: `<path d="M42 ${ty + 4}L46 ${ty - 14}L50 ${ty + 2}L55 ${ty - 20}L59 ${ty + 4}Z" fill="#dff6ff"/>`,
      Light: `<ellipse class="aura" cx="50" cy="${ty - 8}" rx="15" ry="4.5" fill="none" stroke="#ffe27a" stroke-width="3"/>`,
      Shadow: `<path d="M42 ${ty + 4}Q50 ${ty - 14} 58 ${ty + 4}Q50 ${ty - 2} 42 ${ty + 4}Z" fill="#2a1b4d"/><circle cx="50" cy="${ty - 4}" r="2" fill="#ff6fd1" stroke="none"/>`
    }[c.element];
    const tc = { Fire: '#ff9a3c', Water: l, Nature: '#6fdc8c', Ice: '#cdefff', Light: a, Shadow: d }[c.element];
    const tail = [`<path d="M80 74Q108 80 100 44Q92 62 82 62Z" fill="${tc}"/>`, `<path d="M80 72Q98 72 96 58" stroke="${m}" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="96" cy="56" r="8" fill="${tc}"/>`, `<path d="M80 74Q104 84 100 66Q96 54 88 62" stroke="${tc}" stroke-width="7" fill="none" stroke-linecap="round"/>`][tk];
    const wings = adult ? both(`<path class="wing" d="M24 ${ey + 4}Q-12 ${ey - 32} 2 ${ey + 22}Q14 ${ey + 18} 26 ${ey + 22}Z" fill="${a}" opacity=".92"/>`) : '';
    const arms = both(`<ellipse cx="19" cy="${ey + 22}" rx="6" ry="9" transform="rotate(25 19 ${ey + 22})" fill="${m}"/>`);
    const eye = x => `<g class="blink"><ellipse cx="${x}" cy="${ey}" rx="7.5" ry="9.5" fill="#2a1b4d" stroke="none"/><ellipse cx="${x}" cy="${ey + 2}" rx="5.5" ry="6.5" fill="url(#${u}e)" stroke="none"/><circle cx="${x - 2.6}" cy="${ey - 3.5}" r="3.3" fill="#fff" stroke="none"/><circle cx="${x + 2.4}" cy="${ey + 3}" r="1.5" fill="#fff" stroke="none"/><path d="M${x - 8} ${ey - 6}Q${x} ${ey - 13} ${x + 8} ${ey - 6}" stroke="#2a1b4d" stroke-width="2" fill="none" stroke-linecap="round"/></g>`;
    const mouth = [`<path d="M44 ${my}Q50 ${my + 6} 56 ${my}" stroke="#2a1b4d" stroke-width="2.2" fill="none" stroke-linecap="round"/>`, `<path d="M43 ${my - 1}Q50 ${my + 10} 57 ${my - 1}Z" fill="#7a1f4a" stroke="none"/><ellipse cx="50" cy="${my + 5}" rx="3.5" ry="2" fill="#ff7fa8" stroke="none"/>`, `<path d="M43 ${my}Q46.5 ${my + 5} 50 ${my}Q53.5 ${my + 5} 57 ${my}" stroke="#2a1b4d" stroke-width="2.2" fill="none" stroke-linecap="round"/>`][mo];
    const pat = ['', `<g fill="${d}" opacity=".22" stroke="none"><circle cx="36" cy="72" r="5"/><circle cx="64" cy="76" r="4"/><circle cx="52" cy="64" r="3"/></g>`, `<path d="M20 60L50 90M34 56L70 90M52 54L84 84" stroke="${d}" stroke-width="5" opacity=".2"/>`, `<path d="M50 70l3 6h6l-5 4 2 6-6-4-6 4 2-6-5-4h6z" fill="${a}" stroke="none"/>`][pt];
    const aura = (adult || c.rarity === 5) ? `<circle class="aura" cx="50" cy="56" r="52" fill="url(#${u}a)"/>` : '';
    const spark = adult ? `<path class="tw" d="M8 16l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="${a}" stroke="none"/><path class="tw t2" d="M90 8l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#fff" stroke="none"/>` : '';
    const sc = adult ? 1.1 : 1;
    return `<svg viewBox="-14 -8 128 114" class="cr"><defs>
<radialGradient id="${u}b" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="${l}"/><stop offset=".5" stop-color="${m}"/><stop offset="1" stop-color="${d}"/></radialGradient>
<linearGradient id="${u}e" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${d}"/></linearGradient>
<radialGradient id="${u}a"><stop offset="0" stop-color="#fff3a0" stop-opacity=".7"/><stop offset="1" stop-color="#fff3a0" stop-opacity="0"/></radialGradient>
<clipPath id="${u}k"><path d="${bp}"/></clipPath></defs>
<ellipse cx="50" cy="95" rx="28" ry="4.5" fill="#000" opacity=".25"/>${aura}
<g transform="translate(50 56) scale(${sc}) translate(-50 -56)" stroke="${d}" stroke-width="2.4" stroke-linejoin="round">
${tail}${wings}${both(ears)}
<ellipse cx="36" cy="89" rx="10" ry="6" fill="${m}"/><ellipse cx="64" cy="89" rx="10" ry="6" fill="${m}"/>${arms}
<path d="${bp}" fill="url(#${u}b)"/>
<g clip-path="url(#${u}k)" stroke="none"><ellipse cx="50" cy="100" rx="46" ry="24" fill="${d}" opacity=".3"/><ellipse cx="50" cy="76" rx="16" ry="11" fill="${l}" opacity=".85"/>${pat}</g>
<path d="M27 52Q30 36 46 31" stroke="#fff" stroke-width="3.5" opacity=".6" fill="none" stroke-linecap="round"/>
<circle cx="${50 - es - 12}" cy="${ey + 9}" r="4.5" fill="#ff7fa8" opacity=".55" stroke="none"/><circle cx="${50 + es + 12}" cy="${ey + 9}" r="4.5" fill="#ff7fa8" opacity=".55" stroke="none"/>
${crest}${eye(50 - es)}${eye(50 + es)}${mouth}</g>${spark}</svg>`;
  };
})();
