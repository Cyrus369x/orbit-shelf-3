//#region node_modules/.nitro/vite/services/ssr/assets/db-CTGpGLII.js
var _0002_arcade_default = "create table if not exists categories (\n  slug text primary key,\n  label text not null,\n  blurb text not null,\n  sort_order integer not null\n);\n\ninsert into categories (slug, label, blurb, sort_order) values\n  ('action', 'Action', 'Fast fights, chases, and reflex runs.', 1),\n  ('arcade', 'Arcade', 'Short sessions with a sharp score chase.', 2),\n  ('puzzle', 'Puzzle', 'Quiet problems that reward a careful eye.', 3),\n  ('racing', 'Racing', 'Lanes, tracks, and anything that wants speed.', 4),\n  ('sports', 'Sports', 'Courts, fields, and timed matches.', 5),\n  ('adventure', 'Adventure', 'Worlds you walk through at your own pace.', 6),\n  ('strategy', 'Strategy', 'Plans, boards, and long-game thinking.', 7),\n  ('io', 'Multiplayer', 'Rooms built for more than one player.', 8),\n  ('girls', 'Dress & style', 'Makeovers, stories, and style play.', 9),\n  ('casual', 'Casual', 'Easy to start, easy to leave, easy to return.', 10)\non conflict (slug) do nothing;\n\ncreate table if not exists games (\n  id serial primary key,\n  slug text not null unique,\n  title text not null,\n  blurb text not null,\n  category text not null references categories (slug),\n  developer text not null,\n  embed_url text,\n  cover_url text,\n  status text not null default 'live',\n  featured boolean not null default false,\n  plays integer not null default 0,\n  created_at timestamptz not null default now()\n);\n\ncreate index if not exists games_live_idx on games (status, created_at desc);\ncreate index if not exists games_category_idx on games (category, status);\n\ncreate table if not exists station_owner (\n  id integer primary key check (id = 1),\n  password_hash text not null,\n  password_salt text not null,\n  session_token text,\n  session_expires timestamptz\n);\n";
var _0003_shelf_hardening_default = "alter table games add column if not exists cover_url text;\n\ncreate table if not exists station_owner (\n  id integer primary key check (id = 1),\n  password_hash text not null,\n  password_salt text not null,\n  session_token text,\n  session_expires timestamptz\n);\n";
var _0004_portal_default = "alter table games add column if not exists tags text not null default '';\nalter table games add column if not exists likes integer not null default 0;\nalter table games add column if not exists rating_sum integer not null default 0;\nalter table games add column if not exists rating_count integer not null default 0;\n\ncreate table if not exists ratings (\n  game_id integer not null references games (id) on delete cascade,\n  voter text not null,\n  stars integer not null check (stars between 1 and 5),\n  primary key (game_id, voter)\n);\n\ncreate table if not exists reactions (\n  game_id integer not null references games (id) on delete cascade,\n  voter text not null,\n  kind text not null check (kind in ('like')),\n  primary key (game_id, voter, kind)\n);\n\ncreate table if not exists play_days (\n  game_id integer not null references games (id) on delete cascade,\n  day date not null,\n  plays integer not null default 0,\n  primary key (game_id, day)\n);\n\ncreate index if not exists games_plays_idx on games (status, plays desc);\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({
			"/migrations/0002_arcade.sql": _0002_arcade_default,
			"/migrations/0003_shelf_hardening.sql": _0003_shelf_hardening_default,
			"/migrations/0004_portal.sql": _0004_portal_default
		});
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
//#endregion
export { getSql };
