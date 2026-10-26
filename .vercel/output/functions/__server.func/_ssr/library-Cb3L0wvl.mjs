import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Shell } from "./shell-Dv1FDPDB.mjs";
import { n as listFavs, r as listRecent } from "./shelf-local-CaZBWuWa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/library-Cb3L0wvl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LibraryPage() {
	const [favs, setFavs] = (0, import_react.useState)([]);
	const [recent, setRecent] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		setFavs(listFavs());
		setRecent(listRecent());
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl space-y-10 px-4 py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-[0.2em] text-primary",
					children: "This device"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl font-extrabold",
					children: "Library"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-muted",
					children: "Favorites and recent plays stay in this browser. They are not an account."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, {
				title: "Saved",
				items: favs,
				empty: "Save a game from its play page. It will wait here."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, {
				title: "Recently played",
				items: recent,
				empty: "Open a live game and it lands on this rail."
			})
		]
	}) });
}
function Rail({ title, items, empty }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "mb-4 font-display text-2xl font-bold",
		children: title
	}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "rounded-2xl border border-dashed border-border p-8 text-muted",
		children: empty
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-3 lg:grid-cols-3",
		children: items.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/play/$slug",
			params: { slug: g.slug },
			className: "overflow-hidden rounded-2xl border border-border bg-surface",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "aspect-video bg-surface-2",
				children: g.cover_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: g.cover_url,
					alt: "",
					className: "h-full w-full object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hangar h-full w-full" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display font-bold",
					children: g.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase text-muted",
					children: g.category
				})]
			})]
		}, g.slug))
	})] });
}
//#endregion
export { LibraryPage as component };
