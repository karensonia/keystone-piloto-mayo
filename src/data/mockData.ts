export interface Venue {
  id: string;
  name: string;
  visitors: number;
  songsInQueue: number;
}

export const mockVenue: Venue = {
  id: "1",
  name: "Siete Negronis",
  visitors: 236,
  songsInQueue: 143,
};
