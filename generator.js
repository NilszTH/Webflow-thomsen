
const API = 'http://localhost:8787/api/generate';

document.getElementById("run").addEventListener("click", async () => {
  const payload = {
    industry: document.getElementById("industry").value,
    goals: document.getElementById("goals").value,
    brand: { name: document.getElementById("brand").value },
    color: document.getElementById("color").value
  };

  document.getElementById("status").textContent = "Erzeuge…";

  try {
    const r = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Fehler");
    document.getElementById("previewBox").innerHTML = data.choices[0].message.content;
    document.getElementById("status").textContent = "";
  } catch (e) {
    console.error(e);
    document.getElementById("status").textContent = e.message || "Fehler";
  }
});


// für die NAvigation

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("generator.html")) {
    document.querySelectorAll(".nav-links a").forEach(link => {
      if (!link.classList.contains("generator-link")) {
        let hash = link.getAttribute("href");
        // Falls Link nur ein Anker ist (z. B. #about-me), auf index.html umbiegen
        if (hash.startsWith("#")) {
          link.setAttribute("href", "index.html" + hash);
        }
      }
    });
  }
});


// Powered by info sektion 


  (function(){
    const section = document.querySelector('#webgen-arch');
    if(!section || !('IntersectionObserver' in window)) return;

    const animated = section.querySelectorAll('.wire, .arch-card::after, .chip-core::after');
    // CSS-Animationen laufen ohnehin – hier „pausieren wir“ initial via class
    section.classList.add('arch-paused');

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          section.classList.remove('arch-paused');
          io.disconnect();
        }
      });
    }, { threshold: 0.25 });

    io.observe(section);
  })();
  


  // Linien unter boxes 

(function () {
  const section = document.getElementById('webgen-arch');
  if (!section) return;

  const svg   = section.querySelector('.arch-links');
  const cards = Array.from(section.querySelectorAll('.arch-grid .arch-card'));

  function draw() {
    if (cards.length < 3) return;

    const s = section.getBoundingClientRect();
    const w = Math.ceil(s.width);
    const h = Math.ceil(s.height);
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);

    // Startpunkte: Mitte-unten JEWEILS knapp UNTER der Card (sichtbar)
    const start = cards.map(c => {
      const r = c.getBoundingClientRect();
      return {
        x: r.left + r.width / 2 - s.left,
        y: r.bottom - s.top + 10   // 10px unterhalb der Card-Kante
      };
    });

    // Knotenpunkt: UNTER den Cards, mittig zur mittleren Card
    const nodeX = start[1].x;
    const nodeY = Math.max(...start.map(p => p.y)) + 60; // 60px darunter

    // Sanfte Cubic-Bezier nach unten in die Mitte
    const cPath = (sx, sy) => {
      const c1x = sx,     c1y = sy + 40;           // erst leicht runter
      const c2x = (sx+nodeX)/2, c2y = nodeY - 20;  // vor den Knoten abflachen
      return `M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${nodeX} ${nodeY}`;
    };

    const dLeft   = cPath(start[0].x, start[0].y);
    const dMiddle = cPath(start[1].x, start[1].y);
    const dRight  = cPath(start[2].x, start[2].y);
    const dSpine  = `M ${nodeX} ${nodeY} L ${nodeX} ${nodeY + 90}`;

    svg.innerHTML = `
      <path class="arch-path" d="${dLeft}" />
      <path class="arch-path" d="${dMiddle}" />
      <path class="arch-path" d="${dRight}" />
      <path class="arch-path arch-spine" d="${dSpine}" />
      <circle class="arch-node" cx="${nodeX}" cy="${nodeY}" r="6" />
    `;
  }

  const ro = new ResizeObserver(draw);
  ro.observe(section);
  window.addEventListener('load', draw, { once: true });
  window.addEventListener('resize', draw);
})();