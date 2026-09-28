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

const emailLink = document.getElementById("emailLink");
const emailText = document.getElementById("emailText");
if (emailLink && emailText) {
  emailLink.addEventListener("click", function (e) {
    e.preventDefault();
    const addr = emailLink.dataset.u + "@" + emailLink.dataset.d;
    emailLink.href = "mailto:" + addr;
    emailText.textContent = addr;
  });
}

const phoneLink = document.getElementById("phoneLink");
const phoneText = document.getElementById("phoneText");
if (phoneLink && phoneText) {
  phoneLink.addEventListener("click", function (e) {
    e.preventDefault();
    const num = phoneLink.dataset.p;
    phoneLink.href = "tel:" + num;
    phoneText.textContent = num.replace("+36", "+36 ").replace(/(\d{2})(\d{3})(\d{4})$/, "$1 $2 $3");
  });
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
