const EDITAIS_ATUALIZADO_EM = "2026-08-31";
const EDITAIS_CURADOS = [
  {
    orgao: "Transpetro",
    cargo: "Diversos cargos — Quadro de Terra e Quadro de Mar",
    nivel: "Médio/Técnico e Superior",
    vagas: "281 imediatas + 3.890 cadastro de reserva",
    banca: "Cesgranrio",
    salario: "R$ 5.400 a R$ 15.034,81",
    inscricoesFim: "2026-09-14",
    prova: "2026-11-29",
    status: "aberto",
    link: "https://www.cesgranrio.org.br/",
    fonte: "https://www.estrategiaconcursos.com.br/blog/concurso-transpetro-2026-edital-publicado/",
  },
  {
    orgao: "TCDF — Tribunal de Contas do Distrito Federal",
    cargo: "Analista Administrativo de Controle Externo (ANACE)",
    nivel: "Superior (qualquer área)",
    vagas: "10 imediatas + cadastro de reserva",
    banca: "Cebraspe",
    salario: "R$ 14.990,41",
    inscricoesFim: "2026-09-17",
    prova: "2026-11-22",
    status: "aberto",
    link: "https://www.cebraspe.org.br/",
    fonte: "https://www2.tc.df.gov.br/tcdf-publica-edital-de-concurso-para-analista-com-10-vagas-para-qualquer-area-de-formacao/",
  },
  {
    orgao: "Polícia Federal",
    cargo: "Agente, Escrivão, Delegado, Papiloscopista",
    nivel: "Superior",
    vagas: "2.000 imediatas (até 3.000 com cadastro de reserva)",
    banca: "Cebraspe (histórico da instituição)",
    salario: "a confirmar no edital",
    inscricoesFim: null,
    prova: null,
    status: "previsto",
    observacao: "Fontes divergem sobre o cronograma atual de inscrições — confirme datas oficiais no site da PF/Cebraspe antes de se planejar.",
    link: "https://www.gov.br/pf/pt-br",
    fonte: "https://www.portaldoconcurso.com.br/edital-policia-federal-2026",
  },
  {
    orgao: "Receita Federal",
    cargo: "Auditor-Fiscal / Analista Tributário",
    nivel: "Superior",
    vagas: "146 vagas autorizadas",
    banca: "a definir",
    salario: "a confirmar no edital",
    inscricoesFim: null,
    prova: null,
    status: "previsto",
    observacao: "Provimento autorizado pelo MGI em julho/2026; o edital deve ser publicado em até 6 meses (prazo final: janeiro/2027).",
    link: "https://www.gov.br/receitafederal/pt-br",
    fonte: "https://www.novaconcursos.com.br/portal/concursos/concurso-receita-federal/",
  },
  {
    orgao: "INSS",
    cargo: "Técnico do Seguro Social",
    nivel: "Médio",
    vagas: "3.000 a 5.000 previstas",
    banca: "a definir",
    salario: "a confirmar no edital",
    inscricoesFim: null,
    prova: null,
    status: "previsto",
    observacao: "Concurso ainda em fase de planejamento pelo INSS/MGI — sem edital publicado até o momento do levantamento.",
    link: "https://www.gov.br/inss/pt-br",
    fonte: "https://www.spesedu.com.br/concursos-publicos-2026",
  },
];

let filtroTextoEdital = "";
let filtroStatusEdital = "todos";

function formatarDataBr(iso) {
  if (!iso) return null;
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

function editaisFiltrados() {
  const termo = filtroTextoEdital.trim().toLowerCase();
  return EDITAIS_CURADOS.filter((e) => {
    const passaStatus = filtroStatusEdital === "todos" || e.status === filtroStatusEdital;
    const alvo = `${e.orgao} ${e.cargo} ${e.banca}`.toLowerCase();
    const passaTermo = !termo || alvo.includes(termo);
    return passaStatus && passaTermo;
  });
}

function renderEditaisAtualizado() {
  document.getElementById("editais-atualizado").textContent = `Levantamento feito em ${formatarDataBr(EDITAIS_ATUALIZADO_EM)}.`;
}

function renderEditaisLista() {
  const filtrados = editaisFiltrados();
  const container = document.getElementById("editais-lista");

  if (!filtrados.length) {
    container.innerHTML = '<p class="empty-state">Nenhum edital encontrado com esse filtro.</p>';
    return;
  }

  container.innerHTML = filtrados
    .map(
      (e, i) => `
    <div class="edital-card">
      <div class="edital-card__head">
        <div>
          <h4>${escapeHtml(e.orgao)}</h4>
          <div class="edital-card__cargo">${escapeHtml(e.cargo)}</div>
        </div>
        <span class="status-pill status-pill--${e.status}">${e.status === "aberto" ? "Inscrições abertas" : "Previsto"}</span>
      </div>
      <div class="edital-card__grid">
        <div class="edital-card__campo"><span class="rotulo">Nível</span><span class="valor">${escapeHtml(e.nivel)}</span></div>
        <div class="edital-card__campo"><span class="rotulo">Vagas</span><span class="valor">${escapeHtml(e.vagas)}</span></div>
        <div class="edital-card__campo"><span class="rotulo">Banca</span><span class="valor">${escapeHtml(e.banca)}</span></div>
        <div class="edital-card__campo"><span class="rotulo">Salário inicial</span><span class="valor">${escapeHtml(e.salario)}</span></div>
        <div class="edital-card__campo"><span class="rotulo">Inscrições até</span><span class="valor">${e.inscricoesFim ? formatarDataBr(e.inscricoesFim) : "a definir"}</span></div>
        <div class="edital-card__campo"><span class="rotulo">Prova</span><span class="valor">${e.prova ? formatarDataBr(e.prova) : "a definir"}</span></div>
      </div>
      ${e.observacao ? `<div class="edital-card__obs">${escapeHtml(e.observacao)}</div>` : ""}
      <div class="edital-card__acoes">
        <a href="${e.link}" target="_blank" rel="noopener"><button type="button">Site oficial</button></a>
        <a href="${e.fonte}" target="_blank" rel="noopener"><button type="button" class="btn-ghost">Ver fonte</button></a>
        ${e.prova ? `<button type="button" class="btn-ghost" data-acao="usar-data-prova" data-idx="${i}">Definir como data da prova</button>` : ""}
      </div>
    </div>
  `
    )
    .join("");
}

const SITES_BUSCA_VIVA = {
  google: null,
  jcconcursos: "jcconcursos.com.br",
  pciconcursos: "pciconcursos.com.br",
  folhadirigida: "folha.qconcursos.com",
};

function abrirBuscaViva(fonte) {
  const termo = document.getElementById("input-busca-viva").value.trim();
  const base = termo ? `${termo} concurso público federal edital` : "concurso público federal edital 2026 inscrições abertas";
  const dominio = SITES_BUSCA_VIVA[fonte];
  const consulta = dominio ? `${base} site:${dominio}` : base;
  window.open(`https://www.google.com/search?q=${encodeURIComponent(consulta)}`, "_blank", "noopener");
}

function inicializarBuscaViva() {
  document.getElementById("busca-viva-links").addEventListener("click", (e) => {
    const fonte = e.target.dataset.fonte;
    if (!fonte) return;
    abrirBuscaViva(fonte);
  });
  document.getElementById("input-busca-viva").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      abrirBuscaViva("google");
    }
  });
}

function inicializarBuscadorEditais() {
  renderEditaisAtualizado();
  renderEditaisLista();
  inicializarBuscaViva();

  document.getElementById("input-busca-edital").addEventListener("input", (e) => {
    filtroTextoEdital = e.target.value;
    renderEditaisLista();
  });

  document.getElementById("filtro-status-edital").addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON") return;
    filtroStatusEdital = e.target.dataset.status;
    document.querySelectorAll("#filtro-status-edital button").forEach((b) => b.classList.toggle("active", b === e.target));
    renderEditaisLista();
  });

  document.getElementById("editais-lista").addEventListener("click", (e) => {
    if (e.target.dataset.acao !== "usar-data-prova") return;
    const item = editaisFiltrados()[+e.target.dataset.idx];
    if (!item || !item.prova) return;
    DADOS.planoConfig.dataProva = item.prova;
    salvarDados();
    renderDashboard();
    alert(`Data da prova definida como ${formatarDataBr(item.prova)} (${item.orgao}). Você pode ver a contagem no Painel.`);
  });
}
