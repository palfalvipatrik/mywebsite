function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* Csak egyszerű azonosítót engedünk (pl. megujult-az-oldalam): se "/", se ".", se ":", se szóköz. */
const SAFE_SLUG = /^[A-Za-z0-9][A-Za-z0-9-]*$/;
const cleanSlug = (slug) => String(slug).replace(/\.html$/, "");

function renderNewsList(root) {
  const src = root.dataset.posts;
  if (!src) return;

  const limit = root.dataset.limit ? Number(root.dataset.limit) : 0;
  const prefix = root.dataset.linkPrefix ?? "";

  fetch(src)
    .then((res) => {
      if (!res.ok) throw new Error("posts fetch failed");
      return res.json();
    })
    .then((data) => {
      const posts = (Array.isArray(data.posts) ? data.posts : []).filter(
        (post) => post && SAFE_SLUG.test(cleanSlug(post.slug))
      );
      const sorted = posts.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
      const slice = limit > 0 ? sorted.slice(0, limit) : sorted;

      if (!slice.length) return;

      root.innerHTML = slice
        .map(
          (post) => `
        <li class="news-item">
          <time class="news-date" datetime="${escapeHtml(post.date)}">${escapeHtml(post.dateLabel)}</time>
          <h3 class="news-title"><a href="${escapeHtml(prefix)}${escapeHtml(cleanSlug(post.slug))}/">${escapeHtml(post.title)}</a></h3>
          <p class="news-excerpt">${escapeHtml(post.excerpt)}</p>
        </li>`
        )
        .join("");
    })
    .catch(() => {
      /* Megtartjuk a HTML-ben lévő tartalmat (file:// előnézet, hálózati hiba). */
    });
}

document.querySelectorAll("[data-news-list]").forEach(renderNewsList);