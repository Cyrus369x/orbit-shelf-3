import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { listFavs, listRecent, type ShelfSnap } from "@/lib/shelf-local";

export const Route = createFileRoute("/library")({
  head: () => ({ meta: [{ title: "Library · Orbit Shelf" }] }),
  component: LibraryPage,
});

function LibraryPage() {
  const [favs, setFavs] = useState<ShelfSnap[]>([]);
  const [recent, setRecent] = useState<ShelfSnap[]>([]);
  useEffect(() => {
    setFavs(listFavs());
    setRecent(listRecent());
  }, []);

  return (
    <Shell>
      <main className="mx-auto max-w-6xl space-y-10 px-4 py-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">This device</p>
          <h1 className="font-display text-4xl font-extrabold">Library</h1>
          <p className="mt-2 text-muted">Favorites and recent plays stay in this browser. They are not an account.</p>
        </div>
        <Rail title="Saved" items={favs} empty="Save a game from its play page. It will wait here." />
        <Rail title="Recently played" items={recent} empty="Open a live game and it lands on this rail." />
      </main>
    </Shell>
  );
}

function Rail({ title, items, empty }: { title: string; items: ShelfSnap[]; empty: string }) {
  return (
    <section>
      <h2 className="mb-4 font-display text-2xl font-bold">{title}</h2>
      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-muted">{empty}</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {items.map((g) => (
            <Link key={g.slug} to="/play/$slug" params={{ slug: g.slug }} className="overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="aspect-video bg-surface-2">{g.cover_url ? <img src={g.cover_url} alt="" className="h-full w-full object-cover" /> : <div className="hangar h-full w-full" />}</div>
              <div className="p-3">
                <p className="font-display font-bold">{g.title}</p>
                <p className="text-xs uppercase text-muted">{g.category}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
