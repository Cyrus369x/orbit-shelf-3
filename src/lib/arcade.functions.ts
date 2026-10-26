import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const PAGE = 24;
const SESSION_MS = 14 * 24 * 60 * 60 * 1000;
const SUBMIT_CAP = 6;

const categorySlug = z.enum([
  "action",
  "arcade",
  "puzzle",
  "racing",
  "sports",
  "adventure",
  "strategy",
  "io",
  "girls",
  "casual",
]);

export type GameRow = {
  id: number;
  slug: string;
  title: string;
  blurb: string;
  category: string;
  developer: string;
  embed_url: string | null;
  cover_url: string | null;
  status: string;
  featured: boolean;
  plays: number;
  created_at: string;
  tags: string;
  likes: number;
  rating_sum: number;
  rating_count: number;
};

export type CategoryRow = {
  slug: string;
  label: string;
  blurb: string;
  sort_order: number;
  live_count: number;
};

function slugify(title: string) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
  return base || "game";
}

function bytesToHex(buf: ArrayBuffer) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function randomHex(bytes: number) {
  const a = new Uint8Array(bytes);
  crypto.getRandomValues(a);
  return bytesToHex(a.buffer);
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function hashPassword(password: string, saltHex: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const salt = Uint8Array.from(saltHex.match(/.{2}/g)!.map((h) => Number.parseInt(h, 16)));
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 120_000, hash: "SHA-256" }, key, 256);
  return bytesToHex(bits);
}

function cleanHttps(raw: string | undefined, label: string) {
  const url = (raw ?? "").trim();
  if (!url) return null;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`${label} must be an https link.`);
  }
  if (parsed.protocol !== "https:") throw new Error(`${label} must be an https link.`);
  return parsed.toString().slice(0, 400);
}

function cleanTags(raw: string | undefined) {
  const parts = (raw ?? "")
    .split(",")
    .map((t) => t.trim().toLowerCase().replace(/[^a-z0-9 -]/g, "").slice(0, 24))
    .filter(Boolean);
  return [...new Set(parts)].slice(0, 6).join(", ");
}

async function db() {
  const { getSql } = await import("@/lib/db");
  return getSql();
}

type Sql = Awaited<ReturnType<typeof db>>;

async function freshToken(sql: Sql) {
  const token = randomHex(32);
  const expires = new Date(Date.now() + SESSION_MS).toISOString();
  await sql`update station_owner set session_token = ${token}, session_expires = ${expires} where id = 1`;
  return token;
}

async function assertSession(sql: Sql, token: string) {
  if (!token || token.length < 32) throw new Error("Studio locked.");
  const rows = await sql<{ session_token: string | null; session_expires: string | Date | null }>`
    select session_token, session_expires from station_owner where id = 1
  `;
  const row = rows[0];
  if (!row?.session_token || !safeEqual(row.session_token, token)) throw new Error("Studio locked.");
  const exp = row.session_expires ? new Date(row.session_expires).getTime() : 0;
  if (!exp || exp < Date.now()) throw new Error("Session expired. Unlock again.");
}

async function uniqueSlug(sql: Sql, title: string) {
  let slug = slugify(title);
  for (let i = 0; i < 6; i += 1) {
    const clash = await sql<{ slug: string }>`select slug from games where slug = ${slug} limit 1`;
    if (!clash.length) return slug;
    slug = `${slugify(title)}-${randomHex(3)}`;
  }
  return `${slugify(title)}-${randomHex(6)}`;
}

const voter = z.string().min(16).max(64).regex(/^[a-zA-Z0-9-]+$/);

export const getCatalogHome = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await db();
  const categories = await sql<CategoryRow>`
    select c.slug, c.label, c.blurb, c.sort_order,
      (select count(*)::int from games g where g.category = c.slug and g.status = 'live') as live_count
    from categories c
    order by c.sort_order
  `;
  const featured = await sql<GameRow>`
    select * from games where status = 'live' and featured = true order by created_at desc limit 6
  `;
  const newest = await sql<GameRow>`
    select * from games where status = 'live' order by created_at desc limit 12
  `;
  const hot = await sql<GameRow>`
    select * from games where status = 'live' and plays > 0 order by plays desc, created_at desc limit 12
  `;
  const totals = await sql<{ live: number; pending: number; plays: number }>`
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
    plays: totals[0]?.plays ?? 0,
  };
});

const browseInput = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
  sort: z.enum(["new", "plays", "title", "rating"]).optional(),
  page: z.number().int().min(1).optional(),
});

export const browseGames = createServerFn({ method: "GET" })
  .validator((input: unknown) => browseInput.parse(input))
  .handler(async ({ data }) => {
    const sql = await db();
    const page = data.page ?? 1;
    const q = (data.q ?? "").trim().slice(0, 80);
    const category = data.category && data.category !== "all" ? data.category : "";
    const sort = data.sort ?? "new";
    const like = `%${q.replace(/[%_]/g, "")}%`;
    const offset = (page - 1) * PAGE;
    const rows =
      sort === "plays"
        ? await sql<GameRow>`
            select * from games
            where status = 'live'
              and (${category} = '' or category = ${category})
              and (${q} = '' or title ilike ${like} or developer ilike ${like} or blurb ilike ${like} or tags ilike ${like})
            order by plays desc, created_at desc
            limit ${PAGE} offset ${offset}
          `
        : sort === "title"
          ? await sql<GameRow>`
              select * from games
              where status = 'live'
                and (${category} = '' or category = ${category})
                and (${q} = '' or title ilike ${like} or developer ilike ${like} or blurb ilike ${like} or tags ilike ${like})
              order by title asc
              limit ${PAGE} offset ${offset}
            `
          : sort === "rating"
            ? await sql<GameRow>`
                select * from games
                where status = 'live'
                  and (${category} = '' or category = ${category})
                  and (${q} = '' or title ilike ${like} or developer ilike ${like} or blurb ilike ${like} or tags ilike ${like})
                order by (case when rating_count = 0 then 0 else rating_sum::float / rating_count end) desc, plays desc
                limit ${PAGE} offset ${offset}
              `
            : await sql<GameRow>`
                select * from games
                where status = 'live'
                  and (${category} = '' or category = ${category})
                  and (${q} = '' or title ilike ${like} or developer ilike ${like} or blurb ilike ${like} or tags ilike ${like})
                order by created_at desc
                limit ${PAGE} offset ${offset}
              `;
    const counted = await sql<{ n: number }>`
      select count(*)::int as n from games
      where status = 'live'
        and (${category} = '' or category = ${category})
        and (${q} = '' or title ilike ${like} or developer ilike ${like} or blurb ilike ${like} or tags ilike ${like})
    `;
    const total = counted[0]?.n ?? 0;
    return { rows, total, page, pageSize: PAGE, pages: Math.max(1, Math.ceil(total / PAGE)) };
  });

export const getGame = createServerFn({ method: "GET" })
  .validator((input: unknown) => z.object({ slug: z.string().min(1).max(80) }).parse(input))
  .handler(async ({ data }) => {
    const sql = await db();
    const rows = await sql<GameRow>`select * from games where slug = ${data.slug} and status = 'live' limit 1`;
    const game = rows[0] ?? null;
    if (!game) return { game: null as GameRow | null, related: [] as GameRow[] };
    const related = await sql<GameRow>`
      select * from games
      where status = 'live' and category = ${game.category} and id <> ${game.id}
      order by plays desc, created_at desc
      limit 6
    `;
    return { game, related };
  });

export const myMarks = createServerFn({ method: "GET" })
  .validator((input: unknown) => z.object({ slug: z.string(), voter }).parse(input))
  .handler(async ({ data }) => {
    const sql = await db();
    const game = await sql<{ id: number }>`select id from games where slug = ${data.slug} and status = 'live' limit 1`;
    if (!game[0]) return { liked: false, stars: 0 };
    const id = game[0].id;
    const liked = await sql`select 1 from reactions where game_id = ${id} and voter = ${data.voter} and kind = 'like'`;
    const rated = await sql<{ stars: number }>`select stars from ratings where game_id = ${id} and voter = ${data.voter}`;
    return { liked: liked.length > 0, stars: rated[0]?.stars ?? 0 };
  });

export const recordPlay = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ slug: z.string().min(1).max(80) }).parse(input))
  .handler(async ({ data }) => {
    const sql = await db();
    const rows = await sql<{ id: number; plays: number }>`
      update games set plays = plays + 1
      where slug = ${data.slug} and status = 'live'
      returning id, plays
    `;
    const row = rows[0];
    if (!row) return { plays: 0 };
    await sql`
      insert into play_days (game_id, day, plays) values (${row.id}, current_date, 1)
      on conflict (game_id, day) do update set plays = play_days.plays + 1
    `;
    return { plays: row.plays };
  });

export const rateGame = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ slug: z.string(), voter, stars: z.number().int().min(1).max(5) }).parse(input))
  .handler(async ({ data }) => {
    const sql = await db();
    const games = await sql<{ id: number }>`select id from games where slug = ${data.slug} and status = 'live' limit 1`;
    const game = games[0];
    if (!game) throw new Error("That title is not live.");
    await sql`
      insert into ratings (game_id, voter, stars) values (${game.id}, ${data.voter}, ${data.stars})
      on conflict (game_id, voter) do update set stars = ${data.stars}
    `;
    const agg = await sql<{ s: number; n: number }>`
      select coalesce(sum(stars), 0)::int as s, count(*)::int as n from ratings where game_id = ${game.id}
    `;
    await sql`
      update games set rating_sum = ${agg[0]?.s ?? 0}, rating_count = ${agg[0]?.n ?? 0} where id = ${game.id}
    `;
    return { stars: data.stars, rating_sum: agg[0]?.s ?? 0, rating_count: agg[0]?.n ?? 0 };
  });

export const toggleLike = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ slug: z.string(), voter }).parse(input))
  .handler(async ({ data }) => {
    const sql = await db();
    const games = await sql<{ id: number }>`select id from games where slug = ${data.slug} and status = 'live' limit 1`;
    const game = games[0];
    if (!game) throw new Error("That title is not live.");
    const existing = await sql`select 1 from reactions where game_id = ${game.id} and voter = ${data.voter} and kind = 'like'`;
    if (existing.length) {
      await sql`delete from reactions where game_id = ${game.id} and voter = ${data.voter} and kind = 'like'`;
    } else {
      await sql`insert into reactions (game_id, voter, kind) values (${game.id}, ${data.voter}, 'like')`;
    }
    const counted = await sql<{ n: number }>`select count(*)::int as n from reactions where game_id = ${game.id} and kind = 'like'`;
    const likes = counted[0]?.n ?? 0;
    await sql`update games set likes = ${likes} where id = ${game.id}`;
    return { liked: existing.length === 0, likes };
  });

const gameDraft = z.object({
  token: z.string().min(32),
  title: z.string().min(2).max(80),
  blurb: z.string().min(8).max(280),
  developer: z.string().min(2).max(60),
  category: categorySlug,
  embedUrl: z.string().max(400).optional(),
  coverUrl: z.string().max(400).optional(),
  tags: z.string().max(160).optional(),
  featured: z.boolean().optional(),
});

export const studioStatus = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await db();
  const rows = await sql<{ n: number }>`select count(*)::int as n from station_owner where id = 1`;
  return { configured: (rows[0]?.n ?? 0) > 0 };
});

const passwordInput = z.object({ password: z.string().min(8).max(72) });

export const setupOwner = createServerFn({ method: "POST" })
  .validator((input: unknown) => passwordInput.parse(input))
  .handler(async ({ data }) => {
    const sql = await db();
    const existing = await sql`select id from station_owner where id = 1`;
    if (existing.length) throw new Error("Owner password is already set.");
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

export const unlockStudio = createServerFn({ method: "POST" })
  .validator((input: unknown) => passwordInput.parse(input))
  .handler(async ({ data }) => {
    const sql = await db();
    const rows = await sql<{ password_hash: string; password_salt: string }>`
      select password_hash, password_salt from station_owner where id = 1
    `;
    const row = rows[0];
    if (!row) throw new Error("Set an owner password first.");
    const hash = await hashPassword(data.password, row.password_salt);
    if (!safeEqual(hash, row.password_hash)) throw new Error("Password rejected.");
    const token = await freshToken(sql);
    return { token };
  });

export const publishLive = createServerFn({ method: "POST" })
  .validator((input: unknown) => gameDraft.parse(input))
  .handler(async ({ data }) => {
    const sql = await db();
    await assertSession(sql, data.token);
    const embed = cleanHttps(data.embedUrl, "Embed");
    const cover = cleanHttps(data.coverUrl, "Cover");
    const tags = cleanTags(data.tags);
    const slug = await uniqueSlug(sql, data.title);
    const rows = await sql<GameRow>`
      insert into games (slug, title, blurb, category, developer, embed_url, cover_url, status, featured, tags)
      values (
        ${slug}, ${data.title.trim()}, ${data.blurb.trim()}, ${data.category}, ${data.developer.trim()},
        ${embed}, ${cover}, 'live', ${Boolean(data.featured)}, ${tags}
      )
      returning *
    `;
    return rows[0];
  });

export const submitPending = createServerFn({ method: "POST" })
  .validator((input: unknown) => gameDraft.omit({ token: true, featured: true }).parse(input))
  .handler(async ({ data }) => {
    const sql = await db();
    const recent = await sql<{ n: number }>`
      select count(*)::int as n from games
      where status = 'pending' and created_at > now() - interval '10 minutes'
    `;
    if ((recent[0]?.n ?? 0) >= SUBMIT_CAP) throw new Error("Too many submissions. Try again in a few minutes.");
    const embed = cleanHttps(data.embedUrl, "Embed");
    if (!embed) throw new Error("A public submission needs an https embed.");
    const cover = cleanHttps(data.coverUrl, "Cover");
    const tags = cleanTags(data.tags);
    const slug = await uniqueSlug(sql, data.title);
    await sql`
      insert into games (slug, title, blurb, category, developer, embed_url, cover_url, status, featured, tags)
      values (
        ${slug}, ${data.title.trim()}, ${data.blurb.trim()}, ${data.category}, ${data.developer.trim()},
        ${embed}, ${cover}, 'pending', false, ${tags}
      )
    `;
    return { ok: true as const };
  });

export const studioBoard = createServerFn({ method: "GET" })
  .validator((input: unknown) =>
    z
      .object({
        token: z.string(),
        page: z.number().int().min(1).optional(),
        status: z.enum(["all", "live", "pending", "hidden"]).optional(),
        q: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const sql = await db();
    await assertSession(sql, data.token);
    const page = data.page ?? 1;
    const offset = (page - 1) * PAGE;
    const status = data.status && data.status !== "all" ? data.status : "";
    const q = (data.q ?? "").trim().slice(0, 80);
    const like = `%${q.replace(/[%_]/g, "")}%`;
    const rows = await sql<GameRow>`
      select * from games
      where (${status} = '' or status = ${status})
        and (${q} = '' or title ilike ${like} or developer ilike ${like})
      order by created_at desc
      limit ${PAGE} offset ${offset}
    `;
    const counted = await sql<{ n: number; live: number; pending: number; hidden: number; plays: number }>`
      select count(*)::int as n,
        count(*) filter (where status = 'live')::int as live,
        count(*) filter (where status = 'pending')::int as pending,
        count(*) filter (where status = 'hidden')::int as hidden,
        coalesce(sum(plays), 0)::int as plays
      from games
    `;
    const filtered = await sql<{ n: number }>`
      select count(*)::int as n from games
      where (${status} = '' or status = ${status})
        and (${q} = '' or title ilike ${like} or developer ilike ${like})
    `;
    const cats = await sql<CategoryRow>`
      select c.slug, c.label, c.blurb, c.sort_order,
        (select count(*)::int from games g where g.category = c.slug and g.status = 'live') as live_count
      from categories c order by c.sort_order
    `;
    const pulse = await sql<{ day: string; plays: number }>`
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
      pulse,
    };
  });

export const setGameState = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        token: z.string(),
        id: z.number().int(),
        status: z.enum(["live", "hidden", "pending"]).optional(),
        featured: z.boolean().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const sql = await db();
    await assertSession(sql, data.token);
    if (data.status) await sql`update games set status = ${data.status} where id = ${data.id}`;
    if (typeof data.featured === "boolean") await sql`update games set featured = ${data.featured} where id = ${data.id}`;
    return { ok: true as const };
  });

export const updateGame = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        token: z.string(),
        id: z.number().int(),
        title: z.string().min(2).max(80),
        blurb: z.string().min(8).max(280),
        developer: z.string().min(2).max(60),
        category: categorySlug,
        embedUrl: z.string().max(400).optional(),
        coverUrl: z.string().max(400).optional(),
        tags: z.string().max(160).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
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
    return { ok: true as const };
  });

export const removeGame = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ token: z.string(), id: z.number().int() }).parse(input))
  .handler(async ({ data }) => {
    const sql = await db();
    await assertSession(sql, data.token);
    await sql`delete from games where id = ${data.id}`;
    return { ok: true as const };
  });

export const updateCategory = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ token: z.string(), slug: categorySlug, label: z.string().min(2).max(40), blurb: z.string().min(8).max(140) }).parse(input),
  )
  .handler(async ({ data }) => {
    const sql = await db();
    await assertSession(sql, data.token);
    await sql`update categories set label = ${data.label.trim()}, blurb = ${data.blurb.trim()} where slug = ${data.slug}`;
    return { ok: true as const };
  });
