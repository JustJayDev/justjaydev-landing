// Shared types for Forge Station.

export interface Localized {
  en: string;
  hi: string;
}

export interface Project {
  id: string;
  name: string;
  tag: Localized;
  desc: Localized;
  url: string | null;
  status: "live" | "soon";
  featured: boolean;
  tech: string[];
}

export interface LinkItem {
  id: string;
  label: Localized;
  url: string | null;
  sub?: string;
  placeholder?: boolean;
}

export interface ShipEntry {
  date: string;
  title: string;
  desc: Localized;
  tag: string;
}

export interface StatusData {
  building: Localized;
  updated: string;
}

export interface AppData {
  projects: Project[];
  links: LinkItem[];
  shiplog: ShipEntry[];
  status: StatusData;
}

export type Lang = "en" | "hi";
