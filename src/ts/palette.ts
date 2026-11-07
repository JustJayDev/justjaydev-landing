// palette.ts — Ctrl+K command palette (jump-to-section).
export function initPalette(): void {
  const trigger = document.getElementById("palette-trigger");
  const overlay = document.getElementById("palette-overlay");
  const input = document.getElementById("palette-input") as HTMLInputElement | null;
  const results = document.getElementById("palette-results");
  if (!trigger || !overlay || !input || !results) return;

  const open = (): void => {
    overlay.classList.add("open");
    input.value = "";
    results.innerHTML = "";
    input.focus();
  };
  const close = (): void => {
    overlay.classList.remove("open");
    trigger.focus();
  };

  trigger.addEventListener("click", open);

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
      e.preventDefault();
      if (overlay.classList.contains("open")) close();
      else open();
    }
    if (e.key === "Escape" && overlay.classList.contains("open")) close();
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  const commands = [
    { k: "work", label: "Jump to Work", target: "#work" },
    { k: "stats", label: "GitHub stats", target: "#stats" },
    { k: "ships", label: "Jump to Ship log", target: "#ships" },
    { k: "reach", label: "Jump to Reach", target: "#reach" },
    { k: "top", label: "Back to top", target: "#main" },
  ];

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    results.innerHTML = "";
    const filtered = q
      ? commands.filter((c) => c.k.includes(q) || c.label.toLowerCase().includes(q))
      : commands;
    filtered.slice(0, 8).forEach((c) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "palette-result";
      btn.textContent = c.label;
      btn.addEventListener("click", () => {
        close();
        const el = document.querySelector(c.target);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      results.appendChild(btn);
    });
    if (!filtered.length) {
      const empty = document.createElement("p");
      empty.className = "palette-result";
      empty.textContent = "No matches";
      results.appendChild(empty);
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const first = results.querySelector("button");
      if (first) (first as HTMLButtonElement).click();
    }
  });
}