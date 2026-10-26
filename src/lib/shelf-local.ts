const VOTER = "orbit-voter";
const FAVS = "orbit-favs";
const RECENT = "orbit-recent";

export type ShelfSnap = {
  slug: string;
  title: string;
  category: string;
  cover_url: string | null;
  blurb: string;
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function voterId() {
  const existing = localStorage.getItem(VOTER);
  if (existing && existing.length >= 16) return existing;
  const id = crypto.randomUUID().replace(/-/g, "");
  localStorage.setItem(VOTER, id);
  return id;
}

export function listFavs(): ShelfSnap[] {
  return read<ShelfSnap[]>(FAVS, []);
}

export function isFav(slug: string) {
  return listFavs().some((g) => g.slug === slug);
}

export function toggleFav(game: ShelfSnap) {
  const next = listFavs().filter((g) => g.slug !== game.slug);
  if (next.length === listFavs().length) next.unshift(game);
  write(FAVS, next.slice(0, 80));
  return next;
}

export function listRecent(): ShelfSnap[] {
  return read<ShelfSnap[]>(RECENT, []);
}

export function remember(game: ShelfSnap) {
  const next = [game, ...listRecent().filter((g) => g.slug !== game.slug)].slice(0, 24);
  write(RECENT, next);
  return next;
}
