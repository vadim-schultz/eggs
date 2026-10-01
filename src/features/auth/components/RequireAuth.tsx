import { useEffect } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { toaster } from "@/components/ui/toaster";
import { useSession } from "@/features/auth/hooks/useSession";
import { t } from "@/i18n/t";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading } = useSession();
  const signedOut = !loading && !session;

  useEffect(() => {
    if (signedOut) {
      toaster.create({
        description: t("auth.signInRequired"),
        type: "warning",
      });
    }
  }, [signedOut]);

  if (loading) return null;
  if (signedOut) return <Navigate to="/" replace />;

  return <>{children}</>;
}
