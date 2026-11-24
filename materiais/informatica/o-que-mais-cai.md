# Noções de Informática: o que mais cai em concursos

> Resumo didático com os assuntos mais cobrados pelas bancas (FGV, Cebraspe, FCC, Vunesp, Cesgranrio, IBFC e outras).
> Padrão: **Windows 10/11 e Microsoft Office em português do Brasil**. Quando o LibreOffice for diferente, isso aparece indicado.
> Ordem de importância aproximada nas provas de nível médio: **Segurança > Planilhas > Internet/E-mail > Word > Windows > Redes > Hardware > Nuvem/Backup**.

---

## 1. Segurança da informação (o assunto que mais cai)

### 1.1 Princípios (mnemônico **CIDA**)
| Princípio | Garante que... | Ataca/protege |
|---|---|---|
| **C**onfidencialidade | só quem tem autorização acessa a informação | criptografia |
| **I**ntegridade | a informação não foi alterada | hash, assinatura digital |
| **D**isponibilidade | o sistema está no ar quando é preciso | backup, redundância (um ataque DDoS derruba a disponibilidade) |
| **A**utenticidade | o autor é quem diz ser | certificado, senha, biometria |
| *Não repúdio* (irretratabilidade) | o autor não consegue negar a autoria | assinatura digital |

### 1.2 Malwares: a diferença que a banca troca
| Malware | O que faz | Pegadinha |
|---|---|---|
| **Vírus** | se anexa a um arquivo ou programa e **precisa ser executado** | depende de um hospedeiro |
| **Worm** | **se replica sozinho** pela rede, sem hospedeiro | consome a banda; não precisa de execução |
| **Cavalo de Troia (Trojan)** | parece útil, mas executa uma ação maliciosa escondida | **não se replica** |
| **Ransomware** | criptografa os dados e exige resgate | a defesa principal é o **backup** |
| **Spyware** | espiona e envia dados | gênero que inclui o keylogger e o screenlogger |
| **Keylogger** | captura o que é **digitado** | o teclado virtual ajuda contra ele |
| **Screenlogger** | captura a **tela** e os cliques do mouse | criado justamente contra o teclado virtual |
| **Adware** | exibe propaganda | |
| **Backdoor** | abre uma "porta dos fundos" para acesso remoto | |
| **Bot / Botnet** | a máquina vira "zumbi" controlada remotamente; uma rede de bots é uma botnet | usada em ataques DDoS e spam |
| **Rootkit** | **esconde** a presença do invasor e de outros malwares | difícil de detectar |

### 1.3 Golpes
- **Phishing**: uma mensagem falsa (e-mail, SMS, WhatsApp) que leva você a entregar seus dados. É **engenharia social**.
- **Pharming**: corrompe o **DNS**, então você digita o endereço correto e cai no site falso.
- **Spear phishing**: um phishing direcionado a uma pessoa ou empresa específica.
- **Engenharia social**: explora a confiança e a ingenuidade das pessoas, não uma falha técnica.
- **DoS / DDoS**: sobrecarrega um serviço para tirá-lo do ar. O DDoS parte de várias máquinas, geralmente de uma botnet.

### 1.4 Ferramentas de proteção
| Ferramenta | Função | Erro comum |
|---|---|---|
| **Antivírus** | detecta e remove malware | não bloqueia o tráfego de rede |
| **Firewall** | **filtra o tráfego** de rede (portas e regras) | **não é antivírus** e não remove vírus |
| **VPN** | cria um "túnel" criptografado sobre a internet | |
| **Autenticação em dois fatores (2FA)** | combina duas categorias: o que você **sabe** (senha), o que você **tem** (celular, token) e o que você **é** (biometria) | duas senhas **não** são 2FA |

### 1.5 Criptografia
- **Simétrica**: usa **uma única chave** para cifrar e decifrar. É rápida. Exemplos: AES, DES.
- **Assimétrica**: usa **um par de chaves**, uma pública e uma privada. Exemplo: RSA.
  - Para dar **sigilo**, cifra-se com a chave **pública do destinatário**, e só a privada dele decifra.
  - Para **assinar**, cifra-se com a chave **privada do remetente**, e qualquer pessoa confere com a pública dele.
- A **assinatura digital** garante **autenticidade, integridade e não repúdio**, mas **não garante confidencialidade**.
- O **certificado digital** é emitido por uma Autoridade Certificadora (AC) e associa uma chave pública a uma pessoa. No Brasil, segue a **ICP-Brasil**.

---

## 2. Planilhas: Excel (e Calc)

### 2.1 Referências
| Tipo | Exemplo | Ao copiar a fórmula... |
|---|---|---|
| Relativa | `A1` | a linha e a coluna mudam |
| Absoluta | `$A$1` | nada muda |
| Mista | `$A1` / `A$1` | trava só a coluna / só a linha |

Para alternar entre esses tipos, use **F4** no Excel ou **Shift+F4** no Calc.

> **Questão clássica:** a fórmula `=A1+$B$1` está em C1 e é copiada para D3. O resultado é `=B3+$B$1`, porque o deslocamento foi de 1 coluna e 2 linhas e só a parte relativa mudou.

### 2.2 Funções mais cobradas (Excel em português)
| Função | Exemplo | O que devolve |
|---|---|---|
| `SOMA` | `=SOMA(A1:A5)` | a soma. `:` significa "até" e `;` significa "e" |
| `MÉDIA` | `=MÉDIA(A1:A5)` | a média aritmética (ignora células vazias e com texto) |
| `MÁXIMO` / `MÍNIMO` | `=MÁXIMO(A1:A5)` | o maior / o menor valor |
| `MAIOR` / `MENOR` | `=MAIOR(A1:A5;2)` | o 2º maior valor |
| `CONT.NÚM` | `=CONT.NÚM(A1:A5)` | quantas células têm **números** |
| `CONT.VALORES` | `=CONT.VALORES(A1:A5)` | quantas células **não estão vazias** |
| `CONTAR.VAZIO` | `=CONTAR.VAZIO(A1:A5)` | quantas células estão vazias |
| `CONT.SE` | `=CONT.SE(A1:A5;">10")` | quantas células atendem ao critério |
| `SOMASE` | `=SOMASE(A1:A5;">10";B1:B5)` | a soma de B nas linhas em que A atende ao critério |
| `SE` | `=SE(A1>=7;"Aprovado";"Reprovado")` | um resultado se a condição for verdadeira, outro se for falsa |
| `E` / `OU` | `=SE(E(A1>5;B1>5);"Sim";"Não")` | `E` exige todas as condições; `OU` exige ao menos uma |
| `PROCV` | `=PROCV(valor;tabela;nº_coluna;FALSO)` | busca na **1ª coluna** da tabela e devolve a coluna indicada. `FALSO` = correspondência exata |
| `PROCX` | `=PROCX(valor;matriz_procura;matriz_retorno)` | busca em qualquer direção (versões novas do Excel) |
| `ARRED` | `=ARRED(2,567;2)` | 2,57 |
| `TRUNCAR` / `INT` | `=TRUNCAR(2,9)` | 2 (corta as casas decimais, sem arredondar) |
| `HOJE` / `AGORA` | `=HOJE()` | a data atual / a data e a hora atuais |
| `CONCAT` / `&` | `=A1&" "&B1` | junta textos |

Atenção a estes detalhes:
- **Toda fórmula começa com `=`.** Também é aceito começar com `+` ou `-`, o que já foi objeto de questão.
- **A precedência dos operadores** é: `%`, depois `^`, depois `*` e `/`, depois `+` e `-`, depois `&`, e por último as comparações. Por exemplo, `=2+3*2^2` dá **14**.
- **No Calc**, o separador de argumentos também é `;` no Brasil. Para se referir a outra planilha, o Excel usa `Planilha2!A1` e o Calc usa `$Planilha2.A1`, com ponto no lugar da exclamação.

### 2.3 Erros
| Erro | Causa |
|---|---|
| `#DIV/0!` | divisão por zero |
| `#REF!` | referência inválida (uma célula usada na fórmula foi excluída) |
| `#NOME?` | nome de função escrito errado |
| `#VALOR!` | tipo de dado errado (por exemplo, texto numa conta) |
| `#N/D` | valor não encontrado (é típico do `PROCV`) |
| `#####` | a coluna é estreita demais para mostrar o valor (**não é erro** de fórmula) |
| `#NÚM!` | número inválido |

---

## 3. Editor de texto: Word (e Writer)

### 3.1 Atalhos do Word em português (os que mais caem)
| Atalho | Ação | Pegadinha |
|---|---|---|
| `Ctrl+N` | **Negrito** | no Word em inglês o negrito é Ctrl+B |
| `Ctrl+I` | Itálico | |
| `Ctrl+S` | **Sublinhado** | não é salvar! |
| `Ctrl+B` | **Salvar** | |
| `Ctrl+O` | Novo documento | |
| `Ctrl+A` | Abrir | |
| `Ctrl+T` | Selecionar tudo | |
| `Ctrl+P` | Imprimir | |
| `Ctrl+L` | Localizar | |
| `Ctrl+U` | Substituir | |
| `Ctrl+Z` / `Ctrl+R` | Desfazer / Refazer | no Word em português o refazer é **Ctrl+R**; `Ctrl+Y` também funciona como repetir/refazer |
| `Ctrl+E` / `Ctrl+G` / `Ctrl+Q` / `Ctrl+J` | Centralizar / Alinhar à direita / Alinhar à esquerda / Justificar | |
| `Ctrl+Enter` | Quebra de página | |
| `F7` | Ortografia e gramática | |
| `F12` | Salvar como | |

> **No LibreOffice Writer** os atalhos seguem o padrão em inglês: `Ctrl+B` é negrito, `Ctrl+S` é salvar, `Ctrl+U` é sublinhado e `Ctrl+E` é centralizar. As bancas adoram trocar os atalhos do Word com os do Writer.

### 3.2 Conceitos
- **Guias do Word**: Página Inicial (fonte, parágrafo, estilos), Inserir (tabela, imagem, cabeçalho, número de página), Layout (margens, orientação, **quebras**), Referências (sumário, notas de rodapé), Correspondências (**mala direta**), Revisão (ortografia, **controlar alterações**, comentários), Exibir.
- **Quebra de seção**: permite ter, no mesmo documento, partes com orientação, margens ou cabeçalho diferentes.
- **Sumário automático**: depende do uso de **estilos de título**.
- **Formatos de arquivo**: o Word salva em `.docx`, o Writer salva em `.odt` (formato ODF), e ambos exportam para PDF.

---

## 4. Windows 10/11

| Atalho | Ação |
|---|---|
| `Win+E` | abre o Explorador de Arquivos |
| `Win+D` | mostra a área de trabalho |
| `Win+L` | bloqueia a sessão |
| `Win+R` | abre a janela Executar |
| `Win+I` | abre as Configurações |
| `Win+V` | abre o histórico da área de transferência |
| `Win+Shift+S` | faz um recorte da tela |
| `Alt+Tab` | alterna entre as janelas |
| `Alt+F4` | fecha a janela |
| `Ctrl+Shift+Esc` | abre o Gerenciador de Tarefas |
| `F2` | renomeia o item selecionado |
| `Shift+Delete` | exclui **sem passar pela Lixeira** |

- **Arrastar um arquivo** para outra pasta **na mesma unidade** o **move**; para **outra unidade**, o **copia**. Segurar `Ctrl` força a cópia e segurar `Shift` força a movimentação.
- **Arquivos que não vão para a Lixeira**: os excluídos de pendrive ou de unidade de rede, os excluídos com `Shift+Delete` e os maiores que o limite da Lixeira.
- **Caracteres proibidos em nomes de arquivo**: `\ / : * ? " < > |`.

---

## 5. Internet, navegadores e e-mail

### 5.1 Protocolos e portas
| Protocolo | Função | Porta |
|---|---|---|
| HTTP | navegar na web | 80 |
| **HTTPS** | navegar com criptografia (TLS); aparece o cadeado no navegador | 443 |
| FTP | transferir arquivos | 20/21 |
| **DNS** | traduz um nome (como gov.br) em endereço IP | 53 |
| **SMTP** | **enviar** e-mail | 25 / 587 |
| **POP3** | receber e-mail **baixando** as mensagens (normalmente retira do servidor) | 110 / 995 |
| **IMAP** | receber e-mail **sincronizando** (as mensagens ficam no servidor) | 143 / 993 |
| DHCP | atribui o endereço IP automaticamente | 67/68 |
| SSH / Telnet | acesso remoto (o SSH é seguro, o Telnet não) | 22 / 23 |

> Mnemônico: **S**MTP serve para **S**ubir (enviar) a mensagem. POP e IMAP servem para receber.

### 5.2 E-mail
- **Para**: o destinatário principal.
- **Cc**: uma cópia **visível** para todos os destinatários.
- **Cco**: uma cópia **oculta**, que os outros destinatários **não veem**.
- **Responder** vai só para o remetente; **Responder a todos** inclui quem estava em Para e Cc (nunca quem estava em Cco); **Encaminhar** reenvia a mensagem **com os anexos**.
- **Webmail** (Gmail, Outlook.com) funciona no navegador. Um **cliente de e-mail** (Outlook, Thunderbird) é um programa instalado no computador.

### 5.3 Conceitos de rede da web
- **Internet** é a rede pública. **Intranet** é uma rede **privada** que usa as **mesmas tecnologias** da internet (como HTTP e TCP/IP). **Extranet** é a parte da intranet liberada a parceiros externos.
- **Formato da URL**: `protocolo://www.dominio.com.br/pasta/arquivo`.
- **Navegação anônima/privativa**: o navegador não guarda o histórico nem os cookies **no computador**, mas o provedor, a empresa e os sites **continuam vendo** o acesso.
- **Cookies** são pequenos arquivos que os sites gravam para lembrar preferências e o login. O **cache** guarda cópias das páginas para que carreguem mais rápido.
- **Operadores de busca do Google**:

| Operador | O que faz |
|---|---|
| `"frase exata"` | busca exatamente aquela frase |
| `-palavra` | exclui a palavra dos resultados |
| `site:gov.br` | limita a busca àquele site ou domínio |
| `filetype:pdf` | limita a busca àquele tipo de arquivo |
| `OR` | aceita um termo ou outro |
| `*` | funciona como curinga |

---

## 6. Redes de computadores

- **Tipos de rede por alcance**: **PAN** (pessoal, como o Bluetooth), **LAN** (local), **MAN** (metropolitana), **WAN** (de longa distância, como a internet).
- **Equipamentos**:

| Equipamento | O que faz |
|---|---|
| **Hub** | repete o sinal para todas as portas; é "burro" (camada 1) |
| **Switch** | entrega o quadro só ao destino, usando o endereço **MAC** (camada 2) |
| **Roteador** | interliga **redes diferentes** e escolhe a rota pelo endereço **IP** (camada 3) |
| **Modem** | converte o sinal digital no sinal da linha do provedor |
| **Access point** | oferece acesso sem fio à rede |

- **Topologias**:

| Topologia | Característica |
|---|---|
| Estrela | ligada a um nó central; é a mais comum |
| Barramento | todos num cabo só |
| Anel | ligação em círculo |
| Malha | múltiplas ligações; é a mais redundante |

- **Endereço IP**: o **IPv4** tem 32 bits (exemplo: 192.168.0.1) e o **IPv6** tem 128 bits, escritos em hexadecimal.
- **TCP x UDP**: o **TCP** é confiável e orientado a conexão (garante a entrega). O **UDP** é rápido e não garante a entrega, por isso é usado em streaming e jogos.
- **Modelo OSI**, as 7 camadas de baixo para cima: Física, Enlace, Rede, Transporte, Sessão, Apresentação, Aplicação. O mnemônico é "**F**ui **E**ntão **R**apidamente **T**omar **S**orvete **A**o **A**noitecer".

---

## 7. Hardware e software

- **Tipos de memória**:

| Memória | Característica |
|---|---|
| **RAM** | **volátil** (perde os dados ao desligar), leitura e escrita; é a memória principal |
| **ROM** | não volátil, guarda o firmware (BIOS/UEFI) |
| **Cache** | muito rápida, fica entre o processador e a RAM |

- **Hierarquia da memória**, da mais rápida e cara para a mais lenta e barata: registradores, cache, RAM, SSD, HD.
- **SSD x HD**: o SSD não tem partes móveis, então é mais rápido e mais resistente. O HD é magnético e mecânico.
- **Periféricos**:

| Tipo | Exemplos |
|---|---|
| Entrada | teclado, mouse, scanner, microfone |
| Saída | monitor, impressora, caixa de som |
| **Entrada e saída (mistos)** | **multifuncional**, **tela touchscreen**, pendrive |

- **Unidades de medida**: 1 byte tem 8 bits, e cada unidade seguinte vale 1024 da anterior: KB, MB, GB, TB.
- **Tipos de software**: **básico** (o sistema operacional), **aplicativo** (Word, navegador), **utilitário** (antivírus, compactador).
- **Licenças**: o **software livre** tem 4 liberdades: executar, estudar o código, redistribuir e modificar. Livre **não significa grátis**. **Freeware** é grátis mas de código fechado. **Shareware** pode ser testado por um período ou com recursos limitados.

---

## 8. Backup e computação em nuvem

| Tipo de backup | O que copia | Marca o arquivo como copiado? | Para restaurar |
|---|---|---|---|
| **Completo (normal)** | tudo | sim | só o último backup completo |
| **Incremental** | o que mudou desde o **último backup de qualquer tipo** | **sim** | o completo **+ todos** os incrementais |
| **Diferencial** | o que mudou desde o **último backup completo** | **não** | o completo **+ o último** diferencial |

> **Regra rápida:** o backup incremental é mais rápido de fazer e mais lento de restaurar. O diferencial é o contrário.

- **Modelos de serviço em nuvem**:

| Modelo | O que você recebe | Exemplos |
|---|---|---|
| **SaaS** | o **software pronto** para usar | Gmail, Microsoft 365, Google Drive |
| **PaaS** | uma **plataforma** para desenvolver e hospedar aplicações | Google App Engine, Heroku |
| **IaaS** | a **infraestrutura** (servidores virtuais, armazenamento) | AWS EC2, Azure VMs |

- **Mnemônico dos modelos**: do **I**aaS ao **S**aaS, o cliente gerencia cada vez **menos**.
- **Tipos de nuvem**: **pública** (aberta a qualquer cliente), **privada** (exclusiva de uma organização), **híbrida** (combina as duas) e **comunitária** (compartilhada por organizações com interesses comuns).

---

## 9. Questões de fixação (inéditas, feitas para este material)

1. (C/E) O worm precisa ser executado pelo usuário para se propagar, assim como o vírus.
2. (C/E) Na assinatura digital, o remetente usa a própria chave privada, o que garante autenticidade, integridade e confidencialidade.
3. Uma pessoa faz backup completo no domingo e **diferencial** de segunda a sexta. O arquivo é corrompido na sexta, antes do backup do dia. O que é preciso para restaurar?
   a) Só o backup completo  b) O completo e todos os diferenciais  c) O completo e o diferencial de quinta  d) Só o diferencial de quinta
4. Em C1 está a fórmula `=$A1*B$1`, copiada para D2. Qual é a fórmula resultante?
5. (C/E) No Microsoft Word em português, `Ctrl+S` salva o documento.

---

### Gabarito comentado

1. **Errado.** Quem precisa ser executado é o **vírus**, porque depende de um hospedeiro. O **worm** se autorreplica pela rede sozinho.
2. **Errado.** A assinatura digital garante autenticidade, integridade e não repúdio, mas **não garante confidencialidade**, já que qualquer pessoa pode ler a mensagem com a chave pública do remetente.
3. **c.** O backup diferencial acumula tudo o que mudou desde o último backup completo, então bastam o completo de domingo e o **último** diferencial, o de quinta. A alternativa (b) descreve a restauração de um backup incremental. A (a) perderia as alterações da semana. A (d) não tem a base que só o completo fornece.
4. **`=$A2*C$1`**. O deslocamento foi de 1 coluna e 1 linha. Em `$A1`, a coluna está travada e a linha passa de 1 para 2. Em `B$1`, a linha está travada e a coluna passa de B para C.
5. **Errado.** No Word em português, `Ctrl+S` é **sublinhado** e o atalho de salvar é `Ctrl+B`. `Ctrl+S` só salva no Word em inglês e no LibreOffice Writer.
