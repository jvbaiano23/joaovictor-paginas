/**
 * ESTUDIO CINEMATOGRAFICO - LOGICA INTERATIVA
 * JavaScript puro (Vanilla), sem dependencias ou compilacao.
 * Nenhum travessao utilizado neste codigo nem nos textos exibidos.
 */

document.addEventListener("DOMContentLoaded", () => {
  initAmbientGlow();
  initStudioCanvas();
  initTimecode();
  initPortfolioFilters();
  initRateCalculator();
  initFaqAccordion();
  initGuideMode();
  initReservationForm();
  initScrollReveal();
});

/* ==========================================================================
   1. LUZ AMBIENTE QUE SEGUE O CURSOR
   ========================================================================== */
function initAmbientGlow() {
  const glow = document.querySelector(".ambient-glow");
  if (!glow) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updateGlow() {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;
    glow.style.left = `${currentX}px`;
    glow.style.top = `${currentY}px`;
    requestAnimationFrame(updateGlow);
  }
  updateGlow();
}

/* ==========================================================================
   2. CANVAS DE LUZ VOLUMETRICA E PARTICULAS DE ESTUDIO
   ========================================================================== */
function initStudioCanvas() {
  const canvas = document.getElementById("studioCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = canvas.offsetWidth);
  let height = (canvas.height = canvas.offsetHeight);

  window.addEventListener("resize", () => {
    if (!canvas) return;
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  });

  // Particulas sutis de poeira e luz de holofote
  const particleCount = 45;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.1,
      alpha: Math.random() * 0.5 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
    });
  }

  let flareX = width * 0.65;
  let flareY = height * 0.4;
  let targetFlareX = flareX;
  let targetFlareY = flareY;

  const monitorBox = canvas.closest(".camera-monitor-frame");
  if (monitorBox) {
    monitorBox.addEventListener("mousemove", (e) => {
      const rect = monitorBox.getBoundingClientRect();
      targetFlareX = e.clientX - rect.left;
      targetFlareY = e.clientY - rect.top;
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Suavizacao do foco de luz
    flareX += (targetFlareX - flareX) * 0.05;
    flareY += (targetFlareY - flareY) * 0.05;

    // Feixe volumetrico de holofote de cinema
    const beamGradient = ctx.createRadialGradient(
      flareX, flareY, 10,
      flareX, flareY, width * 0.5
    );
    beamGradient.addColorStop(0, "rgba(229, 169, 59, 0.22)");
    beamGradient.addColorStop(0.35, "rgba(229, 169, 59, 0.08)");
    beamGradient.addColorStop(1, "rgba(8, 8, 12, 0)");

    ctx.fillStyle = beamGradient;
    ctx.fillRect(0, 0, width, height);

    // Linha de reflexo anamorfico suave
    const anamorphicGrad = ctx.createLinearGradient(0, flareY, width, flareY);
    anamorphicGrad.addColorStop(0, "rgba(56, 189, 248, 0)");
    anamorphicGrad.addColorStop(Math.max(0, flareX / width - 0.2), "rgba(56, 189, 248, 0.05)");
    anamorphicGrad.addColorStop(flareX / width, "rgba(255, 255, 255, 0.25)");
    anamorphicGrad.addColorStop(Math.min(1, flareX / width + 0.2), "rgba(56, 189, 248, 0.05)");
    anamorphicGrad.addColorStop(1, "rgba(56, 189, 248, 0)");

    ctx.fillStyle = anamorphicGrad;
    ctx.fillRect(0, flareY - 1, width, 2);

    // Particulas em suspensao
    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.005;

      if (p.y < 0) {
        p.y = height + 5;
        p.x = Math.random() * width;
      }
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(244, 244, 246, ${Math.max(0.1, Math.min(0.7, p.alpha))})`;
      ctx.fill();
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   3. TIMECODE CINEMATOGRAFICO VIVO
   ========================================================================== */
function initTimecode() {
  const timecodeEl = document.getElementById("liveTimecode");
  if (!timecodeEl) return;

  let frames = 0;
  let seconds = 14;
  let minutes = 22;
  let hours = 1;

  setInterval(() => {
    frames++;
    if (frames >= 24) {
      frames = 0;
      seconds++;
      if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
          minutes = 0;
          hours++;
        }
      }
    }

    const h = String(hours).padStart(2, "0");
    const m = String(minutes).padStart(2, "0");
    const s = String(seconds).padStart(2, "0");
    const f = String(frames).padStart(2, "0");

    timecodeEl.textContent = `${h}:${m}:${s}:${f}`;
  }, 1000 / 24);
}

/* ==========================================================================
   4. FILTROS DE PORTFOLIO
   ========================================================================== */
function initPortfolioFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      cards.forEach((card) => {
        const category = card.dataset.category;
        if (filter === "all" || category === filter) {
          card.style.display = "block";
          card.style.opacity = "0";
          setTimeout(() => {
            card.style.opacity = "1";
          }, 50);
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

/* ==========================================================================
   5. CALCULADORA DE DIARIAS E HORAS
   ========================================================================== */
function initRateCalculator() {
  const spaceRadios = document.querySelectorAll('input[name="calcSpace"]');
  const hoursSlider = document.getElementById("calcHoursSlider");
  const hoursDisplay = document.getElementById("calcHoursValue");
  const extraLight = document.getElementById("addonLighting");
  const extraStaff = document.getElementById("addonStaff");

  const priceDisplay = document.getElementById("calcTotalPrice");
  const detailSpace = document.getElementById("calcDetailSpace");
  const detailHours = document.getElementById("calcDetailHours");
  const detailTotal = document.getElementById("calcDetailTotal");
  const bookCalcBtn = document.getElementById("bookFromCalcBtn");

  if (!priceDisplay || !hoursSlider) return;

  function calculate() {
    let baseHourRate = 220; // Estudio A Ciclorama por padrao
    let spaceName = "Estudio A (Ciclorama 4K)";

    const checkedSpace = document.querySelector('input[name="calcSpace"]:checked');
    if (checkedSpace) {
      const val = checkedSpace.value;
      if (val === "b") {
        baseHourRate = 180;
        spaceName = "Estudio B (Podcast e Transmissao)";
      } else if (val === "audio") {
        baseHourRate = 150;
        spaceName = "Sala de Audio e Gravacao";
      }
    }

    const hours = parseInt(hoursSlider.value, 10);
    hoursDisplay.textContent = `${hours} horas`;

    let subtotal = baseHourRate * hours;

    if (extraLight && extraLight.checked) {
      subtotal += 350;
    }
    if (extraStaff && extraStaff.checked) {
      subtotal += 250;
    }

    priceDisplay.textContent = `R$ ${subtotal.toLocaleString("pt-BR")}`;
    if (detailSpace) detailSpace.textContent = spaceName;
    if (detailHours) detailHours.textContent = `${hours}h de producao`;
    if (detailTotal) detailTotal.textContent = `R$ ${subtotal.toLocaleString("pt-BR")}`;
  }

  spaceRadios.forEach((r) => r.addEventListener("change", calculate));
  hoursSlider.addEventListener("input", calculate);
  if (extraLight) extraLight.addEventListener("change", calculate);
  if (extraStaff) extraStaff.addEventListener("change", calculate);

  calculate();

  if (bookCalcBtn) {
    bookCalcBtn.addEventListener("click", () => {
      const ctaSection = document.getElementById("contato");
      const messageField = document.getElementById("formMessage");
      const spaceField = document.getElementById("formSpaceSelect");

      if (ctaSection) {
        ctaSection.scrollIntoView({ behavior: "smooth" });
      }

      const checkedSpace = document.querySelector('input[name="calcSpace"]:checked');
      if (spaceField && checkedSpace) {
        spaceField.value = checkedSpace.value;
      }

      if (messageField) {
        const hours = hoursSlider.value;
        const total = priceDisplay.textContent;
        messageField.value = `Ola equipe. Fiz uma simulacao no site para ${hours} horas no espaco selecionado, com estimativa em ${total}. Gostaria de confirmar a disponibilidade de agenda.`;
        messageField.focus();
      }
    });
  }
}

/* ==========================================================================
   6. FAQ ACORDEAO
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Fecha os outros
      faqItems.forEach((other) => {
        if (other !== item) other.classList.remove("active");
      });

      if (isActive) {
        item.classList.remove("active");
      } else {
        item.classList.add("active");
      }
    });
  });
}

/* ==========================================================================
   7. MODO GUIA DE DEMONSTRACAO (CLIENTE)
   ========================================================================== */
function initGuideMode() {
  const toggleBtn = document.getElementById("toggleGuideBtn");
  const modal = document.getElementById("guideModal");
  const closeModalBtn = document.getElementById("closeGuideModal");
  const openModalLink = document.getElementById("openGuideModalLink");

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("guide-mode");
      const isGuide = document.body.classList.contains("guide-mode");
      toggleBtn.innerHTML = isGuide
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Modo Guia Ativo (Clique para Ocultar)`
        : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> Guia de Onde Personalizar`;
    });
  }

  if (openModalLink && modal) {
    openModalLink.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.add("active");
    });
  }

  const footerGuideLink = document.getElementById("footerGuideLink");
  if (footerGuideLink && modal) {
    footerGuideLink.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.add("active");
    });
  }

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener("click", () => {
      modal.classList.remove("active");
    });
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("active");
    });
  }
}

/* ==========================================================================
   8. FORMULARIO DE RESERVA COM ESTADO DE SUCESSO
   ========================================================================== */
function initReservationForm() {
  const form = document.getElementById("bookingForm");
  const feedback = document.getElementById("formFeedback");

  if (!form || !feedback) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("formName").value;
    const phone = document.getElementById("formPhone").value;

    if (!name || !phone) {
      alert("Por favor, preencha ao menos o seu nome e WhatsApp de contato.");
      return;
    }

    feedback.style.display = "block";
    feedback.innerHTML = `
      <strong>Solicitacao demonstrativa enviada com sucesso.</strong><br>
      No site real do seu estudio, estes dados chegam imediatamente no seu WhatsApp ou no e-mail oficial da sua recepcao.
    `;

    form.reset();

    setTimeout(() => {
      feedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  });
}

/* ==========================================================================
   9. REVELACAO SUAVE NO SCROLL
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".space-card, .project-card, .metric-card, .gear-column, .testimonial-card");

  revealElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => observer.observe(el));
}
