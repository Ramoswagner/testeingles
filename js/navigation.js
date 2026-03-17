// ========================================
// navigation.js — controle de navegação, views e renderização
// ========================================

// Depende das variáveis globais: CATS, CAT_ICONS, S, toast, stopAudio, markSeen (definidas em main.js)
// Também depende das funções de atualização de header (updateHdr) que será definida em counters.js, mas podemos chamar posteriormente.

// ========================================
// Alternar entre views (home, study, progress)
// ========================================
function showView(v) {
  // Esconde todas as views
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  // Remove active de todos os botões de navegação
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

  // Mostra a view solicitada
  const viewEl = document.getElementById('view-' + v);
  if (viewEl) viewEl.classList.add('active');

  // Atualiza o botão ativo no header
  const btnMap = { home: 'nb-home', progress: 'nb-prog', study: 'nb-home' }; // study usa o mesmo botão home
  const btnId = btnMap[v];
  if (btnId) {
    const btn = document.getElementById(btnId);
    if (btn) btn.classList.add('active');
  }

  // Renderiza conteúdo específico da view
  if (v === 'home') {
    renderHome();
  } else if (v === 'progress') {
    renderProgress();
  }
  // study é renderizado via openCat
}

// Voltar para a home (vindo do study)
function goHome() {
  stopAudio();           // interrompe qualquer áudio em reprodução
  showView('home');
}

// ========================================
// Abertura de categoria (inicia o estudo)
// ========================================
function openCat(catKey) {
  // Atualiza estado global
  S.cat = catKey;
  S.idx = 0;
  S.flipped = false;
  S.qScore = 0;
  S.qTotal = 0;

  const cat = CATS[catKey];
  document.getElementById('sh-title').textContent = cat.lbl;

  // Muda para a view study e garante modo estudo ativo
  showView('study');
  setMode('study');
}

// ========================================
// Alternar entre modo estudo e quiz
// ========================================
function setMode(mode) {
  S.mode = mode;
  S.flipped = false;
  stopAudio();

  // Atualiza abas
  document.getElementById('tab-study').classList.toggle('active', mode === 'study');
  document.getElementById('tab-quiz').classList.toggle('active', mode === 'quiz');

  // Mostra/esconde os painéis
  document.getElementById('pane-study').style.display = mode === 'study' ? 'block' : 'none';
  document.getElementById('pane-quiz').style.display = mode === 'quiz' ? 'block' : 'none';

  // Atualiza subtítulo
  document.getElementById('sh-sub').textContent = mode === 'study' ? 'Modo estudo' : 'Modo quiz';

  // Renderiza o card atual no modo adequado
  renderCard();
}

// ========================================
// Renderizar o card atual (baseado em S.idx e S.mode)
// ========================================
function renderCard() {
  const cat = CATS[S.cat];
  const cards = cat.cards;
  const card = cards[S.idx];

  // Atualiza os pontinhos de progresso
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

  // Atualiza contador textual
  document.getElementById('sh-cnt').textContent = `${S.idx + 1}/${cards.length}`;

  // Renderiza de acordo com o modo
  if (S.mode === 'study') {
    renderStudy(card, cat);
  } else {
    renderQuiz(card, cat, cards);
  }

  // Marca como visto (para estatísticas)
  markSeen(card.id);
}

// ========================================
// Renderização do modo estudo (flashcard)
// ========================================
function renderStudy(card, cat) {
  const fc = document.getElementById('flashcard');
  fc.classList.remove('flipped');
  S.flipped = false;
  document.getElementById('conf-row').style.display = 'none';

  // Preenche frente
  document.getElementById('fc-badge-txt').textContent = cat.lbl;
  document.getElementById('fc-term').textContent = card.term;
  document.getElementById('fc-phon').textContent = card.ph;

  // Preenche verso
  document.getElementById('bk-pt').textContent = card.pt;
  document.getElementById('bk-def').textContent = card.def;
  document.getElementById('bk-ex').textContent = `"${card.ex}"`;
  document.getElementById('bk-tip').textContent = card.tip;

  // Limpa displays de áudio
  resetSpellDisplay();
  stopAudio();
}

// ========================================
// Renderização do modo quiz
// ========================================
function renderQuiz(card, cat, cards) {
  document.getElementById('q-prompt').textContent = card.pt;
  document.getElementById('q-ctx').textContent = card.def;
  document.getElementById('q-score').textContent = `${S.qScore} corretas de ${S.qTotal}`;
  S.qAnswered = false;

  // Seleciona 3 opções erradas aleatórias (de todos os cards, exceto o atual)
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

// ========================================
// Processar resposta do quiz
// ========================================
function answerQuiz(btn, isCorrect, card) {
  if (S.qAnswered) return;
  S.qAnswered = true;
  S.qTotal++;

  // Inicializa progresso do card se necessário
  if (!S.prog[card.id]) S.prog[card.id] = { seen: true, qc: 0, qt: 0 };
  S.prog[card.id].qt = (S.prog[card.id].qt || 0) + 1;

  if (isCorrect) {
    btn.classList.add('correct');
    S.qScore++;
    S.prog[card.id].qc = (S.prog[card.id].qc || 0) + 1;
    toast('✅ Correto!', 'ok');
  } else {
    btn.classList.add('wrong');
    // Destaca a opção correta entre as demais
    document.querySelectorAll('.q-opt').forEach(b => {
      if (b.querySelector('.opt-term')?.textContent === card.term) {
        b.classList.add('correct');
      }
    });
    toast(`❌ Era: ${card.term}`, 'err');
  }

  // Desabilita todos os botões
  document.querySelectorAll('.q-opt').forEach(b => b.disabled = true);

  // Atualiza placar
  document.getElementById('q-score').textContent = `${S.qScore} corretas de ${S.qTotal}`;

  // Salva progresso e avança após breve pausa
  save();
  setTimeout(() => nextCard(), 1900);
}

// ========================================
// Navegação entre cards
// ========================================
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

// ========================================
// Virar o flashcard (modo estudo)
// ========================================
function flipCard() {
  if (S.mode !== 'study') return;
  const fc = document.getElementById('flashcard');
  S.flipped = !S.flipped;
  fc.classList.toggle('flipped', S.flipped);
  document.getElementById('conf-row').style.display = S.flipped ? 'flex' : 'none';
}

// ========================================
// Registrar nível de confiança (após flip)
// ========================================
function rate(level) {
  const card = CATS[S.cat].cards[S.idx];
  if (!S.prog[card.id]) S.prog[card.id] = { seen: true };
  S.prog[card.id].conf = level;
  save();

  const messages = {
    easy: '✅ Dominado!',
    medium: '🤔 Continue praticando!',
    hard: '💪 Vai chegar lá!'
  };
  toast(messages[level], level === 'easy' ? 'ok' : '');

  nextCard(); // avança automaticamente
}

// ========================================
// Renderização da página inicial (home)
// ========================================
function renderHome() {
  // Atualiza cabeçalho (streak e mastered)
  if (typeof updateHdr === 'function') updateHdr();

  // Calcula estatísticas gerais
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

  // Renderiza grid de categorias
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

// ========================================
// Renderização da página de progresso
// ========================================
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

  const masteryRows = document.getElementById('mastery-rows');
  masteryRows.innerHTML = '';

  Object.entries(CATS).forEach(([key, cat]) => {
    const total = cat.cards.length;
    const masteredCat = cat.cards.filter(c => S.prog[c.id]?.conf === 'easy').length;
    const percent = total ? Math.round((masteredCat / total) * 100) : 0;

    const row = document.createElement('div');
    row.className = 'm-row';
    row.innerHTML = `
      <div class="m-cat">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${CAT_ICONS[key]}</svg>
        ${cat.pt}
      </div>
      <div class="m-bg"><div class="m-fill" style="width:${percent}%; background:${cat.color}"></div></div>
      <div class="m-pct" style="color:${cat.color}">${percent}%</div>
    `;
    masteryRows.appendChild(row);
  });
}

// ========================================
// Atualização do header (chamada por outros módulos)
// ========================================
// Esta função será sobrescrita por counters.js para garantir consistência,
// mas deixamos uma implementação padrão aqui.
window.updateHdr = window.updateHdr || function() {
  const masteredCount = Object.values(S.prog).filter(p => p.conf === 'easy').length;
  document.getElementById('streak-n').textContent = S.streak;
  document.getElementById('mastery-pill').textContent = masteredCount + ' dominadas';
};

// ========================================
// Inicialização (já é feita pelo main.js, mas garantimos que updateHdr seja chamado)
// ========================================
// Não precisa de init aqui, pois as funções são chamadas pelos eventos.
