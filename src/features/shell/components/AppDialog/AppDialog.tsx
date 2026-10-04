import type { ReactNode } from "react";
import { CloseButton, Dialog, Portal } from "@chakra-ui/react";

import { floatingSurface } from "@/features/shell/theme/floatingSurface";
import { t } from "@/i18n/t";

const { bg, borderWidth, borderColor, boxShadow } = floatingSurface;
const dialogSurface = {
  bg,
  borderWidth,
  borderColor,
  boxShadow,
  rounded: "2xl",
} as const;

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
          <Dialog.Content {...dialogSurface}>
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
