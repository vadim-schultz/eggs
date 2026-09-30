import { Tabs, Text } from "@chakra-ui/react";

import { t } from "../i18n/t";
import BuyerTab from "./BuyerTab";

export default function RoleTabs() {
  return (
    <Tabs.Root variant="enclosed" defaultValue="buyer">
      <Tabs.List>
        <Tabs.Trigger value="farmer">🧑‍🌾 {t("tabs.farmer")}</Tabs.Trigger>
        <Tabs.Trigger value="buyer">👨🏻‍💼 {t("tabs.buyer")}</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="farmer">
        <Text>{t("common.comingSoon")}</Text>
      </Tabs.Content>
      <Tabs.Content value="buyer">
        <BuyerTab />
      </Tabs.Content>
    </Tabs.Root>
  );
}
