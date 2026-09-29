import type { ReactNode } from "react";
import { FloatingPanel } from "@chakra-ui/react";

import MapView from "./MapView";
import type { GeoPoint } from "../hooks/useGeolocation";

const BACKGROUND_CENTER: GeoPoint = { lat: 52.52, lng: 13.405 };

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <>
      <MapView
        center={BACKGROUND_CENTER}
        listings={[]}
        selectedId={null}
        onSelect={() => {}}
      />
      <FloatingPanel.Root defaultOpen draggable={false} resizable={false}>
        <FloatingPanel.Positioner
          style={{ top: "1.5rem", right: "1.5rem", left: "auto" }}
        >
          <FloatingPanel.Content
            maxW="sm"
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
