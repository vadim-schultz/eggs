/** A geocoded place suggestion from search. */
export interface PlaceCandidate {
  label: string;
  lat: number;
  lng: number;
}

/** User-confirmed map coordinates. */
export interface ConfirmedPin {
  lat: number;
  lng: number;
}
