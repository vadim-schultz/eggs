import type { ChangeEvent } from "react";
import { Field, Input, Textarea } from "@chakra-ui/react";

import type { ListingErrorKey } from "@/features/listings/types/listingInput";
import { t } from "@/i18n/t";

type PostFormLabelKey =
  | "post.eggCount.label"
  | "post.price.label"
  | "post.note.label"
  | "post.contactNote.label";

interface PostFormFieldProps {
  labelKey: PostFormLabelKey;
  value: string;
  onChange: (value: string) => void;
  errorKey?: ListingErrorKey;
  multiline?: boolean;
  type?: "number" | "text";
}

/** Labeled post-listing control with Chakra field error text. */
export default function PostFormField({
  labelKey,
  value,
  onChange,
  errorKey,
  multiline = false,
  type = "text",
}: PostFormFieldProps) {
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onChange(event.target.value);
  };

  return (
    <Field.Root invalid={Boolean(errorKey)}>
      <Field.Label>{t(labelKey)}</Field.Label>
      {multiline ? (
        <Textarea value={value} onChange={handleChange} />
      ) : (
        <Input type={type} value={value} onChange={handleChange} />
      )}
      {errorKey ? <Field.ErrorText>{t(errorKey)}</Field.ErrorText> : null}
    </Field.Root>
  );
}
