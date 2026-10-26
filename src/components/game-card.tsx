import { Link } from "@tanstack/react-router";
import { Play, Star } from "lucide-react";
import type { GameRow } from "@/lib/arcade.functions";

export function scoreOf(game: Pick<GameRow, "rating_sum" | "rating_count">) {
  if (!game.rating_count) return null;
  return (game.rating_sum / game.rating_count).toFixed(1);
}

export function GameCard({ game }: { game: GameRow }) {
  const score = scoreOf(game);
  return (
    <Link
      to="/play/$slug"
      params={{ slug: game.slug }}
      className="lift group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-surface hover:-translate-y-0.5 hover:border-primary/60"
    >
      <div className="relative aspect-video bg-surface-2">
        {game.cover_url ? (
          <img src={game.cover_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="hangar h-full w-full" />
        )}
        <span className="absolute bottom-2 left-2 rounded-full bg-bg/80 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
          {game.category}
        </span>
        <span className="absolute right-2 top-2 grid size-9 place-items-center rounded-full bg-primary text-primary-ink opacity-0 transition group-hover:opacity-100">
          <Play className="size-4 fill-current" />
        </span>
      </div>
      <div className="space-y-1 p-3">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="truncate font-display text-base font-bold leading-tight">{game.title}</h3>
          {score ? (
            <span className="flex shrink-0 items-center gap-1 text-xs text-accent">
              <Star className="size-3 fill-current" />
              {score}
            </span>
          ) : (
            <span className="shrink-0 text-xs text-muted">{game.plays}</span>
          )}
        </div>
        <p className="line-clamp-2 text-sm text-muted">{game.blurb}</p>
      </div>
    </Link>
  );
}
