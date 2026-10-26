import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Library, Menu, Search, X } from "lucide-react";

export function Shell({ children }: { children: React.ReactNode }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  const goBrowse = () => {
    setOpen(false);
    nav({ to: "/browse", search: { q: "", page: 1, sort: "new", category: "all" } });
  };

  return (
    <div className="min-h-screen bg-bg/80 text-fg">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-extrabold tracking-wide text-primary">
            <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-extrabold text-primary-ink">OS</span>
            Orbit Shelf
          </Link>
          <form
            className="ml-auto hidden min-w-0 max-w-md flex-1 items-center gap-2 rounded-full border border-border bg-surface px-3 sm:flex"
            onSubmit={(e) => {
              e.preventDefault();
              nav({ to: "/browse", search: { q: q.trim(), page: 1, sort: "new", category: "all" } });
            }}
          >
            <Search className="size-4 shrink-0 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search the shelf"
              className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted"
              aria-label="Search games"
            />
          </form>
          <nav className="hidden items-center gap-1 sm:flex">
            <Link to="/browse" search={{ q: "", page: 1, sort: "new", category: "all" }} className="h-11 items-center px-3 text-sm font-semibold inline-flex">
              Browse
            </Link>
            <Link to="/library" className="h-11 items-center px-3 text-sm font-semibold inline-flex">
              Library
            </Link>
            <Link to="/publish" className="hidden h-11 items-center px-3 text-sm font-semibold text-primary md:inline-flex">
              Submit
            </Link>
            <Link to="/studio" className="h-11 items-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-ink inline-flex">
              Studio
            </Link>
          </nav>
          <button type="button" className="ml-auto grid size-11 place-items-center rounded-full border border-border sm:hidden" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {open && (
          <div className="space-y-2 border-t border-border px-4 py-3 sm:hidden">
            <form
              className="flex items-center gap-2 rounded-full border border-border bg-surface px-3"
              onSubmit={(e) => {
                e.preventDefault();
                setOpen(false);
                nav({ to: "/browse", search: { q: q.trim(), page: 1, sort: "new", category: "all" } });
              }}
            >
              <Search className="size-4 text-muted" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the shelf" aria-label="Search games" className="h-11 w-full bg-transparent text-sm outline-none" />
            </form>
            <button type="button" className="flex h-11 w-full items-center text-left text-sm font-semibold" onClick={goBrowse}>Browse</button>
            <button type="button" className="flex h-11 w-full items-center gap-2 text-left text-sm font-semibold" onClick={() => { setOpen(false); nav({ to: "/library" }); }}><Library className="size-4" /> Library</button>
            <button type="button" className="flex h-11 w-full items-center text-left text-sm font-semibold text-primary" onClick={() => { setOpen(false); nav({ to: "/publish" }); }}>Submit a game</button>
            <button type="button" className="flex h-11 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-ink" onClick={() => { setOpen(false); nav({ to: "/studio" }); }}>Studio</button>
          </div>
        )}
      </header>
      {children}
      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-10 text-sm text-muted">
        <span>Orbit Shelf · browser games, one station</span>
        <span className="flex gap-4">
          <Link to="/publish" className="text-primary">Submit</Link>
          <Link to="/library" className="text-primary">Library</Link>
          <Link to="/studio" className="text-primary">Studio</Link>
        </span>
      </footer>
    </div>
  );
}
