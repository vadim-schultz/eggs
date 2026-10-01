import type { ReactNode } from "react";
import { CloseButton, Dialog, Portal } from "@chakra-ui/react";

import { t } from "@/i18n/t";

interface AppDialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function AppDialog({ open, onClose, children }: AppDialogProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details) => {
        if (!details.open) onClose();
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.CloseTrigger asChild>
              <CloseButton
                aria-label={t("dialog.close")}
                size="sm"
                position="absolute"
                top="2"
                insetEnd="2"
              />
            </Dialog.CloseTrigger>
            <Dialog.Body>{children}</Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
