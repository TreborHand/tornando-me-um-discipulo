# Tornando-me um discípulo — ADSV

Série de quatro estudos bíblicos. Assembleia de Deus Semeando em Vidas.

## Publicar no GitHub Pages

1. Crie um repositório novo (ex.: `adsv-discipulo`) e envie estes arquivos para a raiz.
2. No repositório: **Settings → Pages**.
3. Em *Source*, escolha **Deploy from a branch**.
4. Branch: `main` · pasta: `/ (root)` → **Save**.
5. Em cerca de um minuto o endereço aparece na mesma tela:
   `https://SEU-USUARIO.github.io/adsv-discipulo/`

Esse é o link para mandar no grupo do WhatsApp.

## Liberar um encontro

Abra `index.html` e procure o bloco **PAINEL DE CONTROLE DA SÉRIE** (perto do fim).

```js
{ peca:2, dia:'17', data:'17 de agosto', titulo:'', arquivo:'02-encontro.html', liberado:false }
```

- Troque `liberado: false` por `true` para acender a peça.
- Preencha `titulo` com o nome do encontro.

Peça travada **não** mostra o título — é isso que protege a surpresa da série.
Peça liberada continua acessível para sempre.

Depois de salvar, faça commit e push. O site atualiza sozinho em ~1 minuto.

## Estrutura

```
index.html          hub — capa + navegação
01-encontro.html    estudo do dia 10
02-encontro.html    estudo do dia 17
03-encontro.html    estudo do dia 24
04-encontro.html    estudo do dia 31
assets/
  base.css          identidade visual compartilhada
  fogo.js           animação das brasas
  logo.png
```

Mexer em `assets/base.css` altera o visual das cinco páginas de uma vez.

## Frase escondida da série

Fragmentos espalhados nas páginas, entregues fora de ordem.
A frase completa só se monta na última aula:

> EU DEIXEI TUDO · E DESCOBRI · QUE NÃO PERDI · NADA

| Semana | Fragmento na página |
|---|---|
| 10 | E DESCOBRI |
| 17 | NADA |
| 24 | QUE NÃO PERDI |
| 31 | EU DEIXEI TUDO |

O fragmento fica no canto inferior direito da última tela de cada encontro,
em tom bem próximo ao fundo (classe `.escondido`).

## Teclas durante a apresentação

- `↑` `↓` — navegar entre as telas
- `N` — abre/fecha a janela de notas do apresentador
- `F` — tela cheia

As notas abrem em **outra janela**. Compartilhe a GUIA no Meet
(não a tela inteira) e a janela de notas fica fora do compartilhamento.
