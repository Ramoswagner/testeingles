document.addEventListener("DOMContentLoaded", () => {

const header = document.getElementById("navigation");

header.innerHTML = `

  <div class="logo" onclick="showView('home')">
    <div class="logo-gem">
      <svg viewBox="0 0 24 24"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="8.5" x2="22" y2="8.5"/></svg>
    </div>
    <div class="logo-copy">
      <div class="logo-name">Lexi<span>Pro</span></div>
      <div class="logo-tagline">Professional English</div>
    </div>
  </div>

  <nav>
    <button class="nav-btn active" id="nb-home" onclick="showView('home')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      Início
    </button>
    <button class="nav-btn" id="nb-prog" onclick="showView('progress')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
      Progresso
    </button>
  </nav>

  <div class="hdr-r">
    <div class="streak-pill" id="streak-pill">
      <svg viewBox="0 0 24 24" width="13" height="13" fill="var(--gold-l)"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
      <span id="streak-n">0</span> dias
    </div>
    <div class="mastery-pill" id="mastery-pill">0 dominadas</div>
  </div>

`;

});