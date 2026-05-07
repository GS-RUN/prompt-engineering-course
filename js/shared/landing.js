/* ============================================================
   Landing page — render block cards from manifest
   ============================================================ */

(function () {
  const M = window.COURSE_MANIFEST;
  const grid = document.getElementById('blocks-grid');
  if (!M || !grid) return;

  document.getElementById('footer-version-tag') &&
    (document.getElementById('footer-version-tag').textContent = M.version);

  const cards = M.blocks.map(b => {
    const objsEs = (b.objectives.es || []).slice(0, 3).map(o => `<li>${o}</li>`).join('');
    const objsEn = (b.objectives.en || []).slice(0, 3).map(o => `<li>${o}</li>`).join('');
    const stub = b.stub ? '<span class="block-stub" data-i18n="stub-soon">Próximamente</span>' : '';
    return `
      <a class="block-card${b.stub ? ' is-stub' : ''}" href="modules/${b.slug}.html">
        <div class="block-card-head">
          <span class="block-icon">${b.icon}</span>
          <div>
            <div class="block-id">${b.id}</div>
            <div class="block-title">
              <span class="lang-block" data-lang="es">${b.title.es}</span>
              <span class="lang-block" data-lang="en">${b.title.en}</span>
            </div>
          </div>
        </div>
        <div class="block-card-meta">
          ${b.timeMinutes ? `<span>⏱️ ${b.timeMinutes} min</span>` : ''}
          ${b.level && b.level !== 'all' ? `<span class="block-level level-${b.level}">${b.level}</span>` : ''}
          ${stub}
        </div>
        <ul class="block-card-objs lang-block" data-lang="es">${objsEs}</ul>
        <ul class="block-card-objs lang-block" data-lang="en">${objsEn}</ul>
      </a>
    `;
  }).join('');

  grid.innerHTML = cards;
})();
