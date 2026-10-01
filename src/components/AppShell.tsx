import { Box, IconButton, Popover, Portal } from "@chakra-ui/react";

import ListingDetail from "@/features/listings/containers/ListingDetail";
import PostListing from "../routes/PostListing";
import AppDialog from "./AppDialog";
import {
  AppDialogProvider,
  useAppDialog,
  type OpenAppDialog,
} from "./AppDialogState";
import { BackgroundMapProvider, useBackgroundMapState } from "./BackgroundMap";
import MapView from "./MapView";
import RoleTabs from "./RoleTabs";

function DialogContent({
  open,
  onCreated,
}: {
  open: OpenAppDialog;
  onCreated: (listingId: string) => void;
}) {
  if (open !== null && open.kind === "post") {
    return <PostListing onCreated={onCreated} />;
  }
  if (open !== null && open.kind === "detail") {
    return <ListingDetail id={open.listingId} />;
  }
  return null;
}

function AppShellDialog() {
  const { open, closeDialog, openDetailDialog } = useAppDialog();

  return (
    <AppDialog open={open !== null} onClose={closeDialog}>
      <DialogContent open={open} onCreated={openDetailDialog} />
    </AppDialog>
  );
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

export default function AppShell() {
  return (
    <AppDialogProvider>
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
        <AppShellDialog />
      </BackgroundMapProvider>
    </AppDialogProvider>
  );
}
