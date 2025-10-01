export interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
}

export interface Venue {
  id: string;
  name: string;
  visitors: number;
  songsInQueue: number;
}

export const mockSongs: Song[] = [
  { id: "1", title: "Urgent Siege", artist: "The Rockers", genre: "Rock" },
  { id: "2", title: "Damned Anthem", artist: "Electric Storm", genre: "Electrónica" },
  { id: "3", title: "Believer", artist: "Imagine Dragons", genre: "Pop Rock" },
  { id: "4", title: "Tití Me Preguntó", artist: "Bad Bunny", genre: "Reggaetón" },
  { id: "5", title: "Renaissance", artist: "Beyoncé", genre: "Pop" },
  { id: "6", title: "Ivar's Revenge", artist: "Podval Capella", genre: "Folk" },
  { id: "7", title: "As It Was", artist: "Harry Styles", genre: "Pop" },
  { id: "8", title: "Un Verano Sin Ti", artist: "Bad Bunny", genre: "Reggaetón" },
  { id: "9", title: "Efecto", artist: "Bad Bunny", genre: "Reggaetón" },
  { id: "10", title: "Radioactive", artist: "Imagine Dragons", genre: "Rock" },
];

export const topSongs: Song[] = [
  { id: "11", title: "Thunder", artist: "Imagine Dragons", genre: "Pop Rock" },
  { id: "12", title: "Moscow Mule", artist: "Bad Bunny", genre: "Reggaetón" },
  { id: "13", title: "Break My Soul", artist: "Beyoncé", genre: "Pop" },
  { id: "14", title: "Nikes", artist: "Podval Capella", genre: "Folk" },
  { id: "15", title: "Anti-Hero", artist: "Taylor Swift", genre: "Pop" },
];

export const mockVenue: Venue = {
  id: "1",
  name: "Siete Negronis",
  visitors: 236,
  songsInQueue: 143,
};
