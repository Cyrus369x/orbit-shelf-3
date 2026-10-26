alter table games add column if not exists tags text not null default '';
alter table games add column if not exists likes integer not null default 0;
alter table games add column if not exists rating_sum integer not null default 0;
alter table games add column if not exists rating_count integer not null default 0;

create table if not exists ratings (
  game_id integer not null references games (id) on delete cascade,
  voter text not null,
  stars integer not null check (stars between 1 and 5),
  primary key (game_id, voter)
);

create table if not exists reactions (
  game_id integer not null references games (id) on delete cascade,
  voter text not null,
  kind text not null check (kind in ('like')),
  primary key (game_id, voter, kind)
);

create table if not exists play_days (
  game_id integer not null references games (id) on delete cascade,
  day date not null,
  plays integer not null default 0,
  primary key (game_id, day)
);

create index if not exists games_plays_idx on games (status, plays desc);
