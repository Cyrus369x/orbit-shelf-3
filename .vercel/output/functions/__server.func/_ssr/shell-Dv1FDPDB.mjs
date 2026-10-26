import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Search, o as Menu, s as Library, t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell-Dv1FDPDB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Shell({ children }) {
	const [q, setQ] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const nav = useNavigate();
	const goBrowse = () => {
		setOpen(false);
		nav({
			to: "/browse",
			search: {
				q: "",
				page: 1,
				sort: "new",
				category: "all"
			}
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg/80 text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-30 border-b border-border bg-bg/85 backdrop-blur",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center gap-3 px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex items-center gap-2 font-display text-lg font-extrabold tracking-wide text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-8 place-items-center rounded-full bg-primary text-xs font-extrabold text-primary-ink",
								children: "OS"
							}), "Orbit Shelf"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "ml-auto hidden min-w-0 max-w-md flex-1 items-center gap-2 rounded-full border border-border bg-surface px-3 sm:flex",
							onSubmit: (e) => {
								e.preventDefault();
								nav({
									to: "/browse",
									search: {
										q: q.trim(),
										page: 1,
										sort: "new",
										category: "all"
									}
								});
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 shrink-0 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: q,
								onChange: (e) => setQ(e.target.value),
								placeholder: "Search the shelf",
								className: "h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted",
								"aria-label": "Search games"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "hidden items-center gap-1 sm:flex",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/browse",
									search: {
										q: "",
										page: 1,
										sort: "new",
										category: "all"
									},
									className: "h-11 items-center px-3 text-sm font-semibold inline-flex",
									children: "Browse"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/library",
									className: "h-11 items-center px-3 text-sm font-semibold inline-flex",
									children: "Library"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/publish",
									className: "hidden h-11 items-center px-3 text-sm font-semibold text-primary md:inline-flex",
									children: "Submit"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/studio",
									className: "h-11 items-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-ink inline-flex",
									children: "Studio"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "ml-auto grid size-11 place-items-center rounded-full border border-border sm:hidden",
							"aria-label": open ? "Close menu" : "Open menu",
							onClick: () => setOpen((v) => !v),
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
						})
					]
				}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 border-t border-border px-4 py-3 sm:hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "flex items-center gap-2 rounded-full border border-border bg-surface px-3",
							onSubmit: (e) => {
								e.preventDefault();
								setOpen(false);
								nav({
									to: "/browse",
									search: {
										q: q.trim(),
										page: 1,
										sort: "new",
										category: "all"
									}
								});
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: q,
								onChange: (e) => setQ(e.target.value),
								placeholder: "Search the shelf",
								"aria-label": "Search games",
								className: "h-11 w-full bg-transparent text-sm outline-none"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "flex h-11 w-full items-center text-left text-sm font-semibold",
							onClick: goBrowse,
							children: "Browse"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "flex h-11 w-full items-center gap-2 text-left text-sm font-semibold",
							onClick: () => {
								setOpen(false);
								nav({ to: "/library" });
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Library, { className: "size-4" }), " Library"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "flex h-11 w-full items-center text-left text-sm font-semibold text-primary",
							onClick: () => {
								setOpen(false);
								nav({ to: "/publish" });
							},
							children: "Submit a game"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "flex h-11 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-ink",
							onClick: () => {
								setOpen(false);
								nav({ to: "/studio" });
							},
							children: "Studio"
						})
					]
				})]
			}),
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-10 text-sm text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Orbit Shelf · browser games, one station" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/publish",
							className: "text-primary",
							children: "Submit"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/library",
							className: "text-primary",
							children: "Library"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/studio",
							className: "text-primary",
							children: "Studio"
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { Shell as t };
