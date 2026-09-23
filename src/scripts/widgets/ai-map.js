export function renderAiMap(el, data) {
  const frame = document.createElement('div');
  frame.className = 'ix-frame';
  frame.innerHTML = `<div class="ix-head"><span class="ix-title"><b>Interactive</b> — the practical map</span><span class="cc-caption">Select a card to see the working detail</span></div><div class="ai-map-grid"></div>`;
  const grid = frame.querySelector('.ai-map-grid');
  [['helps', data.helps], ['humans', data.humans]].forEach(([key, col]) => {
    const colEl = document.createElement('div');
    colEl.className = 'ai-map-col ai-map-' + key;
    colEl.innerHTML = `<div class="ai-map-col-head"><span class="cc-tag ${key === 'helps' ? 'cc-tag-success' : 'cc-tag-ink'}">${col.label}</span></div>`;
    col.cards.forEach((c) => {
      const card = document.createElement('div');
      card.className = 'ai-card'; card.setAttribute('role', 'button'); card.setAttribute('tabindex', '0'); card.setAttribute('aria-expanded', 'false');
      card.innerHTML = `<div class="ai-card-title"><span>${c.t}</span><span class="ai-plus" aria-hidden="true">+</span></div><div class="ai-card-detail">${c.d}</div>`;
      const toggle = () => { card.classList.toggle('open'); card.setAttribute('aria-expanded', card.classList.contains('open')); };
      card.addEventListener('click', toggle);
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
      colEl.appendChild(card);
    });
    grid.appendChild(colEl);
  });
  el.appendChild(frame);
}
