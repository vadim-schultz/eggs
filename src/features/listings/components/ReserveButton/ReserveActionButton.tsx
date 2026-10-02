import { Button, Text } from "@chakra-ui/react";

import { t } from "@/i18n/t";

interface ReserveActionButtonProps {
  label: string;
  busy: boolean;
  error: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export default function ReserveActionButton({
  label,
  busy,
  error,
  disabled = false,
  onClick,
}: ReserveActionButtonProps) {
  return (
    <>
      <Button disabled={busy || disabled} onClick={onClick}>
        {label}
      </Button>
      {error && <Text color="fg.error">{t("reserve.error")}</Text>}
    </>
  );
}
