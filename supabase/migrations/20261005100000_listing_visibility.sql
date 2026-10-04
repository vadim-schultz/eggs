-- Listing visibility is enforced server-side: a listing is visible iff
-- status = 'active' and egg_count > 0 and expires_at > now().
-- Seller lifecycle controls (mark sold / cancel / expiry edit) are removed;
-- the lifecycle is automatic. expire_listings() and its cron stay as cleanup.

-- Same signature and columns as before; only the WHERE clause gains the
-- visibility predicate.
create or replace function public.listings_near(p_lat double precision, p_lng double precision, p_radius_m int)
returns table (
  id uuid,
  seller_id uuid,
  egg_count int,
  unit text,
  price_per_egg_cents int,
  currency text,
  location_label text,
  note text,
  status text,
  created_at timestamptz,
  expires_at timestamptz,
  lat double precision,
  lng double precision
)
language sql
stable
security invoker
set search_path = public, extensions
as $$
  select
    listing.id,
    listing.seller_id,
    listing.egg_count,
    listing.unit,
    listing.price_per_egg_cents,
    listing.currency,
    listing.location_label,
    listing.note,
    listing.status,
    listing.created_at,
    listing.expires_at,
    st_y(listing.location::extensions.geometry) as lat,
    st_x(listing.location::extensions.geometry) as lng
  from public.listing
  where listing.status = 'active'
    and listing.egg_count > 0
    and listing.expires_at > now()
    and st_dwithin(
      listing.location,
      st_setsrid(st_makepoint(p_lng, p_lat), 4326)::extensions.geography,
      p_radius_m
    );
$$;

-- Only the guard changes: expired listings can no longer be reserved.
create or replace function public.lock_listing_for_reserve(
  p_listing_id uuid,
  p_egg_count int
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_unit text;
  v_remaining int;
begin
  select unit, egg_count into v_unit, v_remaining
  from public.listing
  where id = p_listing_id and status = 'active' and expires_at > now()
  for update;

  if v_unit is null then
    raise exception 'this listing is no longer available';
  end if;

  if p_egg_count > v_remaining then
    raise exception 'invalid egg count';
  end if;

  return v_unit;
end;
$$;

drop function if exists public.mark_listing_sold(uuid);
drop function if exists public.mark_listing_cancelled(uuid);

alter table public.listing drop constraint if exists listing_expires_at_bound;
