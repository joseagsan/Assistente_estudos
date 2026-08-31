function mudarView(nomeView) {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === nomeView);
  });
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("active", view.id === `view-${nomeView}`);
  });
}

function renderTudo() {
  renderDashboard();
  renderDisciplinas();
  renderCronograma();
  renderFlashcards();
  renderSimulados();
}

document.addEventListener("DOMContentLoaded", () => {
  semearDisciplinasCamaraBoaVista();

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => mudarView(btn.dataset.view));
  });

  inicializarBuscadorEditais();
  inicializarDisciplinas();
  inicializarImportadorEdital();
  inicializarCronograma();
  inicializarPlanoAutomatico();
  inicializarFlashcards();
  inicializarSimulados();
  inicializarConfig();

  renderTudo();
});
