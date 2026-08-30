# Assistente de Estudos — Concursos

Aplicativo web simples para organizar os estudos para concursos públicos. Não precisa de instalação, backend ou internet: tudo roda no navegador e os dados ficam salvos localmente (`localStorage`).

## Funcionalidades

- **Edital / Disciplinas**: cadastre as matérias do edital e os tópicos de cada uma, com status (não iniciado, estudando, em revisão, dominado) e barra de progresso.
- **Cronograma semanal**: organize horários de estudo por dia da semana, associando disciplina e tópico.
- **Flashcards com repetição espaçada**: crie cards de pergunta/resposta; ao revisar, os intervalos aumentam quando você acerta (1, 3, 7, 14, 30, 60 dias) e voltam a 1 dia quando você erra.
- **Simulados**: registre o resultado de simulados e provas por disciplina e acompanhe a evolução do percentual de acerto.
- **Painel**: visão geral do progresso, revisões pendentes do dia e cronograma do dia.
- **Backup**: exporte/importe todos os dados em um arquivo `.json`.

## Como usar

Basta abrir o `index.html` diretamente no navegador, ou servir a pasta com qualquer servidor estático:

```bash
python3 -m http.server 8000
# depois acesse http://localhost:8000
```

## Estrutura

```
index.html          # estrutura da página e das seções
css/style.css        # estilos
js/storage.js         # persistência em localStorage
js/dashboard.js       # painel geral
js/disciplinas.js     # edital, disciplinas e tópicos
js/cronograma.js      # agenda semanal
js/flashcards.js      # flashcards e repetição espaçada
js/simulados.js       # registro de simulados
js/config.js          # exportar/importar/apagar dados
js/app.js             # navegação entre abas e inicialização
```
