-- Local dev only: fixture users for the sample listings below. Fake emails,
-- no real identities, no password (nobody signs in as these accounts).
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data
) values
  (
    '00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
    'authenticated', 'authenticated', 'seed-seller-1@example.test', '',
    now(), now(), now(),
    '{"provider":"google","providers":["google"]}', '{"name":"Seed Seller One"}'
  ),
  (
    '00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222',
    'authenticated', 'authenticated', 'seed-seller-2@example.test', '',
    now(), now(), now(),
    '{"provider":"google","providers":["google"]}', '{"name":"Seed Seller Two"}'
  );

-- A handful of sample listings around fake coordinates for local browsing/map
-- development. lng/lat pairs are arbitrary points, not real addresses.
insert into public.listing (
  seller_id, egg_count, unit, price_cents, location, location_label, note
) values
  (
    '11111111-1111-1111-1111-111111111111', 24, 'dozen', 400,
    st_setsrid(st_makepoint(13.405, 52.52), 4326)::extensions.geography,
    'Downtown, near the market', 'Frisch vom Hühnerstall'
  ),
  (
    '11111111-1111-1111-1111-111111111111', 6, 'each', 150,
    st_setsrid(st_makepoint(13.42, 52.5), 4326)::extensions.geography,
    'Near the park', null
  ),
  (
    '22222222-2222-2222-2222-222222222222', 12, 'dozen', 500,
    st_setsrid(st_makepoint(13.39, 52.53), 4326)::extensions.geography,
    'By the old mill', 'Abholung nach Absprache'
  );

insert into public.listing_contact (listing_id, contact_note)
select id, 'Text me at 0176 000 0000'
from public.listing
where seller_id = '11111111-1111-1111-1111-111111111111';

insert into public.listing_contact (listing_id, contact_note)
select id, 'Klingeln bei "Meyer"'
from public.listing
where seller_id = '22222222-2222-2222-2222-222222222222';
