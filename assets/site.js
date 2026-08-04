/* ==========================================================================
   Arcade Shop Mérida — script compartido por todas las páginas
   Se carga con:  <script src="assets/site.js" defer></script>

   Contiene tres cosas:
     1. El menú desplegable de la barra superior
     2. El carrusel de fotos (detecta las fotos solo, no hay que tocar nada)
     3. El registro de descargas de los PDF
     4. El seguimiento de clics para Google Analytics
   ========================================================================== */

(function () {
  'use strict';

  var WA = '5219994530828';
  var SITE = 'arcadeshopmerida-hub.github.io/ashopmid';

  var reduceMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ======================================================================
     1. MENÚ DESPLEGABLE
     ====================================================================== */

  function initNav() {
    var toggle = $('#nav-toggle');
    var menu = $('#nav-menu');
    var scrim = $('#nav-scrim');
    if (!toggle || !menu) return;

    var desktop = function () { return window.matchMedia('(min-width:901px)').matches; };

    /* --- Menú principal (hamburguesa en móvil) --- */
    function openMenu(open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.classList.toggle('open', open);
      if (scrim) scrim.classList.toggle('open', open);
      document.body.style.overflow = open && !desktop() ? 'hidden' : '';
      if (!open) closeAllDropdowns();
    }

    toggle.addEventListener('click', function () {
      openMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    if (scrim) scrim.addEventListener('click', function () { openMenu(false); });

    /* --- Submenú "Equipos" --- */
    var dropBtns = $$('.nav-link[aria-haspopup="true"]');

    function closeAllDropdowns(except) {
      dropBtns.forEach(function (btn) {
        if (btn === except) return;
        btn.setAttribute('aria-expanded', 'false');
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        if (panel) panel.classList.remove('open');
      });
    }

    dropBtns.forEach(function (btn) {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) return;

      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var isOpen = btn.getAttribute('aria-expanded') === 'true';
        closeAllDropdowns(btn);
        btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        panel.classList.toggle('open', !isOpen);
      });

      /* En escritorio el submenú también se abre al pasar el mouse */
      var li = btn.parentElement;
      li.addEventListener('mouseenter', function () {
        if (!desktop()) return;
        closeAllDropdowns(btn);
        btn.setAttribute('aria-expanded', 'true');
        panel.classList.add('open');
      });
      li.addEventListener('mouseleave', function () {
        if (!desktop()) return;
        btn.setAttribute('aria-expanded', 'false');
        panel.classList.remove('open');
      });
    });

    /* Cerrar al hacer clic fuera, o con la tecla Escape */
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.site-header')) {
        closeAllDropdowns();
        if (!desktop()) openMenu(false);
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      closeAllDropdowns();
      if (toggle.getAttribute('aria-expanded') === 'true') { openMenu(false); toggle.focus(); }
    });

    /* Al cambiar el tamaño de la ventana, dejar el menú en un estado limpio */
    var lastDesktop = desktop();
    window.addEventListener('resize', function () {
      var now = desktop();
      if (now !== lastDesktop) { lastDesktop = now; openMenu(false); }
    });
  }

  /* ======================================================================
     2. CARRUSEL DE FOTOS
     El HTML solo declara:
       <div class="carousel" id="carousel" data-gallery="assets/gallery/ps4/"
            data-alt="Arcade PS4">
     Las fotos foto-01.jpg ... foto-12.jpg se detectan automáticamente.
     ====================================================================== */

  var MAX_PHOTOS = 12;
  var detectedPhotos = [];   // lo reutiliza el generador de PDF

  function loadImage(src) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () { resolve(src); };
      img.onerror = function () { resolve(null); };
      img.src = src;
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function initCarousel() {
    var root = $('#carousel');
    if (!root) return Promise.resolve();

    var gallery = root.dataset.gallery;
    var altBase = root.dataset.alt || 'Equipo arcade';
    var track = $('#carousel-track');
    var dotsWrap = $('#carousel-dots');
    var prevBtn = $('#carousel-prev');
    var nextBtn = $('#carousel-next');
    var viewport = $('.carousel-viewport', root);
    if (!gallery || !track) return Promise.resolve();

    var candidates = [];
    for (var i = 1; i <= MAX_PHOTOS; i++) {
      candidates.push(gallery + 'foto-' + String(i).padStart(2, '0') + '.jpg');
    }

    return Promise.all(candidates.map(loadImage)).then(function (res) {
      var photos = res.filter(Boolean);
      detectedPhotos = photos;

      if (!photos.length) {
        track.innerHTML =
          '<div class="carousel-slide"><div class="carousel-empty">' +
          '<b>SIN FOTOS AÚN</b><p>Sube tus fotos a <code>' + escapeHtml(gallery) +
          '</code> con el nombre foto-01.jpg, foto-02.jpg, etc.</p></div></div>';
        [prevBtn, nextBtn, dotsWrap].forEach(function (el) { if (el) el.style.display = 'none'; });
        return;
      }

      track.innerHTML = photos.map(function (src, i) {
        var lazy = i === 0 ? 'eager' : 'lazy';
        return '<div class="carousel-slide">' +
          '<img class="fill" src="' + src + '" alt="" aria-hidden="true" loading="' + lazy + '">' +
          '<img class="photo" src="' + src + '" loading="' + lazy + '" alt="' +
          escapeHtml(altBase) + ' — foto ' + (i + 1) + ' de ' + photos.length + '">' +
          '</div>';
      }).join('');

      if (photos.length === 1) {
        [prevBtn, nextBtn, dotsWrap].forEach(function (el) { if (el) el.style.display = 'none'; });
        return;
      }

      dotsWrap.innerHTML = photos.map(function (_, i) {
        return '<button type="button" class="carousel-dot" data-i="' + i +
          '" aria-label="Ver foto ' + (i + 1) + ' de ' + photos.length +
          '" aria-current="' + (i === 0 ? 'true' : 'false') + '"></button>';
      }).join('');

      var dots = $$('.carousel-dot', dotsWrap);
      var current = 0;

      function goTo(n) {
        current = (n + photos.length) % photos.length;
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
        dots.forEach(function (d, i) {
          d.setAttribute('aria-current', i === current ? 'true' : 'false');
        });
      }

      /* --- Reproducción automática, que se pausa al interactuar --- */
      var timer = null;
      function play() {
        if (reduceMotion || timer || photos.length < 2) return;
        timer = setInterval(function () { goTo(current + 1); }, 5000);
      }
      function pause() { clearInterval(timer); timer = null; }
      function restart() { pause(); play(); }

      prevBtn.addEventListener('click', function () { goTo(current - 1); restart(); });
      nextBtn.addEventListener('click', function () { goTo(current + 1); restart(); });
      dots.forEach(function (d) {
        d.addEventListener('click', function () { goTo(+d.dataset.i); restart(); });
      });

      root.addEventListener('mouseenter', pause);
      root.addEventListener('mouseleave', play);
      root.addEventListener('focusin', pause);
      root.addEventListener('focusout', play);
      document.addEventListener('visibilitychange', function () {
        document.hidden ? pause() : play();
      });

      /* --- Teclado --- */
      root.setAttribute('tabindex', '0');
      root.setAttribute('role', 'group');
      root.setAttribute('aria-roledescription', 'carrusel');
      root.setAttribute('aria-label', 'Fotos de ' + altBase);
      root.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); restart(); }
        if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); restart(); }
      });

      /* --- Deslizar con el dedo o arrastrar con el mouse --- */
      var sx = 0, sy = 0, dx = 0, dragging = false, decided = false, horizontal = false;

      function start(x, y) {
        sx = x; sy = y; dx = 0; dragging = true; decided = false; horizontal = false;
        pause(); track.classList.add('dragging');
      }
      function move(x, y, ev) {
        if (!dragging) return;
        dx = x - sx;
        var dy = y - sy;
        if (!decided && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
          decided = true;
          horizontal = Math.abs(dx) > Math.abs(dy);
          /* Si el movimiento es vertical, dejamos que la página haga scroll */
          if (!horizontal) { dragging = false; track.classList.remove('dragging'); goTo(current); return; }
        }
        if (horizontal) {
          if (ev && ev.cancelable) ev.preventDefault();
          var pct = (dx / viewport.offsetWidth) * 100;
          track.style.transform = 'translateX(' + (-current * 100 + pct) + '%)';
        }
      }
      function end() {
        if (!dragging) { play(); return; }
        dragging = false;
        track.classList.remove('dragging');
        if (horizontal && Math.abs(dx) > viewport.offsetWidth * 0.18) {
          goTo(current + (dx < 0 ? 1 : -1));
        } else { goTo(current); }
        play();
      }

      viewport.addEventListener('touchstart', function (e) {
        start(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: true });
      viewport.addEventListener('touchmove', function (e) {
        move(e.touches[0].clientX, e.touches[0].clientY, e);
      }, { passive: false });
      viewport.addEventListener('touchend', end);
      viewport.addEventListener('touchcancel', end);

      viewport.addEventListener('mousedown', function (e) { e.preventDefault(); start(e.clientX, e.clientY); });
      window.addEventListener('mousemove', function (e) { move(e.clientX, e.clientY, null); });
      window.addEventListener('mouseup', function () { if (dragging) end(); });

      play();
    });
  }

  /* ======================================================================
     3. DESCARGAS
     Los PDF ya vienen hechos dentro de la carpeta pdf/. Aquí solo se
     registra el clic, para saber cuáles se descargan más.
     ====================================================================== */

  function initDescargas() {
    $$('[data-descarga]').forEach(function (a) {
      a.addEventListener('click', function () {
        if (typeof gtag === 'function') {
          gtag('event', 'descarga_pdf', {
            page_name: document.title,
            archivo: a.dataset.descarga
          });
        }
      });
    });
  }

  /* ======================================================================
     4. SEGUIMIENTO DE CLICS (Google Analytics)
     ====================================================================== */

  function initTracking() {
    $$('a[href*="wa.me"]').forEach(function (link) {
      link.addEventListener('click', function () {
        if (typeof gtag === 'function') {
          gtag('event', 'click_whatsapp', {
            page_name: document.title,
            button_location: link.dataset.waLocation || 'sin_etiquetar'
          });
        }
      });
    });
    $$('.dropdown a, .card').forEach(function (link) {
      link.addEventListener('click', function () {
        if (typeof gtag === 'function') {
          gtag('event', 'click_navegacion_producto', {
            from_page: document.title,
            to_page: link.getAttribute('href')
          });
        }
      });
    });
  }

  /* ====================================================================== */

  function start() {
    initNav();
    initTracking();
    initDescargas();
    initCarousel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else { start(); }
})();
