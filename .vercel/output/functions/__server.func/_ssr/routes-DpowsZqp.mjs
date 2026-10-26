import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Route$5 } from "./router-CCdzpxOT.mjs";
import { t as Shell } from "./shell-Dv1FDPDB.mjs";
import { t as GameCard } from "./game-card-BxGCKPpp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DpowsZqp.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const data = Route$5.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl space-y-10 px-4 py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid overflow-hidden rounded-3xl border border-border bg-surface lg:grid-cols-[1.2fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hangar h-48 w-full lg:h-full lg:min-h-64" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col justify-center gap-4 p-6 sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-[0.2em] text-primary",
							children: "Station catalog"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-4xl font-extrabold leading-none sm:text-5xl",
							children: "Play what docks. You decide what stays."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted",
							children: [
								data.live,
								" live · ",
								data.plays,
								" plays",
								data.pending ? ` · ${data.pending} waiting in studio` : "",
								". Search, decks, ratings, and a private owner desk are ready. Games land when you publish them."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/browse",
								search: {
									q: "",
									page: 1,
									sort: "new",
									category: "all"
								},
								className: "inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-ink",
								children: "Open the shelf"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/publish",
								className: "inline-flex h-11 items-center rounded-full border border-border px-5 text-sm font-semibold",
								children: "Submit a game"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-4 font-display text-2xl font-bold",
				children: "Decks"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rail",
				children: data.categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/browse",
					search: {
						category: c.slug,
						q: "",
						page: 1,
						sort: "new"
					},
					className: "rounded-2xl border border-border bg-surface p-4 hover:border-primary/50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg font-bold",
							children: c.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 line-clamp-2 text-sm text-muted",
							children: c.blurb
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-xs text-accent",
							children: [c.live_count, " live"]
						})
					]
				}, c.slug))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, {
				title: "Pinned",
				games: data.featured,
				empty: "Nothing is pinned yet. Feature a game from Studio."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, {
				title: "Most played",
				games: data.hot,
				empty: "Plays show up here after someone opens a live game."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, {
				title: "Just docked",
				games: data.newest,
				empty: "The newest rail fills the moment a game goes live.",
				more: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "grid gap-3 md:grid-cols-3",
				children: [
					[
						"1",
						"Submit",
						"Anyone can send an https embed. It stays pending."
					],
					[
						"2",
						"Review",
						"You unlock Studio, edit the listing, then set it live."
					],
					[
						"3",
						"Play",
						"Visitors rate, like, and keep favorites on this device."
					]
				].map(([n, t, d]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-sm font-bold text-accent",
							children: n
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-1 font-display text-xl font-bold",
							children: t
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: d
						})
					]
				}, n))
			})
		]
	}) });
}
function Rail({ title, games, empty, more }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 flex items-end justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl font-bold",
			children: title
		}), more && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/browse",
			search: {
				q: "",
				page: 1,
				sort: "new",
				category: "all"
			},
			className: "text-sm text-primary",
			children: "All live"
		})]
	}), games.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "rounded-2xl border border-dashed border-border bg-surface/60 p-8 text-muted",
		children: empty
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-3 lg:grid-cols-3",
		children: games.slice(0, 6).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameCard, { game: g }, g.id))
	})] });
}
//#endregion
export { Home as component };
