import type { FormEvent } from "react";
import {
  Button,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";

import LocationPicker from "@/features/location/components/LocationPicker";
import UnitSelect from "@/features/listings/components/UnitSelect";
import type { ListingInputErrors } from "@/features/listings/types/listingInput";
import type { PostListingFormState } from "@/features/listings/utils/postListingMappers";
import { t } from "@/i18n/t";

import FieldError from "./FieldError";

export interface PostListingFormProps {
  form: PostListingFormState;
  errors: ListingInputErrors;
  submitError: boolean;
  submitting: boolean;
  onFieldChange: <K extends keyof PostListingFormState>(
    key: K,
    value: PostListingFormState[K],
  ) => void;
  onSubmit: (event: FormEvent) => void;
}

export default function PostListingForm({
  form,
  errors,
  submitError,
  submitting,
  onFieldChange,
  onSubmit,
}: PostListingFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <Stack gap="4">
        <Heading>{t("post.heading")}</Heading>

        <label htmlFor="egg-count">{t("post.eggCount.label")}</label>
        <Input
          id="egg-count"
          type="number"
          value={form.eggCount}
          onChange={(e) => onFieldChange("eggCount", e.target.value)}
        />
        <FieldError errorKey={errors.eggCount} />

        <UnitSelect
          value={form.unit}
          onChange={(value) => onFieldChange("unit", value)}
        />

        <label htmlFor="price">{t("post.price.label")}</label>
        <Input
          id="price"
          type="number"
          value={form.priceEuros}
          onChange={(e) => onFieldChange("priceEuros", e.target.value)}
        />
        <FieldError errorKey={errors.priceCents} />

        <LocationPicker
          query={form.locationQuery}
          onQueryChange={(value) => onFieldChange("locationQuery", value)}
          confirmed={form.pin}
          onConfirm={(pin) => onFieldChange("pin", pin)}
        />
        <FieldError errorKey={errors.locationLabel} />

        <label htmlFor="note">{t("post.note.label")}</label>
        <Textarea
          id="note"
          value={form.note}
          onChange={(e) => onFieldChange("note", e.target.value)}
        />

        <label htmlFor="contact-note">{t("post.contactNote.label")}</label>
        <Textarea
          id="contact-note"
          value={form.contactNote}
          onChange={(e) => onFieldChange("contactNote", e.target.value)}
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
