import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react, _ as createFileRoute, d as Scripts, f as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, v as createRootRoute, x as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as object, i as number, n as boolean, o as string, r as literal, s as union, t as _enum } from "../_libs/zod.mjs";
import { n as TriangleAlert } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/arcade.functions-BG_HBOxo.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var categorySlug = _enum([
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
]);
var voter = string().min(16).max(64).regex(/^[a-zA-Z0-9-]+$/);
var getCatalogHome = createServerFn({ method: "GET" }).handler(createSsrRpc("1c01a661c949f4efffe2b767829968ff7effb4f122553fa0723d8014a192dfaa"));
var browseInput = object({
	category: string().optional(),
	q: string().optional(),
	sort: _enum([
		"new",
		"plays",
		"title",
		"rating"
	]).optional(),
	page: number().int().min(1).optional()
});
var browseGames = createServerFn({ method: "GET" }).validator((input) => browseInput.parse(input)).handler(createSsrRpc("1cc556692f0a86e9b86e9661c0f1d3ca6a80adc8436ef138a24f79221f8a89ea"));
var getGame = createServerFn({ method: "GET" }).validator((input) => object({ slug: string().min(1).max(80) }).parse(input)).handler(createSsrRpc("c5e52d9345d051d15ec4eedd02bfa363b2f0a82060a10ed972cc5766dd1283b5"));
var myMarks = createServerFn({ method: "GET" }).validator((input) => object({
	slug: string(),
	voter
}).parse(input)).handler(createSsrRpc("f4b774d9ac78aaf8d74fdf073cdc0019af7716746d0de584ed1c75f111ad2bec"));
var recordPlay = createServerFn({ method: "POST" }).validator((input) => object({ slug: string().min(1).max(80) }).parse(input)).handler(createSsrRpc("5e24b92bd4df1ed6e0b525f81da39ef47b6ab7c687e53514df3a9f30ae696a28"));
var rateGame = createServerFn({ method: "POST" }).validator((input) => object({
	slug: string(),
	voter,
	stars: number().int().min(1).max(5)
}).parse(input)).handler(createSsrRpc("a92f1bcfa3549a9c03c94ca19d450c56c0f524cad5d390fe29d8c7e189653fb4"));
var toggleLike = createServerFn({ method: "POST" }).validator((input) => object({
	slug: string(),
	voter
}).parse(input)).handler(createSsrRpc("485c185bd27ee9f4ae87158a7dae1f9a194a9f6aa1900bdf6675a5a01bb126a7"));
var gameDraft = object({
	token: string().min(32),
	title: string().min(2).max(80),
	blurb: string().min(8).max(280),
	developer: string().min(2).max(60),
	category: categorySlug,
	embedUrl: string().max(400).optional(),
	coverUrl: string().max(400).optional(),
	tags: string().max(160).optional(),
	featured: boolean().optional()
});
var studioStatus = createServerFn({ method: "GET" }).handler(createSsrRpc("66d5c82fce907d80e607f7ade3ace4fcb54b35ece8407d95b21ca1ece4041b0c"));
var passwordInput = object({ password: string().min(8).max(72) });
var setupOwner = createServerFn({ method: "POST" }).validator((input) => passwordInput.parse(input)).handler(createSsrRpc("3eec646dde3f0d56420f41002d9fa51140dd66bfc911d9b24a4a40f38f92f0bc"));
var unlockStudio = createServerFn({ method: "POST" }).validator((input) => passwordInput.parse(input)).handler(createSsrRpc("b0f66967ded21ec83e020e4844c235db60b47a0e89fdf8a3cbcc7b81343ed1f8"));
var publishLive = createServerFn({ method: "POST" }).validator((input) => gameDraft.parse(input)).handler(createSsrRpc("932f60626dd1595e4afb83841da3849e88120e7295960570b5f526386a620df4"));
var submitPending = createServerFn({ method: "POST" }).validator((input) => gameDraft.omit({
	token: true,
	featured: true
}).parse(input)).handler(createSsrRpc("daf2e3a71978319f330c4cf7e46030825fa805c2da5ddbffd7ce024b257f8925"));
var studioBoard = createServerFn({ method: "GET" }).validator((input) => object({
	token: string(),
	page: number().int().min(1).optional(),
	status: _enum([
		"all",
		"live",
		"pending",
		"hidden"
	]).optional(),
	q: string().optional()
}).parse(input)).handler(createSsrRpc("5162757694d98342936d6af0568925c860560ad7388d3f5535713d5a28350324"));
var setGameState = createServerFn({ method: "POST" }).validator((input) => object({
	token: string(),
	id: number().int(),
	status: _enum([
		"live",
		"hidden",
		"pending"
	]).optional(),
	featured: boolean().optional()
}).parse(input)).handler(createSsrRpc("32e67315927ea5e250a0b80fdbe6eea0256866cafaf3c1544bde70d10a711fbb"));
var updateGame = createServerFn({ method: "POST" }).validator((input) => object({
	token: string(),
	id: number().int(),
	title: string().min(2).max(80),
	blurb: string().min(8).max(280),
	developer: string().min(2).max(60),
	category: categorySlug,
	embedUrl: string().max(400).optional(),
	coverUrl: string().max(400).optional(),
	tags: string().max(160).optional()
}).parse(input)).handler(createSsrRpc("00cd6db8d55fb8ea2c12bc80ade90b9a529042b44fcf2c3772404b1c981c3e44"));
var removeGame = createServerFn({ method: "POST" }).validator((input) => object({
	token: string(),
	id: number().int()
}).parse(input)).handler(createSsrRpc("13c3f58cbdb7e4bd7f6743aa3dfa2dd6ed20c1a37f103cf8700fb3362edc4581"));
var updateCategory = createServerFn({ method: "POST" }).validator((input) => object({
	token: string(),
	slug: categorySlug,
	label: string().min(2).max(40),
	blurb: string().min(8).max(140)
}).parse(input)).handler(createSsrRpc("dfba5ff7eaa02a74eef1cc4a132178bf31b0379d50b097c4924eab86a3e4fb29"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-CCdzpxOT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-C5ygSDmP.css";
var APP_NAME = "Orbit Shelf";
var Route$6 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Orbit Shelf is a space-themed browser catalog. Browse embeds, submit a title, and run the station from the owner studio."
			},
			{
				name: "theme-color",
				content: "#07060f"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Oxanium:wght@600;700;800&display=swap"
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "starfield",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	})
});
var $$splitComponentImporter$5 = () => import("./routes-DpowsZqp.mjs");
var Route$5 = createFileRoute("/")({
	loader: () => getCatalogHome(),
	head: () => ({ meta: [{ title: "Orbit Shelf" }, {
		name: "description",
		content: "A browser game station. Browse decks, play embeds, and run the catalog from the owner studio."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./browse-BrQrNdkf.mjs");
var searchSchema = object({
	q: string().optional().catch(""),
	category: string().optional().catch("all"),
	sort: _enum([
		"new",
		"plays",
		"title",
		"rating"
	]).optional().catch("new"),
	page: number().optional().catch(1)
});
var Route$4 = createFileRoute("/browse")({
	validateSearch: searchSchema,
	loaderDeps: ({ search }) => search,
	loader: async ({ deps }) => {
		const [board, home] = await Promise.all([browseGames({ data: {
			q: deps.q || void 0,
			category: deps.category,
			sort: deps.sort,
			page: deps.page && deps.page > 0 ? deps.page : 1
		} }), getCatalogHome()]);
		return {
			board,
			categories: home.categories
		};
	},
	head: () => ({ meta: [{ title: "Browse · Orbit Shelf" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./library-Cb3L0wvl.mjs");
var Route$3 = createFileRoute("/library")({
	head: () => ({ meta: [{ title: "Library · Orbit Shelf" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./publish-CvoaPJ6f.mjs");
var Route$2 = createFileRoute("/publish")({
	head: () => ({ meta: [{ title: "Submit · Orbit Shelf" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./studio-DjnRKpG2.mjs");
var Route$1 = createFileRoute("/studio")({
	head: () => ({ meta: [{ title: "Studio · Orbit Shelf" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./play._slug-Bfp6QnU5.mjs");
var Route = createFileRoute("/play/$slug")({
	loader: ({ params }) => getGame({ data: { slug: params.slug } }),
	head: ({ loaderData }) => ({ meta: [{ title: loaderData?.game ? `${loaderData.game.title} · Orbit Shelf` : "Not on the shelf · Orbit Shelf" }, {
		name: "description",
		content: loaderData?.game?.blurb ?? "That title is not on the public shelf."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$5.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$6
	}),
	BrowseRoute: Route$4.update({
		id: "/browse",
		path: "/browse",
		getParentRoute: () => Route$6
	}),
	LibraryRoute: Route$3.update({
		id: "/library",
		path: "/library",
		getParentRoute: () => Route$6
	}),
	PublishRoute: Route$2.update({
		id: "/publish",
		path: "/publish",
		getParentRoute: () => Route$6
	}),
	StudioRoute: Route$1.update({
		id: "/studio",
		path: "/studio",
		getParentRoute: () => Route$6
	}),
	PlaySlugRoute: Route.update({
		id: "/play/$slug",
		path: "/play/$slug",
		getParentRoute: () => Route$6
	})
};
var routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { updateCategory as _, myMarks as a, recordPlay as c, setupOwner as d, studioBoard as f, unlockStudio as g, toggleLike as h, Route$5 as i, removeGame as l, submitPending as m, Route as n, publishLive as o, studioStatus as p, Route$4 as r, rateGame as s, router_exports as t, setGameState as u, updateGame as v };
