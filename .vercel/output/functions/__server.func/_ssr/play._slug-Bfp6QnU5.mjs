import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Heart, r as Star } from "../_libs/lucide-react.mjs";
import { a as myMarks, c as recordPlay, h as toggleLike, n as Route, s as rateGame } from "./router-CCdzpxOT.mjs";
import { t as Shell } from "./shell-Dv1FDPDB.mjs";
import { n as scoreOf, t as GameCard } from "./game-card-BxGCKPpp.mjs";
import { a as toggleFav, i as remember, o as voterId, t as isFav } from "./shelf-local-CaZBWuWa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/play._slug-Bfp6QnU5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function snap(game) {
	return {
		slug: game.slug,
		title: game.title,
		category: game.category,
		cover_url: game.cover_url,
		blurb: game.blurb
	};
}
function PlayPage() {
	const loaded = Route.useLoaderData();
	const [game, setGame] = (0, import_react.useState)(loaded.game);
	const [liked, setLiked] = (0, import_react.useState)(false);
	const [stars, setStars] = (0, import_react.useState)(0);
	const [fav, setFav] = (0, import_react.useState)(false);
	const [plays, setPlays] = (0, import_react.useState)(loaded.game?.plays ?? 0);
	(0, import_react.useEffect)(() => {
		setGame(loaded.game);
		setPlays(loaded.game?.plays ?? 0);
		if (!loaded.game) return;
		const g = loaded.game;
		remember(snap(g));
		setFav(isFav(g.slug));
		const voter = voterId();
		recordPlay({ data: { slug: g.slug } }).then((r) => setPlays(r.plays));
		myMarks({ data: {
			slug: g.slug,
			voter
		} }).then((m) => {
			setLiked(m.liked);
			setStars(m.stars);
		});
	}, [loaded.game]);
	if (!game) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-4 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-bold",
				children: "Not on the shelf"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted",
				children: "That title is hidden, still pending, or the link is wrong."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/browse",
				search: {
					q: "",
					category: "all",
					sort: "new",
					page: 1
				},
				className: "mt-4 inline-flex h-11 items-center text-primary",
				children: "Back to the shelf"
			})
		]
	}) });
	const score = scoreOf({
		...game,
		rating_sum: game.rating_sum,
		rating_count: game.rating_count
	});
	const tags = game.tags.split(",").map((t) => t.trim()).filter(Boolean);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto grid max-w-6xl gap-8 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_300px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-[0.2em] text-primary",
					children: game.category
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl font-extrabold",
					children: game.title
				}),
				game.embed_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "aspect-video overflow-hidden rounded-2xl border border-border bg-bg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
						title: game.title,
						src: game.embed_url,
						className: "h-full w-full",
						sandbox: "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-presentation",
						allow: "fullscreen; autoplay; gamepad",
						referrerPolicy: "no-referrer"
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hangar flex aspect-video flex-col items-start justify-end rounded-2xl border border-border p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl font-bold",
						children: "No embed yet"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-md text-sm text-muted",
						children: "This listing is on the shelf, but it has no playable URL. Add an https embed from the studio."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: `inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold ${liked ? "border-primary bg-primary text-primary-ink" : "border-border"}`,
							onClick: async () => {
								const r = await toggleLike({ data: {
									slug: game.slug,
									voter: voterId()
								} });
								setLiked(r.liked);
								setGame({
									...game,
									likes: r.likes
								});
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `size-4 ${liked ? "fill-current" : ""}` }),
								" ",
								game.likes
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `inline-flex h-11 items-center rounded-full border px-4 text-sm font-semibold ${fav ? "border-accent text-accent" : "border-border"}`,
							onClick: () => setFav(toggleFav(snap(game)).some((g) => g.slug === game.slug)),
							children: fav ? "Saved" : "Save"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm text-muted",
							children: [plays, " plays"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					"aria-label": "Rate this game",
					children: [[
						1,
						2,
						3,
						4,
						5
					].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid size-11 place-items-center",
						"aria-label": `${n} star${n > 1 ? "s" : ""}`,
						onClick: async () => {
							const r = await rateGame({ data: {
								slug: game.slug,
								voter: voterId(),
								stars: n
							} });
							setStars(r.stars);
							setGame({
								...game,
								rating_sum: r.rating_sum,
								rating_count: r.rating_count
							});
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `size-5 ${n <= stars ? "fill-accent text-accent" : "text-muted"}` })
					}, n)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-2 text-sm text-muted",
						children: score ? `${score} · ${game.rating_count}` : "No ratings yet"
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "space-y-4",
			children: [
				game.cover_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: game.cover_url,
					alt: "",
					className: "aspect-video w-full rounded-2xl object-cover"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: game.blurb
				}),
				tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/browse",
						search: {
							q: t,
							category: "all",
							sort: "new",
							page: 1
						},
						className: "rounded-full border border-border px-3 py-1 text-xs uppercase tracking-wide text-muted",
						children: t
					}, t))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Developer",
							v: game.developer
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Plays",
							v: String(plays)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Status",
							v: "Live"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-bold",
					children: "Same deck"
				}),
				loaded.related.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "No neighbors in this category yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3",
					children: loaded.related.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameCard, { game: g }, g.id))
				})
			]
		})]
	}) });
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between border-b border-border py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: v })]
	});
}
//#endregion
export { PlayPage as component };
