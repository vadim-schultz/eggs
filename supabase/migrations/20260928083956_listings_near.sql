-- SECURITY INVOKER (the default, made explicit): runs as the calling role
-- (anon or authenticated) and returns only what that role's `listing` SELECT
-- policy already allows — i.e. everything, since browsing is public (§7).
-- Wrapping ST_DWithin in a function introduces no privilege escalation; it
-- exists so the frontend doesn't need to express ST_DWithin through the JS
-- query builder.
create function public.listings_near(lat double precision, lng double precision, radius_m int)
returns setof public.listing
language sql
stable
security invoker
set search_path = public, extensions
as $$
  select listing.*
  from public.listing
  where st_dwithin(
    listing.location,
    st_setsrid(st_makepoint(lng, lat), 4326)::extensions.geography,
    radius_m
  );
$$;

grant execute on function public.listings_near(double precision, double precision, int) to anon, authenticated;
