import { Box, IconButton, Popover, Portal } from "@chakra-ui/react";

import { BackgroundMapProvider, useBackgroundMapState } from "./BackgroundMap";
import MapView from "./MapView";
import RoleTabs from "./RoleTabs";

function BackgroundMap() {
  const { center, listings, selectedId, onSelect } = useBackgroundMapState();

  return (
    <Box position="fixed" inset="0" zIndex="0">
      <MapView
        center={center}
        listings={listings}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    </Box>
  );
}

export default function AppShell() {
  return (
    <BackgroundMapProvider>
      <BackgroundMap />
      <Popover.Root positioning={{ placement: "bottom-end" }}>
        <Popover.Trigger asChild>
          <IconButton
            aria-label="Menü"
            position="fixed"
            top="1.5rem"
            right="1.5rem"
            zIndex="1"
            rounded="full"
            boxSize="52px"
            minW="52px"
            padding="0"
            fontSize="46px"
            lineHeight="1"
            bg="white"
            borderWidth="1px"
            borderColor="gray.200"
            boxShadow="sm"
          >
            🪺
          </IconButton>
        </Popover.Trigger>
        <Portal>
          <Popover.Positioner>
            <Popover.Content maxW="sm" maxH="calc(100vh - 3rem)">
              <Popover.Arrow />
              <Popover.Header>
                <Popover.Title fontSize="4xl" textAlign="center">
                  Eierbauer
                </Popover.Title>
              </Popover.Header>
              <Popover.Body overflowY="auto">
                <RoleTabs />
              </Popover.Body>
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>
    </BackgroundMapProvider>
  );
}
