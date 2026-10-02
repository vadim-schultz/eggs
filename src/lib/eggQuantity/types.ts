/** Visual state of one decade slot in the egg quantity row. */
export type SlotKind = "empty" | "outline" | "filled";

/** One of ten slots describing which egg icon (if any) appears at that index. */
export interface Slot {
  kind: SlotKind;
  index: number;
}
