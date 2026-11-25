// Vanilla JavaScript for the portfolio: render editable data and wire up interactions.
(() => {
  "use strict";

  const content = window.PORTFOLIO_DATA;
  if (!content || !content.site) return;
  const site = content.site;
  const page = document.body.dataset.page || "home";
  const pageInfo = content.pages[page] || content.pages.home;

  const escapeHtml = (value = "") =>
    String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[character]);

  const setText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  };

  const projectCard = (project, index) => `
    <article class="project-card glass-card" data-category="${escapeHtml(project.category)}">
      <div class="project-card-top">
        <span class="eyebrow category-label">${escapeHtml(project.category)}</span>
        <span class="project-index" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3>${escapeHtml(project.title)}</h3>
      <p>${escapeHtml(project.summary)}</p>
      <ul class="tag-list" aria-label="Technologies">${project.tech.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")}</ul>
      <div class="project-links">
        <a href="${escapeHtml(project.repo)}" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
        <a href="${escapeHtml(project.demo)}" target="_blank" rel="noopener noreferrer">Live demo <span aria-hidden="true">↗</span></a>
        <button class="text-button details-trigger" type="button" data-project="${escapeHtml(project.id)}" aria-haspopup="dialog">Details <span aria-hidden="true">↗</span></button>
      </div>
    </article>`;

  const renderProjectCards = (selector, projects) => {
    const container = document.querySelector(selector);
    if (container) container.innerHTML = projects.map(projectCard).join("");
  };

  const renderHome = () => {
    const name = escapeHtml(site.name);
    setText(".hero-bio", site.bio);
    const heroName = document.querySelector(".hero-name");
    if (heroName) heroName.innerHTML = `I’m <strong>${name}</strong> — ${escapeHtml(site.role)}.`;
    const portrait = document.querySelector(".hero-portrait img");
    if (portrait) {
      portrait.src = site.avatar;
      portrait.alt = site.photoAlt || `Portrait of ${site.name}`;
    }
    renderProjectCards(".featured-grid", site.projects.slice(0, 3));
    const stack = document.querySelector(".stack-grid");
    if (stack) stack.innerHTML = site.techStack.map((tool, index) => `
      <li class="stack-item"><span class="stack-number">${String(index + 1).padStart(2, "0")}</span><span>${escapeHtml(tool)}</span><span class="stack-arrow" aria-hidden="true">↗</span></li>`).join("");
  };

  const renderProjectPage = () => {
    renderProjectCards(".all-projects-grid", site.projects);
    const categories = ["All", ...new Set(site.projects.map((project) => project.category))];
    const filterBar = document.querySelector(".filter-bar");
    if (filterBar) {
      const count = filterBar.querySelector(".filter-count");
      filterBar.querySelectorAll("[data-filter]").forEach((button) => button.remove());
      categories.forEach((category, index) => {
        const button = document.createElement("button");
        button.className = `filter-button${index === 0 ? " is-active" : ""}`;
        button.type = "button";
        button.dataset.filter = category;
        button.setAttribute("aria-pressed", String(index === 0));
        button.textContent = category;
        filterBar.insertBefore(button, count);
      });
      if (count) count.textContent = `${site.projects.length} projects`;
    }
    const note = document.querySelector(".placeholder-note");
    if (note) note.innerHTML = '<span aria-hidden="true">✳</span> Sample projects and links are placeholders—edit <code>js/data.js</code> to replace them.';
  };

  const renderAbout = () => {
    const portrait = document.querySelector(".about-avatar img");
    if (portrait) {
      portrait.src = site.avatar;
      portrait.alt = site.photoAlt || `Portrait of ${site.name}`;
    }
    const story = document.querySelectorAll(".about-copy > p:not(.eyebrow)");
    if (story[0]) story[0].textContent = site.about;
    if (story[1]) story[1].textContent = site.aboutMore;
    const timeline = document.querySelector(".timeline");
    if (timeline) timeline.innerHTML = site.education.map((item) => `
      <article class="timeline-item"><span class="timeline-marker"></span><p class="eyebrow">${escapeHtml(item.period)}</p><h3>${escapeHtml(item.program)}</h3><p class="timeline-school">${escapeHtml(item.school)}</p><p>${escapeHtml(item.description)}</p></article>`).join("");
    const stats = document.querySelector(".stats-grid");
    if (stats) stats.innerHTML = site.stats.map((item) => `
      <a class="stat-card glass-card" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer"><span class="stat-label">${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong><span class="stat-detail">${escapeHtml(item.detail)}</span><span class="stat-arrow" aria-hidden="true">↗</span></a>`).join("");
    const skills = document.querySelector(".skill-cloud");
    if (skills) skills.innerHTML = site.skills.map((skill) => `<li>${escapeHtml(skill)}</li>`).join("");
  };

  const socialIcon = (label) => {
    if (label === "GitHub") return '<span class="social-icon"><svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.24-1.62-1.24-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15.99 1.7 2.6 1.21 3.23.92.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.53 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.06 1.15a10.63 10.63 0 0 1 5.58 0c2.13-1.45 3.06-1.15 3.06-1.15.61 1.54.23 2.68.12 2.96.71.78 1.14 1.78 1.14 3.01 0 4.3-2.61 5.24-5.1 5.52.4.35.75 1.02.75 2.06v3.06c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"/></svg></span>';
    if (label === "LinkedIn") return '<span class="social-icon"><svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5.2 3.7a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2ZM3.4 9.5H7v11.1H3.4V9.5Zm5.8 0h3.4V11h.1a3.7 3.7 0 0 1 3.3-1.8c3.6 0 4.3 2.4 4.3 5.5v5.9h-3.6v-5.2c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9v5.3H9.2V9.5Z"/></svg></span>';
    return `<span class="social-monogram" aria-hidden="true">${escapeHtml(label.slice(0, 2).toUpperCase())}</span>`;
  };

  const renderContact = () => {
    const email = document.querySelector(".email-card > a");
    if (email) {
      email.href = `mailto:${site.email}`;
      email.textContent = site.email;
    }
    const list = document.querySelector(".social-list");
    if (list) list.innerHTML = site.socials.map((item) => `
      <li><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(item.label)} ${escapeHtml(item.handle)} (opens in new tab)">${socialIcon(item.label)}<span>${escapeHtml(item.label)}</span><span class="social-handle">${escapeHtml(item.handle)}</span><span aria-hidden="true">↗</span></a></li>`).join("");
  };

  const renderCommon = () => {
    const brand = document.querySelector(".brand");
    if (brand) {
      const nameParts = site.name.trim().split(/\s+/);
      const surname = nameParts.pop() || "";
      brand.setAttribute("aria-label", `${site.name} home`);
      brand.innerHTML = `<img class="brand-logo" src="${escapeHtml(site.logo || "fuad-logo.png")}" alt="" width="40" height="40"><span>${escapeHtml(nameParts.join(" "))}<span class="brand-muted"> ${escapeHtml(surname)}</span></span>`;
    }
    document.querySelectorAll(".brand-logo").forEach((image) => image.src = site.logo || "fuad-logo.png");
    const footer = document.querySelector(".site-footer p");
    if (footer) footer.innerHTML = `© ${new Date().getFullYear()} ${escapeHtml(site.name)} <span class="footer-separator">·</span> Built with curiosity.`;
    const footerSocials = document.querySelector("[data-footer-socials]");
    if (footerSocials) footerSocials.innerHTML = site.socials.map((item) => `
      <li><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(item.label)} ${escapeHtml(item.handle)} (opens in new tab)" title="${escapeHtml(item.label)}">${socialIcon(item.label)}</a></li>`).join("");
    document.querySelectorAll(".footer-domain").forEach((link) => {
      link.href = `${site.domain}/`;
      link.firstChild.textContent = new URL(site.domain).hostname;
    });
    document.title = pageInfo.title;
    const canonicalUrl = new URL(page === "home" ? "/" : pageInfo.path, `${site.domain.replace(/\/$/, "")}/`).href;
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = canonicalUrl;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = pageInfo.description;
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.content = canonicalUrl;
    const ogImage = new URL(site.avatar, `${site.domain.replace(/\/$/, "")}/`).href;
    document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach((meta) => meta.content = ogImage);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogTitle) ogTitle.content = pageInfo.title;
    if (ogDescription) ogDescription.content = pageInfo.description;
    const structuredData = document.querySelector('script[type="application/ld+json"]');
    if (structuredData) structuredData.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      name: site.name,
      url: `${site.domain}/`,
      alumniOf: { "@type": "EducationalOrganization", name: site.education[0]?.school || "" },
      jobTitle: site.role,
    });
  };

  renderCommon();
  if (page === "home") renderHome();
  if (page === "projects") renderProjectPage();
  if (page === "about") renderAbout();
  if (page === "contact") renderContact();

  // The theme is remembered when storage is available; private file:// tabs still work without it.
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const syncThemeControl = () => {
    const light = document.documentElement.dataset.theme === "light";
    themeToggle?.setAttribute("aria-pressed", String(light));
    themeToggle?.setAttribute("aria-label", `Switch to ${light ? "dark" : "light"} mode`);
    const label = themeToggle?.querySelector(".theme-label");
    if (label) label.textContent = light ? "Dark" : "Light";
    const icon = themeToggle?.querySelector("[aria-hidden]");
    if (icon) icon.textContent = light ? "☾" : "☼";
  };
  try {
    if (localStorage.getItem("portfolio-theme") === "light") document.documentElement.dataset.theme = "light";
  } catch { /* Storage can be unavailable for file:// documents. */ }
  syncThemeControl();
  themeToggle?.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    if (nextTheme === "light") document.documentElement.dataset.theme = "light";
    else delete document.documentElement.dataset.theme;
    try { localStorage.setItem("portfolio-theme", nextTheme); } catch { /* Theme still changes for this page view. */ }
    syncThemeControl();
  });

  // Mobile navigation uses the same accessible disclosure button on every page.
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  menuButton?.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    nav?.classList.toggle("is-open", !expanded);
  });
  nav?.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      nav.classList.remove("is-open");
      menuButton?.setAttribute("aria-expanded", "false");
    }
  });

  // Project filters and the detail dialog use event delegation for rendered cards.
  document.querySelector(".filter-bar")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    const category = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    let visible = 0;
    document.querySelectorAll(".all-projects-grid .project-card").forEach((card) => {
      const show = category === "All" || card.dataset.category === category;
      card.hidden = !show;
      if (show) visible += 1;
    });
    const count = document.querySelector(".filter-count");
    if (count) count.textContent = `${visible} ${visible === 1 ? "project" : "projects"}`;
  });

  const dialog = document.querySelector("#project-dialog");
  const closeDialog = () => dialog?.close();
  dialog?.querySelector(".dialog-close")?.addEventListener("click", closeDialog);
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });
  document.addEventListener("click", (event) => {
    const button = event.target.closest(".details-trigger");
    if (!button || !dialog) return;
    const project = site.projects.find((item) => item.id === button.dataset.project);
    if (!project) return;
    setText("#dialog-category", project.category);
    setText("#dialog-title", project.title);
    setText("#dialog-description", project.description);
    const tags = dialog.querySelector("#dialog-tags");
    if (tags) tags.innerHTML = project.tech.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("");
    dialog.querySelector("#dialog-repo").href = project.repo;
    dialog.querySelector("#dialog-demo").href = project.demo;
    dialog.showModal();
  });

  // Clipboard feedback and the accessible mailto form need no server-side package.
  document.querySelector("[data-copy-email]")?.addEventListener("click", async () => {
    const status = document.querySelector(".copy-status");
    try {
      await navigator.clipboard.writeText(site.email);
      if (status) status.textContent = "Email copied to clipboard.";
    } catch {
      if (status) status.textContent = `Copy unavailable. Email: ${site.email}`;
    }
  });
  document.querySelector("#contact-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Portfolio message from ${form.get("name")}`);
    const body = encodeURIComponent(`From: ${form.get("name")} (${form.get("email")})\n\n${form.get("message")}`);
    setText("#form-status", "Your email app is opening with this message ready to send.");
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  });

  // A smooth halo follows the real pointer; touch devices keep their native behavior.
  const initializeCustomCursor = () => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const ring = document.createElement("span");
    const dot = document.createElement("span");
    ring.className = "custom-cursor-ring";
    dot.className = "custom-cursor-dot";
    ring.setAttribute("aria-hidden", "true");
    dot.setAttribute("aria-hidden", "true");
    document.body.append(ring, dot);
    document.body.classList.add("has-custom-cursor");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let targetX = -100;
    let targetY = -100;
    let ringX = targetX;
    let ringY = targetY;
    let frame = 0;
    const renderRing = () => {
      ringX += (targetX - ringX) * (reducedMotion ? 1 : 0.22);
      ringY += (targetY - ringY) * (reducedMotion ? 1 : 0.22);
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      if (Math.abs(targetX - ringX) > 0.2 || Math.abs(targetY - ringY) > 0.2) {
        frame = requestAnimationFrame(renderRing);
      } else {
        frame = 0;
      }
    };

    document.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;
      targetX = event.clientX;
      targetY = event.clientY;
      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      ring.classList.add("is-visible");
      dot.classList.add("is-visible");
      if (reducedMotion) {
        ringX = targetX;
        ringY = targetY;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      } else if (!frame) {
        frame = requestAnimationFrame(renderRing);
      }
    }, { passive: true });

    document.addEventListener("pointerover", (event) => {
      if (event.target.closest("a, button, input, textarea, select, summary, [role='button']")) {
        ring.classList.add("is-interactive");
      }
    });
    document.addEventListener("pointerout", (event) => {
      const leftControl = event.target.closest("a, button, input, textarea, select, summary, [role='button']");
      const enteredControl = event.relatedTarget instanceof Element && event.relatedTarget.closest("a, button, input, textarea, select, summary, [role='button']");
      if (leftControl && !enteredControl) ring.classList.remove("is-interactive");
    });
    document.addEventListener("pointerdown", () => ring.classList.add("is-pressed"));
    document.addEventListener("pointerup", () => ring.classList.remove("is-pressed"));
    document.documentElement.addEventListener("pointerleave", () => {
      ring.classList.remove("is-visible", "is-interactive");
      dot.classList.remove("is-visible");
    });
  };
  initializeCustomCursor();
})();
