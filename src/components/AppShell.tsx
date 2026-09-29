import type { ReactNode } from "react";
import { Box, FloatingPanel } from "@chakra-ui/react";

import MapView from "./MapView";
import type { GeoPoint } from "../hooks/useGeolocation";

const BACKGROUND_CENTER: GeoPoint = { lat: 52.52, lng: 13.405 };

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <>
      <Box position="fixed" inset="0" zIndex="0">
        <MapView
          center={BACKGROUND_CENTER}
          listings={[]}
          selectedId={null}
          onSelect={() => {}}
        />
      </Box>
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
    </>
  );
}
