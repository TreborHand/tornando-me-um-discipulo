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
