import type { FormEvent } from "react";
import { Button, Field, Heading, Stack, Text } from "@chakra-ui/react";

import LocationPicker from "@/features/location/components/LocationPicker";
import UnitSelect from "@/features/listings/components/UnitSelect";
import type { ListingInputErrors } from "@/features/listings/types/listingInput";
import type { PostListingFormState } from "@/features/listings/utils/postListingMappers";
import { t } from "@/i18n/t";

import PostFormField from "./PostFormField";

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
  function changeText(key: "eggCount" | "priceEuros" | "note" | "contactNote") {
    return (value: string) => onFieldChange(key, value);
  }

  return (
    <form onSubmit={onSubmit}>
      <Stack gap="4">
        <Heading>{t("post.heading")}</Heading>

        <PostFormField
          labelKey="post.eggCount.label"
          type="number"
          value={form.eggCount}
          errorKey={errors.eggCount}
          onChange={changeText("eggCount")}
        />

        <UnitSelect
          value={form.unit}
          onChange={(value) => onFieldChange("unit", value)}
        />

        <PostFormField
          labelKey="post.price.label"
          type="number"
          value={form.priceEuros}
          errorKey={errors.priceCents}
          onChange={changeText("priceEuros")}
        />

        <LocationPicker
          query={form.locationQuery}
          onQueryChange={(value) => onFieldChange("locationQuery", value)}
          confirmed={form.pin}
          onConfirm={(pin) => onFieldChange("pin", pin)}
        />
        {errors.locationLabel ? (
          <Field.Root invalid>
            <Field.ErrorText>{t(errors.locationLabel)}</Field.ErrorText>
          </Field.Root>
        ) : null}

        <PostFormField
          labelKey="post.note.label"
          value={form.note}
          multiline
          onChange={changeText("note")}
        />

        <PostFormField
          labelKey="post.contactNote.label"
          value={form.contactNote}
          errorKey={errors.contactNote}
          multiline
          onChange={changeText("contactNote")}
        />

        {submitError && <Text color="fg.error">{t("post.submitError")}</Text>}

        <Button type="submit" disabled={!form.pin || submitting}>
          {t("post.submit")}
        </Button>
      </Stack>
    </form>
  );
}
