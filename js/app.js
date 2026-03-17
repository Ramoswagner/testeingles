// ========================================
// app.js — completo com gamificação e gráficos
// ========================================

// ... (todo o código anterior permanece igual até a declaração das variáveis) ...

// Acrescentar após as constantes iniciais:

// ========================================
// Gamificação
// ========================================
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

// ========================================
// Gráficos (Chart.js)
// ========================================
let dailyChart, pieChart;

function renderCharts() {
  const ctxDaily = document.getElementById('chart-daily');
  const ctxPie = document.getElementById('chart-pie');
  if (!ctxDaily || !ctxPie) return;

  // Destruir gráficos anteriores se existirem
  if (dailyChart) dailyChart.destroy();
  if (pieChart) pieChart.destroy();

  // Dados mock para demonstração (substituir por dados reais do histórico)
  const labels = [];
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString('pt-BR', { weekday: 'short' }));
    data.push(Math.floor(Math.random() * 10)); // mock
  }

  dailyChart = new Chart(ctxDaily, {
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

  const totalQuiz = Object.values(S.prog).reduce((acc, p) => acc + (p.qt || 0), 0);
  const correctQuiz = Object.values(S.prog).reduce((acc, p) => acc + (p.qc || 0), 0);
  const wrongQuiz = totalQuiz - correctQuiz;

  pieChart = new Chart(ctxPie, {
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

// ========================================
// Modificar renderProgress para incluir conquistas e gráficos
// ========================================
function renderProgress() {
  // ... (código existente de estatísticas) ...
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

  // Gráficos
  renderCharts();

  // Domínio por categoria (já existente)
  const masteryRows = document.getElementById('mastery-rows');
  masteryRows.innerHTML = '';
  Object.entries(CATS).forEach(([key, cat]) => {
    const total = cat.cards.length;
    const masteredCat = cat.cards.filter(c => S.prog[c.id]?.conf === 'easy').length;
    const percent = total ? Math.round((masteredCat / total) * 100) : 0;
    masteryRows.innerHTML += `
      <div class="m-row">
        <div class="m-cat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${CAT_ICONS[key]}</svg>
          ${cat.pt}
        </div>
        <div class="m-bg"><div class="m-fill" style="width:${percent}%; background:${cat.color}"></div></div>
        <div class="m-pct" style="color:${cat.color}">${percent}%</div>
      </div>
    `;
  });
}

// ========================================
// Modificar funções rate e answerQuiz para chamar checkAchievements
// ========================================
function rate(level) {
  // ... (código existente) ...
  const card = CATS[S.cat].cards[S.idx];
  if (!S.prog[card.id]) S.prog[card.id] = { seen: true };
  S.prog[card.id].conf = level;
  save();
  const messages = { easy: '✅ Dominado!', medium: '🤔 Continue praticando!', hard: '💪 Vai chegar lá!' };
  toast(messages[level], level === 'easy' ? 'ok' : '');
  checkAchievements(); // <-- adicionado
  nextCard();
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
  checkAchievements(); // <-- adicionado
  setTimeout(() => nextCard(), 1900);
}

// ========================================
// Carregar conquistas ao iniciar
// ========================================
loadAchievements(); // chamar após load()
