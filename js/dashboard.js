function diaSemanaAtualIndice() {
  const jsDay = new Date().getDay(); // 0 = domingo
  return jsDay === 0 ? 6 : jsDay - 1;
}

function renderDashboard() {
  const totalTopicos = DADOS.disciplinas.reduce((acc, d) => acc + d.topicos.length, 0);
  const topicosDominados = DADOS.disciplinas.reduce(
    (acc, d) => acc + d.topicos.filter((t) => t.status === "dominado").length,
    0
  );
  const cardsHoje = cardsParaRevisarHoje().length;
  const mediaSimulados = DADOS.simulados.length
    ? Math.round(
        (DADOS.simulados.reduce((acc, s) => acc + s.acertos / s.total, 0) / DADOS.simulados.length) * 100
      )
    : null;

  const dataProva = DADOS.planoConfig && DADOS.planoConfig.dataProva;
  let diasRestantes = null;
  if (dataProva) {
    const hoje = new Date(hojeISO() + "T00:00:00");
    const alvo = new Date(dataProva + "T00:00:00");
    diasRestantes = Math.ceil((alvo - hoje) / 86400000);
  }

  document.getElementById("dashboard-stats").innerHTML = `
    <div class="stat-card"><div class="num">${DADOS.disciplinas.length}</div><div class="label">Disciplinas</div></div>
    <div class="stat-card"><div class="num">${topicosDominados}/${totalTopicos}</div><div class="label">Tópicos dominados</div></div>
    <div class="stat-card"><div class="num">${cardsHoje}</div><div class="label">Flashcards p/ hoje</div></div>
    <div class="stat-card"><div class="num">${mediaSimulados !== null ? mediaSimulados + "%" : "—"}</div><div class="label">Média em simulados</div></div>
    ${dataProva ? `<div class="stat-card"><div class="num">${diasRestantes}</div><div class="label">Dias até a prova</div></div>` : ""}
  `;

  const revisoesDiv = document.getElementById("dashboard-revisoes");
  const pendentes = cardsParaRevisarHoje();
  revisoesDiv.innerHTML = pendentes.length
    ? `<p>${pendentes.length} flashcard(s) esperando revisão. <button data-view="flashcards" class="link-to">Revisar agora</button></p>`
    : '<p class="empty-state">Tudo em dia por aqui.</p>';
  const btnRevisar = revisoesDiv.querySelector(".link-to");
  if (btnRevisar) {
    btnRevisar.addEventListener("click", () => mudarView("flashcards"));
  }

  const diaHoje = diaSemanaAtualIndice();
  const eventosHoje = DADOS.cronograma
    .filter((ev) => ev.dia === diaHoje)
    .sort((a, b) => a.hora.localeCompare(b.hora));
  const cronoDiv = document.getElementById("dashboard-cronograma-hoje");
  cronoDiv.innerHTML = eventosHoje.length
    ? eventosHoje
        .map((ev) => {
          const disciplina = DADOS.disciplinas.find((d) => d.id === ev.disciplinaId);
          return `<p><strong>${ev.hora}</strong> — ${disciplina ? escapeHtml(disciplina.nome) : ""} ${ev.topico ? "· " + escapeHtml(ev.topico) : ""}</p>`;
        })
        .join("")
    : '<p class="empty-state">Nada agendado para hoje.</p>';

  const progressoDiv = document.getElementById("dashboard-progresso");
  progressoDiv.innerHTML = DADOS.disciplinas.length
    ? DADOS.disciplinas
        .map((d) => {
          const p = progressoDisciplina(d);
          return `
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
              <span class="disciplina-dot" style="background:${d.cor}"></span>
              <span style="flex:1">${escapeHtml(d.nome)}</span>
              <span class="progress-bar"><span class="progress-bar-fill" style="width:${p}%"></span></span>
              <span>${p}%</span>
            </div>
          `;
        })
        .join("")
    : '<p class="empty-state">Cadastre disciplinas para acompanhar seu progresso.</p>';
}
