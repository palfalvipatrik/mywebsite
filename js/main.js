const galleries = {
  gallery: [
    { src: "assets/g01.webp", caption: "Fellépés pillanata" },
    { src: "assets/g02.webp", caption: "Zumba fellépésem" },
    { src: "assets/g03.webp", caption: "Már kicsiként is szerettem" },
    { src: "assets/g04.webp", caption: "Kép a társammal, a fellépés után. :)" },
    {
      src: "assets/certificate.webp",
      caption: "Zumba® Instructor oklevél - 2025",
    },
  ],
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
        nextIdx =
          currentIdx === -1 || currentIdx === lbFocusable.length - 1
            ? 0
            : currentIdx + 1;
      }
      e.preventDefault();
      lbFocusable[nextIdx].focus();
    }
  });

  document.querySelectorAll(".g-item[data-group]").forEach((item) => {
    const trigger = () =>
      window.openLightbox(item.dataset.group, Number(item.dataset.index));
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
  links
    .querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", closeMenu));
}

const navItems = document.querySelectorAll(".nav-links a[data-nav]");
if (navItems.length) {
  const sections = [
    "top",
    "rolam",
    "zumba",
    "asmr",
    "munkam",
    "hirek",
    "social",
  ]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navItems.forEach((a) =>
            a.classList.toggle("active", a.dataset.nav === entry.target.id),
          );
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
  );
  sections.forEach((s) => spy.observe(s));
}

const toTop = document.getElementById("toTop");
if (toTop) {
  window.addEventListener("scroll", () => {
    toTop.classList.toggle("show", window.scrollY > 600);
  });
}

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise(function (resolve, reject) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.className = "visually-hidden";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (err) {
      ok = false;
    }
    document.body.removeChild(ta);
    if (ok) resolve();
    else reject(new Error("copy failed"));
  });
}

function setupContact(linkId, textId, getValue, ariaPrefix) {
  const link = document.getElementById(linkId);
  const text = document.getElementById(textId);
  if (!link || !text) return;

  const item = document.createElement("span");
  item.className = "contact-item";
  link.parentNode.insertBefore(item, link);
  item.appendChild(link);

  const copyBtn = document.createElement("button");
  copyBtn.type = "button";
  copyBtn.className = "copy-btn";
  copyBtn.textContent = "Másolás";
  copyBtn.hidden = true;
  item.appendChild(copyBtn);

  link.draggable = false;
  let revealed = false;
  let shown = "";

  link.addEventListener("click", function (e) {
    if (!revealed) {
      // 1. kattintás: csak megjelenítjük, nem indítunk mailto:/tel: hivatkozást
      e.preventDefault();
      const value = getValue(link);
      shown = value.display;
      link.href = value.href;
      link.setAttribute("aria-label", ariaPrefix + shown);
      text.textContent = shown;
      copyBtn.hidden = false;
      revealed = true;
      return;
    }
    // 2. kattintás: mehet a mailto:/tel:, kivéve ha a felhasználó éppen szöveget jelölt ki a linkben
    const sel = window.getSelection();
    if (sel && sel.toString() !== "" && link.contains(sel.anchorNode)) {
      e.preventDefault();
    }
  });

  copyBtn.addEventListener("click", function () {
    copyText(shown).then(
      function () {
        copyBtn.textContent = "Kimásolva";
      },
      function () {
        copyBtn.textContent = "Nem sikerült";
      },
    );
    setTimeout(function () {
      copyBtn.textContent = "Másolás";
    }, 1800);
  });
}

setupContact(
  "emailLink",
  "emailText",
  function (link) {
    const addr = link.dataset.u + "@" + link.dataset.d;
    return { display: addr, href: "mailto:" + addr };
  },
  "E-mail írása: ",
);

setupContact(
  "phoneLink",
  "phoneText",
  function (link) {
    const num = link.dataset.p;
    return {
      display: num
        .replace("+36", "+36 ")
        .replace(/(\d{2})(\d{3})(\d{4})$/, "$1 $2 $3"),
      href: "tel:" + num,
    };
  },
  "Telefonhívás: ",
);

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
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        formStatus.textContent = "Köszönöm az üzenetet! Hamarosan válaszolok.";
        formStatus.classList.add("ok");
        contactForm.reset();
      } else {
        formStatus.textContent =
          "Hiba történt a küldés közben - próbáld újra, vagy írj e-mailt.";
        formStatus.classList.add("err");
      }
    } catch (err) {
      formStatus.textContent =
        "Hiba történt a küldés közben - próbáld újra, vagy írj e-mailt.";
      formStatus.classList.add("err");
    }
  });
}