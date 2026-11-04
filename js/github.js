function num(v) {
    return typeof v === "number" && Number.isFinite(v) ? v : null;
}
function date(v) {
    return typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v)
        ? v.slice(0, 10)
        : null;
}
async function getJson(url) {
    try {
        const r = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
        if (!r.ok)
            return null;
        return (await r.json());
    }
    catch {
        return null;
    }
}
async function starTotal(user) {
    const s = await getJson(`https://api.github.com/search/repositories?q=user:${user}+stars:>0`);
    if (!s || !Array.isArray(s.items))
        return null;
    return s.items.reduce((sum, x) => sum + (num(x.stargazers_count) ?? 0), 0);
}
async function lastPush(user, repo) {
    const r = await getJson(`https://api.github.com/repos/${user}/${repo}`);
    return r ? date(r.pushed_at) : null;
}
export async function initGithubStats() {
    const reposEl = document.getElementById("gh-repos");
    const starsEl = document.getElementById("gh-stars");
    const pushEl = document.getElementById("gh-push");
    if (!reposEl || !starsEl || !pushEl)
        return;
    const [nf, jj, nfStars, jjStars, nfPush, jjPush] = await Promise.all([
        getJson("https://api.github.com/users/nightforgeio"),
        getJson("https://api.github.com/users/JustJayDev"),
        starTotal("nightforgeio"),
        starTotal("JustJayDev"),
        lastPush("nightforgeio", "justjaydev-landing"),
        lastPush("JustJayDev", "toxic-quad-gaming"),
    ]);
    const repos = num(nf?.public_repos) !== null && num(jj?.public_repos) !== null
        ? (num(nf?.public_repos) ?? 0) + (num(jj?.public_repos) ?? 0)
        : null;
    if (repos !== null)
        reposEl.textContent = String(repos);
    if (nfStars !== null && jjStars !== null) {
        starsEl.textContent = String(nfStars + jjStars);
    }
    const pushes = [nfPush, jjPush].filter((d) => d !== null).sort();
    if (pushes.length > 0) {
        pushEl.textContent = pushes[pushes.length - 1];
    }
}
