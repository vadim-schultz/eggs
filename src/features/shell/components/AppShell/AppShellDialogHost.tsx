import type { ReactNode } from "react";

import ListingDetail from "@/features/listings/containers/ListingDetail";
import PostListing from "@/features/listings/containers/PostListing";
import AppDialog from "@/features/shell/components/AppDialog";
import {
  useAppDialog,
  type OpenAppDialog,
} from "@/features/shell/context/appDialog";

type CreatedHandler = (listingId: string) => void;
type OpenDialog = Exclude<OpenAppDialog, null>;

function openDialog(open: OpenDialog, onCreated: CreatedHandler): ReactNode {
  switch (open.kind) {
    case "post":
      return <PostListing onCreated={onCreated} />;
    case "detail":
      return <ListingDetail id={open.listingId} />;
  }
}

function dialogContent(
  open: OpenAppDialog,
  onCreated: CreatedHandler,
): ReactNode {
  if (open === null) return null;
  return openDialog(open, onCreated);
}

export default function AppShellDialogHost() {
  const { open, closeDialog, openDetailDialog } = useAppDialog();

  return (
    <AppDialog open={open !== null} onClose={closeDialog}>
      {dialogContent(open, openDetailDialog)}
    </AppDialog>
  );
}
