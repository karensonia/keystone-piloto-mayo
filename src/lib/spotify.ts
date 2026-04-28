const CLIENT_ID = "88f91fc4c45c4dacaf7fa4d7a911c480";
const CLIENT_SECRET = "4fca9f0c1592478d80744a717537510e";

const CHILE_TOP50_PLAYLIST_ID = "37i9dQZEVXbL0GavIqMTeb";

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

export async function getChileTopTracks(token: string, limit: number = 50): Promise<any[]> {
  const params = new URLSearchParams({
    limit: String(Math.min(limit, 50)),
    market: "CL",
  });

  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${CHILE_TOP50_PLAYLIST_ID}/tracks?${params.toString()}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await response.json();

  if (!data.items) {
    console.error("[Spotify] playlist response:", data);
    return [];
  }

  return data.items
    .map((item: any) => item.track)
    .filter((track: any) => track?.id)
    .slice(0, limit);
}
