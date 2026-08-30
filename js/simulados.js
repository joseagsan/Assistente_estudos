function renderSimulados() {
  popularSelectDisciplinas(document.getElementById("input-simulado-disciplina"), true);

  const container = document.getElementById("lista-simulados");
  container.innerHTML = "";

  if (!DADOS.simulados.length) {
    container.innerHTML = '<p class="empty-state">Nenhum simulado registrado ainda.</p>';
    return;
  }

  const linhas = [...DADOS.simulados]
    .sort((a, b) => b.data.localeCompare(a.data))
    .map((s) => {
      const disciplina = DADOS.disciplinas.find((d) => d.id === s.disciplinaId);
      const percentual = Math.round((s.acertos / s.total) * 100);
      const cor = percentual >= 70 ? "var(--success)" : percentual >= 50 ? "var(--warning)" : "var(--danger)";
      return `
        <tr>
          <td>${s.data}</td>
          <td>${escapeHtml(s.nome)}</td>
          <td>${disciplina ? escapeHtml(disciplina.nome) : "—"}</td>
          <td>${s.acertos}/${s.total}</td>
          <td><span class="badge" style="background:${cor}">${percentual}%</span></td>
          <td><button class="icon-btn" data-id="${s.id}">✕</button></td>
        </tr>
      `;
    })
    .join("");

  container.innerHTML = `
    <table class="simulados-table">
      <thead>
        <tr><th>Data</th><th>Simulado</th><th>Disciplina</th><th>Acertos</th><th>%</th><th></th></tr>
      </thead>
      <tbody>${linhas}</tbody>
    </table>
  `;
}

function inicializarSimulados() {
  document.getElementById("form-simulado").addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = document.getElementById("input-simulado-nome").value.trim();
    const disciplinaId = document.getElementById("input-simulado-disciplina").value;
    const acertos = parseInt(document.getElementById("input-simulado-acertos").value, 10);
    const total = parseInt(document.getElementById("input-simulado-total").value, 10);
    if (!nome || isNaN(acertos) || isNaN(total) || total <= 0 || acertos > total) return;

    DADOS.simulados.push({
      id: novoId(),
      nome,
      disciplinaId,
      acertos,
      total,
      data: hojeISO(),
    });

    e.target.reset();
    salvarDados();
    renderTudo();
  });

  document.getElementById("lista-simulados").addEventListener("click", (e) => {
    if (!e.target.dataset.id) return;
    DADOS.simulados = DADOS.simulados.filter((s) => s.id !== e.target.dataset.id);
    salvarDados();
    renderTudo();
  });
}
