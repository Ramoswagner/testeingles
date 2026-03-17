// ========================================
// app.js — LexiPro versão otimizada para mobile
// ========================================

// ----- CAT_ICONS (mesmos) -----
const CAT_ICONS = {
  engineering: `<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>`,
  pmgmt: `<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,
  finance: `<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>`,
  corporate: `<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,
  planning: `<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/>`,
  portfolio: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`
};

let CATS = {};

// ----- Estado global -----
const S = {
  cat: null,
  idx: 0,
  flipped: false,
  mode: 'study',
  qScore: 0,
  qTotal: 0,
  qAnswered: false,
  prog: {},
  streak: 0,
  lastDate: null
};

// ----- Conquistas -----
const ACHIEVEMENTS = [
  { id: 'first_card', name: 'Primeiro passo', desc: 'Estude seu primeiro card', icon: '🎓', condition: s => Object.values(s.prog).length >= 1 },
  { id: 'master_10', name: 'Aprendiz', desc: 'Domine 10 palavras', icon: '🌟', condition: s => Object.values(s.prog).filter(p => p.conf === 'easy').length >= 10 },
  { id: 'master_50', name: 'Profissional', desc: 'Domine 50 palavras', icon: '🏆', condition: s => Object.values(s.prog).filter(p => p.conf === 'easy').length >= 50 },
  { id: 'streak_7', name: 'Disciplina', desc: 'Estude 7 dias seguidos', icon: '🔥', condition: s => s.streak >= 7 },
  { id: 'streak_30', name: 'Inabalável', desc: 'Estude 30 dias seguidos', icon: '⚡', condition: s => s.streak >= 30 },
  { id: 'quiz_50', name: 'Mestre do Quiz', desc: 'Acerta 50 questões', icon: '🧠', condition: s => Object.values(s.prog).reduce((acc, p) => acc + (p.qc || 0), 0) >= 50 }
];
let unlockedAchievements = [];

function checkAchievements() {
  ACHIEVEMENTS.forEach(ach => {
    if (!unlockedAchievements.includes(ach.id) && ach.condition(S)) {
      unlockedAchievements.push(ach.id);
      toast(`🏆 Conquista desbloqueada: ${ach.name}`, 'achievement');
      saveAchievements();
    }
  });
}

function saveAchievements() {
  localStorage.setItem('lexipro_achievements', JSON.stringify(unlockedAchievements));
}

function loadAchievements() {
  try {
    const saved = localStorage.getItem('lexipro_achievements');
    if (saved) unlockedAchievements = JSON.parse(saved);
  } catch (e) {}
}

// ----- Carregar JSONs -----
async function loadAllCategories() {
  const categories = ['engineering', 'pmgmt', 'finance', 'corporate', 'planning', 'portfolio'];
  try {
    const promises = categories.map(async (cat) => {
      const response = await fetch(`data/${cat}.json`);
      if (!response.ok) throw new Error(`Erro ao carregar ${cat}.json`);
      const data = await response.json();
      return { [cat]: data };
    });
    const results = await Promise.all(promises);
    CATS = Object.assign({}, ...results);
    console.log('Dados carregados');
    initApp();
  } catch (error) {
    console.error('Falha ao carregar dados:', error);
    document.body.innerHTML = '<p>Erro ao carregar os cards. Tente novamente mais tarde.</p>';
  }
}

function initApp() {
  load();
  loadAchievements();
  renderHome();
}

// ----- Persistência -----
function load() {
  try {
    const d = JSON.parse(localStorage.getItem('lp3') || '{}');
    S.prog = d.prog || {};
    S.streak = d.streak || 0;
    S.lastDate = d.lastDate || null;
  } catch (e) {}
  checkStreak();
}

function save() {
  try {
    localStorage.setItem('lp3', JSON.stringify({
      prog: S.prog,
      streak: S.streak,
      lastDate: S.lastDate
    }));
  } catch (e) {}
}

function checkStreak() {
  const today = new Date().toDateString();
  const yest = new Date(Date.now() - 864e5).toDateString();
  if (S.lastDate === today) return;
  if (S.lastDate === yest) S.streak++;
  else if (S.lastDate && S.lastDate !== today) S.streak = 0;
  S.lastDate = today;
  save();
}

function markSeen(id) {
  if (!S.prog[id]) S.prog[id] = { seen: true, conf: null, qc: 0, qt: 0 };
  S.prog[id].seen = true;
  S.lastDate = new Date().toDateString();
  save();
}

// ----- Toast -----
function toast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast on ' + (type || '');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.className = 'toast', 2600);
}

// ----- Navegação -----
function showView(v) {
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
  const viewEl = document.getElementById('view-' + v);
  if (viewEl) viewEl.classList.add('active');
  const btnMap = { home: 'nb-home', progress: 'nb-prog', study: 'nb-home' };
  const btnId = btnMap[v];
  if (btnId) {
    const btn = document.getElementById(btnId);
    if (btn) btn.classList.add('active');
  }
  if (v === 'home') renderHome();
  else if (v === 'progress') renderProgress();
}

function goHome() {
  stopAudio();
  showView('home');
}

// ----- Áudio simplificado: apenas Web Speech API (rápido e funciona offline) -----
let _activeBtn = null;
let _spellTmrs = [];

function setActiveBtn(id) {
  if (_activeBtn) {
    const prev = document.getElementById(_activeBtn);
    if (prev) prev.classList.remove('playing');
  }
  _activeBtn = id;
  if (id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('playing');
    document.getElementById('wave-line').classList.add('on');
    const wl = document.getElementById('wave-line');
    if (id === 'pb-main') wl.style.color = 'var(--blue-l)';
    else if (id === 'pb-slow') wl.style.color = 'var(--cyan)';
    else wl.style.color = '#a78bfa';
  } else {
    document.getElementById('wave-line').classList.remove('on');
  }
}

function stopAudio() {
  _spellTmrs.forEach(clearTimeout);
  _spellTmrs = [];
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  setActiveBtn(null);
  resetSpellDisplay();
}

function resetSpellDisplay() {
  const sd = document.getElementById('spell-display');
  if (sd) {
    sd.classList.remove('on');
    sd.innerHTML = '';
  }
}

function speak(mode, e) {
  e?.stopPropagation();
  const card = CATS[S.cat]?.cards[S.idx];
  if (!card) return;
  const btnId = 'pb-' + (mode === 'normal' ? 'main' : mode);
  if (_activeBtn === btnId) { stopAudio(); return; }
  stopAudio();

  if (mode === 'normal' || mode === 'main') {
    setActiveBtn('pb-main');
    utter(card.term, 1.0, () => setActiveBtn(null));
  } else if (mode === 'slow') {
    setActiveBtn('pb-slow');
    utter(card.term, 0.5, () => setActiveBtn(null));
  } else if (mode === 'spell') {
    spellTerm(card.term);
  }
}

function utter(text, rate, onEnd) {
  if (!window.speechSynthesis) { onEnd(); return; }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate;
  utterance.pitch = 1;
  utterance.onend = utterance.onerror = onEnd;
  window.speechSynthesis.speak(utterance);
}

function spellTerm(term) {
  setActiveBtn('pb-spell');
  const letters = term.replace(/[^a-zA-Z\- ]/g, '').split('');
  const sd = document.getElementById('spell-display');
  if (!sd) return;
  sd.innerHTML = '';
  const tiles = [];
  letters.forEach((ch) => {
    const el = document.createElement('span');
    if (ch === ' ' || ch === '-') {
      el.className = 'sl sep';
      el.textContent = ch;
    } else {
      el.className = 'sl';
      el.textContent = ch.toUpperCase();
    }
    sd.appendChild(el);
    tiles.push({ el, ch, isChar: ch !== ' ' && ch !== '-' });
  });
  sd.classList.add('on');

  let delay = 0;
  const charDelay = 400;

  tiles.forEach((t) => {
    if (!t.isChar) return;
    const tmr = setTimeout(() => {
      tiles.forEach(x => { if (x.el.classList.contains('lit')) x.el.classList.replace('lit', 'done'); });
      t.el.classList.add('lit');
      utter(t.ch.toUpperCase(), 0.8, () => {});
    }, delay);
    _spellTmrs.push(tmr);
    delay += charDelay;
  });

  const done = setTimeout(() => {
    tiles.forEach(t => { if (t.isChar) { t.el.classList.remove('lit'); t.el.classList.add('done'); } });
    setActiveBtn(null);
    const fade = setTimeout(() => resetSpellDisplay(), 1500);
    _spellTmrs.push(fade);
  }, delay + 200);
  _spellTmrs.push(done);
}

// ----- Render Home -----
function renderHome() {
  updateHdr();
  const progValues = Object.values(S.prog);
  const studied = progValues.filter(p => p.seen).length;
  const mastered = progValues.filter(p => p.conf === 'easy').length;
  const totalQuiz = progValues.reduce((acc, p) => acc + (p.qt || 0), 0);
  const correctQuiz = progValues.reduce((acc, p) => acc + (p.qc || 0), 0);
  const accuracy = totalQuiz ? Math.round((correctQuiz / totalQuiz) * 100) + '%' : '—';
  document.getElementById('ov-studied').textContent = studied;
  document.getElementById('ov-mastered').textContent = mastered;
  document.getElementById('ov-streak').textContent = S.streak;
  document.getElementById('ov-acc').textContent = accuracy;

  const grid = document.getElementById('cat-grid');
  grid.innerHTML = '';
  Object.entries(CATS).forEach(([key, cat]) => {
    const total = cat.cards.length;
    const seen = cat.cards.filter(c => S.prog[c.id]?.seen).length;
    const masteredCat = cat.cards.filter(c => S.prog[c.id]?.conf === 'easy').length;
    const percent = total ? Math.round((masteredCat / total) * 100) : 0;
    const card = document.createElement('div');
    card.className = 'cat-card';
    card.style.setProperty('--cc', cat.color);
    card.onclick = () => openCat(key);
    card.innerHTML = `
      <div class="cc-top">
        <div class="cc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${CAT_ICONS[key]}</svg></div>
        <div>
          <div class="cc-cnt">${seen}/${total} estudados</div>
          <div class="cc-pct">${percent}%</div>
        </div>
      </div>
      <div class="cc-name">${cat.lbl}</div>
      <div class="cc-desc">${cat.desc}</div>
      <div class="cc-bar"><div class="cc-fill" style="width:${percent}%; background:${cat.color}"></div></div>
    `;
    grid.appendChild(card);
  });
}

function updateHdr() {
  const masteredCount = Object.values(S.prog).filter(p => p.conf === 'easy').length;
  document.getElementById('streak-n').textContent = S.streak;
  document.getElementById('mastery-pill').textContent = masteredCount + ' dominadas';
}

// ----- Study / Quiz -----
function openCat(catKey) {
  S.cat = catKey;
  S.idx = 0;
  S.flipped = false;
  S.qScore = 0;
  S.qTotal = 0;
  const cat = CATS[catKey];
  document.getElementById('sh-title').textContent = cat.lbl;
  showView('study');
  setMode('study');
}

function setMode(mode) {
  S.mode = mode;
  S.flipped = false;
  stopAudio();
  document.getElementById('tab-study').classList.toggle('active', mode === 'study');
  document.getElementById('tab-quiz').classList.toggle('active', mode === 'quiz');
  document.getElementById('pane-study').style.display = mode === 'study' ? 'block' : 'none';
  document.getElementById('pane-quiz').style.display = mode === 'quiz' ? 'block' : 'none';
  document.getElementById('sh-sub').textContent = mode === 'study' ? 'Modo estudo' : 'Modo quiz';
  renderCard();
}

function renderCard() {
  const cat = CATS[S.cat];
  const cards = cat.cards;
  const card = cards[S.idx];
  const dotsContainer = document.getElementById('prog-dots');
  dotsContainer.innerHTML = '';
  const vis = Math.min(cards.length, 14);
  for (let i = 0; i < vis; i++) {
    const dot = document.createElement('div');
    dot.className = 'pdot';
    if (i === S.idx) dot.classList.add('cur');
    else if (S.prog[cards[i]?.id]?.seen) dot.classList.add('done');
    dotsContainer.appendChild(dot);
  }
  document.getElementById('sh-cnt').textContent = `${S.idx + 1}/${cards.length}`;
  if (S.mode === 'study') renderStudy(card, cat);
  else renderQuiz(card, cat, cards);
  markSeen(card.id);
}

function renderStudy(card, cat) {
  const fc = document.getElementById('flashcard');
  fc.classList.remove('flipped');
  S.flipped = false;
  document.getElementById('conf-row').style.display = 'none';
  document.getElementById('fc-badge-txt').textContent = cat.lbl;
  document.getElementById('fc-term').textContent = card.term;
  document.getElementById('fc-phon').textContent = card.ph;
  document.getElementById('bk-pt').textContent = card.pt;
  document.getElementById('bk-def').textContent = card.def;
  document.getElementById('bk-ex').textContent = `"${card.ex}"`;
  document.getElementById('bk-tip').textContent = card.tip;
  resetSpellDisplay();
  stopAudio();
}

function renderQuiz(card, cat, cards) {
  document.getElementById('q-prompt').textContent = card.pt;
  document.getElementById('q-ctx').textContent = card.def;
  document.getElementById('q-score').textContent = `${S.qScore} corretas de ${S.qTotal}`;
  S.qAnswered = false;
  const allCards = Object.values(CATS).flatMap(c => c.cards);
  const pool = allCards.filter(c => c.id !== card.id);
  const wrongs = pool.sort(() => Math.random() - 0.5).slice(0, 3);
  const options = [card, ...wrongs].sort(() => Math.random() - 0.5);
  const optsContainer = document.getElementById('q-opts');
  optsContainer.innerHTML = '';
  ['A', 'B', 'C', 'D'].forEach((letter, i) => {
    if (!options[i]) return;
    const btn = document.createElement('button');
    btn.className = 'q-opt';
    btn.innerHTML = `<span class="opt-letter">${letter}</span><span class="opt-term">${options[i].term}</span>`;
    btn.onclick = () => answerQuiz(btn, options[i].id === card.id, card);
    optsContainer.appendChild(btn);
  });
}

function answerQuiz(btn, isCorrect, card) {
  if (S.qAnswered) return;
  S.qAnswered = true;
  S.qTotal++;
  if (!S.prog[card.id]) S.prog[card.id] = { seen: true, qc: 0, qt: 0 };
  S.prog[card.id].qt = (S.prog[card.id].qt || 0) + 1;
  if (isCorrect) {
    btn.classList.add('correct');
    S.qScore++;
    S.prog[card.id].qc = (S.prog[card.id].qc || 0) + 1;
    toast('✅ Correto!', 'ok');
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.q-opt').forEach(b => {
      if (b.querySelector('.opt-term')?.textContent === card.term) {
        b.classList.add('correct');
      }
    });
    toast(`❌ Era: ${card.term}`, 'err');
  }
  document.querySelectorAll('.q-opt').forEach(b => b.disabled = true);
  document.getElementById('q-score').textContent = `${S.qScore} corretas de ${S.qTotal}`;
  save();
  checkAchievements();
  setTimeout(() => nextCard(), 1900);
}

function prevCard() {
  const cards = CATS[S.cat].cards;
  S.idx = (S.idx - 1 + cards.length) % cards.length;
  renderCard();
}

function nextCard() {
  const cards = CATS[S.cat].cards;
  S.idx = (S.idx + 1) % cards.length;
  renderCard();
}

function flipCard() {
  if (S.mode !== 'study') return;
  const fc = document.getElementById('flashcard');
  S.flipped = !S.flipped;
  fc.classList.toggle('flipped', S.flipped);
  document.getElementById('conf-row').style.display = S.flipped ? 'flex' : 'none';
}

function rate(level) {
  const card = CATS[S.cat].cards[S.idx];
  if (!S.prog[card.id]) S.prog[card.id] = { seen: true };
  S.prog[card.id].conf = level;
  save();
  const messages = { easy: '✅ Dominado!', medium: '🤔 Continue praticando!', hard: '💪 Vai chegar lá!' };
  toast(messages[level], level === 'easy' ? 'ok' : '');
  checkAchievements();
  nextCard();
}

// ----- Progresso (com gráficos e conquistas) -----
function renderProgress() {
  const progValues = Object.values(S.prog);
  const studied = progValues.filter(p => p.seen).length;
  const mastered = progValues.filter(p => p.conf === 'easy').length;
  const totalQuiz = progValues.reduce((acc, p) => acc + (p.qt || 0), 0);
  const correctQuiz = progValues.reduce((acc, p) => acc + (p.qc || 0), 0);
  const accuracy = totalQuiz ? Math.round((correctQuiz / totalQuiz) * 100) + '%' : '—';
  document.getElementById('st-studied').textContent = studied;
  document.getElementById('st-mastered').textContent = mastered;
  document.getElementById('st-acc').textContent = accuracy;
  document.getElementById('st-streak').textContent = S.streak;

  // Conquistas
  const achGrid = document.getElementById('achievements-grid');
  if (achGrid) {
    achGrid.innerHTML = '';
    ACHIEVEMENTS.forEach(ach => {
      const unlocked = unlockedAchievements.includes(ach.id);
      const card = document.createElement('div');
      card.className = `achievement-card ${unlocked ? '' : 'locked'}`;
      card.innerHTML = `
        <div class="achievement-icon">${ach.icon}</div>
        <div class="achievement-name">${ach.name}</div>
        <div class="achievement-desc">${ach.desc}</div>
      `;
      achGrid.appendChild(card);
    });
  }

  // Domínio por categoria
  const masteryRows = document.getElementById('mastery-rows');
  masteryRows.innerHTML = '';
  Object.entries(CATS).forEach(([key, cat]) => {
    const total = cat.cards.length;
    const masteredCat = cat.cards.filter(c => S.prog[c.id]?.conf === 'easy').length;
    const percent = total ? Math.round((masteredCat / total) * 100) : 0;
    masteryRows.innerHTML += `
      <div class="m-row">
        <div class="m-cat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${CAT_ICONS[key]}</svg>
          ${cat.pt}
        </div>
        <div class="m-bg"><div class="m-fill" style="width:${percent}%; background:${cat.color}"></div></div>
        <div class="m-pct" style="color:${cat.color}">${percent}%</div>
      </div>
    `;
  });

  renderCharts();
}

function renderCharts() {
  const ctxDaily = document.getElementById('chart-daily');
  if (ctxDaily) {
    // Simular dados dos últimos 7 dias (idealmente viriam do histórico real)
    const labels = [];
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      labels.push(d.toLocaleDateString('pt-BR', { weekday: 'short' }));
      // Mock: se quiser dados reais, precisa armazenar histórico de estudos
      data.push(Math.floor(Math.random() * 8) + 1);
    }
    new Chart(ctxDaily, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Cards estudados',
          data: data,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.1)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  const ctxPie = document.getElementById('chart-pie');
  if (ctxPie) {
    const totalQuiz = Object.values(S.prog).reduce((acc, p) => acc + (p.qt || 0), 0);
    const correctQuiz = Object.values(S.prog).reduce((acc, p) => acc + (p.qc || 0), 0);
    const wrongQuiz = totalQuiz - correctQuiz;
    new Chart(ctxPie, {
      type: 'doughnut',
      data: {
        labels: ['Acertos', 'Erros'],
        datasets: [{
          data: [correctQuiz, wrongQuiz],
          backgroundColor: ['#10b981', '#f43f5e'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#94a3b8' } }
        }
      }
    });
  }
}

// ----- Keyboard shortcuts -----
document.addEventListener('keydown', e => {
  const v = document.querySelector('.view.active');
  if (!v || v.id !== 'view-study') return;
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  switch (e.key) {
    case 'ArrowLeft': prevCard(); break;
    case 'ArrowRight': nextCard(); break;
    case ' ': e.preventDefault(); if (S.mode === 'study') flipCard(); break;
    case 'p': case 'P': if (S.mode === 'study') speak('normal', null); break;
    case '1': if (S.flipped) rate('hard'); break;
    case '2': if (S.flipped) rate('medium'); break;
    case '3': if (S.flipped) rate('easy'); break;
  }
});

// ----- Inicialização -----
document.addEventListener('DOMContentLoaded', loadAllCategories);
