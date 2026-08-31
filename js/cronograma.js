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

function renderPlanoDias() {
  const container = document.getElementById("plano-dias");
  container.innerHTML = DIAS_SEMANA.map((nome, i) => {
    const ativo = DADOS.planoConfig.diasAtivos[i];
    const sessoes = DADOS.planoConfig.sessoesPorDia[i];
    return `
      <div class="plano-dia-row ${ativo ? "" : "is-off"}">
        <label class="check">
          <input type="checkbox" data-acao="plano-dia-ativo" data-dia="${i}" ${ativo ? "checked" : ""}>
          <span>${nome}</span>
        </label>
        <input type="number" min="0" max="4" data-acao="plano-dia-sessoes" data-dia="${i}" value="${sessoes}" ${ativo ? "" : "disabled"}>
      </div>
    `;
  }).join("");
  document.getElementById("input-plano-hora-inicial").value = DADOS.planoConfig.horaInicial || "19:00";
  document.getElementById("input-data-prova").value = DADOS.planoConfig.dataProva || "";
}

function gerarCronogramaAutomatico() {
  if (!DADOS.disciplinas.length) {
    alert("Cadastre ao menos uma disciplina (ou importe o edital) antes de gerar o plano.");
    return;
  }

  const slots = [];
  const [hBase, mBase] = (DADOS.planoConfig.horaInicial || "19:00").split(":").map(Number);
  DIAS_SEMANA.forEach((_, dia) => {
    if (!DADOS.planoConfig.diasAtivos[dia]) return;
    const n = DADOS.planoConfig.sessoesPorDia[dia] || 0;
    for (let s = 0; s < n; s++) {
      const h = (hBase + s) % 24;
      slots.push({ dia, hora: `${String(h).padStart(2, "0")}:${String(mBase || 0).padStart(2, "0")}` });
    }
  });

  if (!slots.length) {
    alert("Selecione ao menos um dia com sessões de estudo.");
    return;
  }
  if (!confirm(`Isso vai substituir seu cronograma atual por ${slots.length} sessão(ões) semanais geradas automaticamente. Continuar?`)) return;

  const pesos = DADOS.disciplinas.map((d) => ({ id: d.id, peso: Math.max(8, 100 - progressoDisciplina(d)) }));
  const totalPeso = pesos.reduce((acc, p) => acc + p.peso, 0);

  const contagens = pesos.map((p) => {
    const exato = (p.peso / totalPeso) * slots.length;
    return { id: p.id, base: Math.floor(exato), frac: exato - Math.floor(exato) };
  });
  let faltam = slots.length - contagens.reduce((acc, c) => acc + c.base, 0);
  contagens.sort((a, b) => b.frac - a.frac);
  for (let i = 0; i < faltam; i++) {
    contagens[i % contagens.length].base += 1;
  }

  const ordem = [...contagens].sort((a, b) => b.base - a.base).map((c) => c.id);
  const restantes = Object.fromEntries(contagens.map((c) => [c.id, c.base]));
  const sequencia = [];
  while (sequencia.length < slots.length) {
    let avancou = false;
    for (const id of ordem) {
      if (sequencia.length >= slots.length) break;
      if (restantes[id] > 0) {
        sequencia.push(id);
        restantes[id]--;
        avancou = true;
      }
    }
    if (!avancou) break;
  }

  const filaTopicosPorDisciplina = {};
  function proximoTopico(disciplinaId) {
    const d = DADOS.disciplinas.find((x) => x.id === disciplinaId);
    if (!d || !d.topicos.length) return "";
    if (!filaTopicosPorDisciplina[disciplinaId]) {
      const pendentes = d.topicos.filter((t) => t.status !== "dominado");
      filaTopicosPorDisciplina[disciplinaId] = pendentes.length ? pendentes.slice() : d.topicos.slice();
    }
    const fila = filaTopicosPorDisciplina[disciplinaId];
    if (!fila.length) return "";
    const topico = fila.shift();
    fila.push(topico);
    return topico.nome;
  }

  DADOS.cronograma = sequencia.map((disciplinaId, i) => ({
    id: novoId(),
    dia: slots[i].dia,
    hora: slots[i].hora,
    disciplinaId,
    topico: proximoTopico(disciplinaId),
  }));

  salvarDados();
  renderTudo();
}

function inicializarPlanoAutomatico() {
  renderPlanoDias();

  document.getElementById("plano-dias").addEventListener("change", (e) => {
    const dia = +e.target.dataset.dia;
    if (e.target.dataset.acao === "plano-dia-ativo") {
      DADOS.planoConfig.diasAtivos[dia] = e.target.checked;
      salvarDados();
      renderPlanoDias();
    } else if (e.target.dataset.acao === "plano-dia-sessoes") {
      DADOS.planoConfig.sessoesPorDia[dia] = Math.max(0, parseInt(e.target.value, 10) || 0);
      salvarDados();
    }
  });

  document.getElementById("input-plano-hora-inicial").addEventListener("change", (e) => {
    DADOS.planoConfig.horaInicial = e.target.value || "19:00";
    salvarDados();
  });

  document.getElementById("input-data-prova").addEventListener("change", (e) => {
    DADOS.planoConfig.dataProva = e.target.value || null;
    salvarDados();
    renderDashboard();
  });

  document.getElementById("btn-gerar-plano").addEventListener("click", gerarCronogramaAutomatico);
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
