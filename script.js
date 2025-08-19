// play pause button hero

document.addEventListener("DOMContentLoaded", function () {
  // Hero Desktop
  const heroVideo = document.querySelector(".hero-video-wrapper .video-feature");
  const heroBtn = document.querySelector(".video-toggle-btn-hero");

  if (heroVideo && heroBtn) {
    heroBtn.addEventListener("click", () => {
      if (heroVideo.paused) {
        heroVideo.play();
        heroBtn.textContent = "❚❚";
      } else {
        heroVideo.pause();
        heroBtn.textContent = "▶";
      }
    });
  }

  // Hero Mobile
  const heroMobileVideo = document.querySelector(".hero-video-mobile-wrapper .hero-video-mobile");
  const heroMobileBtn = document.querySelector(".video-toggle-btn-hero-mobile");

  if (heroMobileVideo && heroMobileBtn) {
    heroMobileBtn.addEventListener("click", () => {
      if (heroMobileVideo.paused) {
        heroMobileVideo.play();
        heroMobileBtn.textContent = "❚❚";
      } else {
        heroMobileVideo.pause();
        heroMobileBtn.textContent = "▶";
      }
    });
  }
});

// play pause marquee

  const visionButton = document.querySelector('.video-toggle-btn-vision');
  if (visionButton) {
    visionButton.addEventListener('click', () => {
      const container = visionButton.closest('.video-frame-enhanced');
      const video = container ? container.querySelector('video') : null;
      if (!video) return;

      if (video.paused) {
        video.play();
        visionButton.textContent = '❚❚'; // Pause-Symbol
      } else {
        video.pause();
        visionButton.textContent = '▶'; // Play-Symbol
      }
    });
  }





  // Hamburger Mneü


document.addEventListener("DOMContentLoaded", function() {
  // Selektoren für Hamburger-Button und Navigationselemente
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  // Prüfen, ob Elemente existieren
  if (!hamburger || !navLinks) {
    console.warn("Hamburger-Button oder Navigationselemente (.nav-links) nicht gefunden!");
    return; 
  }

  // Klick-Event: toggelt die "active"- und "open"-Klasse
  hamburger.addEventListener("click", function() {
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("open");
  });
});



// Ein- & Ausblenden der navigation (Desktop)

(() => {
  const header = document.querySelector('header');
  if (!header) return;

  const DESKTOP_MIN = 901;
  const MIN_SCROLL  = 80;  // erst nach 80px Gesamtscroll reagieren
  const DELTA       = 10;  // Richtungsrauschen filtern

  let lastY = window.pageYOffset || document.documentElement.scrollTop;

  function onScroll() {
    // Mobile: nie verstecken
    if (window.innerWidth < DESKTOP_MIN) {
      header.classList.remove('nav-hide');
      lastY = window.pageYOffset || document.documentElement.scrollTop;
      return;
    }

    const y  = window.pageYOffset || document.documentElement.scrollTop;
    const dy = y - lastY;

    // winzige Bewegungen ignorieren -> ruhiger
    if (Math.abs(dy) < DELTA) {
      lastY = y;
      return;
    }

    if (y > MIN_SCROLL && dy > 0) {
      // scrollt nach unten -> ausblenden
      header.classList.add('nav-hide');
    } else {
      // scrollt nach oben oder nah am Top -> einblenden
      header.classList.remove('nav-hide');
    }

    lastY = y;
  }

  // performanter Listener
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { onScroll(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', onScroll, { passive: true });

  // initial
  onScroll();
})();




// Hover Animation für Info-button (Start Bereich)
document.querySelectorAll(".btn").forEach(button => {
    let glow = document.createElement("div");
    glow.classList.add("glow-effect");
    button.appendChild(glow);

    button.addEventListener("mousemove", function(e) {
        let rect = button.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        glow.style.left = `${x}px`;
        glow.style.top = `${y}px`;
    });

    button.addEventListener("mouseenter", function() {
        glow.style.opacity = "1";
    });

    button.addEventListener("mouseleave", function() {
        glow.style.opacity = "0";
    });
});



// show case + grid

(function previewSwap() {
  // DOM ready – sicherstellen, dass HTML existiert
  const run = () => {
    const rows = document.querySelectorAll('.showcase-rows .row');
    const wrap = document.querySelector('.showcase-preview');
    if (!wrap || !rows.length) {
      console.warn('[preview] fehlende DOM-Knoten:', { wrap: !!wrap, rows: rows.length });
      return;
    }

    let imgCurrent = wrap.querySelector('.preview-img.current');
    let imgNext    = wrap.querySelector('.preview-img.next');

    if (!imgCurrent || !imgNext) {
      console.warn('[preview] .preview-img Layers fehlen – prüfe HTML-Struktur (current/next).');
      return;
    }

    // Erste aktive Row
    const firstBtn = document.querySelector('.showcase-rows .row.is-active') || rows[0];
    let token = 0; // bricht alte Transitions ab

    function setVarsFor(img, el){
      img.style.setProperty('--x',     el?.dataset?.x     || '50%');
      img.style.setProperty('--y',     el?.dataset?.y     || '50%');
      img.style.setProperty('--scale', el?.dataset?.scale || '1');
      img.style.setProperty('--w',     '100%');
      img.style.setProperty('--h',     '100%');
      img.style.setProperty('--fit',   el?.dataset?.fit   || 'contain');
    }

    async function preload(src){
      return new Promise(res => {
        const pic = new Image();
        pic.onload = () => res(src);
        pic.onerror = () => res(src); // nicht blockieren
        pic.src = src;
        // decode optional
        if (pic.decode) { pic.decode().then(() => res(src)).catch(() => res(src)); }
      });
    }

    function finalizeSwap(){
      imgCurrent.classList.remove('current');
      imgCurrent.classList.add('next');
      imgCurrent.style.visibility = 'hidden';
      imgCurrent.style.opacity    = '0';

      imgNext.classList.remove('next');
      imgNext.classList.add('current');

      const tmp = imgCurrent; imgCurrent = imgNext; imgNext = tmp;

      imgNext.style.opacity    = '0';
      imgNext.style.visibility = 'hidden';
    }

    async function fadeSwap(btn){
      const my = ++token;
      const src = btn.dataset.img;
      if (!src) return;

      setVarsFor(imgNext, btn);
      await preload(src);
      if (my !== token) return;

      imgNext.src = src;

      // next sichtbar ab 0 → animieren
      imgNext.style.visibility = 'visible';
      imgNext.style.opacity    = '0';
      imgCurrent.style.opacity = '1';

      // Reflow erzwingen
      void imgNext.offsetWidth;

      requestAnimationFrame(() => {
        if (my !== token) return;

        const cs  = getComputedStyle(imgNext);
        const dur = (parseFloat(cs.transitionDuration)||0) + (parseFloat(cs.transitionDelay)||0);
        const ms  = Math.max(80, dur * 1000 + 60);

        let done = false;
        const finish = () => {
          if (done || my !== token) return;
          done = true;
          imgNext.removeEventListener('transitionend', onEnd);
          finalizeSwap();
        };
        const onEnd = (e) => (e.propertyName === 'opacity') && finish();

        imgNext.addEventListener('transitionend', onEnd);
        const t = setTimeout(finish, ms);
        requestAnimationFrame(() => { if (my !== token) clearTimeout(t); });

        imgNext.style.opacity    = '1';
        imgCurrent.style.opacity = '0';
      });
    }

    function instantSwap(btn){
      const src = btn.dataset.img;
      if (!src) return;
      setVarsFor(imgCurrent, btn);
      imgCurrent.src = src;
      imgCurrent.style.visibility = 'visible';
      imgCurrent.style.opacity    = '1';
      imgNext.style.opacity       = '0';
      imgNext.style.visibility    = 'hidden';
    }

    function swapTo(btn){
      if (!btn?.dataset?.img) return;
      const noFade = btn.dataset.fade === '0' || wrap.classList.contains('no-fade');
      noFade ? instantSwap(btn) : fadeSwap(btn);
      rows.forEach(r => r.classList.toggle('is-active', r === btn));
    }

    // ---------- INIT ----------
    setVarsFor(imgCurrent, firstBtn);
    if (!imgCurrent.getAttribute('src')) imgCurrent.src = firstBtn.dataset.img || '';
    imgCurrent.style.visibility = 'visible';
    imgCurrent.style.opacity    = '1';
    imgNext.style.opacity       = '0';
    imgNext.style.visibility    = 'hidden';
    rows.forEach(r => r.classList.toggle('is-active', r === firstBtn));

    // ---------- Mobile-sicheres Tapping ----------
    let suppressClicksUntil = 0;
    const handleTap = (btn, e) => {
      if (e.type === 'click' && Date.now() < suppressClicksUntil) return;
      if (e.type === 'pointerdown' && e.pointerType !== 'mouse') suppressClicksUntil = Date.now() + 450;
      if (e.type === 'touchstart') suppressClicksUntil = Date.now() + 450;
      swapTo(btn);
      if (document.activeElement === btn) btn.blur();
    };

    rows.forEach(btn => {
      btn.setAttribute('type', 'button'); // falls in <form>, Submit verhindern

      if (window.PointerEvent) {
        btn.addEventListener('pointerdown', (e) => {
          if (e.pointerType !== 'mouse') e.preventDefault(); // Ghost‑Click kill
          handleTap(btn, e);
        }, { passive: false });

        // echter Maus‑Click
        btn.addEventListener('click', (e) => {
          // wenn pointerType fehlt, ist es sehr wahrscheinlich Maus
          if (e.pointerType === undefined) handleTap(btn, e);
        });
      } else {
        // Fallback
        btn.addEventListener('touchstart', (e) => { e.preventDefault(); handleTap(btn, e); }, { passive: false });
        btn.addEventListener('click', (e) => handleTap(btn, e));
      }

      // Tastatur
      btn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); swapTo(btn); }
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once:true });
  } else {
    run();
  }
})();






// INFO CARD SECTION - SLIDER

document.addEventListener("DOMContentLoaded", function () {
  const parallaxCard = document.querySelector(".infocard-parallax");
  const section = document.querySelector(".infocard-section");
  const scrollContent = document.querySelector(".infocard-scroll-content");

  window.addEventListener("scroll", () => {
    if (!parallaxCard || !section || !scrollContent) return;

    const sectionRect = section.getBoundingClientRect();
    const sectionTop = sectionRect.top;
    const sectionBottom = sectionRect.bottom;
    const sectionHeight = section.offsetHeight;
    const windowHeight = window.innerHeight;

if (sectionTop <= 0 && sectionBottom >= windowHeight) {
  const offsetAdjust = 0;
  const scrollAmount = Math.round(
  Math.min(sectionHeight - windowHeight - offsetAdjust, Math.abs(sectionTop) + offsetAdjust)
);
parallaxCard.style.transform = `translate3d(0, ${scrollAmount}px, 0)`;

  const halfway = (sectionHeight - windowHeight) / 2;
  const cardImage = parallaxCard.querySelector("img");

  if (scrollAmount >= halfway) {
    parallaxCard.classList.add("switched");
    if (cardImage) cardImage.src = "assets/images/concept_eckig.png";
  } else {
    parallaxCard.classList.remove("switched");
    if (cardImage) cardImage.src = "assets/images/concept_eckig.png";
  }
}

    if (sectionTop < windowHeight && sectionBottom > 0) {
      const ratio = Math.min(1, Math.abs(sectionTop) / (sectionHeight - windowHeight));
      const multiplier = 2.5; // schneller scrollen
      const contentOffset = ratio * 100 * multiplier;
      parallaxCard.style.transform = `translate3d(0, ${Math.round(scrollAmount)}px, 0)`;
    }
  });
});

// Text abschnitt, der bearbeitet werden kann

  function toggleStyle(style, value = '') {
    const el = document.getElementById("editableText");
    const current = el.style[style];
    if (style === 'textDecoration') {
      el.style.textDecoration = current === value ? '' : value;
    } else {
      el.style[style] = current === value || current === style ? '' : value || style;
    }
  }



window.addEventListener('scroll', onScroll);

// Smooth scrolling Funktion für Buttons
function smoothScroll(targetSelector, duration) {
    const targetElement = document.querySelector(targetSelector);
    if (!targetElement) return;
    
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    // Ease-in-out-Quadratic-Funktion für sanfte Übergänge
    function easeInOutQuad(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }
    
    requestAnimationFrame(animation);
  }
  
  // Event Listener für alle Links, die mit '#' beginnen
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault(); // Standard-Jump verhindern
      const targetID = this.getAttribute("href");
      smoothScroll(targetID, 800); // 800ms als Animationsdauer
    });
  });
  window.addEventListener("load", function() {
    // Wenn ein Hash in der URL vorhanden ist, entferne ihn ohne die Seite neu zu laden.
    if (window.location.hash) {
      history.replaceState(null, null, window.location.href.split('#')[0]);
    }
  });

  // WHATSAPP CHAT Social-Bereich
  // Öffnen des Chatfensters
  document.addEventListener("DOMContentLoaded", function () {
    const chat = document.getElementById("whatsapp-chat");
    if (chat && !chat.classList.contains("hidden")) {
      chat.classList.add("hidden");
    }
  });

  document.addEventListener("click", function (e) {
    const chat = document.getElementById("whatsapp-chat");
    const isClickInside = chat.contains(e.target) || e.target.classList.contains("social-link");
  
    if (!isClickInside && !chat.classList.contains("hidden")) {
      closeChat();
    }
  });

  function openChat() {
    document.getElementById("whatsapp-chat").classList.remove("hidden");
  }

  // Schließen
  function closeChat() {
    document.getElementById("whatsapp-chat").classList.add("hidden");
  }

  // Nachricht an WhatsApp senden Social-Bereich
  function sendToWhatsApp() {
    const message = document.getElementById("userMessage").value.trim();
    if (message !== "") {
      const phone = "491751503737";
      const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
window.location.href = url;
  
      // Prüfen, ob der Benutzer ein Mobilgerät nutzt
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
      if (isMobile) {
        // Auf Handy: Direkt zur App
        window.location.href = url;
      } else {
        // Auf Desktop: In neuem Tab öffnen
        window.open(url, '_blank');
      }
    }
  }


  // Auto-copy E-Mail Button
  function copyEmail(event) {
    event.preventDefault();
  
    const email = 'kontakt@webflow-thomsen.de';
    const toast = event.target.nextElementSibling;
  
    navigator.clipboard.writeText(email).then(() => {
      // Pop-up anzeigen (Hover oder Mobile)
      toast.classList.add('show-mobile');
  
      setTimeout(() => {
        toast.classList.remove('show-mobile');
      }, 2000);
    }).catch(err => {
      console.error("Kopieren fehlgeschlagen:", err);
    });
  }


  // Button-Klick abfangen Whats-App
  document.querySelectorAll(".social-link").forEach(link => {
    if (link.textContent.trim().toLowerCase() === "whatsapp") {
      link.addEventListener("click", function(e) {
        e.preventDefault();
        openChat();
      });
    }
  });

  // PIXEL OVERLAY
  document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.querySelector(".global-pixel-overlay");
    overlay.style.height = `${window.innerHeight * 3}px`; // 3x Bildschirmhöhe
  });
  document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.querySelector('.pixel-overlay');
    overlay.style.transform = "translateZ(0)";
  });







// Cookie Banner ########################### 

document.addEventListener("DOMContentLoaded", function() {
  const cookieBanner = document.getElementById("cookie-banner");

  if (!cookieBanner) {
    console.error("Cookie-Banner nicht gefunden!");
    return;
  }

  // Prüfen, ob das Cookie existiert
  if (document.cookie.includes("cookies_accepted=true")) {
    console.log("Cookie akzeptiert: Banner bleibt ausgeblendet.");
    cookieBanner.style.bottom = "-100%";
  } else {
    console.log("Kein Cookie gefunden: Banner wird angezeigt.");
    cookieBanner.style.bottom = "0";
  }
});

// Funktion zum Akzeptieren der Cookies
function acceptCookies() {
  document.cookie = "cookies_accepted=true; max-age=31536000; path=/";
  document.getElementById("cookie-banner").style.bottom = "-100%";
  console.log("Cookies akzeptiert.");
}

// Funktion zum Ablehnen der Cookies
function declineCookies() {
  document.getElementById("cookie-banner").style.bottom = "-100%";
  console.log("Cookies abgelehnt.");
}











// pfeile links + rechts service section


  const container = document.querySelector('.services-container');
  const leftArrow = document.getElementById('scrollLeft');
  const rightArrow = document.getElementById('scrollRight');

  function updateArrowVisibility() {
    leftArrow.style.display = container.scrollLeft > 0 ? 'flex' : 'none';
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    rightArrow.style.display = container.scrollLeft < maxScrollLeft - 1 ? 'flex' : 'none';
  }

  leftArrow.addEventListener('click', () => {
    container.scrollBy({ left: -container.clientWidth * 0.8, behavior: 'smooth' });
  });

  rightArrow.addEventListener('click', () => {
    container.scrollBy({ left: container.clientWidth * 0.8, behavior: 'smooth' });
  });

  container.addEventListener('scroll', updateArrowVisibility);
  window.addEventListener('resize', updateArrowVisibility);
  window.addEventListener('load', updateArrowVisibility);


  // SERVICE SECTION mobile (scroll)

window.addEventListener('load', () => {
  const container = document.querySelector('.services-container');
  if (!container) return;

  // Snap deaktivieren
  container.style.scrollSnapType = 'none';

  // Direkt beim ersten Frame scrollen
  requestAnimationFrame(() => {
    container.scrollTo({ left: 0, behavior: 'auto' });

    // Snap kurz danach aktivieren
    setTimeout(() => {
      container.style.scrollSnapType = 'x mandatory';
    }, 100);
  });
});






//  SECTION THREE

//  SECTION THREE (orthogonale Linien)
(function(){
  const root = document.querySelector('.section-three.powered');
  if (!root) return;

  const svg  = root.querySelector('.s3-lines');
  const chip = root.querySelector('.s3-chip');
  if (!svg || !chip) return;

  // Pfade: IDs wie im HTML (#p-…)
  const L_BASE = svg.querySelector('#p-left-base');
  const M_BASE = svg.querySelector('#p-mid-base');
  const R_BASE = svg.querySelector('#p-right-base');
  const L_FLOW = svg.querySelector('#p-left-flow');
  const M_FLOW = svg.querySelector('#p-mid-flow');
  const R_FLOW = svg.querySelector('#p-right-flow');

  const cards = [
    { el: root.querySelector('.card.c1'), base: L_BASE, flow: L_FLOW },
    { el: root.querySelector('.card.c2'), base: M_BASE, flow: M_FLOW },
    { el: root.querySelector('.card.c3'), base: R_BASE, flow: R_FLOW },
  ];

  // sofort was sehen (falls Layout noch nicht lief)
  const seed = 'M 24 24 L 224 24';
  [L_BASE,M_BASE,R_BASE,L_FLOW,M_FLOW,R_FLOW].forEach(p=>{
    if (p && !p.getAttribute('d')) p.setAttribute('d', seed);
  });

  // viewBox = ganze Section
  function setViewBox(){
    const r = root.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${Math.max(1,r.width)} ${Math.max(1,r.height)}`);
  }

  // Andockpunkte
  const round = n => Math.round(n*10)/10;
  const P = (x,y) => `${round(x)} ${round(y)}`;

  function anchorCard(card){
    const cs = getComputedStyle(card);
    const attach = Math.max(0, Math.min(100, parseFloat(cs.getPropertyValue('--attach')) || 50));
    const cr = card.getBoundingClientRect();
    const rr = root.getBoundingClientRect();
    const x = cr.left + (attach/100)*cr.width - rr.left;
    const y = cr.top - rr.top;
    return {x,y};
  }
  function anchorChip(){
    const cr = chip.getBoundingClientRect();
    const rr = root.getBoundingClientRect();
    return { x: cr.left + cr.width/2 - rr.left, y: cr.top + cr.height - rr.top };
  }

  // 90°-Route
  function orth(from, to){
    const lift = 26;
    const viaY = from.y - lift;
    return `M ${P(from.x,from.y)} L ${P(from.x,viaY)} L ${P(to.x,viaY)} L ${P(to.x,to.y)}`;
  }

  function layout(){
    setViewBox();
    const tgt = anchorChip();
    cards.forEach(c=>{
      if (!c.el || !c.base || !c.flow) return;
      const src = anchorCard(c.el);
      const d   = orth(src, tgt);
      c.base.setAttribute('d', d);
      c.flow.setAttribute('d', d);
    });
  }

  // Pulse-Delays (falls CSS-Variablen genutzt werden)
  [L_FLOW,M_FLOW,R_FLOW].forEach((p,i)=>{
    if (!p) return;
    const delay = p.getAttribute('data-delay') || `${i*0.6}s`;
    const gap   = p.getAttribute('data-gap')   || '520';
    p.style.setProperty('--delay', delay);
    p.style.setProperty('--gap', gap);
    p.style.animationDelay = delay;
  });

  // Triggers
  const ro = new ResizeObserver(()=>requestAnimationFrame(layout));
  ro.observe(document.documentElement);
  window.addEventListener('load', ()=>requestAnimationFrame(layout));
  document.fonts && document.fonts.ready.then(()=>requestAnimationFrame(layout));
  window.addEventListener('resize', ()=>requestAnimationFrame(layout), {passive:true});
  requestAnimationFrame(()=>requestAnimationFrame(layout));
})();


// AService

