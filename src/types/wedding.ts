export interface GuestInfo {
  name: string;
  mehandiMales: number;
  mehandiFemales: number;
  lunchMales: number;
  lunchFemales: number;
  submitted: boolean;
  specialNotes?: string;
}

export interface AdminSettings {
  coupleNames: {
    bride: string;
    groom: string;
  };
  tagline: string;
  weddingDate: string; // ISO date string e.g. "2026-11-28T18:00:00"
  weddingDateFormatted: string;
  venueName: string;
  venueAddress: string;
  destinationCity: string;
  destinationState: string;
  destinationCountry: string;
  totalInvitedCap: number;
  maxMehandiInvited: number;
  maxLunchInvited: number;
  warmWishesMessage: string;
  familyNames: string;
  contactRsvp: string;
}

export interface WeddingEvent {
  id: string;
  title: string;
  subTitle: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  dressCode: string;
  colorPalette: { name: string; hex: string }[];
  highlights: string[];
  icon: string;
  bgImage: string;
}
