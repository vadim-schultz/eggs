import { Popover, Portal } from "@chakra-ui/react";

import { floatingSurface } from "@/features/shell/theme/floatingSurface";

import RoleTabs from "../RoleTabs";

export default function AppShellPanel() {
  return (
    <Portal>
      <Popover.Positioner>
        <Popover.Content
          {...floatingSurface}
          rounded="2xl"
          maxW="sm"
          maxH="calc(100vh - 3rem)"
        >
          <Popover.Arrow />
          <Popover.Header>
            <Popover.Title
              fontSize="4xl"
              fontFamily="heading"
              textAlign="center"
            >
              Eierbauer
            </Popover.Title>
          </Popover.Header>
          <Popover.Body overflowY="auto">
            <RoleTabs />
          </Popover.Body>
        </Popover.Content>
      </Popover.Positioner>
    </Portal>
  );
}
