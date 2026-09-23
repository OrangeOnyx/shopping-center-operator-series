export function renderCalendar(el, months) {
  const frame = document.createElement('div');
  frame.className = 'ix-frame';
  frame.innerHTML = `<div class="ix-head"><span class="ix-title"><b>Interactive</b> — walk the operating year</span><span class="cc-caption">Twelve blocks, three forces: finance, weather, retail</span></div><span class="cc-caption">Quarters: Olive Q1 · Mustard Q2 · Terra Q3 · Ink Q4</span><div class="cal-grid" role="tablist"></div><div class="cal-detail" role="tabpanel"></div>`;
  const grid = frame.querySelector('.cal-grid');
  const detail = frame.querySelector('.cal-detail');
  const quarterInk = (i) => (i < 3 ? 'ink-olive' : i < 6 ? 'ink-mustard' : i < 9 ? 'ink-terra' : 'ink-ink');
  function select(i) {
    grid.querySelectorAll('.cal-month').forEach((t, ti) => { t.classList.toggle('active', ti === i); t.setAttribute('aria-selected', ti === i); });
    const m = months[i];
    detail.classList.remove('ink-olive', 'ink-mustard', 'ink-terra', 'ink-ink');
    detail.classList.add(quarterInk(i));
    detail.innerHTML = `<div class="cal-detail-title">${m.m} — ${m.title}</div><div class="cal-detail-focus">${m.focus}</div><ul>${m.items.map((it) => `<li>${it}</li>`).join('')}</ul>`;
  }
  months.forEach((m, i) => {
    const tab = document.createElement('button');
    tab.className = 'cal-month ' + quarterInk(i); tab.type = 'button'; tab.setAttribute('role', 'tab');
    tab.innerHTML = `<span class="cal-mname">${m.m}</span><span class="cal-mtitle">${m.title}</span>`;
    tab.addEventListener('click', () => select(i));
    grid.appendChild(tab);
  });
  select(new Date().getMonth());
  el.appendChild(frame);
}
