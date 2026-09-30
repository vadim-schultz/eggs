import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useSession } from "../auth/useSession";

export type OpenAppDialog =
  { kind: "post" } | { kind: "detail"; listingId: string } | null;

interface AppDialogContextValue {
  open: OpenAppDialog;
  openPostDialog: () => void;
  openDetailDialog: (listingId: string) => void;
  closeDialog: () => void;
}

const noop = () => {};

const AppDialogContext = createContext<AppDialogContextValue>({
  open: null,
  openPostDialog: noop,
  openDetailDialog: noop,
  closeDialog: noop,
});

function useDeepLinkDialog(setOpen: (open: OpenAppDialog) => void) {
  const { id: listingId } = useParams();
  const { pathname } = useLocation();
  const { session } = useSession();

  useEffect(() => {
    if (listingId) {
      setOpen({ kind: "detail", listingId });
    } else if (pathname === "/post" && session) {
      setOpen({ kind: "post" });
    }
  }, [listingId, pathname, session, setOpen]);
}

export function AppDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<OpenAppDialog>(null);
  const navigate = useNavigate();
  useDeepLinkDialog(setOpen);

  const value: AppDialogContextValue = {
    open,
    openPostDialog: () => setOpen({ kind: "post" }),
    openDetailDialog: (listingId) => setOpen({ kind: "detail", listingId }),
    closeDialog: () => {
      setOpen(null);
      navigate("/", { replace: true });
    },
  };

  return (
    <AppDialogContext.Provider value={value}>
      {children}
    </AppDialogContext.Provider>
  );
}

export function useAppDialog(): AppDialogContextValue {
  return useContext(AppDialogContext);
}
