async function carregarSecao(nomeArquivo) {

    try {

        const resposta = await fetch(`sections/${nomeArquivo}`);
        const html = await resposta.text();

        const app = document.getElementById("app");
        app.insertAdjacentHTML("beforeend", html);

    } catch (erro) {

        console.error("Erro ao carregar seção:", nomeArquivo, erro);

    }

}

async function iniciarAplicacao() {

    const secoes = [
        "hero.html",
        "sobre.html",
        "impacto.html",
        "competencias.html",
        "experiencia.html",
        "formacao.html",
        "projetos.html",
        "progresso.html",
        "contato.html"
    ];

    for (const secao of secoes) {

        await carregarSecao(secao);

    }
    
    // Inicializar funcionalidades após carregar todas as seções
    if (typeof iniciarContadores === 'function') iniciarContadores();
    if (typeof iniciarTabs === 'function') iniciarTabs();
    if (typeof iniciarReveal === 'function') iniciarReveal();

}

document.addEventListener("DOMContentLoaded", iniciarAplicacao);