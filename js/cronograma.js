const DIAS_SEMANA = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

function renderCronograma() {
  popularSelectDisciplinas(document.getElementById("input-evento-disciplina"), true);

  const grade = document.getElementById("grade-cronograma");
  grade.innerHTML = "";

  DIAS_SEMANA.forEach((nomeDia, indice) => {
    const coluna = document.createElement("div");
    coluna.className = "dia-coluna";
    coluna.innerHTML = `<h4>${nomeDia}</h4>`;

    const eventosDoDia = DADOS.cronograma
      .filter((ev) => ev.dia === indice)
      .sort((a, b) => a.hora.localeCompare(b.hora));

    if (!eventosDoDia.length) {
      coluna.innerHTML += '<span class="empty-state">—</span>';
    }

    eventosDoDia.forEach((ev) => {
      const disciplina = DADOS.disciplinas.find((d) => d.id === ev.disciplinaId);
      const div = document.createElement("div");
      div.className = "evento-item";
      div.style.borderLeft = disciplina ? `4px solid ${disciplina.cor}` : "";
      div.innerHTML = `
        <span class="remover" data-id="${ev.id}">✕</span>
        <div class="hora">${ev.hora}</div>
        <div>${disciplina ? escapeHtml(disciplina.nome) : ""}</div>
        <div>${escapeHtml(ev.topico || "")}</div>
      `;
      coluna.appendChild(div);
    });

    grade.appendChild(coluna);
  });
}

function inicializarCronograma() {
  document.getElementById("form-evento").addEventListener("submit", (e) => {
    e.preventDefault();
    const dia = parseInt(document.getElementById("input-evento-dia").value, 10);
    const hora = document.getElementById("input-evento-hora").value;
    const disciplinaId = document.getElementById("input-evento-disciplina").value;
    const topico = document.getElementById("input-evento-topico").value.trim();
    if (!hora) return;

    DADOS.cronograma.push({ id: novoId(), dia, hora, disciplinaId, topico });
    document.getElementById("input-evento-topico").value = "";
    salvarDados();
    renderTudo();
  });

  document.getElementById("grade-cronograma").addEventListener("click", (e) => {
    if (!e.target.classList.contains("remover")) return;
    DADOS.cronograma = DADOS.cronograma.filter((ev) => ev.id !== e.target.dataset.id);
    salvarDados();
    renderTudo();
  });
}
