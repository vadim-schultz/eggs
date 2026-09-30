import type { ReactNode } from "react";
import { Box, FloatingPanel } from "@chakra-ui/react";

import { BackgroundMapProvider, useBackgroundMapState } from "./BackgroundMap";
import MapView from "./MapView";

interface AppShellProps {
  children: ReactNode;
}

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

export default function AppShell({ children }: AppShellProps) {
  return (
    <BackgroundMapProvider>
      <BackgroundMap />
      <FloatingPanel.Root defaultOpen draggable={false} resizable={false}>
        <FloatingPanel.Positioner
          style={{ top: "1.5rem", right: "1.5rem", left: "auto" }}
        >
          <FloatingPanel.Content
            maxW="sm"
            maxH="calc(100vh - 3rem)"
            style={{ width: "auto", height: "auto" }}
          >
            <FloatingPanel.Header>
              <FloatingPanel.Title fontSize="4xl" textAlign="center">
                Eierbauer
              </FloatingPanel.Title>
            </FloatingPanel.Header>
            <FloatingPanel.Body>{children}</FloatingPanel.Body>
          </FloatingPanel.Content>
        </FloatingPanel.Positioner>
      </FloatingPanel.Root>
    </BackgroundMapProvider>
  );
}
