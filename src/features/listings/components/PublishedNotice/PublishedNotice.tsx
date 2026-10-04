import { Heading, Stack, Text } from "@chakra-ui/react";

import { t } from "@/i18n/t";

export default function PublishedNotice() {
  return (
    <Stack gap="2">
      <Heading size="md">{t("published.title")}</Heading>
      <Text>{t("published.expires")}</Text>
    </Stack>
  );
}
