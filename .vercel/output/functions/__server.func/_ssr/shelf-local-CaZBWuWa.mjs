//#region node_modules/.nitro/vite/services/ssr/assets/shelf-local-CaZBWuWa.js
var VOTER = "orbit-voter";
var FAVS = "orbit-favs";
var RECENT = "orbit-recent";
function read(key, fallback) {
	if (typeof window === "undefined") return fallback;
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}
function write(key, value) {
	localStorage.setItem(key, JSON.stringify(value));
}
function voterId() {
	const existing = localStorage.getItem(VOTER);
	if (existing && existing.length >= 16) return existing;
	const id = crypto.randomUUID().replace(/-/g, "");
	localStorage.setItem(VOTER, id);
	return id;
}
function listFavs() {
	return read(FAVS, []);
}
function isFav(slug) {
	return listFavs().some((g) => g.slug === slug);
}
function toggleFav(game) {
	const next = listFavs().filter((g) => g.slug !== game.slug);
	if (next.length === listFavs().length) next.unshift(game);
	write(FAVS, next.slice(0, 80));
	return next;
}
function listRecent() {
	return read(RECENT, []);
}
function remember(game) {
	const next = [game, ...listRecent().filter((g) => g.slug !== game.slug)].slice(0, 24);
	write(RECENT, next);
	return next;
}
//#endregion
export { toggleFav as a, remember as i, listFavs as n, voterId as o, listRecent as r, isFav as t };
