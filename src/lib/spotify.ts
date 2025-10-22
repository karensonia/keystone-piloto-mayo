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
type SearchTrackOptions = {
  limit?: number;
  market?: string;
};

export async function searchSpotifyTracks(query: string, token: string, options: SearchTrackOptions = {}): Promise<any[]> {
  const params = new URLSearchParams({
    q: query,
    type: "track",
    limit: String(options.limit ?? 10),
  });
  if (options.market) {
    params.set("market", options.market);
  }
  const response = await fetch(`https://api.spotify.com/v1/search?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data.tracks?.items || [];
}

export const CHILE_TOP_QUERIES = [
  "\"Todo Que Ver\" Jere Klein Katteyes",
  "\"Demoniaka\" Jere Klein",
  "\"Shiny\" Easykid",
  "\"Comando Estelar\" Germanini \"Lyon La F\" \"JhonAlex\" \"Nacho G Flow\"",
  "\"Quiero Decirte\" \"Abraham Mateo\" \"Ana Mena\"",
  "\"Golden\" HUNTR/X EJAE \"AUDREY NUNA\" \"REI AMI\"",
  "\"Ivonny Bonita\" \"KAROL G\"",
  "\"Gata Only\" \"Cris MJ\"",
  "\"Marisola\" \"Cris MJ\"",
  "\"Tu falta de querer\" \"Mon Laferte\"",
] as const;

export async function getChileTopTracks(
  token: string,
  limit: number = 10,
  onTrack?: (track: any, index: number) => void
): Promise<any[]> {
  // Precargamos manualmente el Top 10 chileno con búsquedas específicas.
  const collected: any[] = [];
  for (const fallbackQuery of CHILE_TOP_QUERIES) {
    const [track] = await searchSpotifyTracks(fallbackQuery, token, { limit: 1, market: "CL" });
    if (!track || !track.id) continue;
    if (collected.find((t) => t.id === track.id)) continue;
    collected.push(track);
    onTrack?.(track, collected.length - 1);
    if (collected.length >= limit) {
      return collected.slice(0, limit);
    }
  }

  // Último recurso: búsqueda genérica si no obtuvimos nada.
  const fallback = await searchSpotifyTracks("tag:viral", token, { limit: limit * 2, market: "CL" });
  for (const track of fallback) {
    if (!track || !track.id) continue;
    if (collected.find((t) => t.id === track.id)) continue;
    collected.push(track);
    onTrack?.(track, collected.length - 1);
    if (collected.length >= limit) break;
  }
  return collected.slice(0, limit);
}
