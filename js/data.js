export async function loadData() {
    const [projects, links, shiplog, status] = await Promise.all([
        fetch("data/projects.json").then((r) => r.json()),
        fetch("data/links.json").then((r) => r.json()),
        fetch("data/shiplog.json").then((r) => r.json()),
        fetch("data/status.json").then((r) => r.json()),
    ]);
    return { projects, links, shiplog, status };
}
export function latestShipPort(entries) {
    if (!entries.length) {
        return { date: "", title: "", desc: { en: "", hi: "" }, tag: "" };
    }
    return entries[0];
}
export function liveProjects(projects) {
    return projects.filter((p) => p.status === "live");
}
export function featuredProjects(projects) {
    return projects.filter((p) => p.featured);
}
export function realLinks(links) {
    return links.filter((l) => !l.placeholder && l.url);
}
export function statusText(status) {
    return status.building.en;
}
