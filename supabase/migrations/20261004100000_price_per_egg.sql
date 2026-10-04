-- listing.price_cents held the total price; it now holds the price of ONE egg.
-- Rename first, then backfill from the old totals in a single statement
-- (rows with no eggs left get 0).
alter table public.listing rename column price_cents to price_per_egg_cents;

update public.listing
set price_per_egg_cents = coalesce(
  round(
    price_per_egg_cents::numeric
    / nullif(egg_count * (case unit when 'dozen' then 12 else 1 end), 0)
  ),
  0
)::int;

drop function if exists public.create_listing(
  int, text, int, double precision, double precision, text, text, text
);

create function public.create_listing(
  p_egg_count int,
  p_unit text,
  p_price_per_egg_cents int,
  p_lat double precision,
  p_lng double precision,
  p_location_label text,
  p_note text,
  p_contact_note text
)
returns public.listing
language plpgsql
security invoker
set search_path = public, extensions
as $$
declare
  v_listing public.listing;
begin
  insert into public.listing (
    seller_id, egg_count, unit, price_per_egg_cents, location, location_label, note
  )
  values (
    auth.uid(),
    p_egg_count,
    p_unit,
    p_price_per_egg_cents,
    st_setsrid(st_makepoint(p_lng, p_lat), 4326)::extensions.geography,
    p_location_label,
    p_note
  )
  returning * into v_listing;

  insert into public.listing_contact (listing_id, contact_note)
  values (v_listing.id, p_contact_note);

  return v_listing;
end;
$$;

grant execute on function public.create_listing(
  int, text, int, double precision, double precision, text, text, text
) to authenticated;

drop function if exists public.listings_near(double precision, double precision, int);

create function public.listings_near(p_lat double precision, p_lng double precision, p_radius_m int)
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
  where st_dwithin(
    listing.location,
    st_setsrid(st_makepoint(p_lng, p_lat), 4326)::extensions.geography,
    p_radius_m
  );
$$;

grant execute on function public.listings_near(double precision, double precision, int) to anon, authenticated;
