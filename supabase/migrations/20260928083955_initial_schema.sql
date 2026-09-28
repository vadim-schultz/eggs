-- Extension
create extension if not exists postgis with schema extensions;

-- Tables

create table public.listing (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references auth.users (id) on delete cascade,
  egg_count int not null check (egg_count > 0),
  unit text not null check (unit in ('dozen', 'each')),
  price_cents int not null check (price_cents >= 0),
  currency text not null default 'EUR',
  location extensions.geography(Point, 4326) not null,
  location_label text not null check (char_length(location_label) > 0),
  note text,
  status text not null default 'active'
    check (status in ('active', 'reserved', 'sold', 'expired', 'cancelled')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '3 days')
);

create index listing_location_gix on public.listing using gist (location);
create index listing_seller_id_idx on public.listing (seller_id);

create table public.reservation (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listing (id) on delete cascade,
  buyer_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'cancelled')),
  created_at timestamptz not null default now()
);

-- At most one active reservation per listing: this is what makes reservation
-- whole-listing only and closes the double-booking race at the database level.
create unique index reservation_listing_id_active_key
  on public.reservation (listing_id)
  where status = 'active';

create index reservation_buyer_id_idx on public.reservation (buyer_id);

create table public.listing_contact (
  listing_id uuid primary key references public.listing (id) on delete cascade,
  contact_note text not null check (char_length(contact_note) > 0)
);

-- Reservation trigger
--
-- SECURITY DEFINER (owned by `postgres`, which bypasses RLS locally and on
-- Supabase-hosted projects) so a buyer's INSERT into `reservation` — permitted
-- by reservation_insert_buyer below — can flip the *listing's* status even
-- though the buyer has no UPDATE grant on `listing`. This keeps the
-- active/reserved transition in the database, not in application code.
create function public.handle_reservation_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if TG_OP = 'INSERT' and new.status = 'active' then
    update public.listing set status = 'reserved'
      where id = new.listing_id and status = 'active';
  elsif TG_OP = 'UPDATE' and new.status = 'cancelled' and old.status = 'active' then
    update public.listing set status = 'active'
      where id = new.listing_id and status = 'reserved';
  end if;
  return new;
end;
$$;

create trigger reservation_status_change
  after insert or update on public.reservation
  for each row execute function public.handle_reservation_status_change();

-- Row level security

alter table public.listing enable row level security;
alter table public.reservation enable row level security;
alter table public.listing_contact enable row level security;

-- listing: public read, owner-only write (§6)

create policy listing_select_public
  on public.listing
  for select
  to anon, authenticated
  using (true);

create policy listing_insert_owner
  on public.listing
  for insert
  to authenticated
  with check (seller_id = auth.uid());

create policy listing_update_owner
  on public.listing
  for update
  to authenticated
  using (seller_id = auth.uid())
  with check (seller_id = auth.uid());

-- reservation: buyer or seller can read; buyer can insert on an active
-- listing; buyer or seller can cancel (§6)

create policy reservation_select_participant
  on public.reservation
  for select
  to authenticated
  using (
    buyer_id = auth.uid()
    or exists (
      select 1 from public.listing l
      where l.id = reservation.listing_id and l.seller_id = auth.uid()
    )
  );

create policy reservation_insert_buyer
  on public.reservation
  for insert
  to authenticated
  with check (
    buyer_id = auth.uid()
    and exists (
      select 1 from public.listing l
      where l.id = reservation.listing_id and l.status = 'active'
    )
  );

create policy reservation_update_participant
  on public.reservation
  for update
  to authenticated
  using (
    buyer_id = auth.uid()
    or exists (
      select 1 from public.listing l
      where l.id = reservation.listing_id and l.seller_id = auth.uid()
    )
  )
  with check (
    buyer_id = auth.uid()
    or exists (
      select 1 from public.listing l
      where l.id = reservation.listing_id and l.seller_id = auth.uid()
    )
  );

-- listing_contact: hidden from public listing reads; visible to the seller,
-- and to a buyer only once they hold an active reservation (§8)

create policy listing_contact_select_seller_or_active_buyer
  on public.listing_contact
  for select
  to authenticated
  using (
    exists (
      select 1 from public.listing l
      where l.id = listing_contact.listing_id and l.seller_id = auth.uid()
    )
    or exists (
      select 1 from public.reservation r
      where r.listing_id = listing_contact.listing_id
        and r.buyer_id = auth.uid()
        and r.status = 'active'
    )
  );

create policy listing_contact_insert_seller
  on public.listing_contact
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.listing l
      where l.id = listing_contact.listing_id and l.seller_id = auth.uid()
    )
  );

create policy listing_contact_update_seller
  on public.listing_contact
  for update
  to authenticated
  using (
    exists (
      select 1 from public.listing l
      where l.id = listing_contact.listing_id and l.seller_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.listing l
      where l.id = listing_contact.listing_id and l.seller_id = auth.uid()
    )
  );
