const PLAYLIST_ID = import.meta.env.VITE_SPOTIFY_PLAYLIST_ID as string | undefined;
const REFRESH_TOKEN = import.meta.env.VITE_SPOTIFY_REFRESH_TOKEN as string | undefined;
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET as string;

// ── Playlist write (sigue usando refresh token desde el cliente) ──────────────

async function getAccessTokenFromRefreshToken(): Promise<string> {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: REFRESH_TOKEN! }),
  });
  const data = await response.json();
  if (!data.access_token) throw new Error("No access_token in refresh response");
  return data.access_token;
}

export async function addTrackToSpotifyPlaylist(trackId: string): Promise<void> {
  if (!PLAYLIST_ID || !REFRESH_TOKEN) return;
  const token = await getAccessTokenFromRefreshToken();
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

// ── Search y top tracks → pasan por los serverless de Vercel ─────────────────

export async function getSpotifyToken(): Promise<string> {
  const res = await fetch("/api/spotify-token");
  const data = await res.json();
  return data.token;
}

export async function searchSpotifyTracks(query: string, _token: string, options: { limit?: number; market?: string } = {}): Promise<any[]> {
  const params = new URLSearchParams({ q: query, limit: String(options.limit ?? 10) });
  if (options.market) params.set("market", options.market);
  const res = await fetch(`/api/spotify-search?${params}`);
  return res.json();
}

export async function getChileTopTracks(_token: string, limit: number = 50): Promise<any[]> {
  const res = await fetch(`/api/spotify-top?limit=${limit}`);
  return res.json();
}
