/* applied AI section: example eval console, cycles through test cases */
(function () {
  var root = document.getElementById("evalConsole");
  if (!root) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var cases = [
    {
      q: "Which plans include SSO, and what do they cost?",
      a: "SSO is included in the Business and Enterprise plans. Business is €24 per seat per month; Enterprise is quoted per contract.",
      trace: [["agent.run", 0, 100, "3.2s"], ["llm.plan", 0, 18, "0.6s"], ["tool.search_docs", 18, 40, "0.7s"], ["tool.get_pricing", 40, 58, "0.5s"], ["llm.answer", 58, 100, "1.4s"]],
      checks: [["Every price appears in a tool result", 1], ["Every link resolves", 1], ["No plan outside the tool results", 1]],
      rubric: [["Grounding", 5], ["Relevance", 5], ["Completeness", 4]],
      reason: "Prices and plans match the tool output. Answers both parts of the question.",
      pass: true
    },
    {
      q: "Does the API send a webhook when a refund is created?",
      a: "Yes. A refund.created webhook fires within one second of the refund.",
      trace: [["agent.run", 0, 100, "2.1s"], ["llm.plan", 0, 22, "0.5s"], ["tool.search_docs", 22, 48, "0.6s"], ["llm.answer", 48, 100, "1.0s"]],
      checks: [["Every claim found in retrieved docs", 0], ["Every link resolves", 1], ["No invented API names", 0]],
      rubric: [["Grounding", 1], ["Relevance", 5], ["Completeness", 3]],
      reason: "No retrieved document mentions refund webhooks. The answer invents an event name and states it as fact.",
      pass: false
    },
    {
      q: "How do I rotate an API key without downtime?",
      a: "Create a second key, deploy it to your services, then revoke the old key. The steps are under Security › API keys.",
      trace: [["agent.run", 0, 100, "2.8s"], ["llm.plan", 0, 16, "0.5s"], ["tool.search_docs", 16, 42, "0.8s"], ["llm.answer", 42, 100, "1.5s"]],
      checks: [["Steps match the retrieved doc", 1], ["Every link resolves", 1], ["No invented settings", 1]],
      rubric: [["Grounding", 5], ["Relevance", 5], ["Completeness", 5]],
      reason: "Steps follow the retrieved guide in order. Clear and complete.",
      pass: true
    }
  ];

  var f = {};
  root.querySelectorAll("[data-f]").forEach(function (el) { f[el.getAttribute("data-f")] = el; });
  var tabs = root.querySelector(".c-tabs");
  var timers = [];
  var current = 0, auto = true;

  cases.forEach(function (c, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.setAttribute("role", "tab");
    b.innerHTML = '<i class="' + (c.pass ? "ok" : "bad") + '"></i>case ' + (i + 1);
    b.addEventListener("click", function () { auto = false; show(i); });
    tabs.appendChild(b);
  });

  function later(fn, ms) { timers.push(setTimeout(fn, reduce ? 0 : ms)); }
  function type(el, text, ms, done) {
    if (reduce) { el.textContent = text; if (done) done(); return; }
    el.textContent = ""; el.classList.add("typing");
    var i = 0, step = Math.max(8, ms / text.length);
    (function tick() {
      i += 2; el.textContent = text.slice(0, i);
      if (i < text.length) timers.push(setTimeout(tick, step));
      else { el.classList.remove("typing"); if (done) done(); }
    })();
  }

  function show(i) {
    timers.forEach(clearTimeout); timers = [];
    current = i;
    var c = cases[i];
    [].forEach.call(tabs.children, function (b, j) { b.setAttribute("aria-selected", j === i); });
    f.q.textContent = c.q; f.a.textContent = "";
    f.trace.innerHTML = c.trace.map(function (t, j) {
      return '<div class="span' + (j === 0 ? " root" : "") + '"><span>' + t[0] + '</span><div class="lane"><b style="left:' + t[1] + '%;width:0" data-w="' + (t[2] - t[1]) + '"></b></div><em>' + t[3] + '</em></div>';
    }).join("");
    f.checks.innerHTML = c.checks.map(function (k) { return '<li class="pending">' + k[0] + '<i>' + (k[1] ? "✓" : "✗") + '</i></li>'; }).join("");
    f.rubric.innerHTML = c.rubric.map(function (r) {
      var d = ""; for (var n = 1; n <= 5; n++) d += "<i></i>";
      return '<div class="crit" data-s="' + r[1] + '"><span>' + r[0] + '</span><span class="dots">' + d + '</span><b>' + r[1] + '/5</b></div>';
    }).join("");
    f.reason.textContent = ""; f.verdict.className = "verdict"; f.verdict.textContent = "";
    var passed = cases.slice(0, i + 1).filter(function (x) { return x.pass; }).length;
    f.bar.style.width = "0"; f.gate.textContent = "";

    type(f.a, c.a, 1100, function () {
      f.trace.querySelectorAll("b").forEach(function (b, j) {
        later(function () { b.style.width = b.getAttribute("data-w") + "%"; }, j * 180);
      });
      later(function () {
        f.checks.querySelectorAll("li").forEach(function (li, j) {
          later(function () { li.className = c.checks[j][1] ? "ok" : "bad"; }, j * 260);
        });
      }, 800);
      later(function () {
        f.rubric.querySelectorAll(".crit").forEach(function (cr, j) {
          later(function () { cr.classList.add("on"); }, j * 220);
        });
      }, 1700);
      later(function () {
        type(f.reason, c.reason, 900, function () {
          f.verdict.className = "verdict show " + (c.pass ? "pass" : "fail");
          f.verdict.textContent = c.pass ? "PASS" : "FAIL";
          f.bar.style.width = (passed / (i + 1) * 100) + "%";
          var all = i === cases.length - 1;
          f.gate.innerHTML = "<strong>" + passed + " / " + (i + 1) + "</strong> passing so far · " +
            (all ? (passed === cases.length ? '<span class="ok">release allowed</span>' : '<span class="bad">below threshold · release blocked</span>') : "running…");
          if (auto) later(function () { show((i + 1) % cases.length); }, 3600);
        });
      }, 2500);
    });
  }

  var started = false;
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (e) {
    if (e[0].isIntersecting && !started) { started = true; show(0); io.disconnect(); }
  }, { threshold: 0.3 }) : null;
  if (io) io.observe(root); else show(0);
})();
