// ========================================
// tabs.js — controle dos modos Estudo e Quiz dentro da view study
// ========================================

// Dependências globais: S, CATS, toast, stopAudio, markSeen, save (definidos em main.js)
// Também utiliza prevCard/nextCard (definidos em navigation.js) e updateHdr (counters.js)

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
// Inicialização (caso necessário)
// ========================================
// As funções são chamadas diretamente pelos eventos inline do HTML.
