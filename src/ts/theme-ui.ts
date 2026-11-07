// theme-ui.ts — v13 retires the multi-theme switcher and ships one calm,
// canonical "Forge Console" theme (tokens in _tokens.scss). These exports
// remain so the command palette compiles; cycling is a no-op with a single theme.
export type ThemeId = "forge";
export type TypePairId = "forge";

export function getTheme(): ThemeId {
  return "forge";
}
export function getTypePair(): TypePairId {
  return "forge";
}
export function initThemeUi(): void {
  /* single theme — nothing to wire */
}
export function cycleTheme(): void {
  /* no-op */
}
export function cycleTypePair(): void {
  /* no-op */
}