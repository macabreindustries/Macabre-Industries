/* =========================
   Macabre Industries - script.js
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggle = document.getElementById("theme-toggle");
  const preloader = document.getElementById("preloader");

  // -------- Preloader --------
  window.onload = () => {
    setTimeout(() => {
      preloader.style.opacity = "0";
      preloader.style.pointerEvents = "none";
      setTimeout(() => preloader.style.display = "none", 500);
    }, 1000); // Ajusta duración de preloader
  };

  // -------- Theme Toggle --------
  const currentTheme = localStorage.getItem("theme") || "light";
  if (currentTheme === "dark") body.classList.add("dark");
  themeToggle.checked = currentTheme === "dark";

  themeToggle.addEventListener("change", () => {
    body.classList.toggle("dark");
    const theme = body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", theme);
  });

  // -------- Hero & Cards Animations --------
  const faders = document.querySelectorAll(".hero h1, .hero p, .hero .btn-secundario, .card, .servicio-card, .portafolio-card, .footer");
  const appearOptions = { threshold: 0, rootMargin: "0px 0px -80px 0px" };
  
  const appearOnScroll = new IntersectionObserver((entries, appearOnScroll) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.opacity = 1;
      entry.target.style.transform = "translateY(0)";
      appearOnScroll.unobserve(entry.target);
    });
  }, appearOptions);

  faders.forEach(fader => appearOnScroll.observe(fader));

  // -------- Mobile Menu --------
  const navToggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".menu");

  navToggle.addEventListener("click", () => {
    menu.classList.toggle("mobile-open");
    navToggle.setAttribute("aria-expanded", menu.classList.contains("mobile-open"));
  });
});
