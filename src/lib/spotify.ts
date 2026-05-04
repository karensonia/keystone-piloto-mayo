const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET as string;
const PLAYLIST_ID = import.meta.env.VITE_SPOTIFY_PLAYLIST_ID as string | undefined;
const REFRESH_TOKEN = import.meta.env.VITE_SPOTIFY_REFRESH_TOKEN as string | undefined;


export async function getAccessTokenFromRefreshToken(refreshToken: string): Promise<string> {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
  });
  const data = await response.json();
  if (!data.access_token) throw new Error("No access_token in refresh response");
  return data.access_token;
}

export async function addTrackToSpotifyPlaylist(trackId: string): Promise<void> {
  if (!PLAYLIST_ID || !REFRESH_TOKEN) return;
  const token = await getAccessTokenFromRefreshToken(REFRESH_TOKEN);
  const response = await fetch(`https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ uris: [`spotify:track:${trackId}`] }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Spotify playlist add failed: ${JSON.stringify(err)}`);
  }
}

export async function getSpotifyToken(): Promise<string> {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
    },
    body: "grant_type=client_credentials",
  });
  const data = await response.json();
  return data.access_token;
}

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
  if (options.market) params.set("market", options.market);

  const response = await fetch(`https://api.spotify.com/v1/search?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  return data.tracks?.items || [];
}

const TOP_ARTISTS_CL = [
  "Bad Bunny", "Karol G", "Feid", "Rauw Alejandro", "Peso Pluma",
  "Cris MJ", "Paloma Mami", "Mon Laferte", "Shakira", "Maluma",
  "Myke Towers", "Ozuna", "Duki", "Bizarrap", "Nicki Nicole",
  "J Balvin", "Anuel AA", "Tiago PZK", "Paulo Londra", "Polima Westcoast",
  "Jere Klein", "Harry Nach", "Young Cister", "WOS", "Lunay",
];

export async function getChileTopTracks(token: string, limit: number = 50): Promise<any[]> {
  const perArtist = Math.ceil(limit / TOP_ARTISTS_CL.length) + 1;

  const results = await Promise.all(
    TOP_ARTISTS_CL.map((artist) =>
      searchSpotifyTracks(`artist:"${artist}"`, token, { limit: perArtist, market: "CL" })
        .catch(() => [] as any[])
    )
  );

  const seen = new Set<string>();
  const tracks: any[] = [];

  for (const artistTracks of results) {
    for (const track of artistTracks) {
      if (!track?.id || seen.has(track.id)) continue;
      seen.add(track.id);
      tracks.push(track);
      if (tracks.length >= limit) return tracks;
    }
  }

  return tracks;
}
