import type { FormEvent } from "react";
import { Button, Field, Input, Stack, Text, Textarea } from "@chakra-ui/react";

import KeyValueRow from "@/components/ui/KeyValueRow";
import LocationPicker from "@/features/location/components/LocationPicker";
import type { ListingInputErrors } from "@/features/listings/types/listingInput";
import type { PostListingFormState } from "@/features/listings/utils/postListingMappers";
import { t } from "@/i18n/t";

import EggAmountControl from "./EggAmountControl";

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
  onRequestGeolocation?: () => void;
}

export default function PostListingForm({
  form,
  errors,
  submitError,
  submitting,
  onFieldChange,
  onSubmit,
  onRequestGeolocation,
}: PostListingFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <Stack gap="4">
        <EggAmountControl
          eggCount={form.eggCount}
          onEggCountChange={(value) => onFieldChange("eggCount", value)}
        />

        <KeyValueRow label={t("listing.price.label")}>
          <Field.Root invalid={Boolean(errors.priceCents)} w="full">
            <Input
              type="number"
              aria-label={t("post.price.label")}
              value={form.priceEuros}
              onChange={(event) =>
                onFieldChange("priceEuros", event.target.value)
              }
            />
            {errors.priceCents ? (
              <Field.ErrorText>{t(errors.priceCents)}</Field.ErrorText>
            ) : null}
          </Field.Root>
        </KeyValueRow>

        <KeyValueRow label={t("post.location.shortLabel")}>
          <LocationPicker
            query={form.locationQuery}
            onQueryChange={(value) => onFieldChange("locationQuery", value)}
            confirmed={form.pin}
            onConfirm={(pin) => onFieldChange("pin", pin)}
            onRequestGeolocation={onRequestGeolocation}
            embedInRow
          />
        </KeyValueRow>

        {errors.locationLabel ? (
          <Field.Root invalid>
            <Field.ErrorText>{t(errors.locationLabel)}</Field.ErrorText>
          </Field.Root>
        ) : null}

        <KeyValueRow label={t("post.contactNote.label")}>
          <Field.Root invalid={Boolean(errors.contactNote)} w="full">
            <Textarea
              aria-label={t("post.contactNote.label")}
              value={form.contactNote}
              onChange={(event) =>
                onFieldChange("contactNote", event.target.value)
              }
              rows={3}
            />
            {errors.contactNote ? (
              <Field.ErrorText>{t(errors.contactNote)}</Field.ErrorText>
            ) : null}
          </Field.Root>
        </KeyValueRow>

        {submitError && <Text color="fg.error">{t("post.submitError")}</Text>}

        <Button type="submit" disabled={!form.pin || submitting}>
          {t("post.submit")}
        </Button>
      </Stack>
    </form>
  );
}
