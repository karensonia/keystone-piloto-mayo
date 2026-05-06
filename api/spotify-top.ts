import type { VercelRequest, VercelResponse } from "@vercel/node";

const CLIENT_ID = process.env.VITE_SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.VITE_SPOTIFY_CLIENT_SECRET!;

const TOP_ARTISTS = [
  "Bad Bunny", "Karol G", "Feid", "Rauw Alejandro", "Peso Pluma",
  "Cris MJ", "Paloma Mami", "Mon Laferte", "Shakira", "Maluma",
  "Myke Towers", "Ozuna", "Duki", "Bizarrap", "Nicki Nicole",
  "J Balvin", "Anuel AA", "Tiago PZK", "Paulo Londra", "Polima Westcoast",
  "Jere Klein", "Harry Nach", "Young Cister", "WOS", "Lunay",
];

let tokenCache: { token: string; expiresAt: number } | null = null;
let tracksCache: { tracks: unknown[]; timestamp: number } | null = null;
const TRACKS_TTL = 6 * 60 * 60 * 1000;

async function getToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) return tokenCache.token;
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json() as { access_token: string };
  tokenCache = { token: data.access_token, expiresAt: Date.now() + 50 * 60 * 1000 };
  return data.access_token;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const limit = parseInt((req.query.limit as string) ?? "50");

  if (tracksCache && Date.now() - tracksCache.timestamp < TRACKS_TTL) {
    return res.json((tracksCache.tracks as unknown[]).slice(0, limit));
  }

  const token = await getToken();
  const perArtist = Math.ceil(limit / TOP_ARTISTS.length) + 1;

  const results = await Promise.all(
    TOP_ARTISTS.map((artist) =>
      fetch(
        `https://api.spotify.com/v1/search?${new URLSearchParams({ q: `artist:"${artist}"`, type: "track", limit: String(perArtist), market: "CL" })}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
        .then((r) => r.json())
        .then((d: any) => d.tracks?.items ?? [])
        .catch(() => [])
    )
  );

  const seen = new Set<string>();
  const tracks: unknown[] = [];
  for (const artistTracks of results) {
    for (const track of artistTracks as any[]) {
      if (!track?.id || seen.has(track.id)) continue;
      seen.add(track.id);
      tracks.push(track);
      if (tracks.length >= limit) break;
    }
  }

  if (tracks.length > 0) tracksCache = { tracks, timestamp: Date.now() };
  res.json(tracks.slice(0, limit));
}
