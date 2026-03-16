document.addEventListener("DOMContentLoaded", () => {

const header = document.getElementById("navigation");

header.innerHTML = `
<nav>

<div class="nav-logo">
EnglishLab
</div>

<div class="nav-menu">

<a href="#hero">Início</a>
<a href="#sobre">Sobre</a>
<a href="#impacto">Progresso</a>
<a href="#competencias">Competências</a>
<a href="#experiencia">Prática</a>
<a href="#formacao">Formação</a>
<a href="#projetos">Desafios</a>
<a href="#contato">Contato</a>

</div>

</nav>
`;

});
