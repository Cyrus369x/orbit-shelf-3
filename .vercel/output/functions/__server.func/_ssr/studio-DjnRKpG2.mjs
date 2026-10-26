import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react, x as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as updateCategory, d as setupOwner, f as studioBoard, g as unlockStudio, l as removeGame, o as publishLive, p as studioStatus, u as setGameState, v as updateGame } from "./router-CCdzpxOT.mjs";
import { t as Shell } from "./shell-Dv1FDPDB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/studio-DjnRKpG2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATS = [
	"action",
	"arcade",
	"puzzle",
	"racing",
	"sports",
	"adventure",
	"strategy",
	"io",
	"girls",
	"casual"
];
var TOKEN_KEY = "orbit-studio-token";
function Studio() {
	const router = useRouter();
	const [configured, setConfigured] = (0, import_react.useState)(null);
	const [password, setPassword] = (0, import_react.useState)("");
	const [token, setToken] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [page, setPage] = (0, import_react.useState)(1);
	const [status, setStatus] = (0, import_react.useState)("all");
	const [q, setQ] = (0, import_react.useState)("");
	const [board, setBoard] = (0, import_react.useState)(null);
	const [title, setTitle] = (0, import_react.useState)("");
	const [blurb, setBlurb] = (0, import_react.useState)("");
	const [developer, setDeveloper] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("arcade");
	const [embedUrl, setEmbedUrl] = (0, import_react.useState)("");
	const [coverUrl, setCoverUrl] = (0, import_react.useState)("");
	const [tags, setTags] = (0, import_react.useState)("");
	const [featured, setFeatured] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const load = async (t, p, nextStatus = status, nextQ = q) => {
		const next = await studioBoard({ data: {
			token: t,
			page: p,
			status: nextStatus,
			q: nextQ
		} });
		setBoard(next);
		setPage(p);
		setToken(t);
		sessionStorage.setItem(TOKEN_KEY, t);
		setError("");
	};
	(0, import_react.useEffect)(() => {
		let cancel = false;
		(async () => {
			const st = await studioStatus();
			if (cancel) return;
			setConfigured(st.configured);
			const saved = sessionStorage.getItem(TOKEN_KEY) ?? "";
			if (st.configured && saved) try {
				await load(saved, 1);
			} catch {
				sessionStorage.removeItem(TOKEN_KEY);
			}
		})();
		return () => {
			cancel = true;
		};
	}, []);
	const refresh = async () => {
		if (!token) return;
		await load(token, page);
		router.invalidate();
	};
	const maxPulse = Math.max(1, ...board?.pulse.map((d) => d.plays) ?? [1]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl space-y-8 px-4 py-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold uppercase tracking-[0.2em] text-primary",
				children: "Command"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl font-extrabold",
				children: "Studio"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted",
				children: "You are the only admin. Approve, edit, hide, or publish. The public shelf pages 24 games at a time."
			})
		] }), configured === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Checking the station lock…"
		}) : !board ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-3 rounded-2xl border border-border bg-surface p-5",
			onSubmit: async (e) => {
				e.preventDefault();
				setBusy(true);
				setError("");
				try {
					const result = configured ? await unlockStudio({ data: { password } }) : await setupOwner({ data: { password } });
					setPassword("");
					setConfigured(true);
					await load(result.token, 1);
				} catch (err) {
					setError(err instanceof Error ? err.message : "Could not unlock.");
				} finally {
					setBusy(false);
				}
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-bold",
					children: configured ? "Unlock studio" : "Set the owner password"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: configured ? "The password is stored as a hash. It is never shown again." : "First visit only. Pick at least 8 characters."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-sm font-semibold",
					htmlFor: "password",
					children: "Owner password"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "password",
					type: "password",
					value: password,
					onChange: (e) => setPassword(e.target.value),
					className: "h-11 w-full rounded-xl border border-border bg-bg px-3 outline-none",
					autoComplete: configured ? "current-password" : "new-password",
					minLength: 8
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-danger",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					disabled: busy || password.length < 8,
					className: "h-11 rounded-full bg-primary px-5 text-sm font-semibold text-primary-ink",
					children: configured ? "Unlock" : "Save password"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 text-center sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Live",
						value: board.live
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Pending",
						value: board.pending
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Hidden",
						value: board.hidden
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Plays",
						value: board.plays
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-border bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-bold",
					children: "Plays, last 7 days"
				}), board.pulse.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "No plays recorded yet. Opening a live game counts one."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex h-24 items-end gap-2",
					children: board.pulse.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-1 flex-col items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full rounded-t bg-primary",
							style: { height: `${Math.max(8, d.plays / maxPulse * 72)}px` }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted",
							children: d.day.slice(5)
						})]
					}, d.day))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3 rounded-2xl border border-border bg-surface p-5",
				onSubmit: async (e) => {
					e.preventDefault();
					setBusy(true);
					setError("");
					try {
						await publishLive({ data: {
							token,
							title,
							blurb,
							developer,
							category,
							embedUrl,
							coverUrl,
							tags,
							featured
						} });
						setTitle("");
						setBlurb("");
						setDeveloper("");
						setEmbedUrl("");
						setCoverUrl("");
						setTags("");
						setFeatured(false);
						await load(token, 1);
						router.invalidate();
					} catch (err) {
						setError(err instanceof Error ? err.message : "Publish failed.");
					} finally {
						setBusy(false);
					}
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-bold",
						children: "Put a game live"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Title",
						value: title,
						onChange: setTitle
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Developer or studio",
						value: developer,
						onChange: setDeveloper
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm font-semibold",
						children: ["Description", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: blurb,
							onChange: (e) => setBlurb(e.target.value),
							className: "mt-1 h-24 w-full rounded-xl border border-border bg-bg px-3 py-2 font-normal outline-none"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm font-semibold",
						children: ["Deck", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: category,
							onChange: (e) => setCategory(e.target.value),
							className: "mt-1 h-11 w-full rounded-xl border border-border bg-bg px-3 font-normal",
							children: CATS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c,
								children: c
							}, c))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Tags, comma separated",
						value: tags,
						onChange: setTags
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Embed URL (https, optional)",
						value: embedUrl,
						onChange: setEmbedUrl
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Cover URL (https, optional)",
						value: coverUrl,
						onChange: setCoverUrl
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: featured,
							onChange: (e) => setFeatured(e.target.checked)
						}), " Pin on the home viewport"]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-danger",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: busy,
						className: "h-11 rounded-full bg-primary px-5 text-sm font-semibold text-primary-ink",
						children: "Publish live"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-bold",
					children: "Decks"
				}), board.categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryEditor, {
					category: c,
					onSave: async (label, blurbText) => {
						await updateCategory({ data: {
							token,
							slug: c.slug,
							label,
							blurb: blurbText
						} });
						await refresh();
					}
				}, c.slug))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-display text-xl font-bold",
							children: [
								"Catalog · page ",
								board.page,
								"/",
								board.pages
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "flex gap-2",
							onSubmit: async (e) => {
								e.preventDefault();
								await load(token, 1, status, q);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: q,
								onChange: (e) => setQ(e.target.value),
								placeholder: "Find a title",
								"aria-label": "Find in catalog",
								className: "h-11 rounded-full border border-border bg-bg px-4 text-sm outline-none"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "h-11 rounded-full border border-border px-4 text-sm",
								children: "Find"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							"all",
							"pending",
							"live",
							"hidden"
						].map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `h-11 rounded-full px-4 text-sm capitalize ${status === id ? "bg-primary text-primary-ink" : "border border-border"}`,
							onClick: () => {
								setStatus(id);
								load(token, 1, id, q);
							},
							children: id
						}, id))
					}),
					board.rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "No rows in this filter."
					}),
					board.rows.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						game: g,
						onChange: async (patch) => {
							await setGameState({ data: {
								token,
								id: g.id,
								...patch
							} });
							await refresh();
						},
						onSave: async (draft) => {
							await updateGame({ data: {
								token,
								id: g.id,
								...draft
							} });
							await refresh();
						},
						onRemove: async () => {
							await removeGame({ data: {
								token,
								id: g.id
							} });
							await refresh();
						}
					}, g.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 pt-2",
						children: [board.page > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-11 rounded-full border border-border px-4 text-sm",
							onClick: () => load(token, board.page - 1),
							children: "Previous"
						}), board.page < board.pages && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-11 rounded-full border border-border px-4 text-sm",
							onClick: () => load(token, board.page + 1),
							children: "Next"
						})]
					})
				]
			})
		] })]
	}) });
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-surface p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl font-bold text-accent",
			children: value
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs uppercase tracking-wide text-muted",
			children: label
		})]
	});
}
function Field({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block text-sm font-semibold",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value,
			onChange: (e) => onChange(e.target.value),
			className: "mt-1 h-11 w-full rounded-xl border border-border bg-bg px-3 font-normal outline-none"
		})]
	});
}
function CategoryEditor({ category, onSave }) {
	const [label, setLabel] = (0, import_react.useState)(category.label);
	const [blurb, setBlurb] = (0, import_react.useState)(category.blurb);
	const [busy, setBusy] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid gap-2 rounded-xl border border-border bg-surface p-3 sm:grid-cols-[8rem_1fr_auto]",
		onSubmit: async (e) => {
			e.preventDefault();
			setBusy(true);
			try {
				await onSave(label, blurb);
			} finally {
				setBusy(false);
			}
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: label,
				onChange: (e) => setLabel(e.target.value),
				className: "h-11 rounded-lg border border-border bg-bg px-2 text-sm",
				"aria-label": `${category.slug} label`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: blurb,
				onChange: (e) => setBlurb(e.target.value),
				className: "h-11 rounded-lg border border-border bg-bg px-2 text-sm",
				"aria-label": `${category.slug} blurb`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				disabled: busy,
				className: "h-11 rounded-full border border-border px-3 text-sm",
				children: "Save"
			})
		]
	});
}
function Row({ game, onChange, onSave, onRemove }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [title, setTitle] = (0, import_react.useState)(game.title);
	const [blurb, setBlurb] = (0, import_react.useState)(game.blurb);
	const [developer, setDeveloper] = (0, import_react.useState)(game.developer);
	const [category, setCategory] = (0, import_react.useState)(game.category);
	const [embedUrl, setEmbedUrl] = (0, import_react.useState)(game.embed_url ?? "");
	const [coverUrl, setCoverUrl] = (0, import_react.useState)(game.cover_url ?? "");
	const [tags, setTags] = (0, import_react.useState)(game.tags ?? "");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const score = game.rating_count ? (game.rating_sum / game.rating_count).toFixed(1) : "–";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-surface px-3 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-baseline justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: game.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs uppercase text-muted",
					children: [
						game.status,
						" · ",
						game.category,
						" · ",
						game.plays,
						" plays · ",
						score,
						" · ",
						game.likes,
						" likes"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: game.developer
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [
					game.status !== "live" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-10 rounded-full border border-border px-3 text-sm",
						onClick: () => onChange({ status: "live" }),
						children: "Set live"
					}),
					game.status !== "hidden" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-10 rounded-full border border-border px-3 text-sm",
						onClick: () => onChange({ status: "hidden" }),
						children: "Hide"
					}),
					game.status !== "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-10 rounded-full border border-border px-3 text-sm",
						onClick: () => onChange({ status: "pending" }),
						children: "Pending"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-10 rounded-full border border-border px-3 text-sm",
						onClick: () => onChange({ featured: !game.featured }),
						children: game.featured ? "Unpin" : "Feature"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-10 rounded-full border border-border px-3 text-sm",
						onClick: () => setOpen((v) => !v),
						children: open ? "Close" : "Edit"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-10 rounded-full border border-danger/50 px-3 text-sm text-danger",
						onClick: () => onRemove(),
						children: "Remove"
					})
				]
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-3 space-y-2",
				onSubmit: async (e) => {
					e.preventDefault();
					setBusy(true);
					try {
						await onSave({
							title,
							blurb,
							developer,
							category,
							embedUrl,
							coverUrl,
							tags
						});
						setOpen(false);
					} finally {
						setBusy(false);
					}
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Title",
						value: title,
						onChange: setTitle
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Developer",
						value: developer,
						onChange: setDeveloper
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm font-semibold",
						children: ["Description", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: blurb,
							onChange: (e) => setBlurb(e.target.value),
							className: "mt-1 h-20 w-full rounded-xl border border-border bg-bg px-3 py-2 font-normal outline-none"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm font-semibold",
						children: ["Deck", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: category,
							onChange: (e) => setCategory(e.target.value),
							className: "mt-1 h-11 w-full rounded-xl border border-border bg-bg px-3 font-normal",
							children: CATS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c,
								children: c
							}, c))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Tags",
						value: tags,
						onChange: setTags
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Embed",
						value: embedUrl,
						onChange: setEmbedUrl
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Cover",
						value: coverUrl,
						onChange: setCoverUrl
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: busy,
						className: "h-11 rounded-full bg-primary px-5 text-sm font-semibold text-primary-ink",
						children: "Save listing"
					})
				]
			})
		]
	});
}
//#endregion
export { Studio as component };
