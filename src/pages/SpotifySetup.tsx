import { useState } from "react";

const CLIENT_ID = "a22c3c9e667c4785959e81648a68446f";
const CLIENT_SECRET = "3605e1d15f2d44bcb27ebde1838356e7";
const SCOPES = "playlist-modify-public playlist-modify-private";
const REDIRECT_URI = "https://example.com";

const s: Record<string, React.CSSProperties> = {
  page: { padding: "2rem", fontFamily: "monospace", maxWidth: 600, margin: "0 auto", color: "#eee" },
  h1: { fontSize: "1.3rem", marginBottom: "1rem" },
  step: { background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, padding: "1rem", marginBottom: "1rem" },
  label: { display: "block", marginBottom: "0.4rem", color: "#aaa", fontSize: "0.85rem" },
  code: { background: "#111", color: "#1db954", padding: "4px 8px", borderRadius: 4, fontSize: "0.85rem", wordBreak: "break-all" },
  input: { width: "100%", boxSizing: "border-box", background: "#111", color: "#eee", border: "1px solid #444", borderRadius: 6, padding: "0.6rem 0.8rem", fontFamily: "monospace", fontSize: "0.9rem", marginTop: "0.5rem" },
  btn: { background: "#1db954", color: "#fff", border: "none", padding: "0.7rem 1.4rem", borderRadius: 8, cursor: "pointer", fontSize: "0.95rem", fontWeight: "bold", marginTop: "0.75rem" },
  result: { background: "#0a1a0a", border: "1px solid #1db954", borderRadius: 8, padding: "1rem", marginTop: "1rem" },
  pre: { background: "#111", color: "#1db954", padding: "1rem", borderRadius: 8, overflowX: "auto", userSelect: "all" as const, margin: "0.5rem 0 0" },
  error: { background: "#1a0000", border: "1px solid #f66", color: "#f66", padding: "1rem", borderRadius: 8, marginTop: "0.75rem" },
};

export default function SpotifySetup() {
  const [codeInput, setCodeInput] = useState("");
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
  })}`;

  async function exchange() {
    const raw = codeInput.trim();
    // Accept either the full URL or just the code
    let code = raw;
    try {
      const url = new URL(raw);
      code = url.searchParams.get("code") ?? raw;
    } catch {}

    if (!code) return;
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
        },
        body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: REDIRECT_URI }),
      });
      const data = await r.json();
      if (data.refresh_token) {
        setRefreshToken(data.refresh_token);
      } else {
        setError(JSON.stringify(data, null, 2));
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.page}>
      <h1 style={s.h1}>Conectar Spotify — un solo uso</h1>

      {!refreshToken && (
        <>
          {/* Paso 1 */}
          <div style={s.step}>
            <strong>1. Agrega el Redirect URI en Spotify Dashboard</strong>
            <p style={{ marginTop: "0.5rem", lineHeight: 1.6, color: "#aaa" }}>
              Abre tu app en{" "}
              <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noreferrer" style={{ color: "#1db954" }}>
                developer.spotify.com/dashboard
              </a>{" "}
              → Edit Settings → Redirect URIs → agrega:
            </p>
            <code style={s.code}>{REDIRECT_URI}</code>
          </div>

          {/* Paso 2 */}
          <div style={s.step}>
            <strong>2. Autoriza la app</strong>
            <p style={{ marginTop: "0.5rem", lineHeight: 1.6, color: "#aaa" }}>
              Abre el link de abajo, acepta los permisos en Spotify y serás redirigido a{" "}
              <code style={s.code}>example.com/?code=…</code>
            </p>
            <a href={authUrl} target="_blank" rel="noreferrer">
              <button style={s.btn}>Ir a autorizar en Spotify ↗</button>
            </a>
          </div>

          {/* Paso 3 */}
          <div style={s.step}>
            <strong>3. Pega la URL completa de redirección</strong>
            <p style={{ marginTop: "0.5rem", lineHeight: 1.6, color: "#aaa" }}>
              Después de autorizar, tu navegador irá a example.com. Copia la URL completa
              de la barra del navegador y pégala aquí:
            </p>
            <label style={s.label}>URL de redirección (o solo el code=…)</label>
            <input
              style={s.input}
              placeholder="https://example.com/?code=AQD..."
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && exchange()}
            />
            <button style={s.btn} onClick={exchange} disabled={loading || !codeInput.trim()}>
              {loading ? "Procesando…" : "Obtener refresh token"}
            </button>
          </div>

          {error && <div style={s.error}><strong>Error:</strong><pre style={{ margin: 0 }}>{error}</pre></div>}
        </>
      )}

      {refreshToken && (
        <div style={s.result}>
          <p style={{ color: "#1db954", marginBottom: "0.75rem" }}>✓ Autorización exitosa</p>
          <p style={{ marginBottom: "0.5rem", color: "#aaa" }}>
            Agrega estas líneas a tu archivo <code style={s.code}>.env</code> y reinicia el servidor:
          </p>
          <pre style={s.pre}>{`VITE_SPOTIFY_REFRESH_TOKEN=${refreshToken}\nVITE_SPOTIFY_PLAYLIST_ID=<id-de-tu-playlist>`}</pre>
          <p style={{ marginTop: "1rem", color: "#aaa", lineHeight: 1.6 }}>
            El ID de la playlist está en su URL de Spotify:
            <br />
            <code style={s.code}>open.spotify.com/playlist/<strong>ESTE_ES_EL_ID</strong></code>
          </p>
        </div>
      )}
    </div>
  );
}
