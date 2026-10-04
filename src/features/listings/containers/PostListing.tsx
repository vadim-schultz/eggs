import { useState } from "react";
import type { FormEvent } from "react";

import EggBurst from "@/components/ui/EggBurst";
import { PostListingForm } from "@/features/listings/components/PostListing";
import { useSellerGeolocate } from "@/features/listings/hooks/useSellerGeolocate";
import { createListing } from "@/features/listings/services/listingsApi";
import type { ListingInputErrors } from "@/features/listings/types/listingInput";
import {
  type PostListingFormState,
  toCreateListingArgs,
  toListingInput,
} from "@/features/listings/utils/postListingMappers";
import { validateListingInput } from "@/features/listings/utils/validateListingInput";
import { useAsyncAction } from "@/lib/async/useAsyncAction";

const initialFormState: PostListingFormState = {
  eggCount: 1,
  unit: "each",
  priceEuros: "",
  locationQuery: "",
  pin: null,
  contactNote: "",
};

interface PostListingProps {
  onCreated: (listingId: string) => void;
}

export default function PostListing({ onCreated }: PostListingProps) {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState<ListingInputErrors>({});
  const [burst, setBurst] = useState(false);
  const { busy: submitting, error: submitError, run } = useAsyncAction();

  function updateField<K extends keyof PostListingFormState>(
    key: K,
    value: PostListingFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  const requestGeolocation = useSellerGeolocate(updateField);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const pin = form.pin;
    if (!pin) return;

    const input = toListingInput(form);
    const validationErrors = validateListingInput(input);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    await run(async () => {
      const result = await createListing(toCreateListingArgs(input, pin));
      if ("error" in result) return { ok: false };
      setBurst(true);
      onCreated(result.id);
      return { ok: true };
    });
  }

  return (
    <>
      <PostListingForm
        form={form}
        errors={errors}
        submitError={submitError}
        submitting={submitting}
        onFieldChange={updateField}
        onSubmit={handleSubmit}
        onRequestGeolocation={requestGeolocation}
      />
      <EggBurst active={burst} count={6} onDone={() => setBurst(false)} />
    </>
  );
}
