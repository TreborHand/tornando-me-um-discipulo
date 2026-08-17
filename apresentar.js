/* =========================================================
   ADSV — navegação, revelação, progresso e notas do apresentador

   Teclas:
     ↑ ↓   trocam de bloco
     → ←   revelam / escondem os itens do bloco atual.
           Quando não há mais nada para revelar, → avança de
           bloco e ← volta. (Comportamento de slide mesmo.)
     N     abre a janela de notas (fica fora do compartilhamento)
     F     tela cheia

   A revelação só liga no desktop. No celular, e sem JS, tudo
   aparece de uma vez — quem abre a página sozinho não fica
   sem conteúdo.
   ========================================================= */
(function(){
  var cenas  = Array.prototype.slice.call(document.querySelectorAll('.cena'));
  var barra  = document.getElementById('barra');
  var ajuda  = document.getElementById('ajuda');
  var atual  = 0;
  var notasWin = null;

  if (!cenas.length) return;

  function desktop(){ return window.innerWidth > 900; }

  /* ---------- numeração dos blocos ---------- */
  var bloco = document.getElementById('bloco');
  if (!bloco){
    bloco = document.createElement('div');
    bloco.id = 'bloco';
    document.body.appendChild(bloco);
  }

  function dois(n){ return (n < 10 ? '0' : '') + n; }

  function marcarProgresso(){
    barra.style.width = ((atual + 1) / cenas.length * 100) + '%';
    bloco.innerHTML = 'Bloco <b>' + dois(atual + 1) + '</b> · ' + dois(cenas.length);
  }

  /* ---------- revelação progressiva ---------- */
  function revelaveis(i){
    return Array.prototype.slice.call(cenas[i].querySelectorAll('.revelar'));
  }

  function ligarRevelacao(){
    if (desktop()) document.body.classList.add('revelacao');
    else           document.body.classList.remove('revelacao');
  }

  /* revela o próximo item escondido do bloco. true se revelou algo. */
  function revelarProximo(){
    if (!document.body.classList.contains('revelacao')) return false;
    var itens = revelaveis(atual);
    for (var i = 0; i < itens.length; i++){
      if (!itens[i].classList.contains('visivel')){
        itens[i].classList.add('visivel');
        return true;
      }
    }
    return false;
  }

  /* esconde o último item revelado. true se escondeu algo. */
  function esconderUltimo(){
    if (!document.body.classList.contains('revelacao')) return false;
    var itens = revelaveis(atual);
    for (var i = itens.length - 1; i >= 0; i--){
      if (itens[i].classList.contains('visivel')){
        itens[i].classList.remove('visivel');
        return true;
      }
    }
    return false;
  }

  /* ao entrar num bloco vindo de trás, ele começa fechado;
     vindo da frente, começa aberto (senão você "perde" o que já mostrou) */
  function prepararBloco(i, tudoAberto){
    revelaveis(i).forEach(function(el){
      el.classList.toggle('visivel', !!tudoAberto);
    });
  }

  function irPara(i, tudoAberto){
    if (i < 0 || i >= cenas.length) return;
    prepararBloco(i, tudoAberto);
    atual = i;
    cenas[i].scrollIntoView({ behavior:'smooth', block:'start' });
    marcarProgresso();
    atualizarNotas();
  }

  /* acompanha a rolagem manual também */
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(ents){
      ents.forEach(function(e){
        if (e.isIntersecting){
          atual = cenas.indexOf(e.target);
          marcarProgresso();
          atualizarNotas();
        }
      });
    }, { threshold:0.5 });
    cenas.forEach(function(c){ io.observe(c); });
  }

  /* ---- painel de notas em janela separada ----
     Compartilhe a GUIA no Meet. Esta janela fica fora do
     compartilhamento, então só você enxerga. */
  function abrirNotas(){
    if (notasWin && !notasWin.closed){ notasWin.close(); notasWin = null; return; }
    notasWin = window.open('', 'notas_adsv', 'width=460,height=420');
    if (!notasWin) return;
    notasWin.document.write(
      '<!doctype html><meta charset="utf-8"><title>Notas — ' + document.title + '</title>' +
      '<style>body{margin:0;padding:22px;background:#12100d;color:#F6EEE3;' +
      'font:15px/1.6 -apple-system,Segoe UI,sans-serif}' +
      'h1{font-size:11px;letter-spacing:.24em;text-transform:uppercase;' +
      'color:#EF9B04;margin:0 0 14px;font-weight:600}' +
      '#n{font-size:17px;line-height:1.55}' +
      '#p{margin-top:20px;font-size:12px;color:#8A7A66}</style>' +
      '<h1>Notas do apresentador</h1><div id="n"></div><div id="p"></div>'
    );
    notasWin.document.close();
    atualizarNotas();
  }

  function atualizarNotas(){
    if (!notasWin || notasWin.closed) return;
    var n = notasWin.document.getElementById('n');
    var p = notasWin.document.getElementById('p');
    if (!n) return;
    n.textContent = cenas[atual].getAttribute('data-nota') || '—';
    var itens = revelaveis(atual);
    var abertos = itens.filter(function(el){ return el.classList.contains('visivel'); }).length;
    p.textContent = 'Bloco ' + (atual + 1) + ' de ' + cenas.length +
                    (itens.length ? '  ·  revelados ' + abertos + '/' + itens.length : '');
  }

  document.addEventListener('keydown', function(e){
    var k = e.key;

    if (k === 'ArrowDown' || k === 'PageDown'){
      if (desktop()){ e.preventDefault(); irPara(atual + 1, false); }

    } else if (k === 'ArrowUp' || k === 'PageUp'){
      if (desktop()){ e.preventDefault(); irPara(atual - 1, true); }

    } else if (k === 'ArrowRight' || k === ' '){
      if (desktop()){
        e.preventDefault();
        if (!revelarProximo()) irPara(atual + 1, false);
        else atualizarNotas();
      }

    } else if (k === 'ArrowLeft'){
      if (desktop()){
        e.preventDefault();
        if (!esconderUltimo()) irPara(atual - 1, true);
        else atualizarNotas();
      }

    } else if (k === 'n' || k === 'N'){
      abrirNotas();

    } else if (k === 'f' || k === 'F'){
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen();
    }
  });

  window.addEventListener('resize', ligarRevelacao);

  window.addEventListener('beforeunload', function(){
    if (notasWin && !notasWin.closed) notasWin.close();
  });

  ligarRevelacao();
  marcarProgresso();
  if (ajuda) setTimeout(function(){ ajuda.style.opacity = '0'; }, 6000);
})();
/* =========================================================
   ADSV — navegação, progresso e notas do apresentador
   ========================================================= */
(function(){
  var trilho = document.getElementById('trilho');
  var cenas = Array.prototype.slice.call(document.querySelectorAll('.cena'));
  var barra = document.getElementById('barra');
  var ajuda = document.getElementById('ajuda');
  var atual = 0;
  var notasWin = null;

  function desktop(){ return window.innerWidth > 900; }

  function marcarProgresso(){
    barra.style.width = ((atual + 1) / cenas.length * 100) + '%';
  }

  function irPara(i){
    if (i < 0 || i >= cenas.length) return;
    atual = i;
    cenas[i].scrollIntoView({ behavior:'smooth', block:'start' });
    marcarProgresso();
    atualizarNotas();
  }

  /* acompanha a rolagem manual também */
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(ents){
      ents.forEach(function(e){
        if (e.isIntersecting){
          atual = cenas.indexOf(e.target);
          marcarProgresso();
          atualizarNotas();
        }
      });
    }, { threshold:0.5 });
    cenas.forEach(function(c){ io.observe(c); });
  }

  /* ---- painel de notas em janela separada ----
     Compartilhe a GUIA no Meet. Esta janela fica fora do
     compartilhamento, então só você enxerga. */
  function abrirNotas(){
    if (notasWin && !notasWin.closed){ notasWin.close(); notasWin = null; return; }
    notasWin = window.open('', 'notas_adsv', 'width=460,height=380');
    if (!notasWin) return;
    notasWin.document.write(
      '<!doctype html><meta charset="utf-8"><title>Notas — Peça 1</title>' +
      '<style>body{margin:0;padding:22px;background:#12100d;color:#F6EEE3;' +
      'font:15px/1.6 -apple-system,Segoe UI,sans-serif}' +
      'h1{font-size:11px;letter-spacing:.24em;text-transform:uppercase;' +
      'color:#EF9B04;margin:0 0 14px;font-weight:600}' +
      '#n{font-size:17px;line-height:1.55}' +
      '#p{margin-top:20px;font-size:12px;color:#8A7A66}</style>' +
      '<h1>Notas do apresentador</h1><div id="n"></div><div id="p"></div>'
    );
    notasWin.document.close();
    atualizarNotas();
  }

  function atualizarNotas(){
    if (!notasWin || notasWin.closed) return;
    var n = notasWin.document.getElementById('n');
    var p = notasWin.document.getElementById('p');
    if (!n) return;
    n.textContent = cenas[atual].getAttribute('data-nota') || '—';
    p.textContent = 'Tela ' + (atual + 1) + ' de ' + cenas.length;
  }

  document.addEventListener('keydown', function(e){
    var k = e.key;
    if (k === 'ArrowDown' || k === 'PageDown' || k === ' '){
      if (desktop()){ e.preventDefault(); irPara(atual + 1); }
    } else if (k === 'ArrowUp' || k === 'PageUp'){
      if (desktop()){ e.preventDefault(); irPara(atual - 1); }
    } else if (k === 'n' || k === 'N'){
      abrirNotas();
    } else if (k === 'f' || k === 'F'){
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen();
    }
  });

  window.addEventListener('beforeunload', function(){
    if (notasWin && !notasWin.closed) notasWin.close();
  });

  marcarProgresso();
  setTimeout(function(){ ajuda.style.opacity = '0'; }, 6000);
})();
