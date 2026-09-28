const galleries = {
  gallery: [
    { src: "assets/g01.webp", caption: "Fellépés pillanata" },
    { src: "assets/g02.webp", caption: "Zumba fellépésem" },
    { src: "assets/g03.webp", caption: "Már kicsiként is szerettem" },
    { src: "assets/g04.webp", caption: "Kép a társammal, a fellépés után. :)" },
    { src: "assets/certificate.webp", caption: "Zumba® Instructor oklevél - 2025" }
  ]
};

const lb = document.getElementById("lightbox");
if (lb) {
  let lbGroup = null;
  let lbIndex = 0;
  let lbLastFocused = null;
  const lbImg = document.getElementById("lbImg");
  const lbCaption = document.getElementById("lbCaption");
  const lbClose = document.getElementById("lbClose");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");
  const lbFocusable = [lbClose, lbPrev, lbNext];

  function renderLightbox() {
    const item = galleries[lbGroup][lbIndex];
    lbImg.src = item.src;
    lbImg.alt = item.caption;
    lbCaption.textContent = `${item.caption} · ${lbIndex + 1} / ${galleries[lbGroup].length}`;
  }

  window.openLightbox = function (group, index) {
    lbGroup = group;
    lbIndex = index;
    lbLastFocused = document.activeElement;
    renderLightbox();
    lb.classList.add("show");
    document.body.style.overflow = "hidden";
    lbClose.focus();
  };

  function closeLightbox() {
    lb.classList.remove("show");
    document.body.style.overflow = "";
    if (lbLastFocused) lbLastFocused.focus();
  }

  function stepLightbox(dir) {
    const len = galleries[lbGroup].length;
    lbIndex = (lbIndex + dir + len) % len;
    renderLightbox();
  }

  lbClose.addEventListener("click", closeLightbox);
  lbPrev.addEventListener("click", () => stepLightbox(-1));
  lbNext.addEventListener("click", () => stepLightbox(1));
  lb.addEventListener("click", (e) => {
    if (e.target === lb) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("show")) return;
    if (e.key === "Escape") {
      closeLightbox();
      return;
    }
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
    if (e.key === "Tab") {
      const currentIdx = lbFocusable.indexOf(document.activeElement);
      let nextIdx = currentIdx;
      if (e.shiftKey) {
        nextIdx = currentIdx <= 0 ? lbFocusable.length - 1 : currentIdx - 1;
      } else {
        nextIdx = currentIdx === -1 || currentIdx === lbFocusable.length - 1 ? 0 : currentIdx + 1;
      }
      e.preventDefault();
      lbFocusable[nextIdx].focus();
    }
  });

  document.querySelectorAll(".g-item[data-group]").forEach((item) => {
    const trigger = () => window.openLightbox(item.dataset.group, Number(item.dataset.index));
    item.addEventListener("click", trigger);
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        trigger();
      }
    });
  });
}

const toggle = document.getElementById("navToggle");
const links = document.getElementById("navLinks");
const overlay = document.getElementById("navOverlay");
if (toggle && links) {
  function closeMenu() {
    links.classList.remove("open");
    toggle.classList.remove("open");
    if (overlay) overlay.classList.remove("show");
    toggle.setAttribute("aria-expanded", "false");
  }
  function openMenuToggle() {
    const isOpen = links.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    if (overlay) overlay.classList.toggle("show", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  }
  toggle.addEventListener("click", openMenuToggle);
  if (overlay) overlay.addEventListener("click", closeMenu);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && links.classList.contains("open")) closeMenu();
  });
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
}

const navItems = document.querySelectorAll(".nav-links a[data-nav]");
if (navItems.length) {
  const sections = ["top", "rolam", "zumba", "asmr", "munkam", "hirek", "social"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navItems.forEach((a) => a.classList.toggle("active", a.dataset.nav === entry.target.id));
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );
  sections.forEach((s) => spy.observe(s));
}

const toTop = document.getElementById("toTop");
if (toTop) {
  window.addEventListener("scroll", () => {
    toTop.classList.toggle("show", window.scrollY > 600);
  });
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) { }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  } catch (err) {
    return false;
  }
}

const COPY_ICONS =
  '<svg class="ic-copy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>' +
  '<svg class="ic-ok" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

function addCopyButton(link, label, getValue) {
  const item = document.createElement("span");
  item.className = "contact-item";
  link.replaceWith(item);
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "copy-btn";
  btn.setAttribute("aria-label", label);
  btn.title = label;
  btn.innerHTML = COPY_ICONS;
  item.append(link, btn);
  let timer;
  btn.addEventListener("click", async () => {
    if (!(await copyText(getValue()))) return;
    btn.classList.add("copied");
    clearTimeout(timer);
    timer = setTimeout(() => btn.classList.remove("copied"), 1800);
  });
}

function setupContactLink(link, textEl, scheme, getValue, format, copyLabel) {
  if (!link || !textEl) {
    return;
  }

  let resetTimer;
  let revealed = false;

  link.addEventListener("click", function (e) {
    e.preventDefault();

    const value = getValue();
    const shown = format ? format(value) : value;

    if (!revealed) {
      revealed = true;

      textEl.textContent = shown;
      link.href = scheme + value;
      addCopyButton(link, copyLabel, getValue);

      return;
    }

    let left = false;

    const mark = () => {
      left = true;
    };

    window.addEventListener("blur", mark);
    document.addEventListener("visibilitychange", mark);

    window.location.href = scheme + value;

    setTimeout(async () => {
      window.removeEventListener("blur", mark);
      document.removeEventListener("visibilitychange", mark);

      if (left) {
        return;
      }

      if (await copyText(value)) {
        textEl.textContent = "Vágólapra másolva ✓";

        clearTimeout(resetTimer);

        resetTimer = setTimeout(() => {
          textEl.textContent = shown;
        }, 2500);
      }
    }, 1200);
  });
}

const emailLink = document.getElementById("emailLink");

if (emailLink) {
  const getEmail = () => {
    const part = (name) =>
      emailLink.querySelector(`[data-${name}]`)?.getAttribute(`data-${name}`) ?? "";

    return part("b") + "." + part("k") + part("v") + "@" + part("r") + part("q");
  };

  setupContactLink(
    emailLink,
    document.getElementById("emailText"),
    "mailto:",
    getEmail,
    null,
    "E-mail cím másolása",
  );
}

const phoneLink = document.getElementById("phoneLink");

if (phoneLink) {
  function getPhone() {
    const parts = {
      a: phoneLink.querySelector("[data-m]")?.dataset.m,
      b: phoneLink.querySelector("[data-b]")?.dataset.b,
      c: phoneLink.querySelector("[data-r]")?.dataset.r,
      d: phoneLink.querySelector("[data-x]")?.dataset.x,
      e: phoneLink.querySelector("[data-q]")?.dataset.q,
    };

    return "+" + parts.a + parts.b + parts.c + parts.d + parts.e;
  }

  setupContactLink(
    phoneLink,
    document.getElementById("phoneText"),
    "tel:",
    getPhone,
    (num) =>
      num.replace("+36", "+36 ").replace(/(\d{2})(\d{3})(\d{4})$/, "$1 $2 $3"),
    "Telefonszám másolása",
  );
}

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
if (contactForm && formStatus) {
  const gotcha = contactForm.querySelector('[name="_gotcha"]');
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (gotcha && gotcha.value) {
      formStatus.textContent = "Köszönöm az üzenetet! Hamarosan válaszolok.";
      formStatus.className = "form-status ok";
      contactForm.reset();
      return;
    }
    const data = new FormData(contactForm);
    formStatus.className = "form-status";
    try {
      const res = await fetch(contactForm.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      });
      if (res.ok) {
        formStatus.textContent = "Köszönöm az üzenetet! Hamarosan válaszolok.";
        formStatus.classList.add("ok");
        contactForm.reset();
      } else {
        formStatus.textContent = "Hiba történt a küldés közben - próbáld újra, vagy írj e-mailt.";
        formStatus.classList.add("err");
      }
    } catch (err) {
      formStatus.textContent = "Hiba történt a küldés közben - próbáld újra, vagy írj e-mailt.";
      formStatus.classList.add("err");
    }
  });
}