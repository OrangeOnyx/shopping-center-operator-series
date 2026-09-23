export function renderChecklist(el, cfg, checklistId) {
  const storageKey = 'cc-checklist:' + checklistId;
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch { saved = {}; }
  const total = cfg.sections.reduce((n, s) => n + s.items.length, 0);
  const frame = document.createElement('div');
  frame.className = 'ix-frame';
  frame.innerHTML = `
    <div class="ix-head">
      <span class="ix-title"><b>Interactive</b> — ${cfg.title}</span>
      <span class="ix-actions">
        <button class="btn btn-secondary btn-small" data-act="copy" type="button">Copy summary</button>
        <button class="btn btn-secondary btn-small" data-act="reset" type="button">Reset</button>
      </span>
    </div>
    <div class="ix-progress"><div class="ix-bar"><span></span></div>
      <div class="ix-progress-meta"><span class="ix-status-label">Not started</span><span class="ix-count"></span></div></div>
    <div class="ix-sections"></div>
    <div class="ix-foot"><span class="ix-score"></span><span>${cfg.storageNote || ''}</span></div>`;
  const sectionsEl = frame.querySelector('.ix-sections');
  cfg.sections.forEach((sec, si) => {
    const secEl = document.createElement('div');
    secEl.className = 'ix-section' + (si === 0 ? ' open' : '');
    const doneCount = sec.items.filter((_, ii) => saved[si + ':' + ii]).length;
    secEl.innerHTML = `
      <div class="ix-section-head" role="button" tabindex="0" aria-expanded="${si === 0}">
        <span class="ix-sec-title">${sec.title}</span>
        <span class="ix-sec-count" data-sec-count>${doneCount}/${sec.items.length}</span>
        <span class="ix-caret" aria-hidden="true"></span>
      </div>
      <div class="ix-section-body"></div>`;
    const body = secEl.querySelector('.ix-section-body');
    sec.items.forEach((item, ii) => {
      const key = si + ':' + ii;
      const row = document.createElement('label');
      row.className = 'ix-item' + (saved[key] ? ' done' : '');
      row.innerHTML = `<input type="checkbox" ${saved[key] ? 'checked' : ''} aria-label="${item.t.replace(/"/g, '&quot;')}">
        <span><span class="ix-item-text">${item.t}</span>${item.n ? `<div class="ix-item-note">${item.n}</div>` : ''}</span>`;
      const cb = row.querySelector('input');
      cb.addEventListener('change', () => {
        saved[key] = cb.checked;
        row.classList.toggle('done', cb.checked);
        localStorage.setItem(storageKey, JSON.stringify(saved));
        update();
      });
      body.appendChild(row);
    });
    const head = secEl.querySelector('.ix-section-head');
    const toggle = () => { secEl.classList.toggle('open'); head.setAttribute('aria-expanded', secEl.classList.contains('open')); };
    head.addEventListener('click', toggle);
    head.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    sectionsEl.appendChild(secEl);
  });
  const bar = frame.querySelector('.ix-bar > span');
  const countEl = frame.querySelector('.ix-count');
  const statusEl = frame.querySelector('.ix-status-label');
  const scoreEl = frame.querySelector('.ix-score');
  function update() {
    let done = 0;
    cfg.sections.forEach((sec, si) => {
      let secDone = 0;
      sec.items.forEach((_, ii) => { if (saved[si + ':' + ii]) { secDone++; done++; } });
      sectionsEl.children[si].querySelector('[data-sec-count]').textContent = secDone + '/' + sec.items.length;
    });
    const pct = Math.round((done / total) * 100);
    bar.style.width = pct + '%';
    countEl.textContent = done + ' of ' + total + ' complete';
    statusEl.textContent = pct === 100 ? 'Complete' : pct >= 75 ? 'In progress — strong' : pct >= 40 ? 'In progress' : pct > 0 ? 'In progress — early' : 'Not started';
    scoreEl.innerHTML = `Score: <b>${pct}%</b>`;
  }
  frame.querySelector('[data-act="reset"]').addEventListener('click', () => {
    if (!confirm('Reset all checklist progress for this article?')) return;
    saved = {};
    localStorage.removeItem(storageKey);
    frame.querySelectorAll('.ix-item input').forEach((cb) => { cb.checked = false; });
    frame.querySelectorAll('.ix-item').forEach((r) => r.classList.remove('done'));
    update();
  });
  frame.querySelector('[data-act="copy"]').addEventListener('click', () => {
    const lines = [cfg.title + ' — ' + new Date().toISOString().slice(0, 10)];
    cfg.sections.forEach((sec, si) => { lines.push('', sec.title); sec.items.forEach((item, ii) => lines.push((saved[si + ':' + ii] ? '[x] ' : '[ ] ') + item.t)); });
    const btn = frame.querySelector('[data-act="copy"]');
    navigator.clipboard.writeText(lines.join('\n')).then(() => { btn.textContent = 'Copied'; setTimeout(() => { btn.textContent = 'Copy summary'; }, 1600); });
  });
  update();
  el.appendChild(frame);
}
