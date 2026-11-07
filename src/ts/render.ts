// render.ts — renders work, shiplog, toolkit chips and reach into the DOM.
// v13: Forge Console markup — row-based work list, ship log, chip toolkit.
import type { AppData } from "./types";
import { getLang, t } from "./i18n.js";

export function renderProjects(data: AppData): void {
  const list = document.getElementById("projects-list");
  if (!list) return;
  const projects = data.projects.filter((p) => p.status === "live");
  list.innerHTML = "";
  projects.forEach((p, i) => {
    const row = document.createElement("a");
    row.className = "work-row reveal";
    if (p.url) {
      row.href = p.url;
      row.target = "_blank";
      row.rel = "noopener";
    }
    row.setAttribute("tabindex", "0");

    const index = document.createElement("span");
    index.className = "work-index";
    index.textContent = String(i + 1).padStart(2, "0");
    row.appendChild(index);

    const main = document.createElement("div");
    main.className = "work-main";

    const nameRow = document.createElement("div");
    nameRow.className = "work-name-row";
    const name = document.createElement("h3");
    name.className = "work-name";
    name.textContent = p.name;
    nameRow.appendChild(name);
    const badge = document.createElement("span");
    badge.className = "work-status " + p.status;
    badge.textContent = p.status === "live" ? t("status.live") : "SOON";
    nameRow.appendChild(badge);
    main.appendChild(nameRow);

    const tag = document.createElement("span");
    tag.className = "work-tag";
    tag.textContent = p.tag[getLang()];
    main.appendChild(tag);

    const desc = document.createElement("p");
    desc.className = "work-desc";
    desc.textContent = p.desc[getLang()];
    main.appendChild(desc);

    const tech = document.createElement("div");
    tech.className = "work-tech";
    p.tech.forEach((te) => {
      const span = document.createElement("span");
      span.textContent = te;
      tech.appendChild(span);
    });
    main.appendChild(tech);
    row.appendChild(main);

    list.appendChild(row);
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
    tag.className = "ship-tag";
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
  skills.forEach((s) => {
    const item = document.createElement("span");
    item.className = "chip reveal";
    item.textContent = s;
    list.appendChild(item);
  });
}

export function renderLinks(data: AppData): void {
  const grid = document.getElementById("links-list");
  if (!grid) return;
  const links = data.links.filter((l) => !l.placeholder && l.url);
  grid.innerHTML = "";
  links.forEach((l) => {
    const a = document.createElement("a");
    a.className = "reach-row reveal";
    a.href = l.url as string;
    a.target = "_blank";
    a.rel = "noopener";

    const label = document.createElement("span");
    label.className = "reach-label";
    label.textContent = l.label[getLang()];
    a.appendChild(label);

    if (l.sub) {
      const sub = document.createElement("span");
      sub.className = "reach-sub";
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