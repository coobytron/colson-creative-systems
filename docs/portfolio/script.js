(() => {
  const experiments = [
    { number: "01", title: "Chess Sequencer", indexMeta: "Sound system / Tone.js", description: "Chess structure translated into a playable musical sequence.", role: "Creative coding", medium: "Tone.js / JavaScript", year: "2026", mode: "chess", live: "https://coobytron.github.io/chess_sequencer/", source: "https://github.com/coobytron/chess_sequencer" },
    { number: "02", title: "Git Helper", indexMeta: "Developer tool / interface", description: "A visual builder for common Git and GitHub terminal workflows.", role: "Product design + code", medium: "HTML / CSS / JavaScript", year: "2026", mode: "terminal", live: "https://coobytron.github.io/git-helper/", source: "https://github.com/coobytron/git-helper" },
    { number: "03", title: "StressType", indexMeta: "Accessible type / speech", description: "Spoken emphasis and stress made visible through typography.", role: "Product + interaction design", medium: "Speech input / variable type", year: "2026", mode: "type", live: "https://coobytron.github.io/stresstype-app/", source: "https://github.com/coobytron/stresstype-app" },
    { number: "04", title: "Diffuse React Simple", indexMeta: "Simulation / Gray–Scott", description: "A compact reaction-diffusion system with real-time controls.", role: "Creative coding", medium: "Canvas / reaction diffusion", year: "2026", mode: "reaction", live: "https://coobytron.github.io/diffuse_react_simple/", source: "https://github.com/coobytron/diffuse_react_simple" },
    { number: "05", title: "Experiments", indexMeta: "Collection / browser studies", description: "Nine small studies in type, shaders, simulation, sound, and motion.", role: "Creative coding", medium: "p5.js / WebGL / sound", year: "2026", mode: "field", live: "https://coobytron.github.io/Experiments/", source: "https://github.com/coobytron/Experiments" },
    { number: "06", title: "NCA Splash", indexMeta: "Cellular interface / text seed", description: "Portfolio language used as the seed for a living cellular system.", role: "Art direction + code", medium: "Canvas / cellular automata", year: "2026", mode: "nca", live: "https://coobytron.github.io/NCA-Splash/", source: "https://github.com/coobytron/NCA-Splash" },
    { number: "07", title: "Type Paint", indexMeta: "Drawing tool / typography", description: "A ribbon-painting typography tool for direct, gestural mark making.", role: "Interaction design + code", medium: "p5.js / typography", year: "2026", mode: "ribbon", live: "https://coobytron.github.io/type_paint/", source: "https://github.com/coobytron/type_paint" },
    { number: "08", title: "Splash Page", indexMeta: "Early study / WebGL garden", description: "An early bioluminescent WebGL garden and portfolio entrance study.", role: "Art direction + code", medium: "WebGL / generative world", year: "2026", mode: "mycelia", live: "https://coobytron.github.io/Splash-Page/", source: "https://github.com/coobytron/Splash-Page" },
    { number: "09", title: "Balloon-Type Field", indexMeta: "Generative type / simulation", description: "Glyph-seeded reaction diffusion with growth and export controls.", role: "Creative coding", medium: "p5.js / Gray–Scott", year: "2026", mode: "reaction", live: "https://coobytron.github.io/balloon-type-field/", source: "https://github.com/coobytron/balloon-type-field" },
    { number: "10", title: "Mycelia", indexMeta: "Generative interface / garden", description: "A standalone mushroom garden that evolves through direct input.", role: "Art direction + code", medium: "WebGL / p5.js", year: "2026", mode: "mycelia", live: "https://coobytron.github.io/mycelia-splash/", source: "https://github.com/coobytron/mycelia-splash" },
    { number: "11", title: "Kinetic Type", indexMeta: "Physics typography / tool", description: "Words dragged, flung, pinned, and exported under gravity and force.", role: "Interaction design + code", medium: "Matter.js / p5.js", year: "2026", mode: "type", live: "https://coobytron.github.io/kinetic-type/", source: "https://github.com/coobytron/kinetic-type" },
    { number: "12", title: "DeepDream", indexMeta: "Neural-image research / notebook", description: "An early exploration of the original Inceptionism research code.", role: "Research", medium: "Python / CNN", year: "2017", mode: "dream", source: "https://github.com/coobytron/deepdream" },
    { number: "13", title: "Letterform Gen", indexMeta: "Generative type / reaction diffusion", description: "Letter shapes used to seed and contain evolving pattern systems.", role: "Creative coding", medium: "p5.js / reaction diffusion", year: "2026", mode: "reaction", live: "https://coobytron.github.io/letterform_gen/", source: "https://github.com/coobytron/letterform_gen" },
  ];

  const canvas = document.querySelector("#system-canvas");
  const context = canvas?.getContext("2d");
  const index = document.querySelector("#project-index");
  const title = document.querySelector("#active-title");
  const description = document.querySelector("#active-description");
  const status = document.querySelector("#active-status");
  const meta = document.querySelector("#active-meta");
  const links = document.querySelector("#active-links");
  const parameter = document.querySelector("#preview-parameter");
  if (!canvas || !context || !index || !parameter) return;

  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
  let current = experiments[0];
  let width = 1;
  let height = 1;
  let point = { x: 0.58, y: 0.42 };
  let dragging = false;
  let resetTimer = 0;

  const clamp = (value, minimum = 0, maximum = 1) => Math.max(minimum, Math.min(maximum, value));
  const hash = (text) => [...text].reduce((value, character) => (value * 31 + character.charCodeAt(0)) >>> 0, 2166136261);
  const randomFrom = (seed) => {
    let value = seed || 1;
    return () => {
      value = (value * 1664525 + 1013904223) >>> 0;
      return value / 4294967296;
    };
  };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const scale = Math.min(devicePixelRatio || 1, innerWidth < 760 ? 1 : 1.5);
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
    render();
  }

  function clear(color = "#070807") {
    context.clearRect(0, 0, width, height);
    context.fillStyle = color;
    context.fillRect(0, 0, width, height);
    context.lineCap = "round";
    context.lineJoin = "round";
  }

  function glow(x, y, radius, color, alpha = 1) {
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    context.globalAlpha = alpha;
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = 1;
  }

  function drawNca() {
    clear();
    const xShift = (point.x - 0.5) * width * 0.18;
    const yShift = (point.y - 0.5) * height * 0.16;
    glow(width * 0.55 + xShift, height * 0.51 + yShift, Math.min(width, height) * 0.48, "rgba(113,255,38,.68)", 0.72);
    glow(width * 0.78 - xShift * 0.35, height * 0.3, Math.min(width, height) * 0.4, "rgba(255,77,16,.64)", 0.88);

    const paths = [
      { color: "#dfff8a", line: Math.max(10, width * 0.017), points: [[-.03,.94],[.22,.62],[.46,.34],[.7,.08]] },
      { color: "rgba(184,255,53,.72)", line: Math.max(5, width * 0.009), points: [[.16,1.04],[.39,.7],[.65,.42],[.94,.14]] },
      { color: "rgba(255,77,16,.72)", line: Math.max(3, width * 0.006), points: [[-.03,.77],[.27,.62],[.52,.45],[1.03,.19]] },
    ];
    paths.forEach((path, pathIndex) => {
      const points = path.points.map(([x, y], i) => ({
        x: x * width + xShift * (0.35 + i * 0.13),
        y: y * height + yShift * (pathIndex === 1 ? -0.45 : 0.3),
      }));
      context.strokeStyle = path.color;
      context.lineWidth = path.line;
      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i += 1) {
        const previous = points[i - 1];
        const next = points[i];
        context.bezierCurveTo(previous.x + (next.x - previous.x) * 0.56, previous.y, next.x - (next.x - previous.x) * 0.42, next.y, next.x, next.y);
      }
      context.stroke();
      points.slice(1).forEach((node, i) => {
        context.fillStyle = pathIndex === 2 ? "#ff4d10" : i % 2 ? "#b8ff35" : "#e4ff9b";
        context.beginPath();
        context.arc(node.x, node.y, Math.max(7, path.line * (i === 1 ? 1.5 : 0.9)), 0, Math.PI * 2);
        context.fill();
      });
    });
  }

  function drawRaw() {
    clear("#101012");
    const amount = point.x;
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#ff4d10");
    gradient.addColorStop(0.42, "#6c28ff");
    gradient.addColorStop(1, "#b8ff35");
    context.fillStyle = gradient;
    context.fillRect(width * 0.13, height * 0.09, width * 0.74, height * 0.78);
    const bands = 46;
    for (let i = 0; i < bands; i += 1) {
      const y = (i / bands) * height;
      const bandHeight = height / bands + 1;
      const offset = Math.sin(i * 1.71 + point.y * 8) * amount * width * 0.12;
      context.globalCompositeOperation = i % 4 === 0 ? "difference" : "source-over";
      context.fillStyle = i % 3 === 0 ? "rgba(255,255,255,.46)" : i % 3 === 1 ? "rgba(0,0,0,.78)" : "rgba(255,77,16,.55)";
      context.fillRect(offset, y, width * (0.35 + ((i * 17) % 55) / 100), bandHeight * (i % 5 === 0 ? 3.5 : 0.38));
    }
    context.globalCompositeOperation = "source-over";
  }

  function drawMycelia() {
    clear("#03100d");
    glow(width * point.x, height * point.y, Math.min(width, height) * 0.44, "rgba(0,255,173,.34)", 0.72);
    const random = randomFrom(hash(current.title));
    for (let branch = 0; branch < 18; branch += 1) {
      const startX = (branch / 17) * width;
      const endX = startX + (point.x - 0.5) * width * (0.14 + random() * 0.24);
      const endY = height * (0.16 + random() * 0.43);
      context.strokeStyle = branch % 4 === 0 ? "rgba(255,77,16,.6)" : "rgba(80,255,199,.42)";
      context.lineWidth = 1 + random() * 3;
      context.beginPath();
      context.moveTo(startX, height * 1.03);
      context.bezierCurveTo(startX - width * 0.08, height * 0.72, endX + width * 0.07, height * 0.57, endX, endY);
      context.stroke();
      context.fillStyle = branch % 4 === 0 ? "#ff4d10" : "#9fffdc";
      context.beginPath();
      context.ellipse(endX, endY, 8 + random() * 22, 4 + random() * 8, random() - 0.5, 0, Math.PI * 2);
      context.fill();
    }
  }

  function drawType() {
    clear("#ece8dd");
    const phrase = current.title === "Kinetic Type" ? "TYPE / FORCE" : "SOUND / EMPHASIS";
    const letters = [...phrase];
    const size = Math.min(width / 6.3, height / 3.1);
    context.font = `900 ${size}px Helvetica Neue, Helvetica, Arial, sans-serif`;
    context.textBaseline = "middle";
    let x = width * 0.06;
    let row = 0;
    letters.forEach((letter, indexValue) => {
      if (letter === " " || x > width * 0.84) { row += 1; x = width * 0.06; if (letter === " ") return; }
      const emphasis = 0.58 + Math.abs(Math.sin(indexValue * 1.4 + point.x * 6)) * 0.8;
      context.save();
      context.translate(x, height * (0.34 + row * 0.28) + (point.y - 0.5) * emphasis * 55);
      context.rotate((point.x - 0.5) * (indexValue % 2 ? 0.18 : -0.1));
      context.scale(1, emphasis);
      context.fillStyle = indexValue % 4 === 0 ? "#ff4d10" : "#090909";
      context.fillText(letter, 0, 0);
      context.restore();
      x += size * 0.72;
    });
  }

  function drawReaction() {
    clear("#e7e2d6");
    const random = randomFrom(hash(current.title));
    const cell = Math.max(9, Math.min(width, height) / 47);
    for (let y = -cell; y < height + cell; y += cell) {
      for (let x = -cell; x < width + cell; x += cell) {
        const wave = Math.sin(x * 0.018 + point.x * 8) + Math.cos(y * 0.023 + point.y * 7);
        const radius = cell * clamp((wave + 2) / 4 + random() * 0.26, 0.04, 0.95);
        context.fillStyle = wave > 0.5 ? "#ff4d10" : wave < -0.55 ? "#090909" : "rgba(9,9,9,.14)";
        context.beginPath();
        context.arc(x + Math.sin(y * 0.02) * cell, y, radius, 0, Math.PI * 2);
        context.fill();
      }
    }
  }

  function drawChess() {
    clear("#0b0b0a");
    const size = Math.min(width * 0.64, height * 0.76);
    const left = (width - size) / 2;
    const top = (height - size) / 2;
    const square = size / 8;
    for (let y = 0; y < 8; y += 1) for (let x = 0; x < 8; x += 1) {
      context.fillStyle = (x + y) % 2 ? "#272621" : "#f1eddf";
      context.fillRect(left + x * square, top + y * square, square, square);
    }
    context.strokeStyle = "#ff4d10";
    context.lineWidth = Math.max(3, square * 0.09);
    context.beginPath();
    for (let i = 0; i < 8; i += 1) {
      const x = left + square * (i + 0.5);
      const y = top + size * (0.5 + Math.sin(i * 1.8 + point.x * 6) * 0.3);
      i ? context.lineTo(x, y) : context.moveTo(x, y);
    }
    context.stroke();
  }

  function drawTerminal() {
    clear("#0a0b0a");
    context.font = `${Math.max(12, width * 0.016)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    const lines = ["$ git init", "$ git add .", "$ git commit -m \"build the system\"", "$ git push -u origin main", "✓ published / ready to iterate"];
    lines.forEach((line, lineIndex) => {
      context.fillStyle = lineIndex === 4 ? "#b8ff35" : lineIndex === Math.round(point.x * 4) ? "#ff4d10" : "rgba(255,255,255,.82)";
      context.fillText(line, width * 0.09, height * (0.25 + lineIndex * 0.105));
    });
    context.strokeStyle = "rgba(184,255,53,.3)";
    context.strokeRect(width * 0.06, height * 0.13, width * 0.88, height * 0.63);
  }

  function drawField() {
    clear();
    const random = randomFrom(hash(current.title));
    for (let i = 0; i < 58; i += 1) {
      const x = random() * width;
      const y = random() * height;
      const dx = x - point.x * width;
      const dy = y - point.y * height;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const radius = 2 + Math.max(0, 1 - distance / (width * 0.7)) * 24;
      context.strokeStyle = i % 5 === 0 ? "rgba(255,77,16,.66)" : "rgba(184,255,53,.38)";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + (dx / distance) * radius * 4, y + (dy / distance) * radius * 4);
      context.stroke();
      context.fillStyle = i % 5 === 0 ? "#ff4d10" : "#b8ff35";
      context.beginPath();
      context.arc(x, y, radius * 0.45, 0, Math.PI * 2);
      context.fill();
    }
  }

  function render() {
    const mode = current.mode;
    if (mode === "nca") drawNca();
    else if (mode === "raw") drawRaw();
    else if (mode === "mycelia") drawMycelia();
    else if (mode === "type" || mode === "ribbon") drawType();
    else if (mode === "reaction" || mode === "dream") drawReaction();
    else if (mode === "chess") drawChess();
    else if (mode === "terminal") drawTerminal();
    else drawField();
  }

  function appendLink(label, href) {
    if (!href) return;
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.textContent = label;
    if (/^https?:/.test(href)) {
      anchor.target = "_blank";
      anchor.rel = "noreferrer";
    }
    links.appendChild(anchor);
  }

  function updatePreview(item, itemIndex, focusRow = false) {
    current = item;
    point = { x: 0.58, y: 0.42 };
    parameter.value = "58";
    title.textContent = item.title;
    description.textContent = item.description;
    status.textContent = `${item.number} / Active system`;
    canvas.setAttribute("aria-label", `Interactive preview of ${item.title}`);
    meta.innerHTML = `<div><dt>Role</dt><dd>${item.role}</dd></div><div><dt>Medium</dt><dd>${item.medium}</dd></div><div><dt>Year</dt><dd>${item.year}</dd></div>`;
    links.replaceChildren();
    appendLink("Open live ↗", item.live);
    appendLink("Source ↗", item.source);
    [...index.querySelectorAll(".index-row")].forEach((row, rowIndex) => {
      row.classList.toggle("is-active", rowIndex === itemIndex);
      row.setAttribute("aria-pressed", rowIndex === itemIndex ? "true" : "false");
    });
    render();
    if (focusRow) index.querySelectorAll(".index-row")[itemIndex]?.focus();
  }

  function buildIndex() {
    const data = experiments;
    index.replaceChildren();
    data.forEach((item, itemIndex) => {
      const row = document.createElement("button");
      row.className = "index-row";
      row.type = "button";
      row.setAttribute("aria-pressed", "false");
      row.innerHTML = `<span class="index-number">${item.number}</span><span><strong class="index-name">${item.title}</strong><small class="index-meta">${item.indexMeta}</small></span>`;
      row.addEventListener("click", () => updatePreview(item, itemIndex));
      row.addEventListener("focus", () => updatePreview(item, itemIndex));
      row.addEventListener("pointerenter", () => { if (finePointer.matches) updatePreview(item, itemIndex); });
      row.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
        event.preventDefault();
        const direction = event.key === "ArrowDown" ? 1 : -1;
        const next = (itemIndex + direction + data.length) % data.length;
        updatePreview(data[next], next, true);
      });
      index.appendChild(row);
    });
    updatePreview(data[0], 0);
  }

  function positionFromEvent(event) {
    const rect = canvas.getBoundingClientRect();
    point.x = clamp((event.clientX - rect.left) / rect.width);
    point.y = clamp((event.clientY - rect.top) / rect.height);
    parameter.value = String(Math.round(point.x * 100));
    render();
  }
  canvas.addEventListener("pointerdown", (event) => {
    dragging = true;
    canvas.setPointerCapture?.(event.pointerId);
    positionFromEvent(event);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (!finePointer.matches && !dragging) return;
    positionFromEvent(event);
  });
  canvas.addEventListener("pointerup", () => { dragging = false; });
  canvas.addEventListener("pointercancel", () => { dragging = false; });
  canvas.addEventListener("pointerleave", () => {
    clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      if (dragging) return;
      point = { x: 0.58, y: 0.42 };
      parameter.value = "58";
      render();
    }, 600);
  });
  parameter.addEventListener("input", () => {
    point.x = Number(parameter.value) / 100;
    render();
  });

  new ResizeObserver(resize).observe(canvas);
  buildIndex();
})();
