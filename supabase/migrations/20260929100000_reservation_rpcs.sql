-- SECURITY INVOKER (the default, made explicit): runs as the calling
-- `authenticated` user, so it is fully subject to reservation_insert_buyer
-- (§6, chapter 2) — it cannot reserve as someone else nor bypass the
-- active-listing check. That policy's WITH CHECK rejects the insert once the
-- listing is no longer 'active' (insufficient_privilege), and the partial
-- unique index rejects a true concurrent race (unique_violation); both are
-- wrapped in the same friendlier message here instead of a raw Postgres
-- error code.
create function public.reserve_listing(p_listing_id uuid)
returns public.reservation
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_reservation public.reservation;
begin
  begin
    insert into public.reservation (listing_id, buyer_id)
    values (p_listing_id, auth.uid())
    returning * into v_reservation;
  exception
    when unique_violation or insufficient_privilege then
      raise exception 'this listing was just reserved by someone else';
  end;

  return v_reservation;
end;
$$;

grant execute on function public.reserve_listing(uuid) to authenticated;

-- SECURITY INVOKER: subject to reservation_update_participant (§6), so only
-- the buyer or the listing's seller can cancel. That policy's USING clause
-- silently filters out rows the caller may not touch, which would otherwise
-- read as a silent no-op; we turn the resulting zero-row update into an
-- explicit error instead.
create function public.cancel_reservation(p_reservation_id uuid)
returns public.reservation
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_reservation public.reservation;
begin
  update public.reservation
    set status = 'cancelled'
    where id = p_reservation_id and status = 'active'
  returning * into v_reservation;

  if v_reservation.id is null then
    raise exception 'reservation not found or you are not allowed to cancel it';
  end if;

  return v_reservation;
end;
$$;

grant execute on function public.cancel_reservation(uuid) to authenticated;
