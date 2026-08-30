const STATUS_TOPICO = {
  nao_iniciado: { label: "Não iniciado", peso: 0 },
  estudando: { label: "Estudando", peso: 0.4 },
  revisao: { label: "Em revisão", peso: 0.75 },
  dominado: { label: "Dominado", peso: 1 },
};

function progressoDisciplina(disciplina) {
  if (!disciplina.topicos.length) return 0;
  const soma = disciplina.topicos.reduce(
    (acc, t) => acc + (STATUS_TOPICO[t.status]?.peso ?? 0),
    0
  );
  return Math.round((soma / disciplina.topicos.length) * 100);
}

function renderDisciplinas() {
  const container = document.getElementById("lista-disciplinas");
  container.innerHTML = "";

  if (!DADOS.disciplinas.length) {
    container.innerHTML = '<p class="empty-state">Nenhuma disciplina cadastrada ainda. Adicione as matérias do seu edital acima.</p>';
    return;
  }

  DADOS.disciplinas.forEach((disciplina) => {
    const item = document.createElement("div");
    item.className = "disciplina-item";

    const progresso = progressoDisciplina(disciplina);

    const header = document.createElement("div");
    header.className = "disciplina-header";
    header.innerHTML = `
      <span class="disciplina-dot" style="background:${disciplina.cor}"></span>
      <strong>${escapeHtml(disciplina.nome)}</strong>
      <span class="progress-bar"><span class="progress-bar-fill" style="width:${progresso}%"></span></span>
      <span>${progresso}%</span>
      <button class="icon-btn" data-acao="remover-disciplina" data-id="${disciplina.id}">✕</button>
    `;
    item.appendChild(header);

    const topicosList = document.createElement("div");
    topicosList.className = "topicos-list";
    if (!disciplina.topicos.length) {
      topicosList.innerHTML = '<span class="empty-state">Sem tópicos ainda.</span>';
    } else {
      disciplina.topicos.forEach((topico) => {
        const row = document.createElement("div");
        row.className = "topico-item";
        row.innerHTML = `
          <span style="flex:1">${escapeHtml(topico.nome)}</span>
          <select data-acao="status-topico" data-disciplina="${disciplina.id}" data-topico="${topico.id}">
            ${Object.entries(STATUS_TOPICO)
              .map(
                ([valor, info]) =>
                  `<option value="${valor}" ${topico.status === valor ? "selected" : ""}>${info.label}</option>`
              )
              .join("")}
          </select>
          <button class="icon-btn" data-acao="remover-topico" data-disciplina="${disciplina.id}" data-topico="${topico.id}">✕</button>
        `;
        topicosList.appendChild(row);
      });
    }
    item.appendChild(topicosList);

    const addForm = document.createElement("form");
    addForm.className = "add-topico-form";
    addForm.dataset.disciplina = disciplina.id;
    addForm.innerHTML = `
      <input type="text" placeholder="Novo tópico" required>
      <button type="submit">+</button>
    `;
    item.appendChild(addForm);

    container.appendChild(item);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function inicializarDisciplinas() {
  document.getElementById("form-disciplina").addEventListener("submit", (e) => {
    e.preventDefault();
    const nomeInput = document.getElementById("input-disciplina-nome");
    const corInput = document.getElementById("input-disciplina-cor");
    const nome = nomeInput.value.trim();
    if (!nome) return;
    DADOS.disciplinas.push({
      id: novoId(),
      nome,
      cor: corInput.value,
      topicos: [],
    });
    nomeInput.value = "";
    salvarDados();
    renderTudo();
  });

  const container = document.getElementById("lista-disciplinas");

  container.addEventListener("submit", (e) => {
    if (!e.target.classList.contains("add-topico-form")) return;
    e.preventDefault();
    const disciplinaId = e.target.dataset.disciplina;
    const input = e.target.querySelector("input");
    const nome = input.value.trim();
    if (!nome) return;
    const disciplina = DADOS.disciplinas.find((d) => d.id === disciplinaId);
    disciplina.topicos.push({ id: novoId(), nome, status: "nao_iniciado" });
    salvarDados();
    renderTudo();
  });

  container.addEventListener("change", (e) => {
    if (e.target.dataset.acao === "status-topico") {
      const disciplina = DADOS.disciplinas.find((d) => d.id === e.target.dataset.disciplina);
      const topico = disciplina.topicos.find((t) => t.id === e.target.dataset.topico);
      topico.status = e.target.value;
      salvarDados();
      renderTudo();
    }
  });

  container.addEventListener("click", (e) => {
    const acao = e.target.dataset.acao;
    if (acao === "remover-disciplina") {
      if (!confirm("Remover esta disciplina e todos os seus tópicos?")) return;
      DADOS.disciplinas = DADOS.disciplinas.filter((d) => d.id !== e.target.dataset.id);
      salvarDados();
      renderTudo();
    } else if (acao === "remover-topico") {
      const disciplina = DADOS.disciplinas.find((d) => d.id === e.target.dataset.disciplina);
      disciplina.topicos = disciplina.topicos.filter((t) => t.id !== e.target.dataset.topico);
      salvarDados();
      renderTudo();
    }
  });
}

function popularSelectDisciplinas(select, comOpcaoVazia) {
  const atual = select.value;
  select.innerHTML = "";
  if (comOpcaoVazia) {
    select.innerHTML += '<option value="">Sem disciplina</option>';
  }
  DADOS.disciplinas.forEach((d) => {
    select.innerHTML += `<option value="${d.id}">${escapeHtml(d.nome)}</option>`;
  });
  if ([...select.options].some((o) => o.value === atual)) {
    select.value = atual;
  }
}
