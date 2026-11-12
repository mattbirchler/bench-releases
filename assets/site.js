// Shared by every page: the header, the latest release behind each
// download button, and an anonymous count of page views.
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

  // ---------- Page views ----------

  // One anonymous event per page, sent straight to PostHog: no cookies and
  // no script from anyone else. The random ID lasts as long as the tab, so
  // a visit across pages counts once, and nothing ties one visit to the
  // next. PostHog is told not to look up a location, and the project
  // discards IP addresses. privacy.html says all of this; keep them in step.
  const POSTHOG_URL = "https://us.i.posthog.com/i/v0/e/";
  const POSTHOG_TOKEN = "phc_rBkGD8e38uUJjekGXqxFiBGNaJnDQf8A5TADoNRehTAc";
  const VISIT_KEY = "wb-visit";

  function sendPageView() {
    try {
      // Only the live site counts, and never someone who asked not to be tracked.
      if (!/(^|\.)workbenchapp\.dev$/.test(location.hostname)) return;
      if (navigator.doNotTrack === "1" || navigator.globalPrivacyControl) return;
      let visit = sessionStorage.getItem(VISIT_KEY);
      if (!visit) {
        visit = crypto.randomUUID();
        sessionStorage.setItem(VISIT_KEY, visit);
      }
      let referrer = "";
      try {
        const from = document.referrer && new URL(document.referrer);
        // Where a visit came from, not which page of the site was before this one.
        if (from && from.hostname !== location.hostname) referrer = from.hostname;
      } catch (e) {}
      fetch(POSTHOG_URL, {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: POSTHOG_TOKEN,
          event: "$pageview",
          distinct_id: visit,
          properties: {
            app: "Workbench Website",
            $current_url: location.origin + location.pathname,
            $host: location.hostname,
            $pathname: location.pathname,
            $referring_domain: referrer || "$direct",
            $process_person_profile: false,
            $geoip_disable: true,
          },
        }),
      }).catch(() => {});
    } catch (e) {}
  }

  document.addEventListener("DOMContentLoaded", () => {
    wireHeader();
    wireDownloads();
    sendPageView();
  });

  // Chrome and Safari can restore a page from memory when you come back to
  // it. If that copy is older than the cache, load the page again.
  const loadedAt = Date.now();
  window.addEventListener("pageshow", (event) => {
    if (event.persisted && Date.now() - loadedAt > CACHE_MINUTES * 60e3) location.reload();
  });

  window.WB = { fetchReleases, RELEASES_PAGE, LATEST_DMG };
})();
