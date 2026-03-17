// ── EXPAND COURSES ──
function expandCourses(panelId, total) {
  var expandRow = document.getElementById('expand-' + panelId);
  var btn = expandRow ? expandRow.querySelector('.expand-btn') : null;
  if (!btn) return;
  var rows = document.querySelectorAll('.course-row[data-panel="' + panelId + '"]');
  var isExpanded = btn.classList.contains('expanded');
  if (!isExpanded) {
    rows.forEach(function(r) {
      r.removeAttribute('data-hidden');
      r.classList.remove('course-hidden');
    });
    btn.classList.add('expanded');
    btn.querySelector('.expand-label-en').textContent = 'Show less';
    btn.querySelector('.expand-label-fr').textContent = 'Réduire';
  } else {
    rows.forEach(function(r, i) {
      if (i >= 3) {
        r.setAttribute('data-hidden','true');
        r.classList.add('course-hidden');
      }
    });
    btn.classList.remove('expanded');
    var remaining = total - 3;
    btn.querySelector('.expand-label-en').textContent = 'Show ' + remaining + ' more courses';
    btn.querySelector('.expand-label-fr').textContent = 'Afficher ' + remaining + ' cours de plus';
  }
}

// ── PARTICLES ──
var canvas = document.getElementById('particles-canvas');
var ctx = canvas.getContext('2d');
var W, H, particles = [];
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
function Particle() { this.reset(); }
Particle.prototype.reset = function() {
  this.x = Math.random()*W; this.y = Math.random()*H;
  this.r = Math.random()*1.4+.3;
  this.vx = (Math.random()-.5)*.3; this.vy = (Math.random()-.5)*.3;
  this.alpha = Math.random()*.45+.08;
  this.color = Math.random()>.6 ? '#4f8ef7' : Math.random()>.5 ? '#06b6d4' : '#7c3aed';
};
Particle.prototype.update = function() {
  this.x += this.vx; this.y += this.vy;
  if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
};
Particle.prototype.draw = function() {
  ctx.save(); ctx.globalAlpha = this.alpha; ctx.fillStyle = this.color;
  ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI*2); ctx.fill(); ctx.restore();
};
function initParticles() {
  particles = [];
  var c = Math.min(110, Math.floor(W*H/13000));
  for (var i = 0; i < c; i++) particles.push(new Particle());
}
function drawLines() {
  for (var i = 0; i < particles.length; i++) {
    for (var j = i+1; j < particles.length; j++) {
      var dx = particles[i].x-particles[j].x, dy = particles[i].y-particles[j].y;
      var d = Math.sqrt(dx*dx+dy*dy);
      if (d < 110) {
        ctx.save(); ctx.globalAlpha = (1-d/110)*.07; ctx.strokeStyle = '#4f8ef7';
        ctx.lineWidth = .5; ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke(); ctx.restore();
      }
    }
  }
}
function animate() {
  ctx.clearRect(0, 0, W, H); drawLines();
  particles.forEach(function(p) { p.update(); p.draw(); });
  requestAnimationFrame(animate);
}
resize(); initParticles(); animate();
window.addEventListener('resize', function() { resize(); initParticles(); });

// ── TYPING ──
var currentRoles = ['Data Scientist','ML Engineer','Full-Stack Developer','BI Analyst'];
var ri = 0, ci = 0, deleting = false;
var typed = document.getElementById('typed-text');
function typeLoop() {
  var cur = currentRoles[ri];
  if (!deleting) {
    typed.textContent = cur.slice(0, ++ci);
    if (ci === cur.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
  } else {
    typed.textContent = cur.slice(0, --ci);
    if (ci === 0) { deleting = false; ri = (ri+1) % currentRoles.length; }
  }
  setTimeout(typeLoop, deleting ? 55 : 95);
}
typeLoop();

// ── SCROLL REVEAL ──
var obs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e, i) {
    if (e.isIntersecting) setTimeout(function() { e.target.classList.add('visible'); }, i * 70);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(function(el) { obs.observe(el); });

// ── ACTIVE NAV ──
window.addEventListener('scroll', function() {
  var sects = document.querySelectorAll('section[id]');
  var cur = '';
  sects.forEach(function(s) { if (window.scrollY >= s.offsetTop - 100) cur = s.id; });
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
  });
});

// ── COURSES MAIN TABS ──
document.querySelectorAll('.tab-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var tab = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
    document.querySelectorAll('.tab-panel').forEach(function(p) { p.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('tab-' + tab).classList.add('active');
  });
});

// ── COURSES SUB TABS ──
document.querySelectorAll('.sub-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var group = btn.dataset.group;
    var sub = btn.dataset.sub;
    var parentPanel = btn.closest('.tab-panel');
    parentPanel.querySelectorAll('.sub-btn').forEach(function(b) { b.classList.remove('active'); });
    parentPanel.querySelectorAll('.sub-panel').forEach(function(p) { p.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('sub-' + sub).classList.add('active');
  });
});

// ── PROJECT TABS ──
document.querySelectorAll('.proj-tab-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.proj-tab-btn').forEach(function(b) { b.classList.remove('active'); });
    document.querySelectorAll('.proj-panel').forEach(function(p) { p.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('ptab-' + btn.dataset.ptab).classList.add('active');
  });
});

// ── CAROUSEL ──
var currentSlide = 0;
function getTrack() { return document.getElementById('carouselTrack'); }
function updateCarousel() {
  var track = getTrack(); if (!track) return;
  track.style.transform = 'translateX(' + (-currentSlide * 100) + '%)';
  document.querySelectorAll('.carousel-dot').forEach(function(d, i) {
    d.classList.toggle('active', i === currentSlide);
  });
}
function nextSlide() { var n = getTrack().children.length; currentSlide = (currentSlide+1)%n; updateCarousel(); }
function prevSlide() { var n = getTrack().children.length; currentSlide = (currentSlide-1+n)%n; updateCarousel(); }
function goSlide(i) { currentSlide = i; updateCarousel(); }

// ── VIDEO UPLOAD ──
document.querySelectorAll('.video-placeholder').forEach(function(placeholder) {
  placeholder.addEventListener('click', function() {
    var input = document.createElement('input');
    input.type = 'file'; input.accept = 'video/mp4,video/*';
    input.onchange = function(e) {
      var file = e.target.files[0]; if (!file) return;
      var url = URL.createObjectURL(file);
      var vid = placeholder.querySelector('video');
      if (vid) {
        vid.src = url; vid.style.display = 'block'; vid.play();
        var playBtn = placeholder.querySelector('.play-btn');
        var label = placeholder.querySelector('.video-label');
        if (playBtn) playBtn.style.display = 'none';
        if (label) label.style.display = 'none';
      }
    };
    input.click();
  });
});

// ── LANGUAGE TOGGLE ──
var currentLang = 'en';
var translations = {
  en: {
    navItems: ['Home','Skills','Education','UNamur','Projects','Certifications'],
    navCta: 'Contact',
    heroBadge: 'Available for opportunities',
    heroDesc: "Master's student in Data Science at UNamur, passionate about turning raw data into actionable insights — bridging analytical rigor with modern web development.",
    heroBtn1: 'View Projects', heroBtn2: 'Download CV',
    statLabels: ['Projects','Languages spoken','Expected graduation'],
    sectionLabels: ['Expertise','Background','Academic','Portfolio','Credentials','Get in touch'],
    sectionTitles: ['Technical Skills','Education','UNamur Courses','Projects','Certifications','Contact'],
    tabBachelier:'Bachelier', tabMaster:'Master',
    subTabs: ['Bloc 1','Bloc 2','Bloc 3','Master 1','Master 2'],
    projTabs: ['🎓 Academic','💼 Professional','✨ Personal'],
    courseHeader: 'Course',
    contactTitle: "Let's work together",
    contactDesc: 'Open to internships, collaborations, or a good conversation about data science and tech.',
    formLabels: ['Name','Email','Subject','Message'],
    formPlaceholders: ['Your name','your@email.com',"What's this about?",'Tell me about your project or opportunity...'],
    sendBtn: 'Send Message',
    roles: ['Data Scientist','ML Engineer','Full-Stack Developer','BI Analyst'],
  },
  fr: {
    navItems: ['Accueil','Compétences','Formation','UNamur','Projets','Certifications'],
    navCta: 'Contact',
    heroBadge: 'Disponible pour des opportunités',
    heroDesc: "Étudiant en Master Data Science à UNamur, passionné par la transformation des données brutes en insights actionnables — alliant rigueur analytique et développement web moderne.",
    heroBtn1: 'Voir les projets', heroBtn2: 'Télécharger le CV',
    statLabels: ['Projets','Langues parlées','Diplôme prévu'],
    sectionLabels: ['Expertise','Parcours','Académique','Portfolio','Diplômes','Me contacter'],
    sectionTitles: ['Compétences Techniques','Formation','Cours UNamur','Projets','Certifications','Contact'],
    tabBachelier:'Bachelier', tabMaster:'Master',
    subTabs: ['Bloc 1','Bloc 2','Bloc 3','Master 1','Master 2'],
    projTabs: ['🎓 Académique','💼 Professionnel','✨ Personnel'],
    courseHeader: 'Cours',
    contactTitle: 'Travaillons ensemble',
    contactDesc: "Ouvert aux stages, collaborations, ou simplement une bonne discussion autour de la data science.",
    formLabels: ['Nom','Email','Sujet','Message'],
    formPlaceholders: ['Votre nom','votre@email.com','De quoi s\'agit-il ?','Parlez-moi de votre projet...'],
    sendBtn: 'Envoyer',
    roles: ['Data Scientist','Ingénieur ML','Développeur Full-Stack','Analyste BI'],
  }
};

function toggleLang() {
  currentLang = currentLang === 'en' ? 'fr' : 'en';
  var t = translations[currentLang];

  // Lang button
  document.getElementById('lang-flag').textContent = currentLang === 'en' ? '🇫🇷' : '🇬🇧';
  document.getElementById('lang-label').textContent = currentLang === 'en' ? 'FR' : 'EN';

  // Nav items
  var navAs = document.querySelectorAll('.nav-links a:not(.nav-cta)');
  navAs.forEach(function(a, i) { if (t.navItems[i]) a.textContent = t.navItems[i]; });

  // Hero badge
  var badgeEl = document.querySelector('.hero-badge');
  if (badgeEl) {
    var dot = badgeEl.querySelector('.hero-badge-dot');
    badgeEl.innerHTML = '';
    if (dot) badgeEl.appendChild(dot);
    badgeEl.appendChild(document.createTextNode(' ' + t.heroBadge));
  }

  // Hero desc
  var descEl = document.querySelector('.hero-desc');
  if (descEl) descEl.textContent = t.heroDesc;

  // Hero buttons text nodes
  var btns = document.querySelectorAll('.hero-btns .btn');
  if (btns[0]) { var svg0 = btns[0].querySelector('svg'); btns[0].textContent = ' ' + t.heroBtn1; if (svg0) btns[0].insertBefore(svg0, btns[0].firstChild); }
  if (btns[1]) { var svg1 = btns[1].querySelector('svg'); btns[1].textContent = ' ' + t.heroBtn2; if (svg1) btns[1].insertBefore(svg1, btns[1].firstChild); }

  // Stat labels
  document.querySelectorAll('.stat-label').forEach(function(el, i) { if (t.statLabels[i]) el.textContent = t.statLabels[i]; });

  // Section labels (skip the ::before pseudo via lastChild text)
  var secLabelEls = document.querySelectorAll('.section-label');
  secLabelEls.forEach(function(el, i) {
    // The text is the last text node
    var nodes = el.childNodes;
    for (var n = nodes.length-1; n >= 0; n--) {
      if (nodes[n].nodeType === 3) { nodes[n].textContent = ' ' + t.sectionLabels[i]; break; }
    }
  });

  // Section titles
  document.querySelectorAll('.section-title').forEach(function(el, i) { el.textContent = t.sectionTitles[i]; });

  // Course tabs
  document.querySelectorAll('.tab-btn').forEach(function(b) {
    if (b.dataset.tab === 'bachelier') b.textContent = t.tabBachelier;
    if (b.dataset.tab === 'master') b.textContent = t.tabMaster;
  });
  var subBtns = document.querySelectorAll('.sub-btn');
  subBtns.forEach(function(b, i) { if (t.subTabs[i]) b.textContent = t.subTabs[i]; });

  // Course table "Course" column header
  document.querySelectorAll('.courses-table thead th:nth-child(2)').forEach(function(th) { th.textContent = t.courseHeader; });

  // Project tabs
  document.querySelectorAll('.proj-tab-btn').forEach(function(b, i) { if (t.projTabs[i]) b.textContent = t.projTabs[i]; });

  // Contact
  var ctitle = document.querySelector('#contact h3');
  if (ctitle) ctitle.textContent = t.contactTitle;
  var cdesc = document.querySelector('#contact .contact-info > p');
  if (cdesc) cdesc.textContent = t.contactDesc;
  document.querySelectorAll('.form-group label').forEach(function(lb, i) { if (t.formLabels[i]) lb.textContent = t.formLabels[i]; });
  document.querySelectorAll('.form-group input, .form-group textarea').forEach(function(inp, i) { if (t.formPlaceholders[i]) inp.placeholder = t.formPlaceholders[i]; });
  var sendBtn = document.querySelector('#contact .btn-primary');
  if (sendBtn) { var svg = sendBtn.querySelector('svg'); sendBtn.innerHTML = ''; if (svg) sendBtn.appendChild(svg); sendBtn.appendChild(document.createTextNode(' ' + t.sendBtn)); }

  // Expand buttons
  document.querySelectorAll('.expand-label-en').forEach(function(el) { el.style.display = currentLang === 'en' ? '' : 'none'; });
  document.querySelectorAll('.expand-label-fr').forEach(function(el) { el.style.display = currentLang === 'fr' ? '' : 'none'; });

  // Typed roles
  currentRoles = t.roles;
  ri = 0; ci = 0; deleting = false;
}