// The version history: every release on GitHub, rendered from its notes.
(function () {
  "use strict";
  const WB = window.WB;
  const log = document.querySelector("[data-log]");
  const rail = document.querySelector("[data-rail]");
  const status = document.querySelector("[data-status]");

  const dateFormat = { month: "long", day: "numeric", year: "numeric" };
  const shortDate = { month: "short", day: "numeric" };

  // The newest build of a version gets #v0.9.1; older builds of the same
  // version get their build too (#v0.9.1-50), so every link is unique.
  function assignAnchors(releases) {
    const seen = new Set();
    releases.forEach((r) => {
      const plain = "v" + r.version;
      r.anchor = seen.has(plain) && r.build ? `${plain}-${r.build}` : plain;
      seen.add(plain);
    });
  }

  function anchor(release) { return release.anchor; }

  function render(markdown) {
    const html = window.marked.parse(markdown, { gfm: true, breaks: false });
    const clean = window.DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
    const template = document.createElement("template");
    template.innerHTML = clean;
    template.content.querySelectorAll("img").forEach((img) => {
      img.loading = "lazy";
      img.decoding = "async";
    });
    template.content.querySelectorAll("h1, h2, h3").forEach((h) => {
      // Release headings sit under the version's own heading.
      const level = Math.min(6, +h.tagName[1] + 1);
      const replacement = document.createElement("h" + level);
      replacement.innerHTML = h.innerHTML;
      h.replaceWith(replacement);
    });
    return template.content;
  }

  function article(release, index) {
    const el = document.createElement("article");
    el.className = "release";
    el.id = anchor(release);
    const date = new Date(release.date);
    const oldName = /^Bench\b/.test(release.name);
    const head = document.createElement("header");
    head.className = "release-head";
    head.innerHTML = `
      <h2 class="display"><a href="#${el.id}">${release.version}</a></h2>
      <div class="release-meta">
        ${index === 0 ? '<span class="latest">Latest</span>' : ""}
        <time datetime="${release.date}">${date.toLocaleDateString(undefined, dateFormat)}</time>
        <span>Build ${release.build}</span>
        ${oldName ? "<span>Released as Bench</span>" : ""}
      </div>`;
    if (release.download && release.size) {
      const link = document.createElement("a");
      link.className = "release-dl";
      link.href = release.download;
      link.textContent = `Download ${release.version} (${Math.round(release.size / 1e6)} MB ${release.format === "dmg" ? "disk image" : release.format})`;
      head.querySelector(".release-meta").append(link);
    }
    const body = document.createElement("div");
    body.className = "release-body prose";
    if (release.body.trim()) body.append(render(release.body));
    else body.innerHTML = "<p>Fixes and small improvements.</p>";
    el.append(head, body);
    return el;
  }

  function buildRail(releases) {
    const groups = new Map();
    releases.forEach((r) => {
      const series = r.version.split(".").slice(0, 2).join(".");
      if (!groups.has(series)) groups.set(series, []);
      groups.get(series).push(r);
    });
    const frag = document.createDocumentFragment();
    groups.forEach((items, series) => {
      const group = document.createElement("div");
      group.className = "rail-group";
      group.innerHTML = `<p class="rail-series">${series}</p>`;
      const list = document.createElement("ul");
      items.forEach((r) => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="#${anchor(r)}"><span>${r.version}</span><time>${new Date(r.date).toLocaleDateString(undefined, shortDate)}</time></a>`;
        list.append(li);
      });
      group.append(list);
      frag.append(group);
    });
    rail.append(frag);
    rail.hidden = false;
  }

  function spy() {
    const links = new Map(Array.from(rail.querySelectorAll("a")).map((a) => [a.hash.slice(1), a]));
    let active = null;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const link = links.get(entry.target.id);
        if (!link || link === active) return;
        active?.removeAttribute("aria-current");
        link.setAttribute("aria-current", "true");
        active = link;
        const box = rail.getBoundingClientRect();
        const r = link.getBoundingClientRect();
        if (r.top < box.top + 40 || r.bottom > box.bottom - 40) {
          rail.scrollTop += r.top - box.top - box.height / 3;
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    document.querySelectorAll(".release").forEach((el) => observer.observe(el));
  }

  function fail(error) {
    status.innerHTML = "";
    status.className = "log-status error";
    const text = document.createElement("span");
    text.textContent = `GitHub didn't send the release notes (${error.message}). This usually clears up within the hour. Until then, every release and its notes are on `;
    const link = document.createElement("a");
    link.href = "https://github.com/mattbirchler/bench-releases/releases";
    link.textContent = "the GitHub releases page";
    status.append(text, link, ".");
  }

  WB.fetchReleases().then((releases) => {
    if (!releases.length) throw new Error("no releases yet");
    assignAnchors(releases);
    status.remove();
    const frag = document.createDocumentFragment();
    releases.forEach((r, i) => frag.append(article(r, i)));
    log.append(frag);
    buildRail(releases);
    spy();
    // Jump to a linked version once its article exists.
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }).catch(fail);
})();
