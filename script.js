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

// Hover Animation für Info-button
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

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
    document.querySelectorAll('.parallax-button').forEach(button => {
        // Daten aus dem HTML-Attribut lesen
        const rangeStart = parseInt(button.dataset.rangeStart) || 800;
        const rangeEnd   = parseInt(button.dataset.rangeEnd)   || 1000;
        const moveX      = parseFloat(button.dataset.moveX)    || 0;
        const moveY      = parseFloat(button.dataset.moveY)    || 0;
    
        // "Fortschritt" in der definierten Range berechnen (0 = Start, 1 = Ende)
        let progress;
        if (scrollTop < rangeStart) {
        progress = 0;
        } else if (scrollTop > rangeEnd) {
        progress = 1;
        } else {
        progress = (scrollTop - rangeStart) / (rangeEnd - rangeStart);
        }
    
        // Tatsächliche Verschiebung in X/Y basierend auf progress
        const offsetX = moveX * progress;
        const offsetY = moveY * progress;
    
        // Button um (offsetX, offsetY) verschieben, 
        // ausgehend von der ursprünglichen "translate(-50%, -50%)"
        button.style.transform = `
        translate(-50%, -50%)
        translate(${offsetX}px, ${offsetY}px)
        `;
    });
});

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