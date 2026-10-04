import type { ReactNode } from "react";
import { Dialog, Portal, VStack } from "@chakra-ui/react";

import { floatingSurface } from "@/features/shell/theme/floatingSurface";
import DialogCloseButton from "./DialogCloseButton";

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
            <VStack align="stretch" gap="0">
              <DialogCloseButton />
              <Dialog.Body>{children}</Dialog.Body>
            </VStack>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
