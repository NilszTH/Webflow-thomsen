document.addEventListener("DOMContentLoaded", function() {
  // Selektoren für Hamburger-Button und Navigationselemente
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  // Prüfen, ob Elemente existieren
  if (!hamburger || !navLinks) {
    console.warn("Hamburger-Button oder Navigationselemente (.nav-links) nicht gefunden!");
    return; 
  }

  // Klick-Event: toggelt die "active"-Klasse
  hamburger.addEventListener("click", function() {
    navLinks.classList.toggle("active");
  });
});

// Light-beam---
const container = document.querySelector('.beam-particles');

function createParticle() {
  const particle = document.createElement('div');
  particle.classList.add('particle');

  // Startposition: Links oder rechts vom Strahl
  const fromLeft = Math.random() < 0.5;
  const offsetX = fromLeft ? -100 : window.innerWidth + 100;
  particle.style.left = `${offsetX}px`;

  // Obere Startposition im oberen Drittel
  const startY = Math.random() * (window.innerHeight * 0.33);
  particle.style.top = `${startY}px`;

  // Größe zufällig
  particle.style.width = Math.random() * 2 + 1 + 'px';
  particle.style.height = Math.random() * 4 + 2 + 'px';

  // Dauer bis zum Lichtstrahl + durchfallen
  const duration = 2.5 + Math.random() * 2;
  particle.style.animationDuration = `${duration}s`;

  container.appendChild(particle);

  // Entfernen nach Animation
  setTimeout(() => {
    container.removeChild(particle);
  }, duration * 1000);
}

// Regelmäßig neue Partikel erzeugen
setInterval(createParticle, 80);


// ------------------------ Parallax Text über Circle----------
window.addEventListener("scroll", function() {
    let text = document.querySelector(".parallax-text");
    let scrollPosition = window.scrollY || document.documentElement.scrollTop;

    let maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    let offset = 250; // Ab wann die Skalierung beginnt

    let progress = Math.max(0, (scrollPosition - offset) / (maxScroll - offset));

    // 🔹 Start- und Endgröße definieren
    let minScale = 0.6;  // Startgröße (80%)
    let maxScale = 1.5;  // Endgröße (160%)

    // 🔹 Berechnung der Skalierung mit variabler Spanne
    let scaleValue = minScale + progress * (maxScale - minScale);

    // Skalierung auf das Text-Element anwenden
    text.style.transform = `scale(${scaleValue})`;
    text.style.transition = "transform 0.2s ease-out";
});

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

  // WHATSAPP CHAT
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

  // Nachricht an WhatsApp senden
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

  // Button-Klick abfangen
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