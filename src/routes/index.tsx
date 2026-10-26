import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { GameCard } from "@/components/game-card";
import { getCatalogHome, type GameRow } from "@/lib/arcade.functions";

export const Route = createFileRoute("/")({
  loader: () => getCatalogHome(),
  head: () => ({ meta: [{ title: "Orbit Shelf" }, { name: "description", content: "A browser game station. Browse decks, play embeds, and run the catalog from the owner studio." }] }),
  component: Home,
});

function Home() {
  const data = Route.useLoaderData();
  return (
    <Shell>
      <main className="mx-auto max-w-6xl space-y-10 px-4 py-6">
        <section className="grid overflow-hidden rounded-3xl border border-border bg-surface lg:grid-cols-[1.2fr_1fr]">
          <div className="hangar h-48 w-full lg:h-full lg:min-h-64" />
          <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Station catalog</p>
            <h1 className="font-display text-4xl font-extrabold leading-none sm:text-5xl">Play what docks. You decide what stays.</h1>
            <p className="text-muted">
              {data.live} live · {data.plays} plays
              {data.pending ? ` · ${data.pending} waiting in studio` : ""}. Search, decks, ratings, and a private owner desk are ready. Games land when you publish them.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/browse" search={{ q: "", page: 1, sort: "new", category: "all" }} className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-ink">
                Open the shelf
              </Link>
              <Link to="/publish" className="inline-flex h-11 items-center rounded-full border border-border px-5 text-sm font-semibold">
                Submit a game
              </Link>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-display text-2xl font-bold">Decks</h2>
          <div className="rail">
            {data.categories.map((c) => (
              <Link key={c.slug} to="/browse" search={{ category: c.slug, q: "", page: 1, sort: "new" }} className="rounded-2xl border border-border bg-surface p-4 hover:border-primary/50">
                <p className="font-display text-lg font-bold">{c.label}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{c.blurb}</p>
                <p className="mt-3 text-xs text-accent">{c.live_count} live</p>
              </Link>
            ))}
          </div>
        </section>

        <Rail title="Pinned" games={data.featured} empty="Nothing is pinned yet. Feature a game from Studio." />
        <Rail title="Most played" games={data.hot} empty="Plays show up here after someone opens a live game." />
        <Rail title="Just docked" games={data.newest} empty="The newest rail fills the moment a game goes live." more />

        <section className="grid gap-3 md:grid-cols-3">
          {[
            ["1", "Submit", "Anyone can send an https embed. It stays pending."],
            ["2", "Review", "You unlock Studio, edit the listing, then set it live."],
            ["3", "Play", "Visitors rate, like, and keep favorites on this device."],
          ].map(([n, t, d]) => (
            <div key={n} className="rounded-2xl border border-border bg-surface p-5">
              <p className="font-display text-sm font-bold text-accent">{n}</p>
              <h3 className="mt-1 font-display text-xl font-bold">{t}</h3>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </div>
          ))}
        </section>
      </main>
    </Shell>
  );
}

function Rail({ title, games, empty, more }: { title: string; games: GameRow[]; empty: string; more?: boolean }) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <h2 className="font-display text-2xl font-bold">{title}</h2>
        {more && (
          <Link to="/browse" search={{ q: "", page: 1, sort: "new", category: "all" }} className="text-sm text-primary">
            All live
          </Link>
        )}
      </div>
      {games.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-surface/60 p-8 text-muted">{empty}</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">{games.slice(0, 6).map((g) => <GameCard key={g.id} game={g} />)}</div>
      )}
    </section>
  );
}
