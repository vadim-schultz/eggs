-- pg_cron: enabled via versioned SQL, not a dashboard toggle, same pattern as
-- postgis (chapter 2) — supabase db reset (local) and supabase db push
-- (chapter 8, hosted) produce the identical schedule.
create extension if not exists pg_cron;

-- SECURITY DEFINER: the one function in this app with no calling user at
-- all — pg_cron invokes it on a schedule as the postgres role, so it needs
-- elevated privilege to update rows across every seller. Intentionally
-- narrow (one UPDATE, nothing else) so the privilege it needs is easy to
-- audit.
create function public.expire_listings()
returns void
language sql
security definer
set search_path = public
as $$
  update public.listing
    set status = 'expired'
    where status = 'active' and expires_at < now();
$$;

-- Callable directly for local verification (see chapter 7's Verification
-- section, which calls this instead of waiting a day for cron to fire).
-- pg_cron itself calls it as the function's owner (postgres) and doesn't
-- need this grant.
grant execute on function public.expire_listings() to service_role;

select cron.schedule('expire-listings-daily', '0 3 * * *', $$select expire_listings();$$);

-- A seller can push a listing's expiry out, but never more than 14 days from
-- the moment they save — enforced here, not just in the ListingDetail UI
-- (defense in depth, same pattern as the other listing checks in chapter 2).
alter table public.listing
  add constraint listing_expires_at_bound
  check (expires_at <= now() + interval '14 days');

-- SECURITY INVOKER, subject to listing_update_owner (§6, chapter 2): only
-- the seller can mark their own listing sold, and only from a status where
-- "sold" makes sense. A zero-row update (wrong owner, or already
-- sold/expired/cancelled) becomes an explicit error instead of a silent
-- no-op, same pattern as cancel_reservation (chapter 6).
create function public.mark_listing_sold(p_listing_id uuid)
returns public.listing
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_listing public.listing;
begin
  update public.listing
    set status = 'sold'
    where id = p_listing_id
      and seller_id = auth.uid()
      and status in ('active', 'reserved')
  returning * into v_listing;

  if v_listing.id is null then
    raise exception 'listing not found or you are not allowed to mark it sold';
  end if;

  return v_listing;
end;
$$;

grant execute on function public.mark_listing_sold(uuid) to authenticated;

-- Same shape as mark_listing_sold, for the seller's "never mind" case.
create function public.mark_listing_cancelled(p_listing_id uuid)
returns public.listing
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_listing public.listing;
begin
  update public.listing
    set status = 'cancelled'
    where id = p_listing_id
      and seller_id = auth.uid()
      and status in ('active', 'reserved')
  returning * into v_listing;

  if v_listing.id is null then
    raise exception 'listing not found or you are not allowed to cancel it';
  end if;

  return v_listing;
end;
$$;

grant execute on function public.mark_listing_cancelled(uuid) to authenticated;
