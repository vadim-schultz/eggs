import { Button, Text } from "@chakra-ui/react";

import { t } from "../../i18n/t";

interface ReserveActionButtonProps {
  label: string;
  busy: boolean;
  error: boolean;
  onClick: () => void;
}

export default function ReserveActionButton({
  label,
  busy,
  error,
  onClick,
}: ReserveActionButtonProps) {
  return (
    <>
      <Button disabled={busy} onClick={onClick}>
        {label}
      </Button>
      {error && <Text color="fg.error">{t("reserve.error")}</Text>}
    </>
  );
}
