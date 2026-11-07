// The landing page: the live app window and what's new.
(function () {
  "use strict";
  const WB = window.WB;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---------- Timers ----------

  function format(seconds) {
    const m = Math.floor(seconds / 60), s = seconds % 60;
    return m ? `${m}m ${String(s).padStart(2, "0")}s` : `${s}s`;
  }
  const timers = () => $$("[data-timer]");
  timers().forEach((el) => { el.textContent = format(+el.dataset.timer); });
  if (!reduceMotion) {
    setInterval(() => {
      if (document.hidden) return;
      timers().forEach((el) => {
        el.dataset.timer = +el.dataset.timer + 1;
        el.textContent = format(+el.dataset.timer);
      });
    }, 1000);
  }

  // ---------- The live session ----------

  const win = $(".aw");
  if (win) runSession(win);

  function runSession(win) {
    const chat = $("[data-chat]", win);
    const steps = Object.fromEntries($$("[data-step]", chat).map((el) => [el.dataset.step, el]));
    const files = $$("[data-file]", win);
    const lineSets = Object.fromEntries($$("[data-lines]", win).map((el) => [el.dataset.lines, $$(":scope > span", el)]));
    const counts = (key) => $$(`[data-count="${key}"]`, win);
    const more = $("[data-more]", win);
    const total = $("[data-total]", win);
    const status = $("[data-cmd-status]", win);
    const check3 = $('[data-check="3"]', win);
    const check4 = $('[data-check="4"]', win);
    const checkCount = $("[data-check-count]", win);
    const checkBar = $("[data-check-bar]", win);
    const progress = $("[data-progress]", win);
    const progressStep = $('.aw-progress i[data-step="3"]', win);
    const timer3 = $("small[data-timer]", check3);

    let visible = true;
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.15 }).observe(win);

    // Waits, but holds still while the window is off screen or the tab is hidden.
    const sleep = async (ms) => {
      let left = ms;
      while (left > 0) {
        await new Promise((r) => setTimeout(r, 100));
        if (visible && !document.hidden) left -= 100;
      }
    };

    const show = (el) => { el.classList.remove("pending"); el.classList.add("enter"); };
    const setCount = (key, n) => counts(key).forEach((el) => { el.textContent = `+${n}`; });

    function reset() {
      Object.values(steps).forEach((el) => el.classList.add("pending"));
      files.forEach((el) => el.classList.add("pending"));
      Object.values(lineSets).flat().forEach((el) => { el.hidden = true; el.classList.remove("new"); });
      more.hidden = true;
      setCount("diff1", 0);
      setCount("diff2", 0);
      total.textContent = "+2";
      status.classList.remove("ok");
      status.innerHTML = '<svg class="spark spin"><use href="#spark"/></svg>Running';
      check3.className = "active";
      check4.className = "";
      check3.querySelector("span").append(timer3);
      timer3.dataset.timer = 562;
      timer3.textContent = format(562);
      checkCount.textContent = "2 of 5";
      checkBar.style.setProperty("--done", "0.4");
      progress.textContent = "2/5";
      progressStep.classList.remove("on");
    }

    async function type(key, startTotal, finalCount) {
      const lines = lineSets[key];
      for (let i = 0; i < lines.length; i++) {
        lines[i].hidden = false;
        lines[i].classList.add("new");
        setCount(key, i + 1);
        total.textContent = `+${startTotal + i + 1}`;
        await sleep(reduceMotion ? 0 : 120);
      }
      if (finalCount) {
        setCount(key, finalCount);
        total.textContent = `+${startTotal + finalCount}`;
      }
    }

    function finish() {
      // The end state, for reduced motion and as the resting frame.
      Object.values(steps).forEach((el) => el.classList.remove("pending"));
      files.forEach((el) => el.classList.remove("pending"));
      Object.values(lineSets).flat().forEach((el) => { el.hidden = false; });
      more.hidden = false;
      setCount("diff1", 31);
      setCount("diff2", 5);
      total.textContent = "+38";
    }

    if (reduceMotion) { finish(); return; }

    (async function loop() {
      for (;;) {
        reset();
        await sleep(900);

        show(steps.diff1);
        files.filter((f) => f.dataset.file === "diff1").forEach(show);
        await sleep(350);
        await type("diff1", 2, 0);
        more.hidden = false;
        setCount("diff1", 31);
        total.textContent = "+33";
        await sleep(1300);

        show(steps.msg2);
        await sleep(1500);

        show(steps.diff2);
        files.filter((f) => f.dataset.file === "diff2").forEach(show);
        await sleep(350);
        await type("diff2", 33, 0);
        await sleep(900);

        // The button's in: tick the checklist.
        check3.className = "done";
        check4.className = "active";
        timer3.dataset.timer = 0;
        timer3.textContent = format(0);
        check4.querySelector("span").append(timer3);
        checkCount.textContent = "3 of 5";
        checkBar.style.setProperty("--done", "0.6");
        progress.textContent = "3/5";
        progressStep.classList.add("on");
        await sleep(900);

        show(steps.msg3);
        await sleep(700);
        show(steps.cmd);
        await sleep(3200);
        status.classList.add("ok");
        status.innerHTML = '<svg class="check"><use href="#check"/></svg>Build succeeded';
        await sleep(5200);

        chat.style.transition = "opacity 500ms";
        chat.style.opacity = "0";
        await sleep(520);
        reset();
        chat.style.opacity = "1";
      }
    })();
  }

  // ---------- What's new ----------

  const whatsNew = $("[data-whats-new]");
  if (whatsNew) {
    WB.fetchReleases().then((releases) => {
      const latest = releases[0];
      if (!latest) return;
      const heads = latest.body.split("\n")
        .filter((line) => /^##\s+/.test(line))
        .map((line) => line.replace(/^##\s+/, "").trim())
        .slice(0, 5);
      if (!heads.length) return;
      const list = $("[data-latest-heads]", whatsNew);
      heads.forEach((text) => {
        const li = document.createElement("li");
        li.textContent = text;
        list.append(li);
      });
      $("[data-latest-date]", whatsNew).textContent = `Released ${new Date(latest.date).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}`;
      whatsNew.hidden = false;
    }).catch(() => { /* the section stays hidden */ });
  }
})();
