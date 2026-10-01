import { useState } from "react";
import { Box, Button, Field, Input, Text } from "@chakra-ui/react";

import { t } from "@/i18n/t";
import type { ConfirmedPin } from "@/features/location/types/place";

interface ManualPinFallbackProps {
  onConfirm: (pin: ConfirmedPin) => void;
}

/** Manual latitude/longitude entry when search returns no candidates. */
export default function ManualPinFallback({
  onConfirm,
}: ManualPinFallbackProps) {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  return (
    <Box>
      <Text>{t("post.location.noResults")}</Text>
      <Field.Root>
        <Field.Label>{t("post.location.manualLat.label")}</Field.Label>
        <Input value={lat} onChange={(e) => setLat(e.target.value)} />
      </Field.Root>
      <Field.Root>
        <Field.Label>{t("post.location.manualLng.label")}</Field.Label>
        <Input value={lng} onChange={(e) => setLng(e.target.value)} />
      </Field.Root>
      <Button
        onClick={() =>
          onConfirm({ lat: parseFloat(lat), lng: parseFloat(lng) })
        }
      >
        {t("post.location.useManualPin")}
      </Button>
    </Box>
  );
}
