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

/* Zumba órák. Minden adat EGYETLEN helyen van, az index.html-ben:
   <section id="zumba-orak" data-start="2026-11-05T18:00" data-end="19:00" data-skip="">
   - data-start: az ELSŐ óra kezdete, budapesti falióra-idő szerint
   - data-end:   az óra vége (ÓÓ:PP, ugyanazon a napon)
   - data-skip:  elmaradó napok ÉÉÉÉ-HH-NN formában, vesszővel elválasztva (nem kötelező),
                 pl. data-skip="2026-12-24,2026-12-31"
   Az óra hetente ugyanazon a napon és ugyanabban a budapesti órában ismétlődik.
   Három állapot van, mindet a mostani időből számoljuk ki (nincs tárolt "lejárt" jelző):
   1. az első óra előtt: "indulnak" címsor + visszaszámláló az első órára
   2. óra közben: a visszaszámláló helyett "most zajlik" felirat
   3. két óra között: visszaszámláló a KÖVETKEZŐ órára, a címsor már nem "indulnak"-ot mond */
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

const budapestFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: "Europe/Budapest",
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

/* "ÉÉÉÉ-HH-NNTÓÓ:PP" budapesti falióra-idő -> UTC időbélyeg (DST-helyesen).
   Az eltolást (UTC+1 / UTC+2) a böngésző tudja, nem mi számoljuk. */
function budapestToTimestamp(text) {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(text || "");
  if (!m) return NaN;
  const [y, mo, d, h, mi] = m.slice(1).map(Number);
  const wall = Date.UTC(y, mo - 1, d, h, mi);
  const offsetAt = (ts) => {
    const p = Object.fromEntries(budapestFormat.formatToParts(new Date(ts)).map((x) => [x.type, x.value]));
    return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute) - ts;
  };
  const first = wall - offsetAt(wall);
  return wall - offsetAt(first);
}

const pad2 = (n) => String(n).padStart(2, "0");
const toMinutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const zumbaInfo = document.getElementById("zumba-orak");
const firstStart = zumbaInfo ? budapestToTimestamp(zumbaInfo.dataset.start) : NaN;

if (!Number.isNaN(firstStart)) {
  const [datePart, timePart] = zumbaInfo.dataset.start.split("T");
  const [y, mo, d] = datePart.split("-").map(Number);
  const endTime = zumbaInfo.dataset.end;
  const skip = new Set(
    (zumbaInfo.dataset.skip || "").split(",").map((s) => s.trim()).filter(Boolean),
  );
  const weekday = new Date(Date.UTC(y, mo - 1, d)).getUTCDay();
  const minutes = endTime ? toMinutes(endTime) - toMinutes(timePart) : 60;
  const durationMs = (minutes > 0 ? minutes : 60) * 60000;
  const WEEK_MS = 7 * 24 * 3600 * 1000;

  /* Az első olyan alkalom, ami MÉG NEM ért véget. Az N-edik alkalmat naptári nappal számoljuk
     (első nap + 7*N nap), és minden alkalomra külön alakítjuk át a budapesti órát időbélyeggé.
     Nem "+ 7*24 óra"-t adunk hozzá, mert az óraátállításnál egy hét 167 vagy 169 óra,
     és akkor az óra egy órát csúszna. */
  function findOccurrence(now) {
    let n = Math.max(0, Math.floor((now - firstStart) / WEEK_MS) - 1);
    for (let i = 0; i < 200; i++, n++) {
      const day = new Date(Date.UTC(y, mo - 1, d + 7 * n));
      const oy = day.getUTCFullYear();
      const om = day.getUTCMonth() + 1;
      const od = day.getUTCDate();
      const key = `${oy}-${pad2(om)}-${pad2(od)}`;
      if (skip.has(key)) continue;
      const start = budapestToTimestamp(`${key}T${timePart}`);
      const end = start + durationMs;
      if (end > now) return { key, mo: om, d: od, y: oy, start, end };
    }
    return null; /* biztonsági korlát: ne legyen végtelen ciklus hibás adatnál */
  }

  const zumbaCountdown = document.getElementById("zumbaCountdown");
  const zumbaCountdownDone = document.getElementById("zumbaCountdownDone");
  const countdownFields = zumbaCountdown && {
    days: zumbaCountdown.querySelector('[data-countdown="days"]'),
    hours: zumbaCountdown.querySelector('[data-countdown="hours"]'),
    minutes: zumbaCountdown.querySelector('[data-countdown="minutes"]'),
    seconds: zumbaCountdown.querySelector('[data-countdown="seconds"]'),
  };

  const fill = (name, value) => {
    zumbaInfo.querySelectorAll(`[data-zumba-fill="${name}"]`).forEach((el) => {
      el.textContent = value;
    });
  };

  let occurrence = null;
  let shownState = "";

  function renderZumba(now) {
    if (!occurrence || now >= occurrence.end) occurrence = findOccurrence(now);

    if (!occurrence) {
      if (zumbaCountdown) zumbaCountdown.hidden = true;
      if (zumbaCountdownDone) zumbaCountdownDone.hidden = true;
      return false;
    }

    const live = now >= occurrence.start;
    const beforeLaunch = now < firstStart;

    /* A szövegeket csak állapotváltáskor írjuk át, nem másodpercenként. */
    const state = `${occurrence.key}|${live}|${beforeLaunch}`;
    if (state !== shownState) {
      shownState = state;
      const firstMonth = MONTHS_HU[mo - 1];
      const occMonth = MONTHS_HU[occurrence.mo - 1];

      fill(
        "heading",
        beforeLaunch
          ? `${firstMonth[0].toUpperCase()}${firstMonth.slice(1)} ${dayWithSuffix(d)} indulnak a Zumba órák!`
          : `Minden ${WEEKDAYS_HU[weekday]} Zumba óra!`,
      );
      fill("dateLabel", beforeLaunch ? "INDULÁS" : live ? "MOST ZAJLIK" : "KÖVETKEZŐ ÓRA");
      fill("date", `${occurrence.y}. ${occMonth} ${occurrence.d}.`);
      fill("weekday", `Minden ${WEEKDAYS_HU[weekday]}`);
      fill("time", endTime ? `${timePart}-${endTime}` : timePart);
      fill("countdownTitle", beforeLaunch ? "Első Zumba óráig hátralévő idő" : "Következő Zumba óráig hátralévő idő");

      if (zumbaCountdown && zumbaCountdownDone) {
        zumbaCountdown.hidden = live;
        zumbaCountdownDone.hidden = !live;
      }
    }

    if (!live && countdownFields) {
      const totalSeconds = Math.ceil((occurrence.start - now) / 1000);
      countdownFields.days.textContent = String(Math.floor(totalSeconds / 86400));
      countdownFields.hours.textContent = pad2(Math.floor((totalSeconds % 86400) / 3600));
      countdownFields.minutes.textContent = pad2(Math.floor((totalSeconds % 3600) / 60));
      countdownFields.seconds.textContent = pad2(totalSeconds % 60);
    }
    return true;
  }

  /* Az óra hetente ismétlődik, ezért a számlálót nem állítjuk le soha. */
  if (renderZumba(Date.now())) {
    setInterval(() => renderZumba(Date.now()), 1000);
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
