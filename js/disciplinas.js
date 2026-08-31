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

const CONECTORES_PT = new Set(["de", "da", "do", "das", "dos", "e", "em", "a", "o", "com", "para", "ou", "no", "na"]);

function tituloCasoPtBr(str) {
  return str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((w, i) => ((i > 0 && CONECTORES_PT.has(w)) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

function limparRotulo(linha) {
  return linha
    .replace(/^[\dIVXLCDM]+[\.\-\)]?\s+/, "")
    .replace(/^[-–—•]\s*/, "")
    .replace(/:$/, "")
    .trim();
}

function pareceTitulo(linha) {
  const limpo = limparRotulo(linha);
  if (!limpo || limpo.length > 90) return false;
  const letras = limpo.replace(/[^A-Za-zÀ-ÿ]/g, "");
  if (letras.length < 3) return false;
  const maiusculas = (limpo.match(/[A-ZÀ-Ý]/g) || []).length;
  return maiusculas / letras.length > 0.65;
}

function dividirTopicos(texto) {
  const semQuebras = texto.replace(/\s+/g, " ").trim();
  if (!semQuebras) return [];
  const partes = semQuebras.split(/(?=\d+(?:\.\d+)*\s+(?=[A-ZÀ-Ý0-9(]))/g);
  let itens = partes
    .map((p) => p.replace(/^\d+(?:\.\d+)*\s*[\.\-\)]?\s*/, "").trim())
    .map((p) => p.replace(/[.;]+$/, "").trim())
    .filter((p) => p.length >= 3);
  if (partes.length <= 1 && /[.;]\s+\S/.test(semQuebras)) {
    itens = semQuebras
      .split(/[.;]\s+/)
      .map((p) => p.trim().replace(/[.;]+$/, ""))
      .filter((p) => p.length >= 3);
  }
  const vistos = new Set();
  return itens.filter((p) => {
    const chave = p.toLowerCase();
    if (vistos.has(chave)) return false;
    vistos.add(chave);
    return true;
  });
}

function analisarEdital(texto) {
  const linhas = texto.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const disciplinas = [];
  let atual = null;

  linhas.forEach((linha) => {
    const idx = linha.indexOf(":");
    if (idx > 0 && idx < 90) {
      const rotulo = limparRotulo(linha.slice(0, idx));
      const resto = linha.slice(idx + 1).trim();
      const restoPareceTopicos = /^\d+(?:\.\d+)*\s/.test(resto);
      if (rotulo.length >= 3 && resto.length >= 3 && (restoPareceTopicos || pareceTitulo(rotulo))) {
        atual = { nome: /[a-zà-ÿ]/.test(rotulo) ? rotulo : tituloCasoPtBr(rotulo), topicos: dividirTopicos(resto) };
        disciplinas.push(atual);
        return;
      }
    }
    if (pareceTitulo(linha)) {
      const rotulo = limparRotulo(linha);
      atual = { nome: /[a-zà-ÿ]/.test(rotulo) ? rotulo : tituloCasoPtBr(rotulo), topicos: [] };
      disciplinas.push(atual);
      return;
    }
    if (atual) {
      atual.topicos.push(...dividirTopicos(linha));
    }
  });

  return disciplinas.filter((d) => d.nome);
}

let previewEdital = null;

function renderPreviewEdital() {
  const container = document.getElementById("preview-edital");
  if (!previewEdital) {
    container.innerHTML = "";
    return;
  }
  if (!previewEdital.length) {
    container.innerHTML = '<p class="empty-state">Não encontramos disciplinas nesse texto. Tente colar um trecho com o conteúdo programático completo (ex: "DISCIPLINA: 1 tópico. 2 tópico.").</p>';
    return;
  }
  container.innerHTML = `
    <p class="empty-state" style="padding:0 0 10px;">Encontramos ${previewEdital.length} disciplina(s). Revise, ajuste o que precisar e importe.</p>
    ${previewEdital
      .map(
        (d, di) => `
      <div class="preview-disciplina">
        <div class="preview-disciplina__head">
          <input type="checkbox" data-acao="preview-toggle-disciplina" data-di="${di}" ${d.incluir !== false ? "checked" : ""}>
          <input type="text" class="preview-nome" data-acao="preview-nome-disciplina" data-di="${di}" value="${escapeHtml(d.nome)}">
          <span class="preview-count">${d.topicos.length} tópico(s)</span>
        </div>
        <div class="preview-topicos">
          ${d.topicos
            .map(
              (t, ti) => `
            <div class="preview-topico">
              <input type="checkbox" data-acao="preview-toggle-topico" data-di="${di}" data-ti="${ti}" ${t.incluir !== false ? "checked" : ""}>
              <input type="text" data-acao="preview-nome-topico" data-di="${di}" data-ti="${ti}" value="${escapeHtml(t.nome)}">
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `
      )
      .join("")}
    <div class="btn-row" style="margin-top:14px;">
      <button id="btn-confirmar-importacao">Importar selecionados</button>
      <button type="button" class="btn-ghost" id="btn-cancelar-importacao">Cancelar</button>
    </div>
  `;
}

function confirmarImportacaoEdital() {
  const selecionadas = previewEdital.filter((d) => d.incluir !== false && d.nome.trim());
  if (!selecionadas.length) {
    alert("Selecione ao menos uma disciplina para importar.");
    return;
  }

  const paleta = ["#4f8ef7", "#38b26f", "#e0a12d", "#a05fd9", "#e0524d", "#2fa6a6", "#c07a3a"];
  let importadas = 0;

  selecionadas.forEach((d) => {
    const topicosSelecionados = d.topicos
      .filter((t) => t.incluir !== false && t.nome.trim())
      .map((t) => ({ id: novoId(), nome: t.nome.trim(), status: "nao_iniciado" }));

    const existente = DADOS.disciplinas.find((x) => x.nome.trim().toLowerCase() === d.nome.trim().toLowerCase());
    if (existente) {
      const nomesExistentes = new Set(existente.topicos.map((t) => t.nome.trim().toLowerCase()));
      topicosSelecionados.forEach((t) => {
        if (!nomesExistentes.has(t.nome.toLowerCase())) existente.topicos.push(t);
      });
    } else {
      DADOS.disciplinas.push({ id: novoId(), nome: d.nome.trim(), cor: paleta[DADOS.disciplinas.length % paleta.length], topicos: topicosSelecionados });
    }
    importadas++;
  });

  previewEdital = null;
  document.getElementById("input-edital-texto").value = "";
  salvarDados();
  renderTudo();
  renderPreviewEdital();
  alert(`${importadas} disciplina(s) importada(s) com sucesso.`);
}

function inicializarImportadorEdital() {
  document.getElementById("btn-analisar-edital").addEventListener("click", () => {
    const texto = document.getElementById("input-edital-texto").value;
    const brutas = analisarEdital(texto);
    previewEdital = brutas.map((d) => ({
      nome: d.nome,
      incluir: true,
      topicos: d.topicos.map((nome) => ({ nome, incluir: true })),
    }));
    renderPreviewEdital();
  });

  const preview = document.getElementById("preview-edital");

  preview.addEventListener("input", (e) => {
    const di = e.target.dataset.di, ti = e.target.dataset.ti;
    if (e.target.dataset.acao === "preview-nome-disciplina") {
      previewEdital[di].nome = e.target.value;
    } else if (e.target.dataset.acao === "preview-nome-topico") {
      previewEdital[di].topicos[ti].nome = e.target.value;
    }
  });

  preview.addEventListener("change", (e) => {
    const di = e.target.dataset.di, ti = e.target.dataset.ti;
    if (e.target.dataset.acao === "preview-toggle-disciplina") {
      previewEdital[di].incluir = e.target.checked;
    } else if (e.target.dataset.acao === "preview-toggle-topico") {
      previewEdital[di].topicos[ti].incluir = e.target.checked;
    }
  });

  preview.addEventListener("click", (e) => {
    if (e.target.id === "btn-confirmar-importacao") {
      confirmarImportacaoEdital();
    } else if (e.target.id === "btn-cancelar-importacao") {
      previewEdital = null;
      document.getElementById("input-edital-texto").value = "";
      renderPreviewEdital();
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
