/* Procedural chibi creature art (SVG): 24 unique custom characters, baby + adult forms */
(function () {
  'use strict';
  // [main, light, dark, accent]
  const P = { Fire: ['#ff8a5c', '#ffe0b8', '#c9482b', '#ffd43b'], Water: ['#4cc9f0', '#d2f6ff', '#2b7fc9', '#7b5cff'], Nature: ['#6fdc8c', '#e4ffd0', '#2f9e5a', '#ff8fc4'], Ice: ['#a8e6ff', '#f2fcff', '#5aa8e0', '#7b8cff'], Light: ['#ffe27a', '#fffbe0', '#f0a830', '#ff8fc4'], Shadow: ['#9b7bff', '#e6dcff', '#5a3cb8', '#ff6fd1'] };
  const MARK = { Fire: 'M0-7Q8 0 0 6Q-8 0 0-7Z', Water: 'M0-7C6 1 6 6 0 6C-6 6-6 1 0-7Z', Nature: 'M-6 4Q-6-6 6-6Q6 4-6 4Z', Ice: 'M0-7L2-2 7 0 2 2 0 7-2 2-7 0-2-2Z', Light: 'M0-6A6 6 0 1 0 .1-6Z', Shadow: 'M3-7A7 7 0 1 0 3 7A5 5 0 1 1 3-7Z' };
  let n = 0;
  window.creature = function (id, adult) {
    const c = CHARACTERS[id], [m, l, d, a] = P[c.element], u = 'c' + (n++);
    const e = (id * 3 + c.rarity) % 5, k = adult ? 1.12 : 1, y = adult ? 52 : 58, rx = 30 * k, ry = 27 * k;
    const ears = [
      `<circle cx="28" cy="${y - 24}" r="11" fill="${m}"/><circle cx="28" cy="${y - 24}" r="5.5" fill="${a}" opacity=".6"/>`,
      `<path d="M16 ${y - 14}L24 ${y - 48}L44 ${y - 26}Z" fill="${m}"/><path d="M23 ${y - 22}L26 ${y - 38}L36 ${y - 27}Z" fill="${a}" opacity=".6"/>`,
      `<ellipse cx="32" cy="${y - 38}" rx="8" ry="20" fill="${m}" transform="rotate(-10 32 ${y - 38})"/><ellipse cx="32" cy="${y - 38}" rx="4" ry="14" fill="${a}" opacity=".55" transform="rotate(-10 32 ${y - 38})"/>`,
      `<path d="M34 ${y - 24}Q22 ${y - 48} 40 ${y - 52}Q38 ${y - 38} 46 ${y - 28}Z" fill="${a}"/>`,
      `<path d="M38 ${y - 24}Q30 ${y - 44} 20 ${y - 46}" stroke="${d}" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="20" cy="${y - 46}" r="5" fill="${a}"/>`
    ][e];
    const wing = adult ? `<path d="M26 ${y}Q-6 ${y - 30} 4 ${y + 14}Q14 ${y + 10} 28 ${y + 14}Z" fill="${l}" stroke="${m}" stroke-width="2" opacity=".92" class="wing"/>` : '';
    const both = s => `${s}<g transform="translate(100 0) scale(-1 1)">${s}</g>`;
    const eye = x => `<g class="blink"><ellipse cx="${x}" cy="${y - 3}" rx="7.5" ry="9" fill="#2a1b4d"/><ellipse cx="${x}" cy="${y - 1}" rx="5" ry="6" fill="${a}" opacity=".85"/><circle cx="${x - 2.5}" cy="${y - 6}" r="3.2" fill="#fff"/><circle cx="${x + 2.5}" cy="${y + 2}" r="1.6" fill="#fff"/></g>`;
    const aura = (adult || c.rarity === 5) ? `<circle class="aura" cx="50" cy="${y}" r="47" fill="url(#${u}a)"/>` : '';
    const spark = adult ? `<path class="tw" d="M12 20l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="${a}"/><path class="tw t2" d="M86 10l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#fff"/>` : '';
    return `<svg viewBox="-8 -4 116 108" class="cr" style="filter:hue-rotate(${(id % 4 - 1.5) * 12}deg)"><defs>
<radialGradient id="${u}b" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="${l}"/><stop offset=".45" stop-color="${m}"/><stop offset="1" stop-color="${d}"/></radialGradient>
<radialGradient id="${u}a"><stop offset="0" stop-color="#fff3a0" stop-opacity=".75"/><stop offset="1" stop-color="#fff3a0" stop-opacity="0"/></radialGradient></defs>
<ellipse cx="50" cy="${y + ry + 3}" rx="26" ry="4" fill="#000" opacity=".25"/>${aura}
<path d="M${50 + rx - 4} ${y + 16}Q98 ${y + 14} 90 ${y - 8}" stroke="${m}" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="90" cy="${y - 8}" r="5.5" fill="${a}"/>
${both(wing)}${both(ears)}
<ellipse cx="37" cy="${y + ry - 2}" rx="9" ry="5.5" fill="${d}"/><ellipse cx="63" cy="${y + ry - 2}" rx="9" ry="5.5" fill="${d}"/>
<ellipse cx="50" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#${u}b)"/>
<ellipse cx="50" cy="${y + 9}" rx="${rx * .52}" ry="${ry * .5}" fill="${l}" opacity=".8"/>
<circle cx="28" cy="${y + 5}" r="4.5" fill="#ff7fa8" opacity=".5"/><circle cx="72" cy="${y + 5}" r="4.5" fill="#ff7fa8" opacity=".5"/>
${eye(37)}${eye(63)}
<path d="M45 ${y + 8}Q50 ${y + 14} 55 ${y + 8}" stroke="#2a1b4d" stroke-width="2.2" fill="none" stroke-linecap="round"/>
<path transform="translate(50 ${y - ry + 8})" d="${MARK[c.element]}" fill="${a}" stroke="#fff" stroke-width="1"/>
<ellipse cx="38" cy="${y - ry + 10}" rx="11" ry="5" fill="#fff" opacity=".5" transform="rotate(-25 38 ${y - ry + 10})"/>${spark}</svg>`;
  };
})();
