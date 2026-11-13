"use client";

import { createContext, useContext, type ReactNode } from "react";
import { VENUES, type Venue } from "@/lib/venues";

type Ctx = { venue: Venue; rating: number | null };

const VenueContext = createContext<Ctx>({ venue: VENUES["220"], rating: null });

/** Задаёт заведение (и его палитру) для всех компонентов внутри. */
export function VenueProvider({
  venue,
  rating = null,
  children,
}: {
  /** Данные заведения — из базы (lib/content.ts) или значения по умолчанию */
  venue: Venue;
  rating?: number | null;
  children: ReactNode;
}) {
  return (
    <VenueContext.Provider value={{ venue, rating }}>
      <div className={venue.theme || undefined}>{children}</div>
    </VenueContext.Provider>
  );
}

export const useVenue = () => useContext(VenueContext).venue;
export const useVenueRating = () => useContext(VenueContext).rating;
