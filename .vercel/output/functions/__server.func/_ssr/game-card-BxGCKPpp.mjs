import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Play, r as Star } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/game-card-BxGCKPpp.js
var import_jsx_runtime = require_jsx_runtime();
function scoreOf(game) {
	if (!game.rating_count) return null;
	return (game.rating_sum / game.rating_count).toFixed(1);
}
function GameCard({ game }) {
	const score = scoreOf(game);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/play/$slug",
		params: { slug: game.slug },
		className: "lift group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-surface hover:-translate-y-0.5 hover:border-primary/60",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-video bg-surface-2",
			children: [
				game.cover_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: game.cover_url,
					alt: "",
					className: "h-full w-full object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hangar h-full w-full" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute bottom-2 left-2 rounded-full bg-bg/80 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-primary",
					children: game.category
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute right-2 top-2 grid size-9 place-items-center rounded-full bg-primary text-primary-ink opacity-0 transition group-hover:opacity-100",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4 fill-current" })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-1 p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "truncate font-display text-base font-bold leading-tight",
					children: game.title
				}), score ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex shrink-0 items-center gap-1 text-xs text-accent",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 fill-current" }), score]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0 text-xs text-muted",
					children: game.plays
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "line-clamp-2 text-sm text-muted",
				children: game.blurb
			})]
		})]
	});
}
//#endregion
export { scoreOf as n, GameCard as t };
