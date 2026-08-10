# Tornando-me um discípulo — ADSV

Série de quatro estudos bíblicos. Assembleia de Deus Semeando em Vidas.
Agosto de 2026 · segundas-feiras, às 20h.

**No ar:** https://treborhand.github.io/tornando-me-um-discipulo/

Esse é o link para mandar no grupo do WhatsApp.

## Estrutura

Todos os arquivos ficam na raiz do repositório:

```
index.html          hub — capa + navegação das quatro peças
01-encontro.html    estudo do dia 10
02-encontro.html    estudo do dia 17
03-encontro.html    estudo do dia 24
04-encontro.html    estudo do dia 31
base.css            identidade visual compartilhada
fogo.js             animação das brasas
logo.png            marca da igreja
```

Mexer em `base.css` altera o visual de todas as páginas de uma vez.

## Liberar um encontro

Abra `index.html` e procure o bloco **PAINEL DE CONTROLE DA SÉRIE** (perto do fim).

```js
{ peca:2, dia:'17', data:'17 de agosto', titulo:'', arquivo:'02-encontro.html', liberado:false }
```

- Troque `liberado: false` por `true` para acender a peça.
- Preencha `titulo` com o nome do encontro.

Peça travada **não** mostra o título — é isso que protege a surpresa da série.
Peça liberada continua acessível para sempre.

Depois de salvar, faça commit. O site atualiza sozinho em ~1 minuto.

## Frase escondida da série

Fragmentos espalhados nas páginas, entregues fora de ordem.
A frase completa só se monta na última aula:

> EU DEIXEI TUDO · E DESCOBRI · QUE NÃO PERDI · NADA

| Semana | Fragmento verdadeiro | Onde está        | Iscas na mesma página            |
| ------ | -------------------- | ---------------- | -------------------------------- |
| 10     | E DESCOBRI           | tela de Contexto | Ainda · Sozinho · Quase · Talvez |
| 17     | NADA                 | a definir        | a definir                        |
| 24     | QUE NÃO PERDI        | a definir        | a definir                        |
| 31     | EU DEIXEI TUDO       | a definir        | a definir                        |

**Como funciona:** o fragmento verdadeiro nunca fica no mesmo lugar duas vezes,
e vem acompanhado de palavras falsas espalhadas em outras telas do mesmo encontro.
Quem for procurar vai achar cinco palavras e ter que decidir qual delas conta.

Todas usam a classe `.escondido` — texto em tom quase igual ao fundo, no canto
inferior direito da tela. Para plantar um fragmento novo, basta colocar
`<span class="escondido">Palavra</span>` como filho direto de uma `<section class="cena">`.

> Ao montar a Peça 2, anote nesta tabela onde você escondeu o fragmento.
> É a única forma de lembrar depois.

## Teclas durante a apresentação

- `↑` `↓` — navegar entre as telas
- `N` — abre/fecha a janela de notas do apresentador
- `F` — tela cheia

As notas abrem em **outra janela**. Compartilhe a GUIA no Meet
(não a tela inteira) e a janela de notas fica fora do compartilhamento.

## Publicação

O GitHub Pages já está ativo: **Settings → Pages**, source *Deploy from a branch*,
branch `main`, pasta `/ (root)`. Cada commit republica o site em cerca de um minuto.
