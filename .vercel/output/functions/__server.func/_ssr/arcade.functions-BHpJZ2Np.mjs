import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as object, i as number, n as boolean, o as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/arcade.functions-BHpJZ2Np.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var PAGE = 24;
var SESSION_MS = 12096e5;
var SUBMIT_CAP = 6;
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
function slugify(title) {
	return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 40) || "game";
}
function bytesToHex(buf) {
	return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function randomHex(bytes) {
	const a = new Uint8Array(bytes);
	crypto.getRandomValues(a);
	return bytesToHex(a.buffer);
}
function safeEqual(a, b) {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return diff === 0;
}
async function hashPassword(password, saltHex) {
	const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
	const salt = Uint8Array.from(saltHex.match(/.{2}/g).map((h) => Number.parseInt(h, 16)));
	return bytesToHex(await crypto.subtle.deriveBits({
		name: "PBKDF2",
		salt,
		iterations: 12e4,
		hash: "SHA-256"
	}, key, 256));
}
function cleanHttps(raw, label) {
	const url = (raw ?? "").trim();
	if (!url) return null;
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		throw new Error(`${label} must be an https link.`);
	}
	if (parsed.protocol !== "https:") throw new Error(`${label} must be an https link.`);
	return parsed.toString().slice(0, 400);
}
function cleanTags(raw) {
	const parts = (raw ?? "").split(",").map((t) => t.trim().toLowerCase().replace(/[^a-z0-9 -]/g, "").slice(0, 24)).filter(Boolean);
	return [...new Set(parts)].slice(0, 6).join(", ");
}
async function db() {
	const { getSql } = await import("./db-CTGpGLII.mjs");
	return getSql();
}
async function freshToken(sql) {
	const token = randomHex(32);
	await sql`update station_owner set session_token = ${token}, session_expires = ${new Date(Date.now() + SESSION_MS).toISOString()} where id = 1`;
	return token;
}
async function assertSession(sql, token) {
	if (!token || token.length < 32) throw new Error("Studio locked.");
	const row = (await sql`
    select session_token, session_expires from station_owner where id = 1
  `)[0];
	if (!row?.session_token || !safeEqual(row.session_token, token)) throw new Error("Studio locked.");
	const exp = row.session_expires ? new Date(row.session_expires).getTime() : 0;
	if (!exp || exp < Date.now()) throw new Error("Session expired. Unlock again.");
}
async function uniqueSlug(sql, title) {
	let slug = slugify(title);
	for (let i = 0; i < 6; i += 1) {
		if (!(await sql`select slug from games where slug = ${slug} limit 1`).length) return slug;
		slug = `${slugify(title)}-${randomHex(3)}`;
	}
	return `${slugify(title)}-${randomHex(6)}`;
}
var voter = string().min(16).max(64).regex(/^[a-zA-Z0-9-]+$/);
var getCatalogHome_createServerFn_handler = createServerRpc({
	id: "1c01a661c949f4efffe2b767829968ff7effb4f122553fa0723d8014a192dfaa",
	name: "getCatalogHome",
	filename: "src/lib/arcade.functions.ts"
}, (opts) => getCatalogHome.__executeServer(opts));
var getCatalogHome = createServerFn({ method: "GET" }).handler(getCatalogHome_createServerFn_handler, async () => {
	const sql = await db();
	const categories = await sql`
    select c.slug, c.label, c.blurb, c.sort_order,
      (select count(*)::int from games g where g.category = c.slug and g.status = 'live') as live_count
    from categories c
    order by c.sort_order
  `;
	const featured = await sql`
    select * from games where status = 'live' and featured = true order by created_at desc limit 6
  `;
	const newest = await sql`
    select * from games where status = 'live' order by created_at desc limit 12
  `;
	const hot = await sql`
    select * from games where status = 'live' and plays > 0 order by plays desc, created_at desc limit 12
  `;
	const totals = await sql`
    select
      count(*) filter (where status = 'live')::int as live,
      count(*) filter (where status = 'pending')::int as pending,
      coalesce(sum(plays) filter (where status = 'live'), 0)::int as plays
    from games
  `;
	return {
		categories,
		featured,
		newest,
		hot,
		live: totals[0]?.live ?? 0,
		pending: totals[0]?.pending ?? 0,
		plays: totals[0]?.plays ?? 0
	};
});
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
var browseGames_createServerFn_handler = createServerRpc({
	id: "1cc556692f0a86e9b86e9661c0f1d3ca6a80adc8436ef138a24f79221f8a89ea",
	name: "browseGames",
	filename: "src/lib/arcade.functions.ts"
}, (opts) => browseGames.__executeServer(opts));
var browseGames = createServerFn({ method: "GET" }).validator((input) => browseInput.parse(input)).handler(browseGames_createServerFn_handler, async ({ data }) => {
	const sql = await db();
	const page = data.page ?? 1;
	const q = (data.q ?? "").trim().slice(0, 80);
	const category = data.category && data.category !== "all" ? data.category : "";
	const sort = data.sort ?? "new";
	const like = `%${q.replace(/[%_]/g, "")}%`;
	const offset = (page - 1) * PAGE;
	const rows = sort === "plays" ? await sql`
            select * from games
            where status = 'live'
              and (${category} = '' or category = ${category})
              and (${q} = '' or title ilike ${like} or developer ilike ${like} or blurb ilike ${like} or tags ilike ${like})
            order by plays desc, created_at desc
            limit ${PAGE} offset ${offset}
          ` : sort === "title" ? await sql`
              select * from games
              where status = 'live'
                and (${category} = '' or category = ${category})
                and (${q} = '' or title ilike ${like} or developer ilike ${like} or blurb ilike ${like} or tags ilike ${like})
              order by title asc
              limit ${PAGE} offset ${offset}
            ` : sort === "rating" ? await sql`
                select * from games
                where status = 'live'
                  and (${category} = '' or category = ${category})
                  and (${q} = '' or title ilike ${like} or developer ilike ${like} or blurb ilike ${like} or tags ilike ${like})
                order by (case when rating_count = 0 then 0 else rating_sum::float / rating_count end) desc, plays desc
                limit ${PAGE} offset ${offset}
              ` : await sql`
                select * from games
                where status = 'live'
                  and (${category} = '' or category = ${category})
                  and (${q} = '' or title ilike ${like} or developer ilike ${like} or blurb ilike ${like} or tags ilike ${like})
                order by created_at desc
                limit ${PAGE} offset ${offset}
              `;
	const total = (await sql`
      select count(*)::int as n from games
      where status = 'live'
        and (${category} = '' or category = ${category})
        and (${q} = '' or title ilike ${like} or developer ilike ${like} or blurb ilike ${like} or tags ilike ${like})
    `)[0]?.n ?? 0;
	return {
		rows,
		total,
		page,
		pageSize: PAGE,
		pages: Math.max(1, Math.ceil(total / PAGE))
	};
});
var getGame_createServerFn_handler = createServerRpc({
	id: "c5e52d9345d051d15ec4eedd02bfa363b2f0a82060a10ed972cc5766dd1283b5",
	name: "getGame",
	filename: "src/lib/arcade.functions.ts"
}, (opts) => getGame.__executeServer(opts));
var getGame = createServerFn({ method: "GET" }).validator((input) => object({ slug: string().min(1).max(80) }).parse(input)).handler(getGame_createServerFn_handler, async ({ data }) => {
	const sql = await db();
	const game = (await sql`select * from games where slug = ${data.slug} and status = 'live' limit 1`)[0] ?? null;
	if (!game) return {
		game: null,
		related: []
	};
	return {
		game,
		related: await sql`
      select * from games
      where status = 'live' and category = ${game.category} and id <> ${game.id}
      order by plays desc, created_at desc
      limit 6
    `
	};
});
var myMarks_createServerFn_handler = createServerRpc({
	id: "f4b774d9ac78aaf8d74fdf073cdc0019af7716746d0de584ed1c75f111ad2bec",
	name: "myMarks",
	filename: "src/lib/arcade.functions.ts"
}, (opts) => myMarks.__executeServer(opts));
var myMarks = createServerFn({ method: "GET" }).validator((input) => object({
	slug: string(),
	voter
}).parse(input)).handler(myMarks_createServerFn_handler, async ({ data }) => {
	const sql = await db();
	const game = await sql`select id from games where slug = ${data.slug} and status = 'live' limit 1`;
	if (!game[0]) return {
		liked: false,
		stars: 0
	};
	const id = game[0].id;
	const liked = await sql`select 1 from reactions where game_id = ${id} and voter = ${data.voter} and kind = 'like'`;
	const rated = await sql`select stars from ratings where game_id = ${id} and voter = ${data.voter}`;
	return {
		liked: liked.length > 0,
		stars: rated[0]?.stars ?? 0
	};
});
var recordPlay_createServerFn_handler = createServerRpc({
	id: "5e24b92bd4df1ed6e0b525f81da39ef47b6ab7c687e53514df3a9f30ae696a28",
	name: "recordPlay",
	filename: "src/lib/arcade.functions.ts"
}, (opts) => recordPlay.__executeServer(opts));
var recordPlay = createServerFn({ method: "POST" }).validator((input) => object({ slug: string().min(1).max(80) }).parse(input)).handler(recordPlay_createServerFn_handler, async ({ data }) => {
	const sql = await db();
	const row = (await sql`
      update games set plays = plays + 1
      where slug = ${data.slug} and status = 'live'
      returning id, plays
    `)[0];
	if (!row) return { plays: 0 };
	await sql`
      insert into play_days (game_id, day, plays) values (${row.id}, current_date, 1)
      on conflict (game_id, day) do update set plays = play_days.plays + 1
    `;
	return { plays: row.plays };
});
var rateGame_createServerFn_handler = createServerRpc({
	id: "a92f1bcfa3549a9c03c94ca19d450c56c0f524cad5d390fe29d8c7e189653fb4",
	name: "rateGame",
	filename: "src/lib/arcade.functions.ts"
}, (opts) => rateGame.__executeServer(opts));
var rateGame = createServerFn({ method: "POST" }).validator((input) => object({
	slug: string(),
	voter,
	stars: number().int().min(1).max(5)
}).parse(input)).handler(rateGame_createServerFn_handler, async ({ data }) => {
	const sql = await db();
	const game = (await sql`select id from games where slug = ${data.slug} and status = 'live' limit 1`)[0];
	if (!game) throw new Error("That title is not live.");
	await sql`
      insert into ratings (game_id, voter, stars) values (${game.id}, ${data.voter}, ${data.stars})
      on conflict (game_id, voter) do update set stars = ${data.stars}
    `;
	const agg = await sql`
      select coalesce(sum(stars), 0)::int as s, count(*)::int as n from ratings where game_id = ${game.id}
    `;
	await sql`
      update games set rating_sum = ${agg[0]?.s ?? 0}, rating_count = ${agg[0]?.n ?? 0} where id = ${game.id}
    `;
	return {
		stars: data.stars,
		rating_sum: agg[0]?.s ?? 0,
		rating_count: agg[0]?.n ?? 0
	};
});
var toggleLike_createServerFn_handler = createServerRpc({
	id: "485c185bd27ee9f4ae87158a7dae1f9a194a9f6aa1900bdf6675a5a01bb126a7",
	name: "toggleLike",
	filename: "src/lib/arcade.functions.ts"
}, (opts) => toggleLike.__executeServer(opts));
var toggleLike = createServerFn({ method: "POST" }).validator((input) => object({
	slug: string(),
	voter
}).parse(input)).handler(toggleLike_createServerFn_handler, async ({ data }) => {
	const sql = await db();
	const game = (await sql`select id from games where slug = ${data.slug} and status = 'live' limit 1`)[0];
	if (!game) throw new Error("That title is not live.");
	const existing = await sql`select 1 from reactions where game_id = ${game.id} and voter = ${data.voter} and kind = 'like'`;
	if (existing.length) await sql`delete from reactions where game_id = ${game.id} and voter = ${data.voter} and kind = 'like'`;
	else await sql`insert into reactions (game_id, voter, kind) values (${game.id}, ${data.voter}, 'like')`;
	const likes = (await sql`select count(*)::int as n from reactions where game_id = ${game.id} and kind = 'like'`)[0]?.n ?? 0;
	await sql`update games set likes = ${likes} where id = ${game.id}`;
	return {
		liked: existing.length === 0,
		likes
	};
});
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
var studioStatus_createServerFn_handler = createServerRpc({
	id: "66d5c82fce907d80e607f7ade3ace4fcb54b35ece8407d95b21ca1ece4041b0c",
	name: "studioStatus",
	filename: "src/lib/arcade.functions.ts"
}, (opts) => studioStatus.__executeServer(opts));
var studioStatus = createServerFn({ method: "GET" }).handler(studioStatus_createServerFn_handler, async () => {
	return { configured: ((await (await db())`select count(*)::int as n from station_owner where id = 1`)[0]?.n ?? 0) > 0 };
});
var passwordInput = object({ password: string().min(8).max(72) });
var setupOwner_createServerFn_handler = createServerRpc({
	id: "3eec646dde3f0d56420f41002d9fa51140dd66bfc911d9b24a4a40f38f92f0bc",
	name: "setupOwner",
	filename: "src/lib/arcade.functions.ts"
}, (opts) => setupOwner.__executeServer(opts));
var setupOwner = createServerFn({ method: "POST" }).validator((input) => passwordInput.parse(input)).handler(setupOwner_createServerFn_handler, async ({ data }) => {
	const sql = await db();
	if ((await sql`select id from station_owner where id = 1`).length) throw new Error("Owner password is already set.");
	const salt = randomHex(16);
	const hash = await hashPassword(data.password, salt);
	const token = randomHex(32);
	const expires = new Date(Date.now() + SESSION_MS).toISOString();
	try {
		await sql`
        insert into station_owner (id, password_hash, password_salt, session_token, session_expires)
        values (1, ${hash}, ${salt}, ${token}, ${expires})
      `;
	} catch {
		throw new Error("Owner password is already set.");
	}
	return { token };
});
var unlockStudio_createServerFn_handler = createServerRpc({
	id: "b0f66967ded21ec83e020e4844c235db60b47a0e89fdf8a3cbcc7b81343ed1f8",
	name: "unlockStudio",
	filename: "src/lib/arcade.functions.ts"
}, (opts) => unlockStudio.__executeServer(opts));
var unlockStudio = createServerFn({ method: "POST" }).validator((input) => passwordInput.parse(input)).handler(unlockStudio_createServerFn_handler, async ({ data }) => {
	const sql = await db();
	const row = (await sql`
      select password_hash, password_salt from station_owner where id = 1
    `)[0];
	if (!row) throw new Error("Set an owner password first.");
	if (!safeEqual(await hashPassword(data.password, row.password_salt), row.password_hash)) throw new Error("Password rejected.");
	return { token: await freshToken(sql) };
});
var publishLive_createServerFn_handler = createServerRpc({
	id: "932f60626dd1595e4afb83841da3849e88120e7295960570b5f526386a620df4",
	name: "publishLive",
	filename: "src/lib/arcade.functions.ts"
}, (opts) => publishLive.__executeServer(opts));
var publishLive = createServerFn({ method: "POST" }).validator((input) => gameDraft.parse(input)).handler(publishLive_createServerFn_handler, async ({ data }) => {
	const sql = await db();
	await assertSession(sql, data.token);
	const embed = cleanHttps(data.embedUrl, "Embed");
	const cover = cleanHttps(data.coverUrl, "Cover");
	const tags = cleanTags(data.tags);
	return (await sql`
      insert into games (slug, title, blurb, category, developer, embed_url, cover_url, status, featured, tags)
      values (
        ${await uniqueSlug(sql, data.title)}, ${data.title.trim()}, ${data.blurb.trim()}, ${data.category}, ${data.developer.trim()},
        ${embed}, ${cover}, 'live', ${Boolean(data.featured)}, ${tags}
      )
      returning *
    `)[0];
});
var submitPending_createServerFn_handler = createServerRpc({
	id: "daf2e3a71978319f330c4cf7e46030825fa805c2da5ddbffd7ce024b257f8925",
	name: "submitPending",
	filename: "src/lib/arcade.functions.ts"
}, (opts) => submitPending.__executeServer(opts));
var submitPending = createServerFn({ method: "POST" }).validator((input) => gameDraft.omit({
	token: true,
	featured: true
}).parse(input)).handler(submitPending_createServerFn_handler, async ({ data }) => {
	const sql = await db();
	if (((await sql`
      select count(*)::int as n from games
      where status = 'pending' and created_at > now() - interval '10 minutes'
    `)[0]?.n ?? 0) >= SUBMIT_CAP) throw new Error("Too many submissions. Try again in a few minutes.");
	const embed = cleanHttps(data.embedUrl, "Embed");
	if (!embed) throw new Error("A public submission needs an https embed.");
	const cover = cleanHttps(data.coverUrl, "Cover");
	const tags = cleanTags(data.tags);
	await sql`
      insert into games (slug, title, blurb, category, developer, embed_url, cover_url, status, featured, tags)
      values (
        ${await uniqueSlug(sql, data.title)}, ${data.title.trim()}, ${data.blurb.trim()}, ${data.category}, ${data.developer.trim()},
        ${embed}, ${cover}, 'pending', false, ${tags}
      )
    `;
	return { ok: true };
});
var studioBoard_createServerFn_handler = createServerRpc({
	id: "5162757694d98342936d6af0568925c860560ad7388d3f5535713d5a28350324",
	name: "studioBoard",
	filename: "src/lib/arcade.functions.ts"
}, (opts) => studioBoard.__executeServer(opts));
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
}).parse(input)).handler(studioBoard_createServerFn_handler, async ({ data }) => {
	const sql = await db();
	await assertSession(sql, data.token);
	const page = data.page ?? 1;
	const offset = (page - 1) * PAGE;
	const status = data.status && data.status !== "all" ? data.status : "";
	const q = (data.q ?? "").trim().slice(0, 80);
	const like = `%${q.replace(/[%_]/g, "")}%`;
	const rows = await sql`
      select * from games
      where (${status} = '' or status = ${status})
        and (${q} = '' or title ilike ${like} or developer ilike ${like})
      order by created_at desc
      limit ${PAGE} offset ${offset}
    `;
	const counted = await sql`
      select count(*)::int as n,
        count(*) filter (where status = 'live')::int as live,
        count(*) filter (where status = 'pending')::int as pending,
        count(*) filter (where status = 'hidden')::int as hidden,
        coalesce(sum(plays), 0)::int as plays
      from games
    `;
	const filtered = await sql`
      select count(*)::int as n from games
      where (${status} = '' or status = ${status})
        and (${q} = '' or title ilike ${like} or developer ilike ${like})
    `;
	const cats = await sql`
      select c.slug, c.label, c.blurb, c.sort_order,
        (select count(*)::int from games g where g.category = c.slug and g.status = 'live') as live_count
      from categories c order by c.sort_order
    `;
	const pulse = await sql`
      select day::text as day, coalesce(sum(plays), 0)::int as plays
      from play_days
      where day >= current_date - 6
      group by day
      order by day
    `;
	const c = counted[0];
	const filteredN = filtered[0]?.n ?? 0;
	return {
		rows,
		categories: cats,
		page,
		pages: Math.max(1, Math.ceil(filteredN / PAGE)),
		live: c?.live ?? 0,
		pending: c?.pending ?? 0,
		hidden: c?.hidden ?? 0,
		plays: c?.plays ?? 0,
		total: c?.n ?? 0,
		pulse
	};
});
var setGameState_createServerFn_handler = createServerRpc({
	id: "32e67315927ea5e250a0b80fdbe6eea0256866cafaf3c1544bde70d10a711fbb",
	name: "setGameState",
	filename: "src/lib/arcade.functions.ts"
}, (opts) => setGameState.__executeServer(opts));
var setGameState = createServerFn({ method: "POST" }).validator((input) => object({
	token: string(),
	id: number().int(),
	status: _enum([
		"live",
		"hidden",
		"pending"
	]).optional(),
	featured: boolean().optional()
}).parse(input)).handler(setGameState_createServerFn_handler, async ({ data }) => {
	const sql = await db();
	await assertSession(sql, data.token);
	if (data.status) await sql`update games set status = ${data.status} where id = ${data.id}`;
	if (typeof data.featured === "boolean") await sql`update games set featured = ${data.featured} where id = ${data.id}`;
	return { ok: true };
});
var updateGame_createServerFn_handler = createServerRpc({
	id: "00cd6db8d55fb8ea2c12bc80ade90b9a529042b44fcf2c3772404b1c981c3e44",
	name: "updateGame",
	filename: "src/lib/arcade.functions.ts"
}, (opts) => updateGame.__executeServer(opts));
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
}).parse(input)).handler(updateGame_createServerFn_handler, async ({ data }) => {
	const sql = await db();
	await assertSession(sql, data.token);
	const embed = cleanHttps(data.embedUrl, "Embed");
	const cover = cleanHttps(data.coverUrl, "Cover");
	const tags = cleanTags(data.tags);
	await sql`
      update games set
        title = ${data.title.trim()},
        blurb = ${data.blurb.trim()},
        developer = ${data.developer.trim()},
        category = ${data.category},
        embed_url = ${embed},
        cover_url = ${cover},
        tags = ${tags}
      where id = ${data.id}
    `;
	return { ok: true };
});
var removeGame_createServerFn_handler = createServerRpc({
	id: "13c3f58cbdb7e4bd7f6743aa3dfa2dd6ed20c1a37f103cf8700fb3362edc4581",
	name: "removeGame",
	filename: "src/lib/arcade.functions.ts"
}, (opts) => removeGame.__executeServer(opts));
var removeGame = createServerFn({ method: "POST" }).validator((input) => object({
	token: string(),
	id: number().int()
}).parse(input)).handler(removeGame_createServerFn_handler, async ({ data }) => {
	const sql = await db();
	await assertSession(sql, data.token);
	await sql`delete from games where id = ${data.id}`;
	return { ok: true };
});
var updateCategory_createServerFn_handler = createServerRpc({
	id: "dfba5ff7eaa02a74eef1cc4a132178bf31b0379d50b097c4924eab86a3e4fb29",
	name: "updateCategory",
	filename: "src/lib/arcade.functions.ts"
}, (opts) => updateCategory.__executeServer(opts));
var updateCategory = createServerFn({ method: "POST" }).validator((input) => object({
	token: string(),
	slug: categorySlug,
	label: string().min(2).max(40),
	blurb: string().min(8).max(140)
}).parse(input)).handler(updateCategory_createServerFn_handler, async ({ data }) => {
	const sql = await db();
	await assertSession(sql, data.token);
	await sql`update categories set label = ${data.label.trim()}, blurb = ${data.blurb.trim()} where slug = ${data.slug}`;
	return { ok: true };
});
//#endregion
export { browseGames_createServerFn_handler, getCatalogHome_createServerFn_handler, getGame_createServerFn_handler, myMarks_createServerFn_handler, publishLive_createServerFn_handler, rateGame_createServerFn_handler, recordPlay_createServerFn_handler, removeGame_createServerFn_handler, setGameState_createServerFn_handler, setupOwner_createServerFn_handler, studioBoard_createServerFn_handler, studioStatus_createServerFn_handler, submitPending_createServerFn_handler, toggleLike_createServerFn_handler, unlockStudio_createServerFn_handler, updateCategory_createServerFn_handler, updateGame_createServerFn_handler };
