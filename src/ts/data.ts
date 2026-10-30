// data.ts — loads the JSON data files and exposes them as typed objects.
import type { AppData, Project, LinkItem, ShipEntry, StatusData } from "./types";

export async function loadData(): Promise<AppData> {
  const [projects, links, shiplog, status] = await Promise.all([
    fetch("data/projects.json").then((r) => r.json()),
    fetch("data/links.json").then((r) => r.json()),
    fetch("data/shiplog.json").then((r) => r.json()),
    fetch("data/status.json").then((r) => r.json()),
  ]);
  return { projects, links, shiplog, status } as AppData;
}

export function latestShipPort(entries: ShipEntry[]): ShipEntry {
  if (!entries.length) {
    return { date: "", title: "", desc: { en: "", hi: "" }, tag: "" };
  }
  return entries[0];
}

export function liveProjects(projects: Project[]): Project[] {
  return projects.filter((p) => p.status === "live");
}

export function featuredProjects(projects: Project[]): Project[] {
  return projects.filter((p) => p.featured);
}

export function realLinks(links: LinkItem[]): LinkItem[] {
  return links.filter((l) => !l.placeholder && l.url);
}

export function statusText(status: StatusData): string {
  return status.building.en;
}