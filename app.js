const pages = [...document.querySelectorAll(".page")];
const dots = [...document.querySelectorAll(".page-dots button")];
const pageNumber = document.querySelector("#pageNumber");
const progressFill = document.querySelector("#progressFill");
const portraitCard = document.querySelector("#portraitCard");
const confettiCanvas = document.querySelector("#confetti");
const ctx = confettiCanvas.getContext("2d");
const cursorStar = document.querySelector("#cursorStar");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let currentPage = 0;
let particles = [];
let animationFrame = null;

function goToPage(index) {
  const nextIndex = Math.max(0, Math.min(pages.length - 1, index));
  if (nextIndex === currentPage) return;

  const previous = pages[currentPage];
  previous.classList.add("is-exiting");
  previous.classList.remove("is-active");
  previous.setAttribute("aria-hidden", "true");

  currentPage = nextIndex;
  const next = pages[currentPage];
  next.classList.remove("is-exiting");
  next.classList.add("is-active");
  next.setAttribute("aria-hidden", "false");

  dots.forEach((dot, dotIndex) => {
    const active = dotIndex === currentPage;
    dot.classList.toggle("is-active", active);
    active ? dot.setAttribute("aria-current", "page") : dot.removeAttribute("aria-current");
  });

  pageNumber.textContent = String(currentPage + 1).padStart(2, "0");
  progressFill.style.width = `${((currentPage + 1) / pages.length) * 100}%`;
  document.title = [
    "Happy Teacher's Month!",
    "A Note From the Heart",
    "A Song for Our Professor",
  ][currentPage];

  if (!reduceMotion.matches) burstConfetti(currentPage === 2 ? 70 : 36);
  window.setTimeout(() => previous.classList.remove("is-exiting"), 750);
}

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => goToPage(currentPage + 1));
});

document.querySelectorAll("[data-back]").forEach((button) => {
  button.addEventListener("click", () => goToPage(currentPage - 1));
});

document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => goToPage(Number(button.dataset.go)));
});

document.addEventListener("keydown", (event) => {
  if (event.target.closest("input")) return;
  if (event.key === "ArrowRight") goToPage(currentPage + 1);
  if (event.key === "ArrowLeft") goToPage(currentPage - 1);
});

function resetPortrait() {
  portraitCard.style.transform = "rotate(2.5deg) rotateX(0deg) rotateY(0deg)";
}

portraitCard.addEventListener("pointermove", (event) => {
  if (reduceMotion.matches || event.pointerType === "touch") return;
  const rect = portraitCard.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  portraitCard.style.transform = `rotate(1deg) rotateX(${-y * 12}deg) rotateY(${x * 15}deg)`;
});

portraitCard.addEventListener("pointerleave", resetPortrait);
portraitCard.addEventListener("blur", resetPortrait);

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  confettiCanvas.width = Math.floor(window.innerWidth * ratio);
  confettiCanvas.height = Math.floor(window.innerHeight * ratio);
  confettiCanvas.style.width = `${window.innerWidth}px`;
  confettiCanvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function burstConfetti(count = 72) {
  if (reduceMotion.matches) return;
  const colors = ["#ef6a62", "#f7c94a", "#78bdea", "#17345d", "#f6a7ad", "#fffdf7"];
  const originX = window.innerWidth * (0.35 + Math.random() * 0.3);
  const originY = window.innerHeight * 0.16;
  for (let i = 0; i < count; i += 1) {
    particles.push({
      x: originX,
      y: originY,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -9 - 3,
      gravity: 0.18 + Math.random() * 0.08,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.24,
      size: 5 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      ttl: 140 + Math.random() * 70,
      shape: Math.random() > 0.3 ? "rect" : "circle",
    });
  }
  if (!animationFrame) animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles = particles.filter((particle) => particle.life < particle.ttl);
  for (const particle of particles) {
    particle.life += 1;
    particle.vy += particle.gravity;
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.rotation += particle.spin;
    const alpha = Math.max(0, 1 - particle.life / particle.ttl);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    ctx.fillStyle = particle.color;
    if (particle.shape === "circle") {
      ctx.beginPath();
      ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-particle.size / 2, -particle.size / 4, particle.size, particle.size / 2);
    }
    ctx.restore();
  }
  if (particles.length) {
    animationFrame = requestAnimationFrame(animateConfetti);
  } else {
    animationFrame = null;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

document.querySelector("#celebrateAgain").addEventListener("click", () => {
  burstConfetti(130);
  window.setTimeout(() => goToPage(0), 550);
});

if (window.matchMedia("(pointer: fine)").matches && !reduceMotion.matches) {
  document.addEventListener("pointermove", (event) => {
    cursorStar.style.opacity = "0.85";
    cursorStar.style.left = `${event.clientX + 13}px`;
    cursorStar.style.top = `${event.clientY + 12}px`;
  });

  document.addEventListener("pointerleave", () => {
    cursorStar.style.opacity = "0";
  });
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas, { passive: true });
window.addEventListener("load", () => window.setTimeout(() => burstConfetti(95), 380));
