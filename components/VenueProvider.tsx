"use client";

import { createContext, useContext, type ReactNode } from "react";
import { VENUES, type Venue, type VenueId } from "@/lib/venues";

type Ctx = { venue: Venue; rating: number | null };

const VenueContext = createContext<Ctx>({ venue: VENUES["220"], rating: null });

/** Задаёт заведение (и его палитру) для всех компонентов внутри. */
export function VenueProvider({
  id,
  rating = null,
  children,
}: {
  id: VenueId;
  rating?: number | null;
  children: ReactNode;
}) {
  const venue = VENUES[id];
  return (
    <VenueContext.Provider value={{ venue, rating }}>
      <div className={venue.theme || undefined}>{children}</div>
    </VenueContext.Provider>
  );
}

export const useVenue = () => useContext(VenueContext).venue;
export const useVenueRating = () => useContext(VenueContext).rating;
