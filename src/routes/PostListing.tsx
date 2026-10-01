import { useState } from "react";
import type { FormEvent } from "react";
import {
  Button,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";

import LocationPicker, {
  type ConfirmedPin,
} from "../components/LocationPicker";
import UnitSelect from "../components/UnitSelect";
import { t } from "../i18n/t";
import { supabase } from "../lib/supabaseClient";
import type {
  ListingErrorKey,
  ListingInput,
  ListingInputErrors,
} from "@/features/listings/types/listingInput";
import { validateListingInput } from "@/features/listings/utils/validateListingInput";

interface FormState {
  eggCount: string;
  unit: "dozen" | "each";
  priceEuros: string;
  locationQuery: string;
  pin: ConfirmedPin | null;
  note: string;
  contactNote: string;
}

const initialFormState: FormState = {
  eggCount: "",
  unit: "dozen",
  priceEuros: "",
  locationQuery: "",
  pin: null,
  note: "",
  contactNote: "",
};

function toListingInput(form: FormState): ListingInput {
  return {
    eggCount: Number(form.eggCount),
    unit: form.unit,
    priceCents: Math.round(Number(form.priceEuros || "0") * 100),
    locationLabel: form.locationQuery,
    note: form.note,
    contactNote: form.contactNote,
  };
}

function toCreateListingArgs(input: ListingInput, pin: ConfirmedPin) {
  return {
    p_egg_count: input.eggCount,
    p_unit: input.unit,
    p_price_cents: input.priceCents,
    p_lat: pin.lat,
    p_lng: pin.lng,
    p_location_label: input.locationLabel,
    p_note: input.note.trim() ? input.note.trim() : null,
    p_contact_note: input.contactNote,
  };
}

function FieldError({ errorKey }: { errorKey?: ListingErrorKey }) {
  if (!errorKey) return null;
  return <Text color="fg.error">{t(errorKey)}</Text>;
}

interface PostListingProps {
  onCreated: (listingId: string) => void;
}

export default function PostListing({ onCreated }: PostListingProps) {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState<ListingInputErrors>({});
  const [submitError, setSubmitError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
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
    const { data, error } = await supabase.rpc(
      "create_listing",
      toCreateListingArgs(input, form.pin),
    );
    setSubmitting(false);

    if (error || !data) {
      setSubmitError(true);
      return;
    }
    onCreated(data.id);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="4">
        <Heading>{t("post.heading")}</Heading>

        <label htmlFor="egg-count">{t("post.eggCount.label")}</label>
        <Input
          id="egg-count"
          type="number"
          value={form.eggCount}
          onChange={(e) => updateField("eggCount", e.target.value)}
        />
        <FieldError errorKey={errors.eggCount} />

        <UnitSelect
          value={form.unit}
          onChange={(value) => updateField("unit", value)}
        />

        <label htmlFor="price">{t("post.price.label")}</label>
        <Input
          id="price"
          type="number"
          value={form.priceEuros}
          onChange={(e) => updateField("priceEuros", e.target.value)}
        />
        <FieldError errorKey={errors.priceCents} />

        <LocationPicker
          query={form.locationQuery}
          onQueryChange={(value) => updateField("locationQuery", value)}
          confirmed={form.pin}
          onConfirm={(pin) => updateField("pin", pin)}
        />
        <FieldError errorKey={errors.locationLabel} />

        <label htmlFor="note">{t("post.note.label")}</label>
        <Textarea
          id="note"
          value={form.note}
          onChange={(e) => updateField("note", e.target.value)}
        />

        <label htmlFor="contact-note">{t("post.contactNote.label")}</label>
        <Textarea
          id="contact-note"
          value={form.contactNote}
          onChange={(e) => updateField("contactNote", e.target.value)}
        />
        <FieldError errorKey={errors.contactNote} />

        {submitError && <Text color="fg.error">{t("post.submitError")}</Text>}

        <Button type="submit" disabled={!form.pin || submitting}>
          {t("post.submit")}
        </Button>
      </Stack>
    </form>
  );
}
