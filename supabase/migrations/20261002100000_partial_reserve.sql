-- Partial reserve: reservation quantity + inventory on listing row (panel-ux ch.9 / D9).

alter table public.listing
  drop constraint listing_egg_count_check;

alter table public.listing
  add constraint listing_egg_count_check
  check (egg_count > 0 or status = 'reserved');

alter table public.reservation
  add column egg_count int,
  add column unit text;

update public.reservation r
set
  egg_count = l.egg_count,
  unit = l.unit
from public.listing l
where l.id = r.listing_id;

alter table public.reservation
  alter column egg_count set not null,
  alter column unit set not null;

alter table public.reservation
  add constraint reservation_egg_count_positive check (egg_count > 0),
  add constraint reservation_unit_valid check (unit in ('dozen', 'each'));

create or replace function public.handle_reservation_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if TG_OP = 'INSERT' and new.status = 'active' then
    update public.listing
      set status = 'reserved'
      where id = new.listing_id and status = 'active' and egg_count = 0;
  elsif TG_OP = 'UPDATE' and new.status = 'cancelled' and old.status = 'active' then
    update public.listing
      set
        egg_count = egg_count + old.egg_count,
        status = case when status = 'reserved' then 'active' else status end
      where id = new.listing_id;
  end if;
  return new;
end;
$$;

-- Buyers may not UPDATE `listing`; definer helper applies inventory in the RPC txn.
create function public.decrement_listing_egg_count_for_reserve(
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
  where id = p_listing_id and status = 'active'
  for update;

  if v_unit is null then
    raise exception 'this listing was just reserved by someone else';
  end if;

  if p_egg_count > v_remaining then
    raise exception 'invalid egg count';
  end if;

  update public.listing
  set
    egg_count = egg_count - p_egg_count,
    status = case
      when egg_count - p_egg_count = 0 and status = 'active' then 'reserved'
      else status
    end
  where id = p_listing_id;

  return v_unit;
end;
$$;

drop function if exists public.reserve_listing(uuid);

create function public.reserve_listing(p_listing_id uuid, p_egg_count int)
returns public.reservation
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_unit text;
  v_reservation public.reservation;
begin
  if p_egg_count is null or p_egg_count <= 0 then
    raise exception 'invalid egg count';
  end if;

  v_unit := public.decrement_listing_egg_count_for_reserve(
    p_listing_id,
    p_egg_count
  );

  begin
    insert into public.reservation (listing_id, buyer_id, egg_count, unit)
    values (p_listing_id, auth.uid(), p_egg_count, v_unit)
    returning * into v_reservation;
  exception
    when unique_violation or insufficient_privilege then
      raise exception 'this listing was just reserved by someone else';
  end;

  return v_reservation;
end;
$$;

grant execute on function public.decrement_listing_egg_count_for_reserve(uuid, int) to authenticated;
grant execute on function public.reserve_listing(uuid, int) to authenticated;
