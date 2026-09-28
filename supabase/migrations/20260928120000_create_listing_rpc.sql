-- SECURITY INVOKER (the default, made explicit): runs as the calling
-- `authenticated` user, so it is fully subject to the listing_insert_owner
-- and listing_contact_insert_seller RLS policies (§6) — it cannot be used to
-- post as someone else. The two inserts run inside the function's own
-- implicit transaction: if either fails (e.g. a check constraint), both are
-- rolled back, so a listing is never created without its contact row.
create function public.create_listing(
  p_egg_count int,
  p_unit text,
  p_price_cents int,
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
    seller_id, egg_count, unit, price_cents, location, location_label, note
  )
  values (
    auth.uid(),
    p_egg_count,
    p_unit,
    p_price_cents,
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
