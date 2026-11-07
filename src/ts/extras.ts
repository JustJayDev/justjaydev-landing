// extras.ts — misc light helpers (footer year — currently the only one
// this build needs; the old particles/clock/share/terminal are retired in v13).
export function initFooterYear(): void {
  const el = document.getElementById("year");
  if (el) el.textContent = String(new Date().getFullYear());
}