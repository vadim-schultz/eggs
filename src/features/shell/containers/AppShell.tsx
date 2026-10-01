import { Popover } from "@chakra-ui/react";

import {
  AppShellDialogHost,
  AppShellMenuTrigger,
  AppShellPanel,
  BackgroundMapLayer,
} from "@/features/shell/components/AppShell";
import { AppDialogProvider } from "@/features/shell/context/appDialog";
import { BackgroundMapProvider } from "@/features/shell/context/backgroundMap";

export default function AppShell() {
  return (
    <AppDialogProvider>
      <BackgroundMapProvider>
        <BackgroundMapLayer />
        <Popover.Root positioning={{ placement: "bottom-end" }}>
          <AppShellMenuTrigger />
          <AppShellPanel />
        </Popover.Root>
        <AppShellDialogHost />
      </BackgroundMapProvider>
    </AppDialogProvider>
  );
}
