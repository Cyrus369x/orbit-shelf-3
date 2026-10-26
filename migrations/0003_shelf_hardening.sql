alter table games add column if not exists cover_url text;

create table if not exists station_owner (
  id integer primary key check (id = 1),
  password_hash text not null,
  password_salt text not null,
  session_token text,
  session_expires timestamptz
);
