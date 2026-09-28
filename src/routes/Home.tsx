import { Heading } from "@chakra-ui/react";

import { t } from "../i18n/t";

export default function Home() {
  return <Heading>{t("common.comingSoon")}</Heading>;
}
