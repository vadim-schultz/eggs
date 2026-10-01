import { IconButton, Popover } from "@chakra-ui/react";

export default function AppShellMenuTrigger() {
  return (
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
  );
}
