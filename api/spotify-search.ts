import type { VercelRequest, VercelResponse } from "@vercel/node";

const CLIENT_ID = process.env.VITE_SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.VITE_SPOTIFY_CLIENT_SECRET!;

let cached: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (cached && Date.now() < cached.expiresAt) return cached.token;
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });
  const data = await response.json() as { access_token: string };
  cached = { token: data.access_token, expiresAt: Date.now() + 50 * 60 * 1000 };
  return data.access_token;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { q, limit = "10", market = "CL" } = req.query as Record<string, string>;
  if (!q) return res.status(400).json({ error: "q required" });

  const token = await getToken();
  const params = new URLSearchParams({ q, type: "track", limit, market });
  const response = await fetch(`https://api.spotify.com/v1/search?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json() as { tracks?: { items: unknown[] } };
  res.json(data.tracks?.items ?? []);
}
