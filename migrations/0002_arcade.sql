create table if not exists categories (
  slug text primary key,
  label text not null,
  blurb text not null,
  sort_order integer not null
);

insert into categories (slug, label, blurb, sort_order) values
  ('action', 'Action', 'Fast fights, chases, and reflex runs.', 1),
  ('arcade', 'Arcade', 'Short sessions with a sharp score chase.', 2),
  ('puzzle', 'Puzzle', 'Quiet problems that reward a careful eye.', 3),
  ('racing', 'Racing', 'Lanes, tracks, and anything that wants speed.', 4),
  ('sports', 'Sports', 'Courts, fields, and timed matches.', 5),
  ('adventure', 'Adventure', 'Worlds you walk through at your own pace.', 6),
  ('strategy', 'Strategy', 'Plans, boards, and long-game thinking.', 7),
  ('io', 'Multiplayer', 'Rooms built for more than one player.', 8),
  ('girls', 'Dress & style', 'Makeovers, stories, and style play.', 9),
  ('casual', 'Casual', 'Easy to start, easy to leave, easy to return.', 10)
on conflict (slug) do nothing;

create table if not exists games (
  id serial primary key,
  slug text not null unique,
  title text not null,
  blurb text not null,
  category text not null references categories (slug),
  developer text not null,
  embed_url text,
  cover_url text,
  status text not null default 'live',
  featured boolean not null default false,
  plays integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists games_live_idx on games (status, created_at desc);
create index if not exists games_category_idx on games (category, status);

create table if not exists station_owner (
  id integer primary key check (id = 1),
  password_hash text not null,
  password_salt text not null,
  session_token text,
  session_expires timestamptz
);
