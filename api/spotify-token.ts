import type { VercelRequest, VercelResponse } from "@vercel/node";

const CLIENT_ID = process.env.VITE_SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.VITE_SPOTIFY_CLIENT_SECRET!;

let cached: { token: string; expiresAt: number } | null = null;

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  if (cached && Date.now() < cached.expiresAt) {
    return res.json({ token: cached.token });
  }

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
  res.json({ token: data.access_token });
}
