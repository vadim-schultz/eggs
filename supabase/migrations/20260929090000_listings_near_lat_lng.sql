-- PostgREST encodes a *table's* own geography column as GeoJSON, but not a
-- SQL function's output column of that type — `listings_near` was returning
-- the raw WKB hex for `location`, unusable on the frontend without
-- reimplementing geo parsing there (against D6: PostGIS does this correctly,
-- so the frontend shouldn't second-guess it). Expose plain lat/lng doubles
-- instead, computed in Postgres.
--
-- Input parameters are renamed to p_lat/p_lng/p_radius_m (matching the
-- p_-prefixed convention already used by create_listing) because the
-- output now also needs a `lat`/`lng` column, and a function's IN and OUT
-- parameters share one namespace.
drop function if exists public.listings_near(double precision, double precision, int);

create function public.listings_near(p_lat double precision, p_lng double precision, p_radius_m int)
returns table (
  id uuid,
  seller_id uuid,
  egg_count int,
  unit text,
  price_cents int,
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
    listing.price_cents,
    listing.currency,
    listing.location_label,
    listing.note,
    listing.status,
    listing.created_at,
    listing.expires_at,
    st_y(listing.location::extensions.geometry) as lat,
    st_x(listing.location::extensions.geometry) as lng
  from public.listing
  where st_dwithin(
    listing.location,
    st_setsrid(st_makepoint(p_lng, p_lat), 4326)::extensions.geography,
    p_radius_m
  );
$$;

grant execute on function public.listings_near(double precision, double precision, int) to anon, authenticated;
