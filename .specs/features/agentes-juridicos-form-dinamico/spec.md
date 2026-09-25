# Spec — Formulário dinâmico da landing `agentes-juridicos`

**Objetivo:** tirar a sensação de "monte de pergunta logo de cara" (Rafael, 2026-09-25). Continuam
as mesmas 9 perguntas e o contato no fim (escolha "só A"), só que uma por tela. O corpo enviado ao
`/api/lead` não muda, e o servidor também não.

## Decisões

| # | Decisão |
|---|---|
| F1 | 10 telas: as 9 perguntas, na ordem atual, e o contato. O progresso mostra "Pergunta N de 10". |
| F2 | Escolha única feita com ponteiro (clique ou toque) avança sozinha. Pelo teclado, a escolha **não** avança, porque as setas trocam a seleção dentro do grupo e a pessoa pularia de pergunta enquanto navega. Aí o avanço é pelo "Continuar" (TLC, 2-way door). |
| F3 | Áreas (múltipla escolha) nunca avança sozinha. |
| F4 | "Voltar" aparece da pergunta 2 em diante, e no contato volta para a pergunta 9. As respostas ficam guardadas. |
| F5 | Depois de cada troca de pergunta (não no load nem na ida ao contato, que não tem opção), 400 ms de trava contra clique de ponteiro: um duplo toque não marca a opção da pergunta que acabou de aparecer (fool-gate W1). O teclado não é barrado. A janela do avanço automático só abre com um toque numa opção fora da trava (W2, conformance W5). Tocar de novo na opção já marcada também avança (code-review). |
| F6 | Enter numa pergunta vale como "Continuar" e não envia (W6). |

## Critérios de aceite

Mutações em `tests/mutate-page.js`. Os AC P2 a P7 dos specs da landing e da obrigado seguem valendo.

| AC | Critério | Prova | Mutação que reprova |
|---|---|---|---|
| F-1 | No load só a pergunta 1 aparece, com o progresso "Pergunta 1 de 10", sem "Voltar" e sem roubar o foco. | Playwright | `tudo-de-uma-vez` · `voltar-na-1` · `foca-no-load` |
| F-2 | Clicar numa opção de escolha única mostra a próxima pergunta, com o progresso "Pergunta 2 de 10", e o foco vai para ela. | Playwright | `sem-auto-avanco` · `sem-foco` · `progresso-fixo` |
| F-3 | Setas do teclado trocam a opção sem sair da pergunta. | Playwright | `avanca-no-teclado` |
| F-4 | Em áreas, marcar opções não avança; "Continuar" avança com pelo menos 1 marcada. | Playwright | `checkbox-avanca` |
| F-5 | "Continuar" sem resposta não avança, mostra o aviso e foca a primeira opção. | Playwright (o caso antigo "etapa 1 incompleta") | `pula-sem-resposta` · `sem-foco-pergunta` |
| F-6 | "Voltar" mostra a pergunta anterior com a resposta marcada (da 3 para a 2 e da 2 para a 1). Ao chegar no contato, o foco vai para o título dele; "Voltar" ali leva à 9. | Playwright | `voltar-errado` · `voltar-pra-1` · `contato-sem-foco` |
| F-8 | Um 2º toque logo depois da troca de tela não marca a pergunta nova. | Playwright | `sem-trava` |
| F-9 | Enter numa opção marcada avança, sem requisição nem aviso. | Playwright | `enter-envia` |
| F-10 | Depois de Voltar, tocar de novo na opção já marcada avança. | Playwright | `sem-retoque` |
| F-11 | Durante a trava, Espaço do teclado marca a opção. | Playwright | `trava-teclado` |
| F-7 | O percurso inteiro envia o mesmo corpo de antes (P2 ok). | o caso `P2+P3 ok`, agora preenchido tela a tela | `areas-string` (já existe) |
