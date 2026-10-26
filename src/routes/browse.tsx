import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Shell } from "@/components/shell";
import { GameCard } from "@/components/game-card";
import { browseGames, getCatalogHome } from "@/lib/arcade.functions";

const searchSchema = z.object({
  q: z.string().optional().catch(""),
  category: z.string().optional().catch("all"),
  sort: z.enum(["new", "plays", "title", "rating"]).optional().catch("new"),
  page: z.number().optional().catch(1),
});

export const Route = createFileRoute("/browse")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const [board, home] = await Promise.all([
      browseGames({
        data: {
          q: deps.q || undefined,
          category: deps.category,
          sort: deps.sort,
          page: deps.page && deps.page > 0 ? deps.page : 1,
        },
      }),
      getCatalogHome(),
    ]);
    return { board, categories: home.categories };
  },
  head: () => ({ meta: [{ title: "Browse · Orbit Shelf" }] }),
  component: Browse,
});

const SORTS = [
  ["new", "Newest"],
  ["plays", "Most played"],
  ["rating", "Top rated"],
  ["title", "A–Z"],
] as const;

function Browse() {
  const { q, category, sort, page } = Route.useSearch();
  const { board, categories } = Route.useLoaderData();
  const nav = useNavigate();
  const current = category || "all";
  const sortNow = sort || "new";
  const pageNow = page && page > 0 ? page : 1;
  const [draft, setDraft] = useState(q ?? "");

  return (
    <Shell>
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Shelf</p>
            <h1 className="font-display text-4xl font-extrabold">{board.total} live</h1>
          </div>
          <form
            className="flex min-w-0 flex-1 basis-full items-center gap-2 sm:basis-auto sm:max-w-md"
            onSubmit={(e) => {
              e.preventDefault();
              nav({ to: "/browse", search: { q: draft.trim(), category: current, sort: sortNow, page: 1 } });
            }}
          >
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Titles, studios, tags" aria-label="Search this shelf" className="h-11 w-full rounded-full border border-border bg-surface px-4 text-sm outline-none" />
            <button className="h-11 shrink-0 rounded-full bg-primary px-4 text-sm font-semibold text-primary-ink">Search</button>
          </form>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          {SORTS.map(([id, label]) => (
            <Link key={id} to="/browse" search={{ q: q ?? "", category: current, sort: id, page: 1 }} className={`inline-flex h-11 items-center rounded-full px-3 ${sortNow === id ? "bg-primary text-primary-ink" : "border border-border"}`}>
              {label}
            </Link>
          ))}
        </div>
        <nav className="flex gap-2 overflow-x-auto pb-1">
          <Chip to="all" active={current === "all"} q={q ?? ""} sort={sortNow}>All decks</Chip>
          {categories.map((c) => (
            <Chip key={c.slug} to={c.slug} active={current === c.slug} q={q ?? ""} sort={sortNow}>{c.label}</Chip>
          ))}
        </nav>
        {q ? <p className="text-sm text-muted">Matching “{q}”</p> : null}
        {board.rows.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-8 text-muted">This deck is empty. Publish from the studio, or approve a developer submission.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {board.rows.map((g) => <GameCard key={g.id} game={g} />)}
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Page {board.page} of {board.pages}</span>
          <div className="flex gap-2">
            {pageNow > 1 && <Link to="/browse" search={{ q: q ?? "", category: current, sort: sortNow, page: pageNow - 1 }} className="inline-flex h-11 items-center rounded-full border border-border px-4">Previous</Link>}
            {pageNow < board.pages && <Link to="/browse" search={{ q: q ?? "", category: current, sort: sortNow, page: pageNow + 1 }} className="inline-flex h-11 items-center rounded-full border border-border px-4">Next</Link>}
          </div>
        </div>
      </main>
    </Shell>
  );
}

function Chip({ children, active, q, sort, to }: { children: React.ReactNode; active: boolean; q: string; sort: "new" | "plays" | "title" | "rating"; to: string }) {
  return (
    <Link to="/browse" search={{ q, category: to, sort, page: 1 }} className={`inline-flex h-11 shrink-0 items-center rounded-full px-4 text-sm font-semibold ${active ? "bg-primary text-primary-ink" : "border border-border bg-surface"}`}>
      {children}
    </Link>
  );
}
