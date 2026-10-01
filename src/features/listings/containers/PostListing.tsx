import { useState } from "react";
import type { FormEvent } from "react";

import { PostListingForm } from "@/features/listings/components/PostListing";
import { createListing } from "@/features/listings/services/listingsApi";
import type { ListingInputErrors } from "@/features/listings/types/listingInput";
import {
  type PostListingFormState,
  toCreateListingArgs,
  toListingInput,
} from "@/features/listings/utils/postListingMappers";
import { validateListingInput } from "@/features/listings/utils/validateListingInput";

const initialFormState: PostListingFormState = {
  eggCount: "",
  unit: "dozen",
  priceEuros: "",
  locationQuery: "",
  pin: null,
  note: "",
  contactNote: "",
};

interface PostListingProps {
  onCreated: (listingId: string) => void;
}

export default function PostListing({ onCreated }: PostListingProps) {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState<ListingInputErrors>({});
  const [submitError, setSubmitError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function updateField<K extends keyof PostListingFormState>(
    key: K,
    value: PostListingFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form.pin) return;

    const input = toListingInput(form);
    const validationErrors = validateListingInput(input);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitError(false);
    setSubmitting(true);
    const result = await createListing(toCreateListingArgs(input, form.pin));
    setSubmitting(false);

    if ("error" in result) {
      setSubmitError(true);
      return;
    }
    onCreated(result.id);
  }

  return (
    <PostListingForm
      form={form}
      errors={errors}
      submitError={submitError}
      submitting={submitting}
      onFieldChange={updateField}
      onSubmit={handleSubmit}
    />
  );
}
