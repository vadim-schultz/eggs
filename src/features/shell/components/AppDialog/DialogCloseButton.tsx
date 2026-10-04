import { CloseButton, Dialog, Flex } from "@chakra-ui/react";

import { floatingSurface } from "@/features/shell/theme/floatingSurface";
import { t } from "@/i18n/t";

const { color, bg, borderWidth, borderColor, boxShadow } = floatingSurface;

/** Big, always-outlined sticker button alone in its own row. */
export default function DialogCloseButton() {
  return (
    <Flex justify="flex-end" p="2">
      <Dialog.CloseTrigger asChild position="static">
        <CloseButton
          aria-label={t("dialog.close")}
          color={color}
          bg={bg}
          borderWidth={borderWidth}
          borderStyle="solid"
          borderColor={borderColor}
          boxShadow={boxShadow}
          rounded="full"
          minW="48px"
          minH="48px"
          _active={{ transform: "translate(2px, 2px)", boxShadow: "none" }}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </CloseButton>
      </Dialog.CloseTrigger>
    </Flex>
  );
}
