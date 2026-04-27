import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Volume2, List, Plus, MoreVertical, Music } from "lucide-react";
import { getSpotifyToken, getChileTopTracks } from "@/lib/spotify";

const COVER_GRADIENTS = [
  "linear-gradient(135deg, #ff6a88, #ff99ac)",
  "linear-gradient(135deg, #00d4ff, #2b7fff)",
  "linear-gradient(135deg, #b67bff, #7b5bff)",
  "linear-gradient(135deg, #22e58a, #0ea571)",
  "linear-gradient(135deg, #ffb547, #ff6a4d)",
  "linear-gradient(135deg, #ff5577, #c01850)",
  "linear-gradient(135deg, #5bb8ff, #2264d1)",
  "linear-gradient(135deg, #ffd371, #f0a500)",
];

function coverGradient(id: string) {
  const n = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return COVER_GRADIENTS[n % COVER_GRADIENTS.length];
}

function formatTime(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

const Home = () => {
  const navigate = useNavigate();
  const selectedVenue = JSON.parse(localStorage.getItem("selectedVenue") || "null");
  const playlistKey = selectedVenue ? `playlist_${selectedVenue.id}` : "playlist_default";

  const [playlist, setPlaylist] = useState<any[]>(() => {
    const saved = localStorage.getItem(playlistKey);
    return saved ? JSON.parse(saved) : [];
  });
  const [now, setNow] = useState(() => Date.now());

  // Sincroniza playlist entre tabs
  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem(playlistKey);
      setPlaylist(saved ? JSON.parse(saved) : []);
    }, 1000);
    return () => clearInterval(interval);
  }, [playlistKey]);

  // Reloj para barra de progreso
  useEffect(() => {
    const ticker = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(ticker);
  }, []);

  // Inicializa playlist con Top Chile si está vacía
  useEffect(() => {
    async function init() {
      const saved = localStorage.getItem(playlistKey);
      const current = saved ? JSON.parse(saved) : [];
      if (current.length > 0) return;
      try {
        const token = await getSpotifyToken();
        const tracks = await getChileTopTracks(token, 1);
        if (!tracks?.length) return;
        const first = tracks[0];
        const defaultSong = {
          id: first.id,
          title: first.name,
          artist: first.artists?.map((a: any) => a.name).join(", "),
          image: first.album?.images?.[0]?.url,
          durationMs: first.duration_ms ?? 180000,
          addedAt: new Date().toISOString(),
          startedAt: new Date().toISOString(),
          isDefault: true,
        };
        localStorage.setItem(playlistKey, JSON.stringify([defaultSong]));
        setPlaylist([defaultSong]);
      } catch {
        // playlist permanece vacía
      }
    }
    init();
  }, [playlistKey]);

  // Asegura startedAt en la primera canción
  useEffect(() => {
    if (!playlist.length || playlist[0].startedAt) return;
    const updated = [{ ...playlist[0], startedAt: new Date().toISOString() }, ...playlist.slice(1)];
    localStorage.setItem(playlistKey, JSON.stringify(updated));
    setPlaylist(updated);
  }, [playlist, playlistKey]);

  // Avanza la playlist cuando termina la canción actual
  useEffect(() => {
    if (!playlist.length) return;
    const first = playlist[0];
    const durationMs = first.durationMs ?? 180000;
    const startedAtMs = first.startedAt ? new Date(first.startedAt).getTime() : null;
    if (!startedAtMs || now - startedAtMs < durationMs) return;
    const remaining = playlist.slice(1);
    if (remaining.length > 0 && !remaining[0].startedAt) {
      remaining[0] = { ...remaining[0], startedAt: new Date(startedAtMs + durationMs).toISOString() };
    }
    localStorage.setItem(playlistKey, JSON.stringify(remaining));
    setPlaylist(remaining);
  }, [now, playlist, playlistKey]);

  const nowPlaying = playlist[0] ?? null;
  const upNext = playlist.slice(1);

  const durationMs = nowPlaying?.durationMs ?? 180000;
  const startedAtMs = nowPlaying?.startedAt ? new Date(nowPlaying.startedAt).getTime() : null;
  const elapsedMs = startedAtMs ? Math.max(0, now - startedAtMs) : 0;
  const progress = durationMs ? Math.min(1, elapsedMs / durationMs) : 0;

  return (
    <div className="screen screen--playlist" style={{ position: "relative" }}>
      {/* Header sticky */}
      <header className="app-header app-header--sticky">
        <button className="icon-btn" onClick={() => navigate("/venues")} aria-label="Volver">
          <ArrowLeft size={18} />
        </button>
        <div className="app-header__stack">
          <span className="app-header__title">{selectedVenue?.name ?? "Siete Negronis"}</span>
          <span className="app-header__subtitle">
            <span className="pulse-dot pulse-dot--sm" />
            En vivo
          </span>
        </div>
        <button className="icon-btn" aria-label="Opciones">
          <MoreVertical size={18} />
        </button>
      </header>

      {/* Body scrollable */}
      <div className="playlist-body">
        {/* Now Playing */}
        <div className="now-playing">
          <span className="section-eyebrow">
            <Volume2 size={12} /> Sonando ahora
          </span>
          {nowPlaying ? (
            <div className="now-playing__card">
              <div className="now-playing__cover">
                {nowPlaying.image ? (
                  <img src={nowPlaying.image} alt={nowPlaying.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div className="vinyl">
                    <div className="vinyl__disc">
                      <div className="vinyl__label" />
                    </div>
                  </div>
                )}
              </div>
              <div className="now-playing__info">
                <h3 className="now-playing__title">{nowPlaying.title}</h3>
                <p className="now-playing__artist">{nowPlaying.artist}</p>
                <div className="progress">
                  <div className="progress__bar" style={{ width: `${progress * 100}%` }} />
                </div>
                <div className="progress__times">
                  <span>{formatTime(Math.min(elapsedMs, durationMs))}</span>
                  <span>{formatTime(durationMs)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="now-playing__card">
              <div className="now-playing__cover">
                <div className="vinyl">
                  <div className="vinyl__disc">
                    <div className="vinyl__label" />
                  </div>
                </div>
              </div>
              <div className="now-playing__info">
                <p style={{ color: "var(--text-3)", fontSize: 14 }}>Cargando playlist…</p>
              </div>
            </div>
          )}
        </div>

        {/* Up Next */}
        {upNext.length > 0 && (
          <div className="up-next">
            <div className="section-header">
              <span className="section-eyebrow">
                <List size={12} /> A continuación
              </span>
              <span className="queue-count">
                {upNext.length} {upNext.length === 1 ? "canción" : "canciones"}
              </span>
            </div>
            <ul className="queue">
              {upNext.map((song, idx) => {
                const etaMin = Math.ceil((idx + 1) * 3.5);
                return (
                  <li key={`${song.id}-${song.addedAt}`} className="queue-item">
                    <span className="queue-item__pos">{idx + 1}</span>
                    <div
                      className="queue-item__cover"
                      style={song.image ? { backgroundImage: `url(${song.image})` } : { background: coverGradient(song.id) }}
                    >
                      {!song.image && <Music size={14} />}
                    </div>
                    <div className="queue-item__info">
                      <div className="queue-item__title">{song.title}</div>
                      <div className="queue-item__artist">{song.artist}</div>
                      <div className={`queue-item__user ${song.isDefault ? "queue-item__user--bar" : ""}`}>
                        {song.isDefault ? "Del bar" : `@anónimo agregó esta canción`}
                      </div>
                    </div>
                    <span className="queue-item__eta">~{etaMin} min</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Floating CTA */}
      <div className="floating-cta">
        <button
          className="btn btn--primary btn--xl btn--shadow"
          onClick={() => navigate("/add-song")}
        >
          <Plus size={16} />
          Agregar canción · $700
        </button>
      </div>
    </div>
  );
};

export default Home;
