/**
 * Interactions & Visual Polish
 * Suryansh Singh — Developer Portfolio
 */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const navToggle = document.getElementById("nav-toggle");
  const siteNav = document.getElementById("site-nav");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");

  // 1. Mobile Menu Toggle
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close on nav link click
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (siteNav.classList.contains("is-open")) {
          siteNav.classList.remove("is-open");
          navToggle.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        }
      });
    });
  }

  // 2. Header Scroll Effect & Scroll-Spy Active Nav Highlighting
  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Header elevation
    if (header) {
      if (scrollY > 30) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    // Scroll-Spy
    const scrollPosition = scrollY + 200;

    sections.forEach((section) => {
      const sectionId = section.getAttribute("id");
      const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
      if (!navLink) return;

      const top = section.offsetTop;
      const height = section.offsetHeight;

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach((l) => l.classList.remove("active"));
        navLink.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // 3. Scroll Reveal with IntersectionObserver
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const revealElements = document.querySelectorAll(
      ".section-header, .about-narrative, .about-profile-card, .skill-category-card, .timeline-step-item, .focus-banner, .contact-box"
    );

    revealElements.forEach((el) => {
      el.classList.add("reveal-init");
    });

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -60px 0px",
        threshold: 0.1,
      }
    );

    revealElements.forEach((el) => {
      revealObserver.observe(el);
    });
  }
});
