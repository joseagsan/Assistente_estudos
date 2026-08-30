function inicializarConfig() {
  document.getElementById("btn-exportar").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(DADOS, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup-assistente-estudos-${hojeISO()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById("input-importar").addEventListener("change", (e) => {
    const arquivo = e.target.files[0];
    if (!arquivo) return;
    const leitor = new FileReader();
    leitor.onload = () => {
      try {
        const novosDados = JSON.parse(leitor.result);
        if (!confirm("Importar este backup vai substituir todos os dados atuais. Continuar?")) return;
        DADOS = Object.assign(criarDadosIniciais(), novosDados);
        salvarDados();
        renderTudo();
        alert("Backup importado com sucesso.");
      } catch (err) {
        alert("Arquivo inválido.");
      }
    };
    leitor.readAsText(arquivo);
    e.target.value = "";
  });

  document.getElementById("btn-limpar").addEventListener("click", () => {
    if (!confirm("Isso vai apagar TODOS os dados salvos. Essa ação não pode ser desfeita. Continuar?")) return;
    DADOS = criarDadosIniciais();
    salvarDados();
    renderTudo();
  });
}
