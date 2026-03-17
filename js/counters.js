// ========================================
// counters.js — atualização de contadores e estatísticas
// ========================================

// Depende de S (estado global) definido em main.js

// Atualiza os elementos do header: streak e total de dominadas
function updateHdr() {
  const masteredCount = Object.values(S.prog).filter(p => p.conf === 'easy').length;
  document.getElementById('streak-n').textContent = S.streak;
  document.getElementById('mastery-pill').textContent = masteredCount + ' dominadas';
}

// Calcula as estatísticas gerais para a home
function getHomeStats() {
  const progValues = Object.values(S.prog);
  const studied = progValues.filter(p => p.seen).length;
  const mastered = progValues.filter(p => p.conf === 'easy').length;
  const totalQuiz = progValues.reduce((acc, p) => acc + (p.qt || 0), 0);
  const correctQuiz = progValues.reduce((acc, p) => acc + (p.qc || 0), 0);
  const accuracy = totalQuiz ? Math.round((correctQuiz / totalQuiz) * 100) + '%' : '—';
  return { studied, mastered, streak: S.streak, accuracy };
}

// Atualiza os números na home (chamado por renderHome)
function updateHomeCounters() {
  const stats = getHomeStats();
  document.getElementById('ov-studied').textContent = stats.studied;
  document.getElementById('ov-mastered').textContent = stats.mastered;
  document.getElementById('ov-streak').textContent = stats.streak;
  document.getElementById('ov-acc').textContent = stats.accuracy;
}

// Calcula as estatísticas detalhadas para a página de progresso
function getProgressStats() {
  const progValues = Object.values(S.prog);
  const studied = progValues.filter(p => p.seen).length;
  const mastered = progValues.filter(p => p.conf === 'easy').length;
  const totalQuiz = progValues.reduce((acc, p) => acc + (p.qt || 0), 0);
  const correctQuiz = progValues.reduce((acc, p) => acc + (p.qc || 0), 0);
  const accuracy = totalQuiz ? Math.round((correctQuiz / totalQuiz) * 100) + '%' : '—';
  return { studied, mastered, streak: S.streak, accuracy };
}

// Atualiza os KPI cards na página de progresso
function updateProgressCounters() {
  const stats = getProgressStats();
  document.getElementById('st-studied').textContent = stats.studied;
  document.getElementById('st-mastered').textContent = stats.mastered;
  document.getElementById('st-acc').textContent = stats.accuracy;
  document.getElementById('st-streak').textContent = stats.streak;
}

// Exporta as funções necessárias (no ambiente global)
window.updateHdr = updateHdr;
window.updateHomeCounters = updateHomeCounters;
window.updateProgressCounters = updateProgressCounters;
window.getHomeStats = getHomeStats;
window.getProgressStats = getProgressStats;
