---
name: "Chapter 4 — You-are-here dialog"
overview: "Clicking the basket marker opens the standard AppDialog with 'Du bist hier'; marker titles move to i18n."
todos:
  - id: dialog-kind
    content: "appDialog context: kind 'here' + openHereDialog"
    status: pending
  - id: marker
    content: "MapView user marker clickable via onUserMarkerClick; threaded through backgroundMap state"
    status: pending
  - id: content
    content: "YouAreHere component rendered by AppShellDialogHost; strings"
    status: pending
isProject: false
---

# Chapter 4 — You-are-here dialog

**Repo:** `eggs` · **Branch:** `feat/lean-ui-you-are-here` · **Status:** planned

**Depends on:** [3](03-active-signin.md) (order only) · **Architecture:** [../00-architecture.md](../00-architecture.md) §3 · **Rollout:** [../01-rollout.md](../01-rollout.md)

---

## Goal

The viewer's basket marker answers a click with the same dialog surface as everything else ([D8](../gaps-and-decisions.md)).

## Design decisions

- [`appDialog`](../../../src/features/shell/context/appDialog.tsx): add `{ kind: "here" }` to `OpenAppDialog` and `openHereDialog` to the context value and the default no-op value.
- [`AppShellDialogHost`](../../../src/features/shell/components/AppShell/AppShellDialogHost.tsx): `case "here": return <YouAreHere />`. New `features/shell/components/YouAreHere/YouAreHere.tsx` renders `<Text>{t("map.youAreHere")}</Text>`.
- Strings: `"map.youAreHere": "Du bist hier"`, plus `"map.userMarker.title"` and `"map.listingMarker.title"` replacing the English `title` props in [`MapView`](../../../src/features/browse/components/MapView/MapView.tsx).
- `MapView` gets `onUserMarkerClick?: () => void`; the user `Marker` sets `eventHandlers={{ click: onUserMarkerClick }}`. Thread it through `BackgroundMapState` ([`backgroundMap`](../../../src/features/shell/context/backgroundMap.tsx), `FALLBACK_STATE`, `usePublishBackgroundMap`) and [`BackgroundMapLayer`](../../../src/features/shell/components/AppShell/BackgroundMapLayer.tsx). `BuyerTab` publishes `openHereDialog` from `useAppDialog()`.
- Closing uses the existing `closeDialog`; selection state in `BuyerTab` is unaffected (only listing dialogs set it).

## Files

| Path | Layer | Change |
| --- | --- | --- |
| `src/features/shell/context/appDialog.tsx` | shell | New kind |
| `src/features/shell/components/YouAreHere/*` | shell | New |
| `src/features/shell/components/AppShell/{AppShellDialogHost,BackgroundMapLayer}.tsx` | shell | Wire |
| `src/features/shell/context/backgroundMap.tsx` | shell | New state field |
| `src/features/browse/components/MapView/MapView.tsx`, `src/features/browse/containers/BuyerTab.tsx` | browse | Click handler |
| `src/i18n/strings.de.ts` | i18n | Strings |

## Red tests

| Test | Asserts |
| --- | --- |
| **Happy:** `MapView` | Clicking the user marker calls `onUserMarkerClick` |
| **Happy:** `AppShellDialogHost` with `open = { kind: "here" }` | Dialog shows "Du bist hier" and closes via the close button |
| **Negative:** listing marker click | Does not call `onUserMarkerClick` |
| **Negative:** `showUserMarker=false` | No user marker, no handler call |
| **Negative:** no English marker titles remain | `grep` in test or source finds neither "Your location" nor "Egg listing" |

## Green

Implement; `./ci.sh`.

## Refactor gate

`MapView` stays ≤~100 LOC (extract the icon builders to `MapView/icons.tsx` if needed); no new conditional chain in `openDialog` beyond the existing `switch`. Report outcome.

## Git workflow

```bash
git checkout feat/plans-lean-ui && git pull
git checkout -b feat/lean-ui-you-are-here
```

```text
feat(browse): open a "Du bist hier" dialog from the user-location marker
```
