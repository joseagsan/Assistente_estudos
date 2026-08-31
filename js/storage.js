const STORAGE_KEY = "assistente_estudos_data_v1";

function criarDadosIniciais() {
  return {
    disciplinas: [],
    cronograma: [],
    flashcards: [],
    simulados: [],
    planoConfig: {
      diasAtivos: [true, true, true, true, true, false, false],
      sessoesPorDia: [1, 1, 1, 1, 1, 1, 1],
      horaInicial: "19:00",
      dataProva: null,
    },
  };
}

function carregarDados() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return criarDadosIniciais();
    const dados = Object.assign(criarDadosIniciais(), JSON.parse(raw));
    dados.planoConfig = Object.assign(criarDadosIniciais().planoConfig, dados.planoConfig || {});
    return dados;
  } catch (e) {
    console.error("Falha ao carregar dados, iniciando do zero.", e);
    return criarDadosIniciais();
  }
}

function salvarDados() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DADOS));
}

function novoId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

let DADOS = carregarDados();
