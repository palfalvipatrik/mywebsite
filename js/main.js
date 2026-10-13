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

/* Elérhetőségek - EGYETLEN helyen. Ha változik, csak itt kell átírni (az összes oldalra érvényes).
   Darabokban tároljuk, futásidőben fűzzük össze (egyszerű spam-botok ellen). */
const CONTACT_EMAIL_PARTS = ["palfalvi", ".", "patrik", ".flp", "@", "gmail", ".com"];
const CONTACT_PHONE_PARTS = ["+", "36", "70", "148", "69", "05"];

const getEmail = () => CONTACT_EMAIL_PARTS.join("");
const getPhone = () => CONTACT_PHONE_PARTS.join("");

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

/* A "Hívj telefonon" gomb az első érintésig (egér ráhúzás, érintés, billentyűzetes fókusz) nem tartalmazza a számot.
   Utána rendes tel: link: kattintásra hív, hosszú nyomásra / jobb klikkre másolható. */
const zumbaPhoneLink = document.getElementById("zumbaPhoneLink");
if (zumbaPhoneLink) {
  const armPhoneLink = () => {
    zumbaPhoneLink.href = "tel:" + getPhone();
    ["pointerenter", "pointerdown", "touchstart", "focus"].forEach((type) =>
      zumbaPhoneLink.removeEventListener(type, armPhoneLink),
    );
  };
  ["pointerenter", "pointerdown", "touchstart", "focus"].forEach((type) =>
    zumbaPhoneLink.addEventListener(type, armPhoneLink, { passive: true }),
  );
  /* Tartalék: ha valamiért még nincs beállítva a cím, a kattintás akkor is hív. */
  zumbaPhoneLink.addEventListener("click", (e) => {
    if (zumbaPhoneLink.getAttribute("href") === "#") {
      e.preventDefault();
      armPhoneLink();
      window.location.href = zumbaPhoneLink.href;
    }
  });
}

/* Zumba órák: az indulás időpontját EGYETLEN helyen kell megadni, az index.html-ben:
   <section id="zumba-orak" data-start="2026-11-05T18:00" data-end="19:00">
   (budapesti idő; a nyári/téli időszámítást a böngésző kezeli).
   Ebből számolódik a visszaszámláló, a dátum, a nap neve, az időpont és a címsor is. */
const MONTHS_HU = [
  "január", "február", "március", "április", "május", "június",
  "július", "augusztus", "szeptember", "október", "november", "december",
];
const WEEKDAYS_HU = [
  "vasárnap", "hétfőn", "kedden", "szerdán", "csütörtökön", "pénteken", "szombaton",
];

/* "5-én", "6-án", "1-jén": a magyar napnév-rag a szám kiejtésétől függ. */
function dayWithSuffix(day) {
  let suffix = "én";
  if (day === 1) suffix = "jén";
  else if (day === 2 || day === 20 || day === 30) suffix = "án";
  else if ([3, 6, 8].includes(day % 10)) suffix = "án";
  return `${day}-${suffix}`;
}

/* "ÉÉÉÉ-HH-NNTÓÓ:PP" budapesti falióra-idő -> UTC időbélyeg (DST-helyesen). */
function budapestToTimestamp(text) {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(text || "");
  if (!m) return NaN;
  const [y, mo, d, h, mi] = m.slice(1).map(Number);
  const wall = Date.UTC(y, mo - 1, d, h, mi);
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Budapest",
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const offsetAt = (ts) => {
    const p = Object.fromEntries(fmt.formatToParts(new Date(ts)).map((x) => [x.type, x.value]));
    return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute) - ts;
  };
  const first = wall - offsetAt(wall);
  return wall - offsetAt(first);
}

const zumbaInfo = document.getElementById("zumba-orak");
const zumbaCountdown = document.getElementById("zumbaCountdown");
const zumbaCountdownDone = document.getElementById("zumbaCountdownDone");

if (zumbaInfo && zumbaInfo.dataset.start) {
  const startText = zumbaInfo.dataset.start;
  const firstZumbaClass = budapestToTimestamp(startText);

  if (!Number.isNaN(firstZumbaClass)) {
    const [datePart, timePart] = startText.split("T");
    const [y, mo, d] = datePart.split("-").map(Number);
    const weekday = new Date(Date.UTC(y, mo - 1, d)).getUTCDay();
    const monthName = MONTHS_HU[mo - 1];
    const endTime = zumbaInfo.dataset.end;

    const fill = {
      heading: `${monthName[0].toUpperCase()}${monthName.slice(1)} ${dayWithSuffix(d)} indulnak a Zumba órák!`,
      date: `${y}. ${monthName} ${d}.`,
      weekday: `Minden ${WEEKDAYS_HU[weekday]}`,
      time: endTime ? `${timePart}-${endTime}` : timePart,
    };
    zumbaInfo.querySelectorAll("[data-zumba-fill]").forEach((el) => {
      const value = fill[el.dataset.zumbaFill];
      if (value) el.textContent = value;
    });

    if (zumbaCountdown && zumbaCountdownDone) {
      const countdownFields = {
        days: zumbaCountdown.querySelector('[data-countdown="days"]'),
        hours: zumbaCountdown.querySelector('[data-countdown="hours"]'),
        minutes: zumbaCountdown.querySelector('[data-countdown="minutes"]'),
        seconds: zumbaCountdown.querySelector('[data-countdown="seconds"]'),
      };
      let countdownInterval;

      function updateZumbaCountdown() {
        const millisecondsLeft = firstZumbaClass - Date.now();

        if (millisecondsLeft <= 0) {
          zumbaCountdown.hidden = true;
          zumbaCountdownDone.hidden = false;
          clearInterval(countdownInterval);
          return;
        }

        const totalSeconds = Math.ceil(millisecondsLeft / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        countdownFields.days.textContent = String(days);
        countdownFields.hours.textContent = String(hours).padStart(2, "0");
        countdownFields.minutes.textContent = String(minutes).padStart(2, "0");
        countdownFields.seconds.textContent = String(seconds).padStart(2, "0");
      }

      updateZumbaCountdown();
      if (!zumbaCountdown.hidden) {
        countdownInterval = setInterval(updateZumbaCountdown, 1000);
      }
    }
  }
}

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
if (contactForm && formStatus) {
  const gotcha = contactForm.querySelector('[name="_gotcha"]');

  /* Hibánál az e-mail címet közvetlenül a hibaüzenet mellett mutatjuk, hogy ne kelljen keresgélni. */
  const showFormError = () => {
    const email = getEmail();
    formStatus.textContent = "Hiba történt a küldés közben - próbáld újra, vagy írj e-mailt: ";
    const mail = document.createElement("a");
    mail.href = "mailto:" + email;
    mail.textContent = email;
    formStatus.append(mail);
    formStatus.classList.add("err");
  };

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
        showFormError();
      }
    } catch (err) {
      showFormError();
    }
  });
}
