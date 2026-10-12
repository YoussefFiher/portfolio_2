// Interaction layer for the supplied portfolio markup.
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  if (hamburger && nav) {
    hamburger.setAttribute('role', 'button');
    hamburger.setAttribute('tabindex', '0');
    hamburger.setAttribute('aria-label', 'Toggle navigation');
    hamburger.setAttribute('aria-expanded', 'false');
    const syncMenu = () => hamburger.setAttribute('aria-expanded', String(nav.classList.contains('open')));
    hamburger.addEventListener('click', () => requestAnimationFrame(syncMenu));
    hamburger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); hamburger.click(); }
    });
    nav.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open'); syncMenu();
    }));
  }

  const reveal = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: .08, rootMargin: '0px 0px 50px 0px' });
    reveal.forEach(el => observer.observe(el));
  } else reveal.forEach(el => el.classList.add('visible'));

  document.querySelectorAll('.main-tabs .tab-btn').forEach(button => {
    button.addEventListener('click', () => {
      const target = button.dataset.tab;
      document.querySelectorAll('.main-tabs .tab-btn').forEach(b => b.classList.toggle('active', b === button));
      document.querySelectorAll('#courses .tab-panel').forEach(panel => panel.classList.toggle('active', panel.id === `tab-${target}`));
    });
  });
  document.querySelectorAll('#courses .sub-btn').forEach(button => {
    button.addEventListener('click', () => {
      const parent = button.closest('.tab-panel');
      if (!parent) return;
      parent.querySelectorAll('.sub-btn').forEach(b => b.classList.toggle('active', b === button));
      parent.querySelectorAll('.sub-panel').forEach(panel => panel.classList.toggle('active', panel.id === `sub-${button.dataset.sub}`));
    });
  });
  document.querySelectorAll('.proj-tab-btn').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.proj-tab-btn').forEach(b => b.classList.toggle('active', b === button));
      document.querySelectorAll('.proj-panel').forEach(panel => panel.classList.toggle('active', panel.id === `ptab-${button.dataset.ptab}`));
      document.querySelectorAll(`#ptab-${button.dataset.ptab} .reveal`).forEach(el => el.classList.add('visible'));
    });
  });

  const sections = [...document.querySelectorAll('main section[id], body > section[id]')];
  if ('IntersectionObserver' in window && nav) {
    const current = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        nav.querySelectorAll('a[href^="#"]').forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(s => current.observe(s));
  }
});

function expandCourses(panel) {
  const rows = [...document.querySelectorAll(`.course-row[data-panel="${panel}"]`)];
  const extra = rows.slice(3);
  const expanded = extra.some(row => row.dataset.hidden === 'true');
  extra.forEach(row => {
    row.dataset.hidden = expanded ? 'false' : 'true';
    row.classList.toggle('course-hidden', !expanded);
  });
  const button = document.querySelector(`#expand-${panel} .expand-btn`);
  if (!button) return;
  button.classList.toggle('expanded', expanded);
  button.setAttribute('aria-expanded', String(expanded));
  const en = button.querySelector('.expand-label-en');
  const fr = button.querySelector('.expand-label-fr');
  if (en) en.textContent = expanded ? 'Show fewer courses' : `Show ${extra.length} more courses`;
  if (fr) fr.textContent = expanded ? 'Afficher moins de cours' : `Afficher ${extra.length} cours de plus`;
}
