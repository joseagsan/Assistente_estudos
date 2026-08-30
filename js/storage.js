const STORAGE_KEY = "assistente_estudos_data_v1";

function criarDadosIniciais() {
  return {
    disciplinas: [],
    cronograma: [],
    flashcards: [],
    simulados: [],
  };
}

function carregarDados() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return criarDadosIniciais();
    const dados = JSON.parse(raw);
    return Object.assign(criarDadosIniciais(), dados);
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
