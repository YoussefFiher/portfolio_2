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
    // NAV
    navItems: ['Home','Skills','Education','Experience','UNamur','Projects','Certifications'],
    navCta: 'Contact',

    // HERO
    heroBadge: 'Available for opportunities',
    heroDesc: "Master's student in Data Science at UNamur, passionate about turning raw data into actionable insights — bridging analytical rigor with modern web development.",
    heroBtn1: 'View Projects',
    heroBtn2: 'Download CV',
    heroCardSub: 'Namur, Belgium 🇧🇪',
    statLabels: ['Projects','Languages spoken','Expected graduation'],

    // SECTION LABELS & TITLES
    sectionLabels: ['Expertise','Background','Work','Academic','Portfolio','Credentials','Get in touch'],
    sectionTitles: ['Technical Skills','Education','Experience','UNamur Courses','Projects','Certifications','Contact'],

    // SKILLS
    skillCats: ['Programming','Data Analysis','ML & Visualization','Web Development'],

    // EDUCATION
    tlDates: ['SEP 2024 — PRESENT','SEP 2021 — 2024','SEP 2017 — JUN 2019','SEP 2016 — JUN 2017'],
    tlTitles: ["Master's Degree in Data Science","Bachelor's Degree in Computer Science","Specialized Technician Diploma — Mining & Quarrying","Baccalauréat"],
    tlPlaces: ['University of Namur · Belgium','University of Namur · Belgium','Marrakesh Institute of Mines · Morocco','Lycée Hassan 2 · Beni Mellal, Morocco'],

    // EXPERIENCE
    expPeriods: ['Feb 2025 — Jun 2025','Feb 2025 — Jun 2025'],
    expBadge: 'In Progress',
    expTitles: ['Research Intern — Mémoire (Master\'s Thesis)','Developer — Multilingual Translation System'],
    expOrgs: ['University of Namur','HMS Networks'],
    expLocs: ['Namur, Belgium','Belgium'],
    expBullets: [
      ['Research on test prioritization and selection using <strong>machine learning</strong> techniques',
       'Applied to <strong>Odoo</strong>, a large-scale open-source ERP project (Python)',
       'Compared ML models (classification, ranking) for predicting test failure likelihood',
       'Analyzed test history data, code coverage, and change impact for feature engineering',
       'Writing a scientific thesis following academic methodology standards'],
      ['Designed and implemented a back-office interface for marketing teams to manage web app translations using <strong>i18n tags</strong>',
       'Integrated the <strong>Lokalize API</strong> to automate translation workflows and synchronization between developers and translators',
       'Worked in Agile sprints (daily stand-ups, sprint planning, retrospectives) tracked via <strong>Jira</strong>']
    ],

    // COURSES
    tabBachelier: 'Bachelier',
    tabMaster: 'Master',
    subTabs: ['Bloc 1','Bloc 2','Bloc 3','Master 1','Master 2'],
    courseHeader: 'Course',
    expandMore: function(n) { return 'Show ' + n + ' more courses'; },
    expandLess: 'Show less',

    // PROJECTS
    projTabs: ['🎓 Academic','💼 Professional','✨ Personal'],
    projYears: [
      'BACHELOR 2024 · INFOB314 — SYNTAX & SEMANTICS',
      'BACHELOR 2024 · INFOB318 — INDIVIDUAL PROJECT',
      'MASTER 2025 · IDASM104 — DATA ANALYTICS PROJECT',
      'MASTER 2026 · INFOM232 — DEEP LEARNING',
      'FEB 2025 — JUN 2025 · UNIVERSITY OF NAMUR',
      'FEB 2025 — JUN 2025 · HMS NETWORKS · BELGIUM',
      'PERSONAL PROJECT · REGRESSION · STREAMLIT',
      'PERSONAL PROJECT · EDA · STREAMLIT',
      'PERSONAL PROJECT · CLASSIFICATION · REVOLUT CHALLENGE'
    ],
    projTitles: [
      'Emoji-to-Python Compiler',
      'Clothed — Clothing Donation Platform',
      'Seekr — Cultural Exploration App',
      'Galaxy Classification — Neural Networks',
      'Elia Energy Dashboard',
      'Multilingual Translation System',
      'House Prices Prediction',
      'Netflix Data Analysis & Visualization',
      'Fraudsters Detection — Revolut'
    ],
    projDescs: [
      'Built a compiler that converts an emoji-based programming language into Python code using ANTLR for lexical and syntactic analysis. Applied to control a micro-robot.',
      'Web application facilitating clothing donations with an intuitive interface to offer and search for items. Focused on UX and efficient donation management.',
      'Web app for cultural exploration using open data from Namur. Clustering and graph algorithms optimize art route planning with interactive geolocation experiences.',
      'Automatic classification of galaxies into 10 categories using CNNs trained on 15K images. Full pipeline: data exploration, preprocessing, model architecture (PyTorch), hyperparameter tuning, and Kaggle leaderboard submission.',
      'ETL pipeline on wind and solar energy data from Elia using SSIS. Built an interactive Power BI dashboard for energy performance visualization and operational decision-making.',
      'Collaborated with HMS Networks to design a multilingual back-office for marketing teams. Implemented i18n tag management, integrated the Lokalize API to automate translation workflows, and worked in Agile sprints tracked via Jira.',
      'End-to-end ML pipeline predicting house prices in Ames, Iowa. Data cleaning, feature engineering, log-transform of target variable, then Ridge Regression vs XGBoost comparison. Models evaluated with RMSE & R², deployed in an interactive Streamlit app via joblib.',
      'Exploratory analysis of Netflix titles dataset with Pandas. Cleans raw data, engineers date/category features, then surfaces insights — movies vs shows distribution, content evolution, popular genres & countries, ratings — through an interactive Streamlit dashboard.',
      "Take-home assignment inspired by Revolut's recruitment process. Explores fictional banking data (users, transactions, currencies) to detect fraudulent behavior. Feature engineering on transactional patterns, then Logistic Regression vs Random Forest vs Gradient Boosting compared by Accuracy, Precision, Recall, F1 & ROC-AUC. Streamlit app with prediction & visualization pages."
    ],
    confidentialElia: '⚠ Due to data confidentiality agreements, the dashboard and ETL transformations cannot be shared publicly.',
    confidentialHms: '⚠ Due to confidentiality agreements with HMS Networks, the source code and internal tooling cannot be shared publicly.',

    // CERTIFICATIONS
    certTitle: 'Certifications',
    certDates: ['Oct 2024','Oct 2024','Oct 2024','27 June 2025 · Mention: Satisfaction'],
    certVerify: 'Verify',
    certDownload: 'Download',

    // CONTACT
    contactTitle: "Let's work together",
    contactDesc: 'Open to internships, collaborations, or a good conversation about data science and tech.',
    contactItems: ['youssef.fiher.6@gmail.com','Namur, Belgium','+32 466 26 26 30'],
    formLabels: ['Name','Email','Subject','Message'],
    formPlaceholders: ['Your name','your@email.com',"What's this about?",'Tell me about your project or opportunity...'],
    sendBtn: 'Send Message',
    sendingBtn: 'Sending...',
    successMsg: '✓ Message sent! I will get back to you soon.',

    // FOOTER
    footerCopy: '© 2025 Youssef FIHER — Built with passion',

    // TYPED
    roles: ['Data Scientist','ML Engineer','Full-Stack Developer','BI Analyst'],
  },

  fr: {
    // NAV
    navItems: ['Accueil','Compétences','Formation','Expérience','UNamur','Projets','Certifications'],
    navCta: 'Contact',

    // HERO
    heroBadge: 'Disponible pour des opportunités',
    heroDesc: "Étudiant en Master Data Science à UNamur, passionné par la transformation des données brutes en insights actionnables — alliant rigueur analytique et développement web moderne.",
    heroBtn1: 'Voir les projets',
    heroBtn2: 'Télécharger le CV',
    heroCardSub: 'Namur, Belgique 🇧🇪',
    statLabels: ['Projets','Langues parlées','Diplôme prévu'],

    // SECTION LABELS & TITLES
    sectionLabels: ['Expertise','Parcours','Travail','Académique','Portfolio','Diplômes','Me contacter'],
    sectionTitles: ['Compétences Techniques','Formation','Expérience','Cours UNamur','Projets','Certifications','Contact'],

    // SKILLS
    skillCats: ['Programmation','Analyse de données','ML & Visualisation','Développement Web'],

    // EDUCATION
    tlDates: ['SEP 2024 — PRÉSENT','SEP 2021 — 2024','SEP 2017 — JUN 2019','SEP 2016 — JUN 2017'],
    tlTitles: ["Master en Data Science","Bachelier en Informatique","Technicien Spécialisé — Mines & Carrières","Baccalauréat"],
    tlPlaces: ['Université de Namur · Belgique','Université de Namur · Belgique','Institut des Mines de Marrakech · Maroc','Lycée Hassan 2 · Beni Mellal, Maroc'],

    // EXPERIENCE
    expPeriods: ['Fév 2025 — Juin 2025','Fév 2025 — Juin 2025'],
    expBadge: 'En cours',
    expTitles: ['Stagiaire Recherche — Mémoire de Master','Développeur — Système de Traduction Multilingue'],
    expOrgs: ['Université de Namur','HMS Networks'],
    expLocs: ['Namur, Belgique','Belgique'],
    expBullets: [
      ['Recherche sur la priorisation et la sélection de tests via des techniques de <strong>machine learning</strong>',
       'Appliqué à <strong>Odoo</strong>, un projet ERP open-source à grande échelle (Python)',
       'Comparaison de modèles ML (classification, ranking) pour prédire la probabilité d\'échec des tests',
       'Analyse des historiques de tests, couverture de code et impact des changements pour le feature engineering',
       'Rédaction d\'une thèse scientifique selon les standards académiques'],
      ['Conception et développement d\'une interface back-office pour la gestion des traductions avec des <strong>tags i18n</strong>',
       'Intégration de l\'<strong>API Lokalize</strong> pour automatiser les workflows de traduction entre développeurs et traducteurs',
       'Travail en sprints Agile (stand-ups, planification de sprint, rétrospectives) via <strong>Jira</strong>']
    ],

    // COURSES
    tabBachelier: 'Bachelier',
    tabMaster: 'Master',
    subTabs: ['Bloc 1','Bloc 2','Bloc 3','Master 1','Master 2'],
    courseHeader: 'Cours',
    expandMore: function(n) { return 'Afficher ' + n + ' cours de plus'; },
    expandLess: 'Réduire',

    // PROJECTS
    projTabs: ['🎓 Académique','💼 Professionnel','✨ Personnel'],
    projYears: [
      'BACHELIER 2024 · INFOB314 — SYNTAXE & SÉMANTIQUE',
      'BACHELIER 2024 · INFOB318 — PROJET INDIVIDUEL',
      'MASTER 2025 · IDASM104 — PROJET DATA ANALYTICS',
      'MASTER 2026 · INFOM232 — DEEP LEARNING',
      'FÉV 2025 — JUIN 2025 · UNIVERSITÉ DE NAMUR',
      'FÉV 2025 — JUIN 2025 · HMS NETWORKS · BELGIQUE',
      'PROJET PERSONNEL · RÉGRESSION · STREAMLIT',
      'PROJET PERSONNEL · EDA · STREAMLIT',
      'PROJET PERSONNEL · CLASSIFICATION · REVOLUT CHALLENGE'
    ],
    projTitles: [
      'Compilateur Emoji-vers-Python',
      'Clothed — Plateforme de Dons de Vêtements',
      'Seekr — Application d\'Exploration Culturelle',
      'Classification de Galaxies — Réseaux de Neurones',
      'Dashboard Énergétique Elia',
      'Système de Traduction Multilingue',
      'Prédiction des Prix Immobiliers',
      'Analyse des Données Netflix',
      'Détection de Fraudeurs — Revolut'
    ],
    projDescs: [
      'Compilateur traduisant un langage de programmation basé sur des emojis vers Python, via ANTLR pour l\'analyse lexicale et syntaxique. Appliqué au contrôle d\'un micro-robot.',
      'Application web facilitant les dons de vêtements avec une interface intuitive pour proposer et rechercher des articles. Focus sur l\'UX et la gestion efficace des dons.',
      'Application web d\'exploration culturelle utilisant les données ouvertes de Namur. Des algorithmes de clustering et de graphes optimisent la planification de circuits artistiques.',
      'Classification automatique de galaxies en 10 catégories via des CNN entraînés sur 15K images. Pipeline complet : exploration, prétraitement, architecture PyTorch, tuning et soumission Kaggle.',
      'Pipeline ETL sur les données éoliennes et solaires d\'Elia via SSIS. Dashboard Power BI interactif pour la visualisation des performances énergétiques et l\'aide à la décision.',
      'Collaboration avec HMS Networks pour concevoir un back-office multilingue pour les équipes marketing. Gestion des tags i18n, intégration de l\'API Lokalize, sprints Agile via Jira.',
      'Pipeline ML complet prédisant les prix immobiliers à Ames, Iowa. Nettoyage, feature engineering, log-transformation, puis comparaison Ridge Regression vs XGBoost. Déployé en app Streamlit.',
      'Analyse exploratoire du dataset Netflix avec Pandas. Nettoyage, feature engineering temporel, puis dashboard Streamlit interactif : distribution films/séries, genres populaires, pays, évolution du contenu.',
      'Mission inspirée du processus de recrutement Revolut. Exploration de données bancaires fictives pour détecter des comportements frauduleux. Feature engineering transactionnel, puis comparaison Logistic Regression vs Random Forest vs Gradient Boosting.'
    ],
    confidentialElia: '⚠ En raison d\'accords de confidentialité, le dashboard et les transformations ETL ne peuvent pas être partagés publiquement.',
    confidentialHms: '⚠ En raison d\'accords de confidentialité avec HMS Networks, le code source et les outils internes ne peuvent pas être partagés publiquement.',

    // CERTIFICATIONS
    certTitle: 'Certifications',
    certDates: ['Oct 2024','Oct 2024','Oct 2024','27 Juin 2025 · Mention : Satisfaction'],
    certVerify: 'Vérifier',
    certDownload: 'Télécharger',

    // CONTACT
    contactTitle: 'Travaillons ensemble',
    contactDesc: "Ouvert aux stages, collaborations, ou simplement une bonne discussion autour de la data science.",
    contactItems: ['youssef.fiher.6@gmail.com','Namur, Belgique','+32 466 26 26 30'],
    formLabels: ['Nom','Email','Sujet','Message'],
    formPlaceholders: ['Votre nom','votre@email.com','De quoi s\'agit-il ?','Parlez-moi de votre projet...'],
    sendBtn: 'Envoyer',
    sendingBtn: 'Envoi en cours...',
    successMsg: '✓ Message envoyé ! Je vous répondrai très bientôt.',

    // FOOTER
    footerCopy: '© 2025 Youssef FIHER — Fait avec passion',

    // TYPED
    roles: ['Data Scientist','Ingénieur ML','Développeur Full-Stack','Analyste BI'],
  }
};

function toggleLang() {
  currentLang = currentLang === 'en' ? 'fr' : 'en';
  var t = translations[currentLang];

  // ── Lang button
  document.getElementById('lang-flag').textContent = currentLang === 'en' ? '🇫🇷' : '🇬🇧';
  document.getElementById('lang-label').textContent = currentLang === 'en' ? 'FR' : 'EN';

  // ── Nav items
  var navAs = document.querySelectorAll('.nav-links a:not(.nav-cta)');
  navAs.forEach(function(a, i) { if (t.navItems[i]) a.textContent = t.navItems[i]; });

  // ── Hero badge
  var badgeEl = document.querySelector('.hero-badge');
  if (badgeEl) {
    var dot = badgeEl.querySelector('.hero-badge-dot');
    badgeEl.innerHTML = '';
    if (dot) badgeEl.appendChild(dot);
    badgeEl.appendChild(document.createTextNode(' ' + t.heroBadge));
  }

  // ── Hero desc
  var descEl = document.querySelector('.hero-desc');
  if (descEl) descEl.textContent = t.heroDesc;

  // ── Hero card sub
  var cardSub = document.querySelector('.hero-card-sub');
  if (cardSub) cardSub.textContent = t.heroCardSub;

  // ── Hero buttons
  var btns = document.querySelectorAll('.hero-btns .btn');
  if (btns[0]) { var svg0 = btns[0].querySelector('svg'); btns[0].textContent = ' ' + t.heroBtn1; if (svg0) btns[0].insertBefore(svg0, btns[0].firstChild); }
  if (btns[1]) { var svg1 = btns[1].querySelector('svg'); btns[1].textContent = ' ' + t.heroBtn2; if (svg1) btns[1].insertBefore(svg1, btns[1].firstChild); }

  // ── Stat labels
  document.querySelectorAll('.stat-label').forEach(function(el, i) { if (t.statLabels[i]) el.textContent = t.statLabels[i]; });

  // ── Section labels
  var secLabelEls = document.querySelectorAll('.section-label');
  secLabelEls.forEach(function(el, i) {
    var nodes = el.childNodes;
    for (var n = nodes.length - 1; n >= 0; n--) {
      if (nodes[n].nodeType === 3) { nodes[n].textContent = ' ' + t.sectionLabels[i]; break; }
    }
  });

  // ── Section titles
  document.querySelectorAll('.section-title').forEach(function(el, i) {
    if (t.sectionTitles[i]) el.textContent = t.sectionTitles[i];
  });

  // ── Skills categories
  document.querySelectorAll('.skill-cat').forEach(function(el, i) {
    if (t.skillCats[i]) el.textContent = t.skillCats[i];
  });

  // ── Education timeline
  document.querySelectorAll('.tl-date').forEach(function(el, i) {
    if (t.tlDates[i]) el.textContent = t.tlDates[i];
  });
  document.querySelectorAll('.tl-title').forEach(function(el, i) {
    if (t.tlTitles[i]) el.textContent = t.tlTitles[i];
  });
  document.querySelectorAll('.tl-place').forEach(function(el, i) {
    if (t.tlPlaces[i]) el.textContent = t.tlPlaces[i];
  });

  // ── Experience
  var expCards = document.querySelectorAll('.exp-card');
  expCards.forEach(function(card, i) {
    var period = card.querySelector('.exp-period');
    if (period && t.expPeriods[i]) period.textContent = t.expPeriods[i];
    var badge = card.querySelector('.exp-badge');
    if (badge && i === 0) badge.textContent = t.expBadge;
    var title = card.querySelector('.exp-title');
    if (title && t.expTitles[i]) title.textContent = t.expTitles[i];
    var orgName = card.querySelector('.exp-org-name');
    if (orgName && t.expOrgs[i]) orgName.textContent = t.expOrgs[i];
    var loc = card.querySelector('.exp-loc');
    if (loc && t.expLocs[i]) loc.textContent = t.expLocs[i];
    var bullets = card.querySelectorAll('.exp-bullets li');
    if (t.expBullets[i]) {
      bullets.forEach(function(li, j) {
        if (t.expBullets[i][j]) li.innerHTML = t.expBullets[i][j];
      });
    }
  });

  // ── Course tabs
  document.querySelectorAll('.tab-btn').forEach(function(b) {
    if (b.dataset.tab === 'bachelier') b.textContent = t.tabBachelier;
    if (b.dataset.tab === 'master') b.textContent = t.tabMaster;
  });
  var subBtns = document.querySelectorAll('.sub-btn');
  subBtns.forEach(function(b, i) { if (t.subTabs[i]) b.textContent = t.subTabs[i]; });

  // ── Course table headers
  document.querySelectorAll('.courses-table thead th:nth-child(2)').forEach(function(th) {
    th.textContent = t.courseHeader;
  });

  // ── Expand buttons
  document.querySelectorAll('.expand-btn').forEach(function(btn) {
    var enLabel = btn.querySelector('.expand-label-en');
    var frLabel = btn.querySelector('.expand-label-fr');
    if (enLabel) enLabel.style.display = currentLang === 'en' ? '' : 'none';
    if (frLabel) frLabel.style.display = currentLang === 'fr' ? '' : 'none';
  });

  // ── Project tabs
  document.querySelectorAll('.proj-tab-btn').forEach(function(b, i) {
    if (t.projTabs[i]) b.textContent = t.projTabs[i];
  });

  // ── Project cards
  var projCards = document.querySelectorAll('.proj-card');
  projCards.forEach(function(card, i) {
    var year = card.querySelector('.proj-year');
    if (year && t.projYears[i]) year.textContent = t.projYears[i];
    var title = card.querySelector('.proj-title');
    if (title && t.projTitles[i]) title.textContent = t.projTitles[i];
    var desc = card.querySelector('.proj-desc');
    if (desc && t.projDescs[i]) {
      // Preserve the confidentiality note if present
      var confNote = desc.querySelector('em');
      var confText = '';
      if (confNote) {
        // Update confidentiality note based on project
        if (i === 4) confText = '<br><br><em style="color:var(--text-muted);font-size:0.85em">' + t.confidentialElia + '</em>';
        if (i === 5) confText = '<br><br><em style="color:var(--text-muted);font-size:0.85em">' + t.confidentialHms + '</em>';
      }
      desc.innerHTML = t.projDescs[i] + confText;
    }
  });

  // ── Certifications
  var certDates = document.querySelectorAll('.cert-date');
  certDates.forEach(function(el, i) { if (t.certDates[i]) el.textContent = t.certDates[i]; });
  document.querySelectorAll('.cert-btn-verify').forEach(function(btn) {
    var svg = btn.querySelector('svg');
    btn.textContent = t.certVerify;
    if (svg) btn.insertBefore(svg, btn.firstChild);
  });
  document.querySelectorAll('.cert-btn-download').forEach(function(btn) {
    var svg = btn.querySelector('svg');
    btn.textContent = t.certDownload;
    if (svg) btn.insertBefore(svg, btn.firstChild);
  });

  // ── Contact
  var ctitle = document.querySelector('#contact h3');
  if (ctitle) ctitle.textContent = t.contactTitle;
  var cdesc = document.querySelector('#contact .contact-info > p');
  if (cdesc) cdesc.textContent = t.contactDesc;
  var contactItems = document.querySelectorAll('.contact-item span');
  contactItems.forEach(function(el, i) {
    if (i === 0) { var a = el.querySelector('a'); if (a) a.textContent = t.contactItems[0]; }
    else if (t.contactItems[i]) el.textContent = t.contactItems[i];
  });
  document.querySelectorAll('.form-group label').forEach(function(lb, i) {
    if (t.formLabels[i]) lb.textContent = t.formLabels[i];
  });
  document.querySelectorAll('.form-group input, .form-group textarea').forEach(function(inp, i) {
    if (t.formPlaceholders[i]) inp.placeholder = t.formPlaceholders[i];
  });
  var sendBtn = document.querySelector('#contact .btn-primary');
  if (sendBtn) {
    var svg = sendBtn.querySelector('svg');
    var btnText = document.getElementById('btn-text');
    if (btnText) btnText.textContent = t.sendBtn;
    else { sendBtn.innerHTML = ''; if (svg) sendBtn.appendChild(svg); sendBtn.appendChild(document.createTextNode(' ' + t.sendBtn)); }
  }

  // ── Footer
  var footerCopy = document.querySelector('.footer-copy');
  if (footerCopy) footerCopy.textContent = t.footerCopy;

  // ── Typed roles
  currentRoles = t.roles;
  ri = 0; ci = 0; deleting = false;
}