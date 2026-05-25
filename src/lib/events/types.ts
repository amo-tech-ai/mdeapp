export type PublicEventTicket = {
  id: string;
  name: string;
  priceCents: number;
  currency: string;
  qtyTotal: number;
  qtySold: number;
  position: number;
};

export type PublicEventDetail = {
  id: string;
  slug: string | null;
  name: string;
  description: string | null;
  address: string | null;
  city: string | null;
  startsAt: string;
  endsAt: string | null;
  imageUrl: string | null;
  currency: string | null;
  latitude: number | null;
  longitude: number | null;
  tickets: PublicEventTicket[];
};
