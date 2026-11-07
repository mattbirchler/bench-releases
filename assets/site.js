// Shared by every page: the header, and the latest release behind each
// download button.
(function () {
  "use strict";

  const RELEASES_REPO = "mattbirchler/bench-releases";
  const RELEASES_API = `https://api.github.com/repos/${RELEASES_REPO}/releases?per_page=100`;
  const RELEASES_PAGE = `https://github.com/${RELEASES_REPO}/releases/latest`;
  const CACHE_KEY = "wb-releases-v1";
  const CACHE_MINUTES = 15;

  // ---------- Releases ----------

  let releasesPromise = null;

  function fetchReleases() {
    if (releasesPromise) return releasesPromise;
    releasesPromise = (async () => {
      try {
        const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
        if (cached && Date.now() - cached.at < CACHE_MINUTES * 60e3) return cached.releases;
      } catch (e) { /* no storage */ }
      const response = await fetch(RELEASES_API, { headers: { Accept: "application/vnd.github+json" } });
      if (!response.ok) throw new Error(`GitHub answered ${response.status}`);
      const releases = (await response.json())
        .filter((r) => !r.draft && !r.prerelease)
        .map((r) => {
          const asset = (r.assets || []).find((a) => /\.(zip|dmg)$/i.test(a.name));
          const match = /^v?([\d.]+)-(\d+)$/.exec(r.tag_name) || [];
          return {
            tag: r.tag_name,
            name: r.name || r.tag_name,
            version: match[1] || r.tag_name.replace(/^v/, ""),
            build: match[2] || "",
            date: r.published_at,
            body: r.body || "",
            url: r.html_url,
            download: asset ? asset.browser_download_url : r.html_url,
            size: asset ? asset.size : 0,
          };
        });
      try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), releases })); } catch (e) { /* full */ }
      return releases;
    })();
    releasesPromise.catch(() => { releasesPromise = null; });
    return releasesPromise;
  }

  // Download buttons link to the releases page until the latest zip is known.
  function wireDownloads() {
    document.querySelectorAll("[data-download]").forEach((a) => { if (!a.href) a.href = RELEASES_PAGE; });
    fetchReleases().then((releases) => {
      const latest = releases[0];
      if (!latest) return;
      document.querySelectorAll("[data-download]").forEach((a) => { a.href = latest.download; });
      document.querySelectorAll("[data-latest-version]").forEach((el) => { el.textContent = latest.version; });
    }).catch(() => { /* buttons keep the releases page */ });
  }

  // ---------- Header ----------

  function wireHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const update = () => header.classList.toggle("scrolled", window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  document.addEventListener("DOMContentLoaded", () => {
    wireHeader();
    wireDownloads();
  });

  window.WB = { fetchReleases, RELEASES_PAGE };
})();
