// src/lib/spotify.ts
// Lógica para autenticar y buscar canciones en Spotify

const CLIENT_ID = "ad543d6b3b2e46ad8129e7da4102f40c";
const CLIENT_SECRET = "b36a41fd795c42049eaffdcc2272a640";

// Obtiene el token de acceso usando Client Credentials Flow
export async function getSpotifyToken(): Promise<string> {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
    },
    body: "grant_type=client_credentials",
  });
  const data = await response.json();
  return data.access_token;
}

// Busca canciones en Spotify
export async function searchSpotifyTracks(query: string, token: string): Promise<any[]> {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  return data.tracks?.items || [];
}
