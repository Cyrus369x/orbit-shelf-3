import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, Star } from "lucide-react";
import { Shell } from "@/components/shell";
import { GameCard, scoreOf } from "@/components/game-card";
import { getGame, myMarks, rateGame, recordPlay, toggleLike, type GameRow } from "@/lib/arcade.functions";
import { isFav, remember, toggleFav, voterId, type ShelfSnap } from "@/lib/shelf-local";

export const Route = createFileRoute("/play/$slug")({
  loader: ({ params }) => getGame({ data: { slug: params.slug } }),
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.game ? `${loaderData.game.title} · Orbit Shelf` : "Not on the shelf · Orbit Shelf" },
      { name: "description", content: loaderData?.game?.blurb ?? "That title is not on the public shelf." },
    ],
  }),
  component: PlayPage,
});

function snap(game: GameRow): ShelfSnap {
  return { slug: game.slug, title: game.title, category: game.category, cover_url: game.cover_url, blurb: game.blurb };
}

function PlayPage() {
  const loaded = Route.useLoaderData();
  const [game, setGame] = useState(loaded.game);
  const [liked, setLiked] = useState(false);
  const [stars, setStars] = useState(0);
  const [fav, setFav] = useState(false);
  const [plays, setPlays] = useState(loaded.game?.plays ?? 0);

  useEffect(() => {
    setGame(loaded.game);
    setPlays(loaded.game?.plays ?? 0);
    if (!loaded.game) return;
    const g = loaded.game;
    remember(snap(g));
    setFav(isFav(g.slug));
    const voter = voterId();
    void recordPlay({ data: { slug: g.slug } }).then((r) => setPlays(r.plays));
    void myMarks({ data: { slug: g.slug, voter } }).then((m) => {
      setLiked(m.liked);
      setStars(m.stars);
    });
  }, [loaded.game]);

  if (!game) {
    return (
      <Shell>
        <main className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="font-display text-3xl font-bold">Not on the shelf</h1>
          <p className="mt-2 text-muted">That title is hidden, still pending, or the link is wrong.</p>
          <Link to="/browse" search={{ q: "", category: "all", sort: "new", page: 1 }} className="mt-4 inline-flex h-11 items-center text-primary">Back to the shelf</Link>
        </main>
      </Shell>
    );
  }

  const score = scoreOf({ ...game, rating_sum: game.rating_sum, rating_count: game.rating_count });
  const tags = game.tags.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <Shell>
      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{game.category}</p>
          <h1 className="font-display text-4xl font-extrabold">{game.title}</h1>
          {game.embed_url ? (
            <div className="aspect-video overflow-hidden rounded-2xl border border-border bg-bg">
              <iframe title={game.title} src={game.embed_url} className="h-full w-full" sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-presentation" allow="fullscreen; autoplay; gamepad" referrerPolicy="no-referrer" />
            </div>
          ) : (
            <div className="hangar flex aspect-video flex-col items-start justify-end rounded-2xl border border-border p-6">
              <p className="font-display text-xl font-bold">No embed yet</p>
              <p className="mt-1 max-w-md text-sm text-muted">This listing is on the shelf, but it has no playable URL. Add an https embed from the studio.</p>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold ${liked ? "border-primary bg-primary text-primary-ink" : "border-border"}`}
              onClick={async () => {
                const r = await toggleLike({ data: { slug: game.slug, voter: voterId() } });
                setLiked(r.liked);
                setGame({ ...game, likes: r.likes });
              }}
            >
              <Heart className={`size-4 ${liked ? "fill-current" : ""}`} /> {game.likes}
            </button>
            <button
              type="button"
              className={`inline-flex h-11 items-center rounded-full border px-4 text-sm font-semibold ${fav ? "border-accent text-accent" : "border-border"}`}
              onClick={() => setFav(toggleFav(snap(game)).some((g) => g.slug === game.slug))}
            >
              {fav ? "Saved" : "Save"}
            </button>
            <span className="text-sm text-muted">{plays} plays</span>
          </div>
          <div className="flex items-center gap-1" aria-label="Rate this game">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className="grid size-11 place-items-center"
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                onClick={async () => {
                  const r = await rateGame({ data: { slug: game.slug, voter: voterId(), stars: n } });
                  setStars(r.stars);
                  setGame({ ...game, rating_sum: r.rating_sum, rating_count: r.rating_count });
                }}
              >
                <Star className={`size-5 ${n <= stars ? "fill-accent text-accent" : "text-muted"}`} />
              </button>
            ))}
            <span className="ml-2 text-sm text-muted">{score ? `${score} · ${game.rating_count}` : "No ratings yet"}</span>
          </div>
        </div>
        <aside className="space-y-4">
          {game.cover_url ? <img src={game.cover_url} alt="" className="aspect-video w-full rounded-2xl object-cover" /> : null}
          <p className="text-sm text-muted">{game.blurb}</p>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <Link key={t} to="/browse" search={{ q: t, category: "all", sort: "new", page: 1 }} className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-wide text-muted">
                  {t}
                </Link>
              ))}
            </div>
          )}
          <dl className="text-sm">
            <Row k="Developer" v={game.developer} />
            <Row k="Plays" v={String(plays)} />
            <Row k="Status" v="Live" />
          </dl>
          <h2 className="font-display text-lg font-bold">Same deck</h2>
          {loaded.related.length === 0 ? (
            <p className="text-sm text-muted">No neighbors in this category yet.</p>
          ) : (
            <div className="grid gap-3">{loaded.related.map((g) => <GameCard key={g.id} game={g} />)}</div>
          )}
        </aside>
      </main>
    </Shell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-border py-2">
      <dt className="text-muted">{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}
