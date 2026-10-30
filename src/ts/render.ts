// render.ts — renders projects, shiplog, skills and links into the DOM.
import type { AppData } from "./types";
import { getLang } from "./i18n.js";

export function renderProjects(data: AppData): void {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;
  const projects = data.projects.filter((p) => p.status === "live");
  grid.innerHTML = "";
  projects.forEach((p) => {
    const card = document.createElement("article");
    card.className = "project-card reveal";
    card.setAttribute("tabindex", "0");

    const head = document.createElement("div");
    head.className = "project-head";

    const name = document.createElement("h3");
    name.className = "project-name";
    name.textContent = p.name;
    head.appendChild(name);

    const badge = document.createElement("span");
    badge.className = "project-status badge " + p.status;
    badge.textContent = p.status === "live" ? "LIVE" : "SOON";
    head.appendChild(badge);
    card.appendChild(head);

    const tag = document.createElement("span");
    tag.className = "project-tag";
    tag.textContent = p.tag[getLang()];
    card.appendChild(tag);

    const desc = document.createElement("p");
    desc.className = "project-desc";
    desc.textContent = p.desc[getLang()];
    card.appendChild(desc);

    const tech = document.createElement("div");
    tech.className = "project-tech";
    p.tech.forEach((te) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = te;
      tech.appendChild(chip);
    });
    card.appendChild(tech);

    if (p.url) {
      const link = document.createElement("a");
      link.className = "project-link";
      link.href = p.url;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "Open →";
      card.appendChild(link);
    }

    grid.appendChild(card);
  });
}

export function renderShipLog(data: AppData): void {
  const list = document.getElementById("shiplog-list");
  if (!list) return;
  list.innerHTML = "";
  data.shiplog.forEach((entry) => {
    const item = document.createElement("article");
    item.className = "ship-entry reveal";

    const date = document.createElement("time");
    date.className = "ship-date";
    date.dateTime = entry.date;
    date.textContent = entry.date.replace(/-/g, ".");
    item.appendChild(date);

    const body = document.createElement("div");
    body.className = "ship-body";

    const title = document.createElement("h3");
    title.className = "ship-title";
    title.textContent = entry.title;
    body.appendChild(title);

    const desc = document.createElement("p");
    desc.className = "ship-desc";
    desc.textContent = entry.desc[getLang()];
    body.appendChild(desc);

    const tag = document.createElement("span");
    tag.className = "chip ship-tag";
    tag.textContent = entry.tag;
    body.appendChild(tag);

    item.appendChild(body);
    list.appendChild(item);
  });
}

export function renderSkills(): void {
  const list = document.getElementById("skills-list");
  if (!list) return;
  const skills = [
    "TypeScript",
    "Sass / SCSS",
    "Python · build tooling",
    "HTML5 / CSS3",
    "Git & GitHub Pages",
    "Vanilla JS · no frameworks",
    "PWA · Service Workers",
    "Android automation",
  ];
  list.innerHTML = "";
  skills.forEach((s, i) => {
    const item = document.createElement("span");
    item.className = "skill-pill reveal";
    item.style.setProperty("--i", String(i));
    item.textContent = s;
    list.appendChild(item);
  });
}

export function renderLinks(data: AppData): void {
  const grid = document.getElementById("links-grid");
  if (!grid) return;
  const links = data.links.filter((l) => !l.placeholder && l.url);
  grid.innerHTML = "";
  links.forEach((l) => {
    const a = document.createElement("a");
    a.className = "link-tile reveal";
    a.href = l.url as string;
    a.target = "_blank";
    a.rel = "noopener";
    const label = document.createElement("span");
    label.className = "link-label";
    label.textContent = l.label[getLang()];
    a.appendChild(label);
    if (l.sub) {
      const sub = document.createElement("span");
      sub.className = "link-sub";
      sub.textContent = l.sub;
      a.appendChild(sub);
    }
    grid.appendChild(a);
  });
}

export function renderStatus(data: AppData): void {
  const statusText = document.getElementById("status-text");
  const statusDate = document.getElementById("status-date");
  if (statusText) statusText.textContent = data.status.building[getLang()];
  if (statusDate) {
    const fmt = data.status.updated.replace(/-/g, ".");
    statusDate.textContent = "updated " + fmt;
  }
}

export function renderAll(data: AppData): void {
  renderStatus(data);
  renderProjects(data);
  renderShipLog(data);
  renderSkills();
  renderLinks(data);
}