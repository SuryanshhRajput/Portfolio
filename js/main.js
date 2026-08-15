/**
 * Application Logic & Stable Proportional 1440x900 Desktop Website Thumbnail Preview System
 * Shared Engine for Both Project Cards & Project Detail Modal (Feedback-Loop-Free)
 * Suryansh Singh — Developer Portfolio
 */

document.addEventListener("DOMContentLoaded", () => {
  const portfolio = window.portfolioData || { developmentProjects: [], freelanceProjects: [] };
  const freelanceProjects = portfolio.freelanceProjects || [];
  const developmentProjects = portfolio.developmentProjects || portfolio.projects || [];
  const allProjects = [...freelanceProjects, ...developmentProjects];

  const freelanceGrid = document.getElementById("freelance-grid");
  const projectGrid = document.getElementById("project-grid");
  const projectCountEl = document.getElementById("project-count");

  // Modal Elements
  const modal = document.getElementById("project-modal");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalCloseBtn = document.getElementById("modal-close");
  const modalTitle = document.getElementById("modal-title");
  const modalCategory = document.getElementById("modal-category");
  const modalDesc = document.getElementById("modal-description");
  const modalTechTags = document.getElementById("modal-tech-tags");
  const modalHighlightsList = document.getElementById("modal-highlights-list");
  const modalHighlightsContainer = document.getElementById("modal-highlights-container");
  const modalLiveBtn = document.getElementById("modal-live-btn");
  const modalGithubBtn = document.getElementById("modal-github-btn");
  const modalBrowserAddress = document.getElementById("modal-browser-address");
  const modalBrowserBadge = document.getElementById("modal-browser-badge");
  const modalIframeContainer = document.getElementById("modal-iframe-container");

  // Toast Element
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");
  let toastTimeout = null;

  function showToast(message) {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = message;
    toast.classList.add("is-active");
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("is-active");
    }, 2800);
  }

  // Copy Email Handlers
  const copyButtons = document.querySelectorAll(".copy-email-btn");
  copyButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const email = btn.getAttribute("data-email") || "suryanshhsingh986@gmail.com";
      navigator.clipboard.writeText(email).then(
        () => {
          showToast(`Copied ${email} to clipboard!`);
        },
        () => {
          showToast(`Email: ${email}`);
        }
      );
    });
  });

  if (projectCountEl) {
    projectCountEl.textContent = String(developmentProjects.length);
  }

  // ==========================================================================
  // STABLE, NON-JITTERING 1440x900 DESKTOP THUMBNAIL SCALING CONTROLLER
  // (Observes ONLY stable container clientWidth and transforms internal stage)
  // ==========================================================================

  const DESKTOP_CANVAS_WIDTH = 1440;

  function updateDesktopPreviewScale(container) {
    if (!container) return;
    const stage = container.querySelector(".desktop-preview-stage");
    if (!stage) return;

    // Read stable, untransformed container width
    const containerWidth = container.clientWidth;
    if (!containerWidth || containerWidth <= 0) return;

    // Prevent feedback loops: skip calculation if width has not changed
    if (
      typeof container.__lastAppliedWidth === "number" &&
      Math.abs(container.__lastAppliedWidth - containerWidth) < 1
    ) {
      return;
    }
    container.__lastAppliedWidth = containerWidth;

    // Calculate exact proportional scale
    const scale = containerWidth / DESKTOP_CANVAS_WIDTH;

    // Apply scale ONLY to internal desktop stage (instant transform, zero animation on scale)
    stage.style.transform = `scale(${scale})`;
    stage.style.transformOrigin = "0 0";
  }

  // RAF-batched scale scheduler to completely prevent layout thrashing
  let rafId = null;
  const pendingContainers = new Set();

  function processPendingScales() {
    pendingContainers.forEach((container) => {
      updateDesktopPreviewScale(container);
    });
    pendingContainers.clear();
    rafId = null;
  }

  function scheduleScaleUpdate(container) {
    if (!container) return;
    pendingContainers.add(container);
    if (!rafId) {
      rafId = requestAnimationFrame(processPendingScales);
    }
  }

  function updateAllDesktopPreviews() {
    const containers = document.querySelectorAll(".desktop-preview-container");
    containers.forEach((container) => {
      scheduleScaleUpdate(container);
    });
  }

  // ResizeObserver observes only the outer preview container
  let resizeObserver = null;
  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        scheduleScaleUpdate(entry.target);
      }
    });
  }

  // Helper to construct reusable 1440x900 desktop preview stage markup (Live Websites)
  function createLiveDesktopPreviewHtml(project, isModal = false) {
    let hostname = "project.vercel.app";
    if (project.liveUrl) {
      try {
        hostname = new URL(project.liveUrl).hostname;
      } catch (e) {
        hostname = "project.vercel.app";
      }
    }

    const hoverOverlayHtml = isModal
      ? ""
      : `
        <div class="preview-hover-overlay">
          <span class="overlay-cta-badge">✦ View Live Preview &amp; Details</span>
        </div>
      `;

    return `
      <div class="preview-stage" data-project-id="${project.id}" role="button" tabindex="0" aria-label="Open details and live preview for ${project.title}">
        <div class="browser-bar" aria-hidden="true">
          <div class="browser-dots"><span></span><span></span><span></span></div>
          <span class="browser-address">${hostname}</span>
          <span class="browser-badge">● Live</span>
        </div>
        <div class="desktop-preview-container">
          <div class="viewport-loader">
            <span class="spinner"></span>
            <span>Loading desktop preview...</span>
          </div>
          <div class="desktop-preview-stage">
            <iframe
              src="${project.liveUrl}"
              title="Desktop preview of ${project.title}"
              loading="lazy"
              tabindex="-1"
              aria-hidden="true"
              scrolling="no"
            ></iframe>
          </div>
          ${hoverOverlayHtml}
        </div>
      </div>
    `;
  }

  // Helper to construct LinkedIn link preview card (For archived Glasseria & DogIndeed)
  function createLinkedInPreviewHtml(project, isModal = false) {
    const isGlasseria = project.id === "glasseria";
    const postTitle = isGlasseria
      ? "Glasseria — Custom Shopify E-Commerce Storefront"
      : "DogIndeed — Shopify Store & Custom UI Implementation";
    const postSnippet = isGlasseria
      ? "Excited to share the custom Shopify storefront built for Glasseria featuring bespoke Liquid templates, custom-coded UI sections, responsive product cards, and tailored e-commerce experience."
      : "Completed a tailored Shopify storefront implementation for DogIndeed, engineering custom product display cards, responsive collection pages, and optimized e-commerce UI components.";
    const tagsText = isGlasseria
      ? "#Shopify #Liquid #Frontend #CustomUI #Freelance"
      : "#Shopify #ECommerce #Frontend #Freelance #WebDesign";

    const hoverOverlayHtml = isModal
      ? ""
      : `
        <div class="preview-hover-overlay">
          <span class="overlay-cta-badge">✦ View LinkedIn Post &amp; Case Study</span>
        </div>
      `;

    return `
      <div class="preview-stage" data-project-id="${project.id}" role="button" tabindex="0" aria-label="Open project details and LinkedIn proof for ${project.title}">
        <div class="browser-bar" aria-hidden="true">
          <div class="browser-dots"><span></span><span></span><span></span></div>
          <span class="browser-address">linkedin.com/posts/suryanshhsingh</span>
          <span class="browser-badge" style="color: #94a3b8; background: rgba(148, 163, 184, 0.12); border: 1px solid rgba(148, 163, 184, 0.2);">Completed</span>
        </div>
        <div class="linkedin-preview-card">
          <div class="linkedin-post-header">
            <div class="linkedin-in-icon" aria-hidden="true">in</div>
            <div class="linkedin-author-meta">
              <span class="linkedin-author-name">
                Suryansh Singh
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#38bdf8"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              </span>
              <span class="linkedin-author-role">Frontend / Full-Stack Developer • Project Showcase</span>
            </div>
          </div>
          <div class="linkedin-post-snippet">
            <div class="linkedin-post-title">${postTitle}</div>
            <div class="linkedin-post-desc">${postSnippet}</div>
          </div>
          <div class="linkedin-post-footer">
            <span>${tagsText}</span>
            <span style="font-weight: 600;">Verified Case Post ↗</span>
          </div>
          ${hoverOverlayHtml}
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // RENDER FEATURED FREELANCE WORK SECTION (3 CLIENT PROJECTS)
  // ==========================================================================

  function renderFreelanceWork() {
    if (!freelanceGrid || freelanceProjects.length === 0) return;

    const glasseria = freelanceProjects.find((p) => p.id === "glasseria") || freelanceProjects[0];
    const secondaries = freelanceProjects.filter((p) => p.id !== glasseria.id);

    // Flagship Card (Glasseria - LinkedIn Project Preview)
    const glasseriaTags = (glasseria.technologies || [])
      .map((tech) => `<span class="tech-tag">${tech}</span>`)
      .join("");

    const flagshipHtml = `
      <article class="freelance-card--flagship" data-project-id="${glasseria.id}">
        ${createLinkedInPreviewHtml(glasseria)}
        <div class="card-body">
          <div>
            <div class="card-topline" style="margin-bottom: 0.8rem;">
              <span class="card-category">${glasseria.category}</span>
              <span class="flagship-badge">★ Featured Client Project</span>
            </div>
            <h3 class="card-title" style="font-size: 1.45rem; line-height: 1.25; min-height: auto; margin-bottom: 0.8rem;">
              ${glasseria.title}
            </h3>
            <p class="card-description" style="-webkit-line-clamp: 4; min-height: auto; font-size: 0.92rem; line-height: 1.6; margin-bottom: 1.4rem;">
              ${glasseria.description}
            </p>
            <div class="tech-tags" style="margin-bottom: 1.5rem;">${glasseriaTags}</div>
          </div>
          <div class="card-actions" style="padding-top: 1.25rem;">
            <div class="freelance-actions">
              <a href="${glasseria.linkedinUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" aria-label="View Glasseria Project Post on LinkedIn">
                <span>View Project Post</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </a>
            </div>
            <button type="button" class="details-trigger" data-project-id="${glasseria.id}" aria-label="View project details for ${glasseria.title}">
              Details +
            </button>
          </div>
        </div>
      </article>
    `;

    // Secondary Cards: Vellora Escapes (Live) & DogIndeed (LinkedIn Preview)
    const secondaryHtml = secondaries
      .map((project) => {
        const tags = (project.technologies || [])
          .map((tech) => `<span class="tech-tag">${tech}</span>`)
          .join("");

        const isLive = project.status === "live" && Boolean(project.liveUrl);
        const previewHtml = isLive ? createLiveDesktopPreviewHtml(project) : createLinkedInPreviewHtml(project);

        const primaryCtaHtml = isLive
          ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="action-link live-link" aria-label="Visit Website for ${project.title}">
              <span>Visit Website</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </a>`
          : `<a href="${project.linkedinUrl}" target="_blank" rel="noopener noreferrer" class="action-link live-link" aria-label="View Project Post for ${project.title}">
              <span>View Project Post</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </a>`;

        return `
          <article class="project-card" data-project-id="${project.id}">
            ${previewHtml}
            <div class="card-body">
              <div class="card-topline">
                <span class="card-category">${project.category}</span>
                <span class="feature-badge">${isLive ? "Live Client Website" : "Archived Client Work"}</span>
              </div>
              <h3 class="card-title">${project.title}</h3>
              <p class="card-description">${project.description}</p>
              <div class="tech-tags">${tags}</div>
              <div class="card-actions">
                <div class="freelance-actions">
                  ${primaryCtaHtml}
                </div>
                <button type="button" class="details-trigger" data-project-id="${project.id}" aria-label="View project details for ${project.title}">
                  Details +
                </button>
              </div>
            </div>
          </article>
        `;
      })
      .join("");

    freelanceGrid.innerHTML = `
      ${flagshipHtml}
      <div class="freelance-secondary-grid">
        ${secondaryHtml}
      </div>
    `;
  }

  // ==========================================================================
  // RENDER SELECTED DEVELOPMENT PROJECTS (EXACTLY 15 WEBSITES)
  // ==========================================================================

  function renderDevelopmentProjects() {
    if (!projectGrid) return;

    projectGrid.innerHTML = developmentProjects
      .map((project) => {
        const isFeatured = project.featured;
        const tagsHtml = (project.technologies || [])
          .map((tech) => `<span class="tech-tag">${tech}</span>`)
          .join("");

        return `
          <article class="project-card" data-project-id="${project.id}">
            ${createLiveDesktopPreviewHtml(project)}
            <div class="card-body">
              <div class="card-topline">
                <span class="card-category">${project.category || "Web Application"}</span>
                ${isFeatured ? '<span class="feature-badge">Featured</span>' : ""}
              </div>
              <h3 class="card-title">${project.title}</h3>
              <p class="card-description">${project.description}</p>
              <div class="tech-tags">${tagsHtml}</div>
              <div class="card-actions">
                <div class="card-actions-left">
                  <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="action-link live-link" data-id="${project.id}" aria-label="Open live demo for ${project.title}">
                    <span>Live Demo</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                  </a>
                </div>
                <button type="button" class="details-trigger" data-project-id="${project.id}" aria-label="View project details for ${project.title}">
                  Details +
                </button>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  // ==========================================================================
  // INITIALIZE DESKTOP THUMBNAILS & RESIZEOBSERVERS
  // ==========================================================================

  function initDesktopThumbnails() {
    const containers = document.querySelectorAll(".desktop-preview-container");

    containers.forEach((container) => {
      // Register with ResizeObserver
      if (resizeObserver) {
        resizeObserver.observe(container);
      }

      // Initial scaling calculation
      scheduleScaleUpdate(container);

      // Handle iframe load
      const stage = container.querySelector(".desktop-preview-stage");
      const iframe = container.querySelector("iframe");
      const loader = container.querySelector(".viewport-loader");

      if (iframe && stage) {
        iframe.addEventListener("load", () => {
          stage.classList.add("is-ready");
          if (loader) loader.classList.add("is-hidden");
          scheduleScaleUpdate(container);
        });

        // Safety fallback timer to guarantee visibility
        setTimeout(() => {
          stage.classList.add("is-ready");
          if (loader) loader.classList.add("is-hidden");
          scheduleScaleUpdate(container);
        }, 1600);
      }
    });

    // Window resize fallback
    window.addEventListener("resize", updateAllDesktopPreviews);
  }

  // ==========================================================================
  // PROJECT DETAIL MODAL (USES EXACT SAME STABLE 1440x900 DESKTOP PREVIEW ENGINE)
  // ==========================================================================

  function openProjectModal(projectId) {
    const project = allProjects.find((p) => p.id === projectId);
    if (!project || !modal) return;

    modalTitle.textContent = project.title;
    modalCategory.textContent = project.category;
    modalDesc.textContent = project.description;

    const isLive = project.status === "live" && Boolean(project.liveUrl);

    // Update Modal Browser Bar
    if (modalBrowserAddress) {
      let host = "linkedin.com/posts/suryanshhsingh";
      if (isLive) {
        try {
          host = new URL(project.liveUrl).hostname;
        } catch (e) {
          host = project.liveUrl;
        }
      }
      modalBrowserAddress.textContent = host;
    }

    if (modalBrowserBadge) {
      modalBrowserBadge.textContent = isLive ? "● Live" : "Completed";
      modalBrowserBadge.style.color = isLive ? "var(--accent)" : "#94a3b8";
      modalBrowserBadge.style.background = isLive ? "rgba(56, 189, 248, 0.12)" : "rgba(148, 163, 184, 0.12)";
      modalBrowserBadge.style.border = isLive ? "none" : "1px solid rgba(148, 163, 184, 0.2)";
    }

    // Modal Action Buttons
    if (isLive) {
      modalLiveBtn.style.display = "inline-flex";
      modalLiveBtn.href = project.liveUrl;
      modalLiveBtn.querySelector("span").textContent = "Open Live Site";
    } else if (project.linkedinUrl) {
      modalLiveBtn.style.display = "inline-flex";
      modalLiveBtn.href = project.linkedinUrl;
      modalLiveBtn.querySelector("span").textContent = "View LinkedIn Post";
    } else {
      modalLiveBtn.style.display = "none";
    }

    if (project.githubUrl) {
      modalGithubBtn.style.display = "inline-flex";
      modalGithubBtn.href = project.githubUrl;
    } else {
      modalGithubBtn.style.display = "none";
    }

    // Tech Tags
    modalTechTags.innerHTML = (project.technologies || [])
      .map((tech) => `<span class="tech-tag">${tech}</span>`)
      .join("");

    // Highlights
    if (project.highlights && project.highlights.length > 0) {
      modalHighlightsContainer.style.display = "flex";
      modalHighlightsList.innerHTML = project.highlights
        .map((hl) => `<li>${hl}</li>`)
        .join("");
    } else {
      modalHighlightsContainer.style.display = "none";
    }

    // Modal Website Preview: EXACT SAME DESKTOP 1440x900 SCALED STAGE
    if (isLive) {
      modalIframeContainer.innerHTML = `
        <div class="viewport-loader">
          <span class="spinner"></span>
          <span>Loading desktop preview...</span>
        </div>
        <div class="desktop-preview-stage">
          <iframe
            src="${project.liveUrl}"
            title="Desktop preview of ${project.title}"
            loading="lazy"
            tabindex="-1"
            aria-hidden="true"
            scrolling="no"
          ></iframe>
        </div>
      `;

      delete modalIframeContainer.__lastAppliedWidth;

      // Register with ResizeObserver for dynamic scaling in modal
      if (resizeObserver) {
        resizeObserver.observe(modalIframeContainer);
      }

      // Initial scaling calculation
      scheduleScaleUpdate(modalIframeContainer);

      const frame = modalIframeContainer.querySelector("iframe");
      const stage = modalIframeContainer.querySelector(".desktop-preview-stage");
      const loader = modalIframeContainer.querySelector(".viewport-loader");

      if (frame && stage) {
        frame.addEventListener("load", () => {
          stage.classList.add("is-ready");
          if (loader) loader.classList.add("is-hidden");
          scheduleScaleUpdate(modalIframeContainer);
        });

        // Fail-safe display
        setTimeout(() => {
          stage.classList.add("is-ready");
          if (loader) loader.classList.add("is-hidden");
          scheduleScaleUpdate(modalIframeContainer);
        }, 1500);
      }
    } else {
      // ARCHIVED LINKEDIN PREVIEW (No iframe)
      modalIframeContainer.innerHTML = `
        <div class="linkedin-preview-card" style="min-height: 240px; padding: 1.75rem 2rem;">
          <div class="linkedin-post-header">
            <div class="linkedin-in-icon" aria-hidden="true">in</div>
            <div class="linkedin-author-meta">
              <span class="linkedin-author-name" style="font-size: 1rem;">
                Suryansh Singh
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#38bdf8"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              </span>
              <span class="linkedin-author-role">Frontend / Full-Stack Developer • Verified Project Showcase</span>
            </div>
          </div>
          <div class="linkedin-post-snippet" style="margin: 1.1rem 0; padding: 1.1rem 1.25rem;">
            <div class="linkedin-post-title" style="font-size: 1.1rem; margin-bottom: 0.4rem;">
              ${project.id === "glasseria" ? "Glasseria — Custom Shopify E-Commerce Storefront" : "DogIndeed — Shopify Store & Custom UI Implementation"}
            </div>
            <div class="linkedin-post-desc" style="font-size: 0.88rem; line-height: 1.55; -webkit-line-clamp: 3;">
              ${project.description}
            </div>
          </div>
          <div class="linkedin-post-footer">
            <span>${project.id === "glasseria" ? "#Shopify #Liquid #Frontend #CustomUI" : "#Shopify #ECommerce #Frontend #Freelance"}</span>
            <a href="${project.linkedinUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--accent); font-weight: 600;">
              Open Verified Post on LinkedIn ↗
            </a>
          </div>
        </div>
      `;
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      if (isLive) {
        scheduleScaleUpdate(modalIframeContainer);
      }
      modalCloseBtn?.focus();
    }, 150);
  }

  function closeProjectModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (resizeObserver && modalIframeContainer) {
      resizeObserver.unobserve(modalIframeContainer);
    }
    delete modalIframeContainer.__lastAppliedWidth;
    if (modalIframeContainer) {
      modalIframeContainer.innerHTML = "";
    }
  }

  function initCardModalTriggers() {
    const triggers = document.querySelectorAll(".details-trigger");
    triggers.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-project-id");
        if (id) openProjectModal(id);
      });
    });

    const previewStages = document.querySelectorAll(".preview-stage");
    previewStages.forEach((stage) => {
      stage.addEventListener("click", (e) => {
        const id = stage.getAttribute("data-project-id");
        if (id) openProjectModal(id);
      });
      stage.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const id = stage.getAttribute("data-project-id");
          if (id) openProjectModal(id);
        }
      });
    });

    const cards = document.querySelectorAll(".project-card, .freelance-card--flagship");
    cards.forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.closest("a") || e.target.closest("button")) {
          return;
        }
        const id = card.getAttribute("data-project-id");
        if (id) openProjectModal(id);
      });
    });
  }

  modalCloseBtn?.addEventListener("click", closeProjectModal);
  modalBackdrop?.addEventListener("click", closeProjectModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.classList.contains("is-open")) {
      closeProjectModal();
    }
  });

  // Render both sections
  renderFreelanceWork();
  renderDevelopmentProjects();
  initDesktopThumbnails();
  initCardModalTriggers();
});
