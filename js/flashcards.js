const INTERVALOS_DIAS = [1, 3, 7, 14, 30, 60];

function hojeISO() {
  return new Date().toISOString().slice(0, 10);
}

function somarDias(iso, dias) {
  const data = new Date(iso + "T00:00:00");
  data.setDate(data.getDate() + dias);
  return data.toISOString().slice(0, 10);
}

function cardsParaRevisarHoje() {
  const hoje = hojeISO();
  return DADOS.flashcards.filter((c) => c.proximaRevisao <= hoje);
}

let filaRevisao = [];
let cardAtualVirado = false;

function renderFlashcards() {
  popularSelectDisciplinas(document.getElementById("input-flash-disciplina"), true);
  renderFilaRevisao();
  renderListaFlashcards();
}

function renderFilaRevisao() {
  filaRevisao = cardsParaRevisarHoje();
  const area = document.getElementById("flash-revisar-area");
  area.innerHTML = "";

  if (!filaRevisao.length) {
    area.innerHTML = '<p class="empty-state">Nenhum card para revisar agora. Volte mais tarde ou cadastre novos cards na aba "Gerenciar".</p>';
    return;
  }

  const card = filaRevisao[0];
  const disciplina = DADOS.disciplinas.find((d) => d.id === card.disciplinaId);

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <p class="empty-state">${filaRevisao.length} card(s) restante(s) hoje ${disciplina ? "· " + escapeHtml(disciplina.nome) : ""}</p>
    <div class="flash-card" id="flash-card-face">${escapeHtml(cardAtualVirado ? card.verso : card.frente)}</div>
    <div class="flash-actions" id="flash-actions" style="display:${cardAtualVirado ? "flex" : "none"}">
      <button class="errei" data-resultado="errei">Errei</button>
      <button class="acertei" data-resultado="acertei">Acertei</button>
    </div>
  `;
  area.appendChild(wrapper);

  document.getElementById("flash-card-face").addEventListener("click", () => {
    cardAtualVirado = !cardAtualVirado;
    renderFilaRevisao();
  });

  wrapper.querySelectorAll("[data-resultado]").forEach((btn) => {
    btn.addEventListener("click", () => {
      responderCard(card, btn.dataset.resultado);
    });
  });
}

function responderCard(card, resultado) {
  if (resultado === "acertei") {
    card.intervaloIndex = Math.min(card.intervaloIndex + 1, INTERVALOS_DIAS.length - 1);
  } else {
    card.intervaloIndex = 0;
  }
  card.proximaRevisao = somarDias(hojeISO(), INTERVALOS_DIAS[card.intervaloIndex]);
  cardAtualVirado = false;
  salvarDados();
  renderTudo();
}

function renderListaFlashcards() {
  const container = document.getElementById("lista-flashcards");
  container.innerHTML = "";

  if (!DADOS.flashcards.length) {
    container.innerHTML = '<p class="empty-state">Nenhum flashcard cadastrado ainda.</p>';
    return;
  }

  DADOS.flashcards.forEach((card) => {
    const disciplina = DADOS.disciplinas.find((d) => d.id === card.disciplinaId);
    const row = document.createElement("div");
    row.className = "flashcard-row";
    row.innerHTML = `
      <div class="fc-text">
        <strong>${escapeHtml(card.frente)}</strong><br>
        <span class="fc-meta">${disciplina ? escapeHtml(disciplina.nome) + " · " : ""}próxima revisão: ${card.proximaRevisao}</span>
      </div>
      <button class="icon-btn" data-id="${card.id}">✕</button>
    `;
    container.appendChild(row);
  });
}

function inicializarFlashcards() {
  document.querySelectorAll(".tabs-inner .tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tabs-inner .tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`flash-${btn.dataset.tab}`).classList.add("active");
    });
  });

  document.getElementById("form-flashcard").addEventListener("submit", (e) => {
    e.preventDefault();
    const disciplinaId = document.getElementById("input-flash-disciplina").value;
    const frenteInput = document.getElementById("input-flash-frente");
    const versoInput = document.getElementById("input-flash-verso");
    const frente = frenteInput.value.trim();
    const verso = versoInput.value.trim();
    if (!frente || !verso) return;

    DADOS.flashcards.push({
      id: novoId(),
      disciplinaId,
      frente,
      verso,
      intervaloIndex: 0,
      proximaRevisao: hojeISO(),
    });
    frenteInput.value = "";
    versoInput.value = "";
    salvarDados();
    renderTudo();
  });

  document.getElementById("lista-flashcards").addEventListener("click", (e) => {
    if (!e.target.dataset.id) return;
    DADOS.flashcards = DADOS.flashcards.filter((c) => c.id !== e.target.dataset.id);
    salvarDados();
    renderTudo();
  });
}

function semearFlashcardsSujeito() {
  if (DADOS.seeds.flashcardsSujeito) return;
  DADOS.seeds.flashcardsSujeito = true;

  let portugues = DADOS.disciplinas.find((d) => d.nome.trim().toLowerCase() === "língua portuguesa");
  if (!portugues) {
    portugues = { id: novoId(), nome: "Língua Portuguesa", cor: "#1f6f54", topicos: [] };
    DADOS.disciplinas.push(portugues);
  }

  const CARDS = [
    ["Qual é o teste decisivo para achar o sujeito?", "Teste da concordância: troque singular/plural; se o verbo acompanhar, é o sujeito."],
    ["\"Quem não vê bem uma palavra não pode ver bem uma alma.\" Qual é o sujeito de \"pode ver\"?", "A oração \"Quem não vê bem uma palavra\" (sujeito oracional). Teste: \"Essa pessoa não pode ver...\""],
    ["Frase que começa com \"Quem...\" (sem ser pergunta) costuma ter que tipo de sujeito?", "Sujeito oracional: a oração \"Quem...\" é o sujeito do outro verbo. Ex.: \"Quem estuda passa.\""],
    ["\"As palavras, felizmente, não têm dono.\" Sujeito de \"têm\"?", "\"As palavras\". \"dono\" (singular) não concorda com \"têm\" (plural): é objeto direto."],
    ["\"Dizem que os escritores são donos das palavras.\" Sujeito de \"Dizem\"?", "Indeterminado: 3ª pessoa do plural sem referente. \"os escritores\" é sujeito de \"são\"."],
    ["\"Alugaram-se muitas salas\" é oração sem sujeito?", "Não. VTD + se = voz passiva sintética; sujeito: \"muitas salas\" (= muitas salas foram alugadas)."],
    ["\"Faz dez anos que a empresa faliu\": o que é \"Faz dez anos\"?", "Oração sem sujeito: \"fazer\" indicando tempo decorrido é impessoal (fica no singular)."],
    ["\"Choveram críticas ao projeto\" tem sujeito?", "Sim, \"críticas\": \"chover\" em sentido figurado deixa de ser impessoal."],
    ["Substantivo + adjetivo (\"Resultados semelhantes\") forma sujeito composto?", "Não. Composto exige dois núcleos ou mais. O adjetivo é adjunto adnominal; sujeito simples."],
    ["Preposição depois do verbo o torna transitivo indireto?", "Não. Se o termo só indica circunstância (lugar, tempo), é adjunto adverbial e o verbo pode ser intransitivo. Ex.: aparecer em quadros de demência."],
    ["\"Em contínuas tristezas a alegria\" (Gregório de Matos): função de \"a alegria\"?", "Sujeito posposto do verbo subentendido \"morre\" (zeugma): a alegria [morre] em contínuas tristezas."],
    ["Verso sem verbo na questão: o que fazer?", "Procurar o verbo no verso anterior (zeugma) e pôr na ordem direta."],
  ];

  CARDS.forEach(([frente, verso]) => {
    DADOS.flashcards.push({
      id: novoId(),
      disciplinaId: portugues.id,
      frente,
      verso,
      intervaloIndex: 0,
      proximaRevisao: hojeISO(),
    });
  });

  salvarDados();
}
