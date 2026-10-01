import { Tabs } from "@chakra-ui/react";

import BuyerTab from "@/features/browse/containers/BuyerTab";
import { t } from "@/i18n/t";

import FarmerTab from "./FarmerTab";

export default function RoleTabs() {
  return (
    <Tabs.Root variant="enclosed" defaultValue="buyer">
      <Tabs.List>
        <Tabs.Trigger value="farmer">🧑‍🌾 {t("tabs.farmer")}</Tabs.Trigger>
        <Tabs.Trigger value="buyer">👨🏻‍💼 {t("tabs.buyer")}</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="farmer">
        <FarmerTab />
      </Tabs.Content>
      <Tabs.Content value="buyer">
        <BuyerTab />
      </Tabs.Content>
    </Tabs.Root>
  );
}
