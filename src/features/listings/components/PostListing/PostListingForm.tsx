import type { FormEvent } from "react";
import { Button, Field, Stack, Text, Textarea } from "@chakra-ui/react";

import KeyValueRow from "@/components/ui/KeyValueRow";
import LocationPicker from "@/features/location/components/LocationPicker";
import type { ListingInputErrors } from "@/features/listings/types/listingInput";
import type { PostListingFormState } from "@/features/listings/utils/postListingMappers";
import { t } from "@/i18n/t";

import EggAmountControl from "./EggAmountControl";
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
        <KeyValueRow label={t("listing.count.label")}>
          <EggAmountControl
            unit={form.unit}
            eggCount={form.eggCount}
            onUnitChange={(value) => onFieldChange("unit", value)}
            onEggCountChange={(value) => onFieldChange("eggCount", value)}
          />
        </KeyValueRow>

        <PostFormField
          labelKey="post.price.label"
          type="number"
          value={form.priceEuros}
          errorKey={errors.priceCents}
          onChange={(value) => onFieldChange("priceEuros", value)}
        />

        <LocationPicker
          query={form.locationQuery}
          onQueryChange={(value) => onFieldChange("locationQuery", value)}
          confirmed={form.pin}
          onConfirm={(pin) => onFieldChange("pin", pin)}
          onRequestGeolocation={onRequestGeolocation}
        />

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
