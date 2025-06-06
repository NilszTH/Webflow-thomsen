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


function startCounter(entry) {
  const counter = entry.target;
  const target = +counter.getAttribute('data-target');
  let current = 0;

  const duration = 8000; // Dauer der Animation in ms → 8000 = 8 Sekunden
  const frameRate = 60; // 60 FPS
  const totalSteps = Math.round((duration / 1000) * frameRate);
  const increment = target / totalSteps;

  function update() {
    current += increment;
    if (current < target) {
      counter.textContent = Math.floor(current) + "+";
      requestAnimationFrame(update);
    } else {
      counter.textContent = target + "+h";
    }
  }

  update();
  counter.classList.add('counted');
}

// Observer wird erst nach dem ersten Scroll registriert
let observerInitialized = false;

function initObserverOnScroll() {
  if (observerInitialized) return;
  observerInitialized = true;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        startCounter(entry);
      }
    });
  }, {
    threshold: 0.6
  });

  document.querySelectorAll('.counter-number').forEach(counter => {
    observer.observe(counter);
  });

  // Observer-Initialisierung nur einmal
  window.removeEventListener('scroll', initObserverOnScroll);
}

// Erst auf echten Scroll aktivieren
window.addEventListener('scroll', initObserverOnScroll);



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

// Parallax Effect für Buttons über Circle
let lastScrollY = window.scrollY;
let ticking = false;

function onScroll() {
  lastScrollY = window.scrollY;
  requestTick();
}

function requestTick() {
  if (!ticking) {
    requestAnimationFrame(updateParallaxButtons);
    ticking = true;
  }
}

function updateParallaxButtons() {
  const scrollTop = lastScrollY;

  document.querySelectorAll('.parallax-button').forEach(button => {
    const rangeStart = parseInt(button.dataset.rangeStart) || 800;
    const rangeEnd   = parseInt(button.dataset.rangeEnd)   || 1000;
    const moveX      = parseFloat(button.dataset.moveX)    || 0;
    const moveY      = parseFloat(button.dataset.moveY)    || 0;

    let progress;
    if (scrollTop < rangeStart) {
      progress = 0;
    } else if (scrollTop > rangeEnd) {
      progress = 1;
    } else {
      progress = (scrollTop - rangeStart) / (rangeEnd - rangeStart);
    }

    const offsetX = moveX * progress;
    const offsetY = moveY * progress;

    button.style.transform = `
      translate(-50%, -50%)
      translate(${offsetX}px, ${offsetY}px)
    `;
  });

  ticking = false;
}

// PPPPP
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