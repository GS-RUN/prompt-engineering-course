/* ============================================================
   Shared sidebar — generated from window.COURSE_MANIFEST
   ============================================================ */

(function () {
  const M = window.COURSE_MANIFEST;
  if (!M) {
    console.error('[sidebar] COURSE_MANIFEST not loaded');
    return;
  }

  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  // Locate which block we're on (set by data-page-block on body)
  const pageBlock = document.body?.dataset?.pageBlock || null;

  // Logo + lang/theme toggle (same pattern as legacy)
  const logoHtml = `
    <div id="sidebar-logo">
      <a href="${pageBlock === 'home' ? '#' : '../index.html'}" style="text-decoration:none;">
        <h2>🧠 Prompt Engineering</h2>
      </a>
      <span data-i18n="sidebar-subtitle">Master Course 2026</span>
      <div class="sidebar-toggles">
        <div class="lang-toggle">
          <button class="lang-btn active" data-lang="es">ES</button>
          <button class="lang-btn" data-lang="en">EN</button>
        </div>
        <button id="theme-toggle" aria-label="Toggle theme" title="Cambiar tema">🌙</button>
      </div>
    </div>
  `;

  // Build modules list
  const baseHref = pageBlock === 'home' ? 'modules/' : '';
  const moduleListHtml = M.blocks.map(b => {
    const href = `${baseHref}${b.slug}.html`;
    const isCurrent = b.id === pageBlock;
    const lvlBadge = b.level && b.level !== 'all' && b.level !== 'reference' && b.level !== 'reading'
      ? `<span class="sb-level sb-${b.level}">${b.level[0].toUpperCase()}</span>` : '';
    const stubMark = b.stub ? ' <span class="sb-stub">soon</span>' : '';
    return `
      <a class="sb-module-link${isCurrent ? ' active' : ''}" href="${href}">
        <span class="sb-icon">${b.icon}</span>
        <span class="sb-title">
          <span class="lang-block" data-lang="es">${b.title.es}</span>
          <span class="lang-block" data-lang="en">${b.title.en}</span>
        </span>
        ${lvlBadge}${stubMark}
      </a>
    `;
  }).join('\n');

  sidebar.innerHTML = `
    ${logoHtml}
    <div class="sb-modules">
      ${moduleListHtml}
    </div>
    <div class="sb-foot">
      <a href="${pageBlock === 'home' ? 'CHANGELOG.md' : '../CHANGELOG.md'}" data-i18n="sb-changelog">📝 Changelog</a>
      <span class="sb-version">v${M.version} · ${M.lastUpdated}</span>
    </div>
  `;
})();
