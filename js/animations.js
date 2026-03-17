// ========================================
// animations.js — animações controladas por JavaScript
// ========================================

// Este arquivo contém funções para acionar animações específicas
// que não podem ser feitas apenas com CSS, como:
// - Efeitos de entrada em elementos recém-criados
// - Coordenação de animações encadeadas
// - Feedback visual para ações do usuário (ex: botão de áudio pulsando)

// No momento, a maioria das animações é gerenciada por CSS.
// Mantemos este arquivo para futuras implementações ou para
// funções que possam ser chamadas a partir de outros módulos.

// ========================================
// Ativa uma animação de destaque em um elemento
// ========================================
function highlightElement(element, className = 'highlight', duration = 500) {
  if (!element) return;
  element.classList.add(className);
  setTimeout(() => {
    element.classList.remove(className);
  }, duration);
}

// ========================================
// Exemplo: animação de "pulse" para botões (já existe em CSS)
// Mas podemos acioná-la via JS se necessário
// ========================================
function pulseButton(buttonId) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;
  btn.classList.add('playing');
  setTimeout(() => {
    btn.classList.remove('playing');
  }, 600);
}

// ========================================
// Função para animar a barra de progresso de uma categoria
// (já é feita via transição CSS, mas podemos forçar um refresh)
// ========================================
function refreshProgressBars() {
  // Força reflow para garantir que as transições sejam aplicadas
  document.querySelectorAll('.cc-fill').forEach(el => {
    el.style.transition = 'none';
    el.offsetHeight; // reflow
    el.style.transition = '';
  });
}

// ========================================
// Inicialização de animações que precisam ser acionadas após carregamento
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  // Pequeno atraso para garantir que tudo esteja renderizado
  setTimeout(() => {
    refreshProgressBars();
  }, 100);
});
