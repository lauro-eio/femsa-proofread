(function () {
  var root = document.documentElement;
  var buttons = document.querySelectorAll("[data-lang-switch]");
  var metaEl = document.querySelector("[data-track-meta]");
  var labels = {
    en: {
      track: "ES → EN",
      target: "English (target · live/draft)",
      correction: "English (correction · apply this)",
    },
    pt: {
      track: "ES → PT",
      target: "Portuguese (target · live/draft)",
      correction: "Portuguese (correction · apply this)",
    },
  };

  function setEmpty(el, value) {
    var text = value || "";
    el.textContent = text;
    el.classList.toggle("is-empty", !text.trim());
  }

  function applyLang(lang) {
    root.setAttribute("data-lang", lang);
    try {
      localStorage.setItem("femsa-handoff-lang", lang);
    } catch (e) {}

    buttons.forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-lang-switch") === lang ? "true" : "false");
    });

    var L = labels[lang];
    document.querySelectorAll("[data-label-target]").forEach(function (el) {
      el.textContent = L.target;
    });
    document.querySelectorAll("[data-label-correction]").forEach(function (el) {
      el.textContent = L.correction;
    });
    document.querySelectorAll("[data-track-label]").forEach(function (el) {
      el.textContent = L.track;
    });

    document.querySelectorAll(".block[data-id]").forEach(function (block) {
      var target = block.getAttribute("data-target-" + lang) || "";
      var correction = block.getAttribute("data-correction-" + lang) || "";
      var changed = block.getAttribute("data-changed-" + lang) === "1";
      var blocked = block.getAttribute("data-blocked") === "1";

      var targetEl = block.querySelector("[data-pane-target]");
      var corrEl = block.querySelector("[data-pane-correction]");
      if (targetEl) setEmpty(targetEl, target);
      if (corrEl) setEmpty(corrEl, correction);

      block.classList.toggle("block--changed", !blocked && changed);

      var status = block.querySelector("[data-status-badge]");
      if (status && !blocked) {
        status.textContent = changed ? "changed" : "unchanged";
        status.className = "badge " + (changed ? "badge--changed" : "badge--same");
      }
    });

    if (metaEl) {
      var changed = metaEl.getAttribute("data-changed-" + lang) || "0";
      var rows = metaEl.getAttribute("data-rows") || "0";
      var blocked = metaEl.getAttribute("data-blocked") || "0";
      metaEl.textContent =
        rows + " strings · " + changed + " changed · " + blocked + " ES gaps · viewing " + lang.toUpperCase();
    }
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyLang(btn.getAttribute("data-lang-switch"));
    });
  });

  var initial = "en";
  try {
    var stored = localStorage.getItem("femsa-handoff-lang");
    if (stored === "en" || stored === "pt") initial = stored;
  } catch (e) {}
  applyLang(initial);
})();
