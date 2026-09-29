// Smoke-tests the RLS policies from supabase/migrations against a running
// `supabase start` local stack. Not part of the vitest suite: it needs Docker
// and a live Postgres, so it's run explicitly (see chapter 2's Verification
// section) and in CI as a separate step.
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

interface LocalCredentials {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
}

function getLocalCredentials(): LocalCredentials {
  const raw = execFileSync(
    "npx",
    ["--yes", "supabase", "status", "-o", "json"],
    {
      encoding: "utf-8",
    },
  );
  const status = JSON.parse(raw) as Record<string, string>;
  return {
    url: status.API_URL,
    anonKey: status.ANON_KEY,
    serviceRoleKey: status.SERVICE_ROLE_KEY,
  };
}

async function createSignedInClient(
  admin: SupabaseClient,
  url: string,
  anonKey: string,
  email: string,
): Promise<SupabaseClient> {
  const password = randomUUID();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error || !data.user) {
    throw new Error(`failed to create test user ${email}: ${error?.message}`);
  }

  const client = createClient(url, anonKey);
  const { error: signInError } = await client.auth.signInWithPassword({
    email,
    password,
  });
  if (signInError) {
    throw new Error(
      `failed to sign in test user ${email}: ${signInError.message}`,
    );
  }
  return client;
}

let passed = 0;
let failed = 0;

async function check(
  name: string,
  assertion: () => Promise<void>,
): Promise<void> {
  try {
    await assertion();
    passed += 1;
    console.log(`ok - ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`not ok - ${name}`);
    console.error(
      `  ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

async function main() {
  const { url, anonKey, serviceRoleKey } = getLocalCredentials();
  const admin = createClient(url, serviceRoleKey);

  const anon = createClient(url, anonKey);
  const runId = randomUUID();
  const userA = await createSignedInClient(
    admin,
    url,
    anonKey,
    `smoke-a-${runId}@example.test`,
  );
  const userB = await createSignedInClient(
    admin,
    url,
    anonKey,
    `smoke-b-${runId}@example.test`,
  );
  const userC = await createSignedInClient(
    admin,
    url,
    anonKey,
    `smoke-c-${runId}@example.test`,
  );
  const userD = await createSignedInClient(
    admin,
    url,
    anonKey,
    `smoke-d-${runId}@example.test`,
  );

  const { data: userAData } = await userA.auth.getUser();
  const { data: userBData } = await userB.auth.getUser();
  const sellerAId = userAData.user!.id;
  const buyerBId = userBData.user!.id;

  const point = { lat: 52.52, lng: 13.405 };
  const newListing = () => ({
    seller_id: sellerAId,
    egg_count: 12,
    unit: "dozen",
    price_cents: 300,
    location: `SRID=4326;POINT(${point.lng} ${point.lat})`,
    location_label: "Smoke test listing",
  });

  await check("anon can select from listing", async () => {
    const { data, error } = await anon.from("listing").select("id");
    assert(!error, `unexpected error: ${error?.message}`);
    assert(Array.isArray(data), "expected an array of listings");
  });

  await check("anon insert into listing is rejected", async () => {
    const { error } = await anon.from("listing").insert(newListing());
    assert(!!error, "expected anon insert to be rejected");
  });

  let listingId = "";
  await check(
    "signed-in user A can insert a listing with seller_id = A",
    async () => {
      const { data, error } = await userA
        .from("listing")
        .insert(newListing())
        .select("id")
        .single();
      assert(!error, `unexpected error: ${error?.message}`);
      listingId = data!.id as string;
    },
  );

  await check(
    "signed-in user B cannot insert a listing with seller_id = A",
    async () => {
      const { error } = await userB
        .from("listing")
        .insert(newListing())
        .select("id")
        .single();
      assert(!!error, "expected non-owner insert to be rejected");
    },
  );

  await check(
    "user B can insert a reservation on A's active listing",
    async () => {
      const { error } = await userB
        .from("reservation")
        .insert({ listing_id: listingId, buyer_id: buyerBId });
      assert(!error, `unexpected error: ${error?.message}`);
    },
  );

  await check(
    "the trigger flips that listing's status to 'reserved'",
    async () => {
      const { data, error } = await admin
        .from("listing")
        .select("status")
        .eq("id", listingId)
        .single();
      assert(!error, `unexpected error: ${error?.message}`);
      assert(
        data!.status === "reserved",
        `expected status 'reserved', got '${data!.status}'`,
      );
    },
  );

  await check(
    "a second reservation insert on the same listing by user C violates the partial unique index",
    async () => {
      const { data: userCData } = await userC.auth.getUser();
      const { error } = await userC
        .from("reservation")
        .insert({ listing_id: listingId, buyer_id: userCData.user!.id });
      assert(!!error, "expected the second active reservation to be rejected");
    },
  );

  await check("anon select on listing_contact returns zero rows", async () => {
    const { data, error } = await anon
      .from("listing_contact")
      .select("listing_id")
      .eq("listing_id", listingId);
    assert(!error, `unexpected error: ${error?.message}`);
    assert(data!.length === 0, "expected zero rows for anon");
  });

  await check("seller A can insert the listing_contact row", async () => {
    const { error } = await userA
      .from("listing_contact")
      .insert({ listing_id: listingId, contact_note: "Ring the bell" });
    assert(!error, `unexpected error: ${error?.message}`);
  });

  await check(
    "user B (active reservation) can select the listing's listing_contact row",
    async () => {
      const { data, error } = await userB
        .from("listing_contact")
        .select("contact_note")
        .eq("listing_id", listingId);
      assert(!error, `unexpected error: ${error?.message}`);
      assert(
        data!.length === 1,
        "expected buyer with an active reservation to see the row",
      );
    },
  );

  await check(
    "user C (no reservation) cannot select that listing_contact row",
    async () => {
      const { data, error } = await userC
        .from("listing_contact")
        .select("contact_note")
        .eq("listing_id", listingId);
      assert(!error, `unexpected error: ${error?.message}`);
      assert(
        data!.length === 0,
        "expected user with no reservation to see zero rows",
      );
    },
  );

  await check(
    "listings_near returns a listing within radius_m and omits one outside it",
    async () => {
      const near = await anon.rpc("listings_near", {
        p_lat: point.lat,
        p_lng: point.lng,
        p_radius_m: 1000,
      });
      assert(!near.error, `unexpected error: ${near.error?.message}`);
      assert(
        (near.data as { id: string }[]).some((row) => row.id === listingId),
        "expected the listing within radius_m to be returned",
      );

      const far = await anon.rpc("listings_near", {
        p_lat: point.lat + 5,
        p_lng: point.lng + 5,
        p_radius_m: 1000,
      });
      assert(!far.error, `unexpected error: ${far.error?.message}`);
      assert(
        !(far.data as { id: string }[]).some((row) => row.id === listingId),
        "expected the listing outside radius_m to be omitted",
      );
    },
  );

  await check(
    "create_listing as signed-in user A creates one listing row owned by A and one matching listing_contact row",
    async () => {
      const { data, error } = await userA.rpc("create_listing", {
        p_egg_count: 6,
        p_unit: "dozen",
        p_price_cents: 250,
        p_lat: point.lat,
        p_lng: point.lng,
        p_location_label: "create_listing smoke test",
        p_note: null,
        p_contact_note: "Ring the bell",
      });
      assert(!error, `unexpected error: ${error?.message}`);
      assert(
        data.seller_id === sellerAId,
        "expected the created listing's seller_id to be user A",
      );

      const { data: contact, error: contactError } = await admin
        .from("listing_contact")
        .select("contact_note")
        .eq("listing_id", data.id)
        .single();
      assert(!contactError, `unexpected error: ${contactError?.message}`);
      assert(
        contact!.contact_note === "Ring the bell",
        "expected a matching listing_contact row",
      );
    },
  );

  await check("create_listing with p_egg_count = 0 is rejected", async () => {
    const { error } = await userA.rpc("create_listing", {
      p_egg_count: 0,
      p_unit: "dozen",
      p_price_cents: 250,
      p_lat: point.lat,
      p_lng: point.lng,
      p_location_label: "create_listing smoke test",
      p_note: null,
      p_contact_note: "Ring the bell",
    });
    assert(!!error, "expected the check constraint to reject egg_count = 0");
  });

  let rpcListingId = "";
  await check(
    "seller A can create a second listing for the reservation RPC checks",
    async () => {
      const { data, error } = await userA
        .from("listing")
        .insert(newListing())
        .select("id")
        .single();
      assert(!error, `unexpected error: ${error?.message}`);
      rpcListingId = data!.id as string;
    },
  );

  await check(
    "reserve_listing by user B on A's active listing succeeds and the listing's status becomes 'reserved'",
    async () => {
      const { error } = await userB.rpc("reserve_listing", {
        p_listing_id: rpcListingId,
      });
      assert(!error, `unexpected error: ${error?.message}`);

      const { data, error: statusError } = await admin
        .from("listing")
        .select("status")
        .eq("id", rpcListingId)
        .single();
      assert(!statusError, `unexpected error: ${statusError?.message}`);
      assert(
        data!.status === "reserved",
        `expected status 'reserved', got '${data!.status}'`,
      );
    },
  );

  await check(
    "reserve_listing by user C on the same (now reserved) listing fails with a friendly error",
    async () => {
      const { error } = await userC.rpc("reserve_listing", {
        p_listing_id: rpcListingId,
      });
      assert(!!error, "expected reserve_listing to be rejected");
    },
  );

  let rpcReservationId = "";
  await check(
    "cancel_reservation by user D (neither buyer nor seller) on B's reservation is rejected",
    async () => {
      const { data: reservationRow, error: findError } = await admin
        .from("reservation")
        .select("id")
        .eq("listing_id", rpcListingId)
        .eq("status", "active")
        .single();
      assert(!findError, `unexpected error: ${findError?.message}`);
      rpcReservationId = reservationRow!.id as string;

      const { error } = await userD.rpc("cancel_reservation", {
        p_reservation_id: rpcReservationId,
      });
      assert(!!error, "expected user D's cancel to be rejected");
    },
  );

  await check(
    "cancel_reservation by user B reopens the listing to 'active'",
    async () => {
      const { error } = await userB.rpc("cancel_reservation", {
        p_reservation_id: rpcReservationId,
      });
      assert(!error, `unexpected error: ${error?.message}`);

      const { data, error: statusError } = await admin
        .from("listing")
        .select("status")
        .eq("id", rpcListingId)
        .single();
      assert(!statusError, `unexpected error: ${statusError?.message}`);
      assert(
        data!.status === "active",
        `expected status 'active', got '${data!.status}'`,
      );
    },
  );

  let expiredListingId = "";
  await check(
    "expire_listings() sets status = 'expired' on an active listing whose expires_at is in the past",
    async () => {
      const { data, error } = await admin
        .from("listing")
        .insert({
          ...newListing(),
          expires_at: new Date(Date.now() - 1000).toISOString(),
        })
        .select("id")
        .single();
      assert(!error, `unexpected error: ${error?.message}`);
      expiredListingId = data!.id as string;

      const { error: rpcError } = await admin.rpc("expire_listings");
      assert(!rpcError, `unexpected error: ${rpcError?.message}`);

      const { data: row, error: fetchError } = await admin
        .from("listing")
        .select("status")
        .eq("id", expiredListingId)
        .single();
      assert(!fetchError, `unexpected error: ${fetchError?.message}`);
      assert(
        row!.status === "expired",
        `expected status 'expired', got '${row!.status}'`,
      );
    },
  );

  let futureListingId = "";
  await check(
    "expire_listings() does not touch an active listing whose expires_at is in the future",
    async () => {
      const { data, error } = await admin
        .from("listing")
        .insert(newListing())
        .select("id")
        .single();
      assert(!error, `unexpected error: ${error?.message}`);
      futureListingId = data!.id as string;

      const { error: rpcError } = await admin.rpc("expire_listings");
      assert(!rpcError, `unexpected error: ${rpcError?.message}`);

      const { data: row, error: fetchError } = await admin
        .from("listing")
        .select("status")
        .eq("id", futureListingId)
        .single();
      assert(!fetchError, `unexpected error: ${fetchError?.message}`);
      assert(
        row!.status === "active",
        `expected status 'active', got '${row!.status}'`,
      );
    },
  );

  let reservedPastListingId = "";
  await check(
    "expire_listings() does not touch a reserved listing even if expires_at has passed",
    async () => {
      const { data, error } = await admin
        .from("listing")
        .insert({
          ...newListing(),
          status: "reserved",
          expires_at: new Date(Date.now() - 1000).toISOString(),
        })
        .select("id")
        .single();
      assert(!error, `unexpected error: ${error?.message}`);
      reservedPastListingId = data!.id as string;

      const { error: rpcError } = await admin.rpc("expire_listings");
      assert(!rpcError, `unexpected error: ${rpcError?.message}`);

      const { data: row, error: fetchError } = await admin
        .from("listing")
        .select("status")
        .eq("id", reservedPastListingId)
        .single();
      assert(!fetchError, `unexpected error: ${fetchError?.message}`);
      assert(
        row!.status === "reserved",
        `expected status 'reserved', got '${row!.status}'`,
      );
    },
  );

  let sellableListingId = "";
  await check(
    "seller A can create a listing for the mark_listing_sold checks",
    async () => {
      const { data, error } = await userA
        .from("listing")
        .insert(newListing())
        .select("id")
        .single();
      assert(!error, `unexpected error: ${error?.message}`);
      sellableListingId = data!.id as string;
    },
  );

  await check("mark_listing_sold by a non-owner is rejected", async () => {
    const { error } = await userB.rpc("mark_listing_sold", {
      p_listing_id: sellableListingId,
    });
    assert(!!error, "expected non-owner mark_listing_sold to be rejected");
  });

  await check("mark_listing_sold by the owner succeeds", async () => {
    const { error } = await userA.rpc("mark_listing_sold", {
      p_listing_id: sellableListingId,
    });
    assert(!error, `unexpected error: ${error?.message}`);

    const { data, error: fetchError } = await admin
      .from("listing")
      .select("status")
      .eq("id", sellableListingId)
      .single();
    assert(!fetchError, `unexpected error: ${fetchError?.message}`);
    assert(
      data!.status === "sold",
      `expected status 'sold', got '${data!.status}'`,
    );
  });

  await check(
    "updating expires_at beyond the allowed bound violates the CHECK constraint",
    async () => {
      const tooFar = new Date(
        Date.now() + 15 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const { error } = await userA
        .from("listing")
        .update({ expires_at: tooFar })
        .eq("id", sellableListingId);
      assert(!!error, "expected the bound CHECK to reject an expires_at 15 days out");
    },
  );

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
