import { EmptyState, Icon, VStack } from "@chakra-ui/react";
import { TbBasketOff } from "react-icons/tb";

import { t } from "@/i18n/t";

export default function BrowseEmptyState() {
  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <VStack gap="2">
          <EmptyState.Indicator>
            <Icon as={TbBasketOff} boxSize="8" />
          </EmptyState.Indicator>
          <EmptyState.Title>{t("home.empty")}</EmptyState.Title>
        </VStack>
      </EmptyState.Content>
    </EmptyState.Root>
  );
}
