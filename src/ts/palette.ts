// palette.ts — Ctrl+K command palette.

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

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    results.innerHTML = "";
    const commands = [
      { k: "projects", label: "Jump to Projects", target: "#projects" },
      { k: "shiplog", label: "Jump to Ship Log", target: "#shiplog" },
      { k: "skills", label: "Jump to Skills", target: "#skills" },
      { k: "links", label: "Jump to Links", target: "#links" },
      { k: "top", label: "Back to top", target: "#main" },
      { k: "theme", label: "Toggle theme (soon)", target: "" },
    ];
    const filtered = q ? commands.filter((c) => c.k.includes(q) || c.label.toLowerCase().includes(q)) : commands;
    filtered.slice(0, 6).forEach((c) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "palette-item";
      btn.textContent = c.label;
      btn.addEventListener("click", () => {
        close();
        if (c.target) {
          const el = document.querySelector(c.target);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
      results.appendChild(btn);
    });
    if (!filtered.length) {
      const empty = document.createElement("p");
      empty.className = "palette-empty";
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