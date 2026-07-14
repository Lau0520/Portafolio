const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const themeToggle = document.querySelector("#theme-toggle");
const themeToggleIcon = document.querySelector(".theme-toggle-icon");
const themeToggleText = document.querySelector(".theme-toggle-text");
const links = [...document.querySelectorAll(".site-nav a")];
const sections = links
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const THEME_KEY = "portfolio-theme";

function setTheme(theme) {
  const isLight = theme === "light";

  document.body.classList.toggle("light-theme", isLight);

  if (themeToggleIcon) {
    themeToggleIcon.textContent = isLight ? "\u2600" : "\u263E";
  }

  if (themeToggleText) {
    themeToggleText.textContent = isLight ? "Modo oscuro" : "Modo claro";
  }
}

const savedTheme = localStorage.getItem(THEME_KEY);
setTheme(savedTheme === "light" ? "light" : "dark");

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("light-theme") ? "dark" : "light";
  localStorage.setItem(THEME_KEY, nextTheme);
  setTheme(nextTheme);
});

menuToggle?.addEventListener("click", () => {
  header.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", header.classList.contains("is-open"));
});

links.forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const id = `#${entry.target.id}`;
      links.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === id);
      });
    });
  },
  {
    threshold: 0.45,
    rootMargin: "-20% 0px -35% 0px",
  }
);

sections.forEach((section) => observer.observe(section));

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const panels = document.querySelectorAll(".panel");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  panels.forEach((panel, index) => {
    panel.style.opacity = "0";
    panel.style.transform = "translateY(22px)";
    panel.style.transition = `opacity 480ms ease ${index * 60}ms, transform 480ms ease ${index * 60}ms`;
    revealObserver.observe(panel);
  });
}
