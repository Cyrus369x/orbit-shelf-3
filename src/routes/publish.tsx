import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/shell";
import { submitPending } from "@/lib/arcade.functions";

const CATS = ["action", "arcade", "puzzle", "racing", "sports", "adventure", "strategy", "io", "girls", "casual"] as const;

export const Route = createFileRoute("/publish")({
  head: () => ({ meta: [{ title: "Submit · Orbit Shelf" }] }),
  component: Publish,
});

function Publish() {
  const [title, setTitle] = useState("");
  const [blurb, setBlurb] = useState("");
  const [developer, setDeveloper] = useState("");
  const [category, setCategory] = useState<(typeof CATS)[number]>("arcade");
  const [embedUrl, setEmbedUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [tags, setTags] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <Shell>
      <main className="mx-auto max-w-xl space-y-4 px-4 py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Developers</p>
        <h1 className="font-display text-4xl font-extrabold">Request a berth</h1>
        <p className="text-muted">Send a title and an https embed. It stays pending until you set it live in Studio. Nothing here plays until that happens.</p>
        <form
          className="space-y-3 rounded-2xl border border-border bg-surface p-5"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setErr("");
            setMsg("");
            try {
              await submitPending({ data: { title, blurb, developer, category, embedUrl, coverUrl, tags } });
              setMsg("Received. It is in the owner queue, not on the public shelf yet.");
              setTitle("");
              setBlurb("");
              setDeveloper("");
              setEmbedUrl("");
              setCoverUrl("");
              setTags("");
            } catch (error) {
              setErr(error instanceof Error ? error.message : "Could not submit.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <Lab label="Title" value={title} onChange={setTitle} />
          <Lab label="Studio name" value={developer} onChange={setDeveloper} />
          <label className="block text-sm font-semibold">
            What it is
            <textarea value={blurb} onChange={(e) => setBlurb(e.target.value)} className="mt-1 h-24 w-full rounded-xl border border-border bg-bg px-3 py-2 font-normal outline-none" />
          </label>
          <label className="block text-sm font-semibold">
            Deck
            <select value={category} onChange={(e) => setCategory(e.target.value as (typeof CATS)[number])} className="mt-1 h-11 w-full rounded-xl border border-border bg-bg px-3 font-normal">
              {CATS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <Lab label="Tags, comma separated" value={tags} onChange={setTags} />
          <Lab label="https embed" value={embedUrl} onChange={setEmbedUrl} />
          <Lab label="https cover image (optional)" value={coverUrl} onChange={setCoverUrl} />
          {err && <p className="text-sm text-danger">{err}</p>}
          {msg && <p className="text-sm text-primary">{msg}</p>}
          <button disabled={busy} className="h-11 rounded-full bg-primary px-5 text-sm font-semibold text-primary-ink">Submit for review</button>
        </form>
      </main>
    </Shell>
  );
}

function Lab({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 h-11 w-full rounded-xl border border-border bg-bg px-3 font-normal outline-none" />
    </label>
  );
}
