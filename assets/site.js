// Shared by every page: the header, and the latest release behind each
// download button.
(function () {
  "use strict";

  const RELEASES_REPO = "mattbirchler/bench-releases";
  const RELEASES_API = `https://api.github.com/repos/${RELEASES_REPO}/releases?per_page=100`;
  const RELEASES_PAGE = `https://github.com/${RELEASES_REPO}/releases/latest`;
  // GitHub always serves the newest release's disk image at this address.
  const LATEST_DMG = `${RELEASES_PAGE}/download/Workbench.dmg`;
  const CACHE_KEY = "wb-releases-v3";
  const CACHE_MINUTES = 5;

  // A reload means "show me what's new", so it skips the saved copy.
  function isReload() {
    try {
      const nav = performance.getEntriesByType("navigation")[0];
      return nav ? nav.type === "reload" : performance.navigation.type === 1;
    } catch (e) { return false; }
  }

  // ---------- Releases ----------

  let releasesPromise = null;

  function fetchReleases() {
    if (releasesPromise) return releasesPromise;
    releasesPromise = (async () => {
      try {
        const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
        if (!isReload() && cached && Date.now() - cached.at < CACHE_MINUTES * 60e3) return cached.releases;
      } catch (e) { /* no storage */ }
      const response = await fetch(RELEASES_API, {
        headers: { Accept: "application/vnd.github+json" },
        cache: "no-cache",
      });
      if (!response.ok) throw new Error(`GitHub answered ${response.status}`);
      const releases = (await response.json())
        .filter((r) => !r.draft && !r.prerelease)
        .map((r) => {
          // The disk image when a release has one, otherwise the zip.
          const assets = r.assets || [];
          const asset = assets.find((a) => /\.dmg$/i.test(a.name)) || assets.find((a) => /\.zip$/i.test(a.name));
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
            format: asset ? asset.name.split(".").pop().toLowerCase() : "",
          };
        });
      try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), releases })); } catch (e) { /* full */ }
      return releases;
    })();
    releasesPromise.catch(() => { releasesPromise = null; });
    return releasesPromise;
  }

  // Download buttons always point at the latest disk image, so they never go
  // stale. Only the version number shown next to them comes from GitHub.
  function wireDownloads() {
    document.querySelectorAll("[data-download]").forEach((a) => { a.href = LATEST_DMG; });
    fetchReleases().then((releases) => {
      const latest = releases[0];
      if (!latest) return;
      document.querySelectorAll("[data-latest-version]").forEach((el) => { el.textContent = latest.version; });
    }).catch(() => { /* the version text keeps its default */ });
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

  // Chrome and Safari can restore a page from memory when you come back to
  // it. If that copy is older than the cache, load the page again.
  const loadedAt = Date.now();
  window.addEventListener("pageshow", (event) => {
    if (event.persisted && Date.now() - loadedAt > CACHE_MINUTES * 60e3) location.reload();
  });

  window.WB = { fetchReleases, RELEASES_PAGE, LATEST_DMG };
})();
