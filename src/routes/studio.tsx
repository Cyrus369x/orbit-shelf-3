import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import {
  publishLive,
  removeGame,
  setGameState,
  setupOwner,
  studioBoard,
  studioStatus,
  unlockStudio,
  updateCategory,
  updateGame,
  type CategoryRow,
  type GameRow,
} from "@/lib/arcade.functions";

const CATS = ["action", "arcade", "puzzle", "racing", "sports", "adventure", "strategy", "io", "girls", "casual"] as const;
const TOKEN_KEY = "orbit-studio-token";
type StatusFilter = "all" | "live" | "pending" | "hidden";

export const Route = createFileRoute("/studio")({
  head: () => ({ meta: [{ title: "Studio · Orbit Shelf" }] }),
  component: Studio,
});

function Studio() {
  const router = useRouter();
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [q, setQ] = useState("");
  const [board, setBoard] = useState<Awaited<ReturnType<typeof studioBoard>> | null>(null);
  const [title, setTitle] = useState("");
  const [blurb, setBlurb] = useState("");
  const [developer, setDeveloper] = useState("");
  const [category, setCategory] = useState<(typeof CATS)[number]>("arcade");
  const [embedUrl, setEmbedUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [tags, setTags] = useState("");
  const [featured, setFeatured] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = async (t: string, p: number, nextStatus = status, nextQ = q) => {
    const next = await studioBoard({ data: { token: t, page: p, status: nextStatus, q: nextQ } });
    setBoard(next);
    setPage(p);
    setToken(t);
    sessionStorage.setItem(TOKEN_KEY, t);
    setError("");
  };

  useEffect(() => {
    let cancel = false;
    (async () => {
      const st = await studioStatus();
      if (cancel) return;
      setConfigured(st.configured);
      const saved = sessionStorage.getItem(TOKEN_KEY) ?? "";
      if (st.configured && saved) {
        try {
          await load(saved, 1);
        } catch {
          sessionStorage.removeItem(TOKEN_KEY);
        }
      }
    })();
    return () => {
      cancel = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = async () => {
    if (!token) return;
    await load(token, page);
    router.invalidate();
  };

  const maxPulse = Math.max(1, ...(board?.pulse.map((d) => d.plays) ?? [1]));

  return (
    <Shell>
      <main className="mx-auto max-w-3xl space-y-8 px-4 py-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Command</p>
          <h1 className="font-display text-4xl font-extrabold">Studio</h1>
          <p className="mt-2 text-muted">You are the only admin. Approve, edit, hide, or publish. The public shelf pages 24 games at a time.</p>
        </div>

        {configured === null ? (
          <p className="text-sm text-muted">Checking the station lock…</p>
        ) : !board ? (
          <form
            className="space-y-3 rounded-2xl border border-border bg-surface p-5"
            onSubmit={async (e) => {
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
            }}
          >
            <h2 className="font-display text-xl font-bold">{configured ? "Unlock studio" : "Set the owner password"}</h2>
            <p className="text-sm text-muted">{configured ? "The password is stored as a hash. It is never shown again." : "First visit only. Pick at least 8 characters."}</p>
            <label className="block text-sm font-semibold" htmlFor="password">Owner password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 w-full rounded-xl border border-border bg-bg px-3 outline-none" autoComplete={configured ? "current-password" : "new-password"} minLength={8} />
            {error && <p className="text-sm text-danger">{error}</p>}
            <button disabled={busy || password.length < 8} className="h-11 rounded-full bg-primary px-5 text-sm font-semibold text-primary-ink">{configured ? "Unlock" : "Save password"}</button>
          </form>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
              <Stat label="Live" value={board.live} />
              <Stat label="Pending" value={board.pending} />
              <Stat label="Hidden" value={board.hidden} />
              <Stat label="Plays" value={board.plays} />
            </div>
            <section className="rounded-2xl border border-border bg-surface p-4">
              <h2 className="font-display text-lg font-bold">Plays, last 7 days</h2>
              {board.pulse.length === 0 ? (
                <p className="mt-2 text-sm text-muted">No plays recorded yet. Opening a live game counts one.</p>
              ) : (
                <div className="mt-3 flex h-24 items-end gap-2">
                  {board.pulse.map((d) => (
                    <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                      <div className="w-full rounded-t bg-primary" style={{ height: `${Math.max(8, (d.plays / maxPulse) * 72)}px` }} />
                      <span className="text-[10px] text-muted">{d.day.slice(5)}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <form
              className="space-y-3 rounded-2xl border border-border bg-surface p-5"
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                setError("");
                try {
                  await publishLive({ data: { token, title, blurb, developer, category, embedUrl, coverUrl, tags, featured } });
                  setTitle(""); setBlurb(""); setDeveloper(""); setEmbedUrl(""); setCoverUrl(""); setTags(""); setFeatured(false);
                  await load(token, 1);
                  router.invalidate();
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Publish failed.");
                } finally {
                  setBusy(false);
                }
              }}
            >
              <h2 className="font-display text-xl font-bold">Put a game live</h2>
              <Field label="Title" value={title} onChange={setTitle} />
              <Field label="Developer or studio" value={developer} onChange={setDeveloper} />
              <label className="block text-sm font-semibold">Description<textarea value={blurb} onChange={(e) => setBlurb(e.target.value)} className="mt-1 h-24 w-full rounded-xl border border-border bg-bg px-3 py-2 font-normal outline-none" /></label>
              <label className="block text-sm font-semibold">Deck
                <select value={category} onChange={(e) => setCategory(e.target.value as (typeof CATS)[number])} className="mt-1 h-11 w-full rounded-xl border border-border bg-bg px-3 font-normal">
                  {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <Field label="Tags, comma separated" value={tags} onChange={setTags} />
              <Field label="Embed URL (https, optional)" value={embedUrl} onChange={setEmbedUrl} />
              <Field label="Cover URL (https, optional)" value={coverUrl} onChange={setCoverUrl} />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} /> Pin on the home viewport</label>
              {error && <p className="text-sm text-danger">{error}</p>}
              <button disabled={busy} className="h-11 rounded-full bg-primary px-5 text-sm font-semibold text-primary-ink">Publish live</button>
            </form>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold">Decks</h2>
              {board.categories.map((c) => (
                <CategoryEditor key={c.slug} category={c} onSave={async (label, blurbText) => {
                  await updateCategory({ data: { token, slug: c.slug as (typeof CATS)[number], label, blurb: blurbText } });
                  await refresh();
                }} />
              ))}
            </section>

            <section className="space-y-2">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <h2 className="font-display text-xl font-bold">Catalog · page {board.page}/{board.pages}</h2>
                <form className="flex gap-2" onSubmit={async (e) => { e.preventDefault(); await load(token, 1, status, q); }}>
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a title" aria-label="Find in catalog" className="h-11 rounded-full border border-border bg-bg px-4 text-sm outline-none" />
                  <button className="h-11 rounded-full border border-border px-4 text-sm">Find</button>
                </form>
              </div>
              <div className="flex flex-wrap gap-2">
                {(["all", "pending", "live", "hidden"] as const).map((id) => (
                  <button key={id} type="button" className={`h-11 rounded-full px-4 text-sm capitalize ${status === id ? "bg-primary text-primary-ink" : "border border-border"}`} onClick={() => { setStatus(id); void load(token, 1, id, q); }}>{id}</button>
                ))}
              </div>
              {board.rows.length === 0 && <p className="text-sm text-muted">No rows in this filter.</p>}
              {board.rows.map((g) => (
                <Row
                  key={g.id}
                  game={g}
                  onChange={async (patch) => { await setGameState({ data: { token, id: g.id, ...patch } }); await refresh(); }}
                  onSave={async (draft) => { await updateGame({ data: { token, id: g.id, ...draft } }); await refresh(); }}
                  onRemove={async () => { await removeGame({ data: { token, id: g.id } }); await refresh(); }}
                />
              ))}
              <div className="flex gap-2 pt-2">
                {board.page > 1 && <button type="button" className="h-11 rounded-full border border-border px-4 text-sm" onClick={() => load(token, board.page - 1)}>Previous</button>}
                {board.page < board.pages && <button type="button" className="h-11 rounded-full border border-border px-4 text-sm" onClick={() => load(token, board.page + 1)}>Next</button>}
              </div>
            </section>
          </>
        )}
      </main>
    </Shell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="font-display text-2xl font-bold text-accent">{value}</p>
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 h-11 w-full rounded-xl border border-border bg-bg px-3 font-normal outline-none" />
    </label>
  );
}

function CategoryEditor({ category, onSave }: { category: CategoryRow; onSave: (label: string, blurb: string) => Promise<void> }) {
  const [label, setLabel] = useState(category.label);
  const [blurb, setBlurb] = useState(category.blurb);
  const [busy, setBusy] = useState(false);
  return (
    <form className="grid gap-2 rounded-xl border border-border bg-surface p-3 sm:grid-cols-[8rem_1fr_auto]" onSubmit={async (e) => { e.preventDefault(); setBusy(true); try { await onSave(label, blurb); } finally { setBusy(false); } }}>
      <input value={label} onChange={(e) => setLabel(e.target.value)} className="h-11 rounded-lg border border-border bg-bg px-2 text-sm" aria-label={`${category.slug} label`} />
      <input value={blurb} onChange={(e) => setBlurb(e.target.value)} className="h-11 rounded-lg border border-border bg-bg px-2 text-sm" aria-label={`${category.slug} blurb`} />
      <button disabled={busy} className="h-11 rounded-full border border-border px-3 text-sm">Save</button>
    </form>
  );
}

function Row({ game, onChange, onSave, onRemove }: {
  game: GameRow;
  onChange: (patch: { status?: "live" | "hidden" | "pending"; featured?: boolean }) => Promise<void>;
  onSave: (draft: { title: string; blurb: string; developer: string; category: (typeof CATS)[number]; embedUrl: string; coverUrl: string; tags: string }) => Promise<void>;
  onRemove: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(game.title);
  const [blurb, setBlurb] = useState(game.blurb);
  const [developer, setDeveloper] = useState(game.developer);
  const [category, setCategory] = useState(game.category as (typeof CATS)[number]);
  const [embedUrl, setEmbedUrl] = useState(game.embed_url ?? "");
  const [coverUrl, setCoverUrl] = useState(game.cover_url ?? "");
  const [tags, setTags] = useState(game.tags ?? "");
  const [busy, setBusy] = useState(false);
  const score = game.rating_count ? (game.rating_sum / game.rating_count).toFixed(1) : "–";

  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-semibold">{game.title}</p>
        <p className="text-xs uppercase text-muted">{game.status} · {game.category} · {game.plays} plays · {score} · {game.likes} likes</p>
      </div>
      <p className="text-sm text-muted">{game.developer}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {game.status !== "live" && <button type="button" className="h-10 rounded-full border border-border px-3 text-sm" onClick={() => onChange({ status: "live" })}>Set live</button>}
        {game.status !== "hidden" && <button type="button" className="h-10 rounded-full border border-border px-3 text-sm" onClick={() => onChange({ status: "hidden" })}>Hide</button>}
        {game.status !== "pending" && <button type="button" className="h-10 rounded-full border border-border px-3 text-sm" onClick={() => onChange({ status: "pending" })}>Pending</button>}
        <button type="button" className="h-10 rounded-full border border-border px-3 text-sm" onClick={() => onChange({ featured: !game.featured })}>{game.featured ? "Unpin" : "Feature"}</button>
        <button type="button" className="h-10 rounded-full border border-border px-3 text-sm" onClick={() => setOpen((v) => !v)}>{open ? "Close" : "Edit"}</button>
        <button type="button" className="h-10 rounded-full border border-danger/50 px-3 text-sm text-danger" onClick={() => onRemove()}>Remove</button>
      </div>
      {open && (
        <form className="mt-3 space-y-2" onSubmit={async (e) => { e.preventDefault(); setBusy(true); try { await onSave({ title, blurb, developer, category, embedUrl, coverUrl, tags }); setOpen(false); } finally { setBusy(false); } }}>
          <Field label="Title" value={title} onChange={setTitle} />
          <Field label="Developer" value={developer} onChange={setDeveloper} />
          <label className="block text-sm font-semibold">Description<textarea value={blurb} onChange={(e) => setBlurb(e.target.value)} className="mt-1 h-20 w-full rounded-xl border border-border bg-bg px-3 py-2 font-normal outline-none" /></label>
          <label className="block text-sm font-semibold">Deck
            <select value={category} onChange={(e) => setCategory(e.target.value as (typeof CATS)[number])} className="mt-1 h-11 w-full rounded-xl border border-border bg-bg px-3 font-normal">
              {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <Field label="Tags" value={tags} onChange={setTags} />
          <Field label="Embed" value={embedUrl} onChange={setEmbedUrl} />
          <Field label="Cover" value={coverUrl} onChange={setCoverUrl} />
          <button disabled={busy} className="h-11 rounded-full bg-primary px-5 text-sm font-semibold text-primary-ink">Save listing</button>
        </form>
      )}
    </div>
  );
}
