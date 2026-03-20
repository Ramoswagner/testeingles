// ══════════════════════════════════════════════════
// Wagner.English — Executive Vocabulary
// app.js — production ready
// ══════════════════════════════════════════════════

const CAT_ICONS = {
  engineering: `<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>`,
  pmgmt:        `<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,
  finance:      `<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>`,
  corporate:    `<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,
  planning:     `<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/>`,
  portfolio:    `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
  pmbok:        `<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>`
};

let CATS = {};

const S = {
  cat: null, idx: 0, flipped: false,
  mode: 'study', qScore: 0, qTotal: 0, qAnswered: false,
  prog: {}, streak: 0, lastDate: null, daily: {}
};

const _charts = {};

// ── Conquistas ──────────────────────────────────────────────
const ACHIEVEMENTS = [
  { id: 'first_card', name: 'Primeiro passo', desc: 'Estude seu primeiro card',     icon: '🎓', condition: s => Object.values(s.prog).length >= 1 },
  { id: 'master_10',  name: 'Aprendiz',       desc: 'Domine 10 palavras',           icon: '🌟', condition: s => Object.values(s.prog).filter(p => p.conf === 'easy').length >= 10 },
  { id: 'master_50',  name: 'Profissional',   desc: 'Domine 50 palavras',           icon: '🏆', condition: s => Object.values(s.prog).filter(p => p.conf === 'easy').length >= 50 },
  { id: 'streak_7',   name: 'Disciplina',     desc: 'Estude 7 dias seguidos',       icon: '🔥', condition: s => s.streak >= 7 },
  { id: 'streak_30',  name: 'Inabalável',     desc: 'Estude 30 dias seguidos',      icon: '⚡', condition: s => s.streak >= 30 },
  { id: 'quiz_50',    name: 'Mestre do Quiz', desc: 'Acerte 50 questões',           icon: '🧠', condition: s => Object.values(s.prog).reduce((a, p) => a + (p.qc || 0), 0) >= 50 }
];
let unlockedAchievements = [];

function checkAchievements() {
  ACHIEVEMENTS.forEach(ach => {
    if (!unlockedAchievements.includes(ach.id) && ach.condition(S)) {
      unlockedAchievements.push(ach.id);
      toast(`🏆 ${ach.name}`, 'achievement');
      saveAchievements();
    }
  });
}
function saveAchievements() { try { localStorage.setItem('we_ach', JSON.stringify(unlockedAchievements)); } catch(e){} }
function loadAchievements() { try { const s = localStorage.getItem('we_ach'); if (s) unlockedAchievements = JSON.parse(s); } catch(e){} }

// ── Load data ───────────────────────────────────────────────
async function loadAllCategories() {
  const cats = ['engineering','pmgmt','finance','corporate','planning','portfolio','pmbok'];
  try {
    const results = await Promise.all(cats.map(async c => {
      const r = await fetch(`data/${c}.json`);
      if (!r.ok) throw new Error(`Falha: ${c}.json`);
      return { [c]: await r.json() };
    }));
    CATS = Object.assign({}, ...results);
    initApp();
  } catch(err) {
    console.error(err);
    document.body.innerHTML = '<div style="padding:2rem;font-family:sans-serif;color:#F87171;">Erro ao carregar. Verifique a pasta /data e recarregue.</div>';
  }
}

function initApp() {
  load();
  loadAchievements();
  updateTotalCount();
  renderHome();
}

// ── Persistence ─────────────────────────────────────────────
function load() {
  try {
    const d = JSON.parse(localStorage.getItem('we_data') || '{}');
    S.prog = d.prog || {}; S.streak = d.streak || 0;
    S.lastDate = d.lastDate || null; S.daily = d.daily || {};
  } catch(e) {}
  checkStreak();
}
function save() {
  try { localStorage.setItem('we_data', JSON.stringify({ prog: S.prog, streak: S.streak, lastDate: S.lastDate, daily: S.daily })); } catch(e) {}
}
function checkStreak() {
  const today = new Date().toDateString();
  const yest  = new Date(Date.now() - 864e5).toDateString();
  if (S.lastDate === today) return;
  if (S.lastDate === yest)  S.streak++;
  else if (!S.lastDate)     S.streak = 1;
  else                      S.streak = 0;
  S.lastDate = today; save();
}
function markSeen(id) {
  if (!S.prog[id]) S.prog[id] = { seen: true, conf: null, qc: 0, qt: 0 };
  S.prog[id].seen = true;
  const today = new Date().toDateString();
  S.lastDate = today;
  if (!S.daily) S.daily = {};
  S.daily[today] = (S.daily[today] || 0) + 1;
  save();
}
function updateTotalCount() {
  const total = Object.values(CATS).reduce((a, c) => a + c.cards.length, 0);
  const el = document.getElementById('hs-total-cards');
  if (el) el.textContent = total;
}

// ── Toast ────────────────────────────────────────────────────
function toast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg; t.className = 'toast on ' + type;
  clearTimeout(t._t);
  t._t = setTimeout(() => { t.className = 'toast'; }, 2800);
}

// ── Navigation ───────────────────────────────────────────────
function showView(v) {
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nv').forEach(el => el.classList.remove('active'));
  const vEl = document.getElementById('view-' + v);
  if (vEl) vEl.classList.add('active');
  const map = { home: 'nb-home', progress: 'nb-prog', study: 'nb-home' };
  const btn = document.getElementById(map[v]);
  if (btn) btn.classList.add('active');
  if (v === 'home')     renderHome();
  if (v === 'progress') renderProgress();
}
function goHome() { stopAudio(); showView('home'); }

// ── Audio ────────────────────────────────────────────────────
let _activeBtn = null, _spellTmrs = [];

function setActiveBtn(id) {
  if (_activeBtn) { const p = document.getElementById(_activeBtn); if (p) p.classList.remove('playing'); }
  _activeBtn = id;
  const wl = document.getElementById('wave-line');
  if (id) {
    const el = document.getElementById(id); if (el) el.classList.add('playing');
    wl.classList.add('on');
    wl.style.color = id === 'pb-main' ? 'var(--blue-hi)' : id === 'pb-slow' ? 'var(--warm-hi)' : '#a78bfa';
  } else { wl.classList.remove('on'); }
}
function stopAudio() {
  _spellTmrs.forEach(clearTimeout); _spellTmrs = [];
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  setActiveBtn(null); resetSpell();
}
function resetSpell() {
  const sd = document.getElementById('spell-display');
  if (sd) { sd.classList.remove('on'); sd.innerHTML = ''; }
}
function speak(mode, e) {
  e?.stopPropagation();
  const card = CATS[S.cat]?.cards[S.idx]; if (!card) return;
  const btnId = mode === 'normal' ? 'pb-main' : 'pb-' + mode;
  if (_activeBtn === btnId) { stopAudio(); return; }
  stopAudio();
  if (mode === 'normal') { setActiveBtn('pb-main'); utter(card.term, 1.0, () => setActiveBtn(null)); }
  else if (mode === 'slow')  { setActiveBtn('pb-slow'); utter(card.term, 0.5, () => setActiveBtn(null)); }
  else if (mode === 'spell') { spellTerm(card.term); }
}
function utter(text, rate, onEnd) {
  if (!window.speechSynthesis) { onEnd(); return; }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US'; u.rate = rate; u.pitch = 1;
  u.onend = u.onerror = onEnd;
  window.speechSynthesis.speak(u);
}
function spellTerm(term) {
  setActiveBtn('pb-spell');
  const letters = term.replace(/[^a-zA-Z\- ]/g, '').split('');
  const sd = document.getElementById('spell-display'); if (!sd) return;
  sd.innerHTML = '';
  const tiles = [];
  letters.forEach(ch => {
    const el = document.createElement('span');
    if (ch === ' ' || ch === '-') { el.className = 'sl sep'; el.textContent = ch; }
    else { el.className = 'sl'; el.textContent = ch.toUpperCase(); }
    sd.appendChild(el); tiles.push({ el, ch, isChar: ch !== ' ' && ch !== '-' });
  });
  sd.classList.add('on');
  let delay = 0;
  tiles.forEach(t => {
    if (!t.isChar) return;
    _spellTmrs.push(setTimeout(() => {
      tiles.forEach(x => { if (x.el.classList.contains('lit')) x.el.classList.replace('lit','done'); });
      t.el.classList.add('lit'); utter(t.ch.toUpperCase(), 0.8, () => {});
    }, delay));
    delay += 400;
  });
  _spellTmrs.push(setTimeout(() => {
    tiles.forEach(t => { if (t.isChar) { t.el.classList.remove('lit'); t.el.classList.add('done'); } });
    setActiveBtn(null);
    _spellTmrs.push(setTimeout(resetSpell, 1500));
  }, delay + 200));
}

// ── Home ─────────────────────────────────────────────────────
function renderHome() {
  updateHdr();
  const pv = Object.values(S.prog);
  const studied = pv.filter(p => p.seen).length;
  const mastered = pv.filter(p => p.conf === 'easy').length;
  const tQ = pv.reduce((a, p) => a + (p.qt || 0), 0);
  const cQ = pv.reduce((a, p) => a + (p.qc || 0), 0);
  document.getElementById('ov-studied').textContent  = studied;
  document.getElementById('ov-mastered').textContent = mastered;
  document.getElementById('ov-streak').textContent   = S.streak;
  document.getElementById('ov-acc').textContent      = tQ ? Math.round((cQ/tQ)*100)+'%' : '—';

  const grid = document.getElementById('cat-grid');
  grid.innerHTML = '';
  Object.entries(CATS).forEach(([key, cat], i) => {
    const total = cat.cards.length;
    const seen  = cat.cards.filter(c => S.prog[c.id]?.seen).length;
    const mCat  = cat.cards.filter(c => S.prog[c.id]?.conf === 'easy').length;
    const pct   = total ? Math.round((mCat/total)*100) : 0;
    const el = document.createElement('div');
    el.className = 'cat-card';
    el.style.setProperty('--cc', cat.color);
    el.setAttribute('data-num', String(i + 1).padStart(2,'0'));
    el.onclick = () => openCat(key);
    el.innerHTML = `
      <div class="cc-top">
        <div class="cc-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${CAT_ICONS[key]}</svg>
        </div>
        <div class="cc-stat">
          <div class="cc-cnt">${seen}/${total}</div>
          <div class="cc-pct">${pct}%</div>
        </div>
      </div>
      <div class="cc-name">${cat.lbl}</div>
      <div class="cc-desc">${cat.desc}</div>
      <div class="cc-bar"><div class="cc-fill" style="width:${pct}%"></div></div>
    `;
    grid.appendChild(el);
  });
}
function updateHdr() {
  const mc = Object.values(S.prog).filter(p => p.conf === 'easy').length;
  document.getElementById('streak-n').textContent = S.streak;
  const mp = document.getElementById('mastery-pill');
  if (mp) mp.innerHTML = `<span>${mc}</span> dominadas`;
}

// ── Study ────────────────────────────────────────────────────
function openCat(catKey) {
  S.cat = catKey; S.idx = 0; S.flipped = false; S.qScore = 0; S.qTotal = 0;
  document.getElementById('sh-title').textContent = CATS[catKey].lbl;
  showView('study'); setMode('study');
}
function setMode(mode) {
  S.mode = mode; S.flipped = false; stopAudio();
  document.getElementById('tab-study').classList.toggle('active', mode === 'study');
  document.getElementById('tab-quiz').classList.toggle('active', mode === 'quiz');
  document.getElementById('pane-study').style.display = mode === 'study' ? 'block' : 'none';
  document.getElementById('pane-quiz').style.display  = mode === 'quiz'  ? 'block' : 'none';
  document.getElementById('sh-sub').textContent = mode === 'study' ? 'flashcard' : 'quiz';
  renderCard();
}
function renderCard() {
  const cat = CATS[S.cat], cards = cat.cards, card = cards[S.idx];
  const dots = document.getElementById('dot-track') || document.getElementById('prog-dots');
  if (dots) {
    dots.innerHTML = '';
    const vis = Math.min(cards.length, 14);
    for (let i = 0; i < vis; i++) {
      const d = document.createElement('div');
      d.className = 'pdot' + (i === S.idx ? ' cur' : S.prog[cards[i]?.id]?.seen ? ' done' : '');
      dots.appendChild(d);
    }
  }
  document.getElementById('sh-cnt').textContent = `${S.idx + 1} / ${cards.length}`;
  if (S.mode === 'study') renderStudy(card, cat);
  else renderQuiz(card);
  markSeen(card.id);
}
function renderStudy(card, cat) {
  document.getElementById('flashcard').classList.remove('flipped');
  S.flipped = false;
  document.getElementById('conf-row').style.display = 'none';
  document.getElementById('fc-badge-txt').textContent = cat.lbl;
  document.getElementById('fc-term').textContent = card.term;
  document.getElementById('fc-phon').textContent = card.ph;
  document.getElementById('bk-pt').textContent  = card.pt;
  document.getElementById('bk-def').textContent = card.def;
  document.getElementById('bk-ex').textContent  = `"${card.ex}"`;
  document.getElementById('bk-tip').textContent = card.tip;
  resetSpell(); stopAudio();
}
function renderQuiz(card) {
  document.getElementById('q-prompt').textContent = card.pt;
  document.getElementById('q-ctx').textContent    = card.def;
  document.getElementById('q-score').textContent  = `${S.qScore} corretas de ${S.qTotal}`;
  S.qAnswered = false;
  const pool    = Object.values(CATS).flatMap(c => c.cards).filter(c => c.id !== card.id);
  const wrongs  = pool.sort(() => Math.random() - 0.5).slice(0, 3);
  const options = [card, ...wrongs].sort(() => Math.random() - 0.5);
  const container = document.getElementById('q-opts');
  container.innerHTML = '';
  ['A','B','C','D'].forEach((letter, i) => {
    if (!options[i]) return;
    const btn = document.createElement('button');
    btn.className = 'q-opt';
    btn.innerHTML = `<span class="opt-letter">${letter}</span><span class="opt-term">${options[i].term}</span>`;
    btn.onclick = () => answerQuiz(btn, options[i].id === card.id, card);
    container.appendChild(btn);
  });
}
function answerQuiz(btn, isCorrect, card) {
  if (S.qAnswered) return;
  S.qAnswered = true; S.qTotal++;
  if (!S.prog[card.id]) S.prog[card.id] = { seen: true, qc: 0, qt: 0 };
  S.prog[card.id].qt = (S.prog[card.id].qt || 0) + 1;
  if (isCorrect) {
    btn.classList.add('correct'); S.qScore++;
    S.prog[card.id].qc = (S.prog[card.id].qc || 0) + 1;
    toast('✓ Correto!', 'ok');
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.q-opt').forEach(b => { if (b.querySelector('.opt-term')?.textContent === card.term) b.classList.add('correct'); });
    toast(`✗ Era: ${card.term}`, 'err');
  }
  document.querySelectorAll('.q-opt').forEach(b => b.disabled = true);
  document.getElementById('q-score').textContent = `${S.qScore} corretas de ${S.qTotal}`;
  save(); checkAchievements();
  setTimeout(nextCard, 1900);
}
function prevCard() { S.idx = (S.idx - 1 + CATS[S.cat].cards.length) % CATS[S.cat].cards.length; renderCard(); }
function nextCard() { S.idx = (S.idx + 1) % CATS[S.cat].cards.length; renderCard(); }
function flipCard() {
  if (S.mode !== 'study') return;
  S.flipped = !S.flipped;
  document.getElementById('flashcard').classList.toggle('flipped', S.flipped);
  document.getElementById('conf-row').style.display = S.flipped ? 'flex' : 'none';
}
function rate(level) {
  const card = CATS[S.cat].cards[S.idx];
  if (!S.prog[card.id]) S.prog[card.id] = { seen: true };
  S.prog[card.id].conf = level; save(); checkAchievements();
  const msg = { easy: '✓ Dominado!', medium: 'Continue praticando.', hard: 'Vai chegar lá.' };
  toast(msg[level], level === 'easy' ? 'ok' : '');
  nextCard();
}

// ── Progress ─────────────────────────────────────────────────
function renderProgress() {
  const pv = Object.values(S.prog);
  const studied  = pv.filter(p => p.seen).length;
  const mastered = pv.filter(p => p.conf === 'easy').length;
  const tQ = pv.reduce((a,p) => a+(p.qt||0),0);
  const cQ = pv.reduce((a,p) => a+(p.qc||0),0);
  document.getElementById('st-studied').textContent  = studied;
  document.getElementById('st-mastered').textContent = mastered;
  document.getElementById('st-acc').textContent      = tQ ? Math.round((cQ/tQ)*100)+'%' : '—';
  document.getElementById('st-streak').textContent   = S.streak;

  // Conquistas
  const achGrid = document.getElementById('achievements-grid');
  if (achGrid) {
    achGrid.innerHTML = '';
    ACHIEVEMENTS.forEach(ach => {
      const unlocked = unlockedAchievements.includes(ach.id);
      const el = document.createElement('div');
      el.className = `achievement-card ${unlocked ? 'unlocked' : 'locked'}`;
      el.innerHTML = `<div class="achievement-icon">${ach.icon}</div><div class="achievement-name">${ach.name}</div><div class="achievement-desc">${ach.desc}</div>`;
      achGrid.appendChild(el);
    });
  }

  // Mastery rows
  const masteryRows = document.getElementById('mastery-rows');
  masteryRows.innerHTML = '';
  Object.entries(CATS).forEach(([key, cat]) => {
    const total = cat.cards.length;
    const mCat  = cat.cards.filter(c => S.prog[c.id]?.conf === 'easy').length;
    const pct   = total ? Math.round((mCat/total)*100) : 0;
    const row = document.createElement('div');
    row.className = 'm-row';
    row.innerHTML = `
      <div class="m-cat">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${CAT_ICONS[key]}</svg>
        ${cat.pt}
      </div>
      <div class="m-bg"><div class="m-fill" style="width:${pct}%; background:${cat.color}"></div></div>
      <div class="m-pct" style="color:${cat.color}">${pct}%</div>
    `;
    masteryRows.appendChild(row);
  });

  renderCharts();
}

function renderCharts() {
  if (_charts.daily) { _charts.daily.destroy(); delete _charts.daily; }
  if (_charts.pie)   { _charts.pie.destroy();   delete _charts.pie;   }

  const ctxDaily = document.getElementById('chart-daily');
  if (ctxDaily) {
    const labels = [], data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      labels.push(d.toLocaleDateString('pt-BR', { weekday: 'short' }));
      data.push(S.daily[d.toDateString()] || 0);
    }
    _charts.daily = new Chart(ctxDaily, {
      type: 'line',
      data: { labels, datasets: [{ data, borderColor: '#2862A8', backgroundColor: 'rgba(26,79,138,0.09)', tension: 0.4, fill: true, pointBackgroundColor: '#2862A8', pointRadius: 4, pointHoverRadius: 6, borderWidth: 1.5 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { color: '#3A5068', stepSize: 1, font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.03)' } }, x: { ticks: { color: '#3A5068', font: { size: 11 } }, grid: { display: false } } } }
    });
  }

  const ctxPie = document.getElementById('chart-pie');
  if (ctxPie) {
    const tQ = Object.values(S.prog).reduce((a,p) => a+(p.qt||0),0);
    const cQ = Object.values(S.prog).reduce((a,p) => a+(p.qc||0),0);
    _charts.pie = new Chart(ctxPie, {
      type: 'doughnut',
      data: { labels: ['Acertos','Erros'], datasets: [{ data: tQ > 0 ? [cQ, tQ-cQ] : [1,0], backgroundColor: tQ > 0 ? ['#2862A8','#283E58'] : ['#283E58','#283E58'], borderWidth: 0, hoverOffset: 5 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom', labels: { color: '#7A8FA0', padding: 14, font: { size: 11 } } } } }
    });
  }
}

// ── Keyboard ─────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  const v = document.querySelector('.view.active');
  if (!v || v.id !== 'view-study') return;
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  switch(e.key) {
    case 'ArrowLeft':       prevCard(); break;
    case 'ArrowRight':      nextCard(); break;
    case ' ':               e.preventDefault(); if (S.mode === 'study') flipCard(); break;
    case 'p': case 'P':    if (S.mode === 'study') speak('normal', null); break;
    case '1':               if (S.flipped) rate('hard');   break;
    case '2':               if (S.flipped) rate('medium'); break;
    case '3':               if (S.flipped) rate('easy');   break;
  }
});

// ── Boot ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', loadAllCategories);
