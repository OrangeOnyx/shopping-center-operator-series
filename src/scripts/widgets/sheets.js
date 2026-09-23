export function renderSheetExplorer(el, sheets) {
  const frame = document.createElement('div');
  frame.className = 'ix-frame';
  frame.innerHTML = `<div class="ix-head"><span class="ix-title"><b>Interactive</b> — walk the sheets</span><span class="cc-caption">A drawing-set index, the way the program is organized</span></div><div class="sheet-strip" role="tablist"></div><div class="sheet-detail" role="tabpanel"></div>`;
  const strip = frame.querySelector('.sheet-strip');
  const detail = frame.querySelector('.sheet-detail');
  function select(i) {
    strip.querySelectorAll('.sheet-tab').forEach((t, ti) => { t.classList.toggle('active', ti === i); t.setAttribute('aria-selected', ti === i); });
    const s = sheets[i];
    detail.innerHTML = `<div class="sheet-big">${s.id}</div><div><div class="sheet-name">${s.name}</div><p>${s.d}</p><div class="sheet-question">${s.q}</div></div>`;
  }
  sheets.forEach((s, i) => {
    const tab = document.createElement('button');
    tab.className = 'sheet-tab'; tab.type = 'button'; tab.setAttribute('role', 'tab');
    tab.innerHTML = `<span class="sheet-id">${s.id}</span><span class="sheet-short">${s.short}</span>`;
    tab.addEventListener('click', () => select(i));
    strip.appendChild(tab);
  });
  select(0);
  el.appendChild(frame);
}
