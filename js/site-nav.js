(function () {
  const ul = document.getElementById("navLinks");
  const logo = document.querySelector(".navbar .logo");
  if (!ul) return;

  const prefix = document.body.dataset.navPrefix || "";
  const onSubpage = Boolean(prefix);
  const page = prefix + "index.html";
  const sectionHref = (id) => (onSubpage ? page + id : id);

  if (logo) logo.setAttribute("href", sectionHref("#top"));

  const items = [
    {
      href: sectionHref("#top"),
      nav: "top",
      label: "Kezdőlap",
      icon: '<path d="M3 11l9-7 9 7"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"/>'
    },
    {
      href: sectionHref("#rolam"),
      nav: "rolam",
      label: "Rólam",
      icon: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7"/>'
    },
    {
      href: sectionHref("#zumba"),
      nav: "zumba",
      label: "Zumba",
      icon: '<path d="M20.8 4.6a5 5 0 0 0-7.8 0L12 5.8l-1-1.2a5 5 0 0 0-7.8 6.3L12 20l8.8-9.1a5 5 0 0 0 0-6.3z"/>'
    },
    {
      href: sectionHref("#asmr"),
      nav: "asmr",
      label: "ASMR",
      icon: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>'
    },
    {
      href: sectionHref("#munkam"),
      nav: "munkam",
      label: "Munkám",
      icon: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>'
    },
    {
      href: sectionHref("#hirek"),
      nav: "hirek",
      label: "Hírek",
      icon: '<path d="M4 19h16M4 5h16M4 12h16"/>'
    },
    {
      href: sectionHref("#social"),
      nav: "social",
      label: "Social média",
      icon: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>'
    }
  ];

  const ctaHref = sectionHref("#uzenet");
  ul.innerHTML =
    items
      .map(
        (item) =>
          `<li><a href="${item.href}" data-nav="${item.nav}"><span class="nav-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${item.icon}</svg></span>${item.label}</a></li>`
      )
      .join("") +
    `<li class="nav-links-cta"><a href="${ctaHref}">Írj nekem</a></li>`;

  const ctaBtn = document.querySelector(".nav-cta");
  if (ctaBtn) ctaBtn.setAttribute("href", ctaHref);
})();
