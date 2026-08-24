/* ═══════════════════════════════════════════════════════════
   fogo.js — fagulhas subindo em cada <canvas> dentro de .fogo
   Sem dependências. Pausa sozinho quando a tela sai de vista.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduzido = window.matchMedia &&
                 window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduzido) return;

  var CORES = ['#EF9B04', '#FFC46A', '#D9AA74', '#C6600A'];

  /* brilho desenhado UMA vez por cor. Muito mais barato que shadowBlur
     em cada partícula, em cada quadro. */
  var SPRITES = {};
  function brilho(cor){
    if (SPRITES[cor]) return SPRITES[cor];
    var R = 24, s = document.createElement('canvas');
    s.width = s.height = R * 2;
    var g = s.getContext('2d');
    var grad = g.createRadialGradient(R, R, 0, R, R, R);
    grad.addColorStop(0,    cor);
    grad.addColorStop(0.18, cor);
    grad.addColorStop(0.5,  cor + '55');
    grad.addColorStop(1,    cor + '00');
    g.fillStyle = grad;
    g.fillRect(0, 0, R * 2, R * 2);
    SPRITES[cor] = s;
    return s;
  }

  function Fogueira(canvas) {
    this.canvas  = canvas;
    this.ctx     = canvas.getContext('2d');
    this.parts   = [];
    this.ativa   = false;
    this.raf     = null;
    this.dpr     = Math.min(window.devicePixelRatio || 1, 2);
    this.medir();
  }

  Fogueira.prototype.medir = function () {
    var r = this.canvas.getBoundingClientRect();
    this.w = Math.max(r.width, 1);
    this.h = Math.max(r.height, 1);
    this.canvas.width  = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    // densidade proporcional à área, com teto para não pesar no celular
    this.alvo = Math.min(58, Math.round((this.w * this.h) / 30000));
  };

  Fogueira.prototype.nova = function (inicio) {
    var h = this.h;
    return {
      x: Math.random() * this.w,
      y: inicio ? Math.random() * h : h + Math.random() * 40,
      r: 0.6 + Math.random() * 1.9,
      vy: 0.25 + Math.random() * 0.75,
      vx: (Math.random() - 0.5) * 0.28,
      fase: Math.random() * Math.PI * 2,
      giro: 0.008 + Math.random() * 0.022,
      vida: 0,
      total: 260 + Math.random() * 340,
      cor: CORES[(Math.random() * CORES.length) | 0]
    };
  };

  Fogueira.prototype.passo = function () {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);

    while (this.parts.length < this.alvo) {
      this.parts.push(this.nova(this.parts.length < this.alvo / 2));
    }

    ctx.globalCompositeOperation = 'lighter';

    for (var i = this.parts.length - 1; i >= 0; i--) {
      var p = this.parts[i];

      p.vida++;
      p.fase += p.giro;
      p.y -= p.vy;
      p.x += p.vx + Math.sin(p.fase) * 0.42;
      p.vy += 0.0016;                       // acelera um pouco ao subir

      var t = p.vida / p.total;
      if (t >= 1 || p.y < -20) {
        this.parts[i] = this.nova(false);
        continue;
      }

      // aparece, brilha, apaga
      var alpha = t < 0.14 ? (t / 0.14) : (1 - (t - 0.14) / 0.86);
      alpha *= 0.9;

      ctx.globalAlpha = Math.max(alpha, 0);
      var d = p.r * 5.5;
      ctx.drawImage(brilho(p.cor), p.x - d, p.y - d, d * 2, d * 2);
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    this.raf = window.requestAnimationFrame(this.passo.bind(this));
  };

  Fogueira.prototype.ligar = function () {
    if (this.ativa) return;
    this.ativa = true;
    this.passo();
  };

  Fogueira.prototype.desligar = function () {
    this.ativa = false;
    if (this.raf) window.cancelAnimationFrame(this.raf);
    this.raf = null;
  };

  function iniciar() {
    var canvases = document.querySelectorAll('.fogo canvas');
    if (!canvases.length) return;

    var fogueiras = [];
    Array.prototype.forEach.call(canvases, function (c) {
      fogueiras.push(new Fogueira(c));
    });

    // só anima o que está visível na tela
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (ents) {
        ents.forEach(function (e) {
          var f = fogueiras[Array.prototype.indexOf.call(canvases, e.target)];
          if (!f) return;
          if (e.isIntersecting) f.ligar();
          else f.desligar();
        });
      }, { threshold: 0.01 });
      Array.prototype.forEach.call(canvases, function (c) { io.observe(c); });
    } else {
      fogueiras.forEach(function (f) { f.ligar(); });
    }

    // pausa geral quando a aba sai de foco
    document.addEventListener('visibilitychange', function () {
      fogueiras.forEach(function (f) {
        if (document.hidden) f.desligar();
        else f.ligar();
      });
    });

    var t = null;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(function () {
        fogueiras.forEach(function (f) { f.medir(); });
      }, 180);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
