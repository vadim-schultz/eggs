import { IconButton, Popover } from "@chakra-ui/react";
import { TbMenu2 } from "react-icons/tb";

import { floatingSurface } from "@/features/shell/theme/floatingSurface";

export default function AppShellMenuTrigger() {
  return (
    <Popover.Trigger asChild>
      <IconButton
        aria-label="Menü öffnen"
        position="fixed"
        top="1.5rem"
        right="1.5rem"
        zIndex="1"
        {...floatingSurface}
        boxSize="52px"
        minW="52px"
        padding="0"
        fontSize="28px"
      >
        <TbMenu2 />
      </IconButton>
    </Popover.Trigger>
  );
}
