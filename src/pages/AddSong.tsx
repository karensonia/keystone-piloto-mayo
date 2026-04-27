import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, X, Plus, Flame, Frown, Music } from "lucide-react";
import { getSpotifyToken, searchSpotifyTracks, getChileTopTracks } from "@/lib/spotify";

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

function highlight(text: string, query: string) {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return parts.map((p, i) =>
    p.toLowerCase() === query.toLowerCase()
      ? <mark key={i}>{p}</mark>
      : p
  );
}

const AddSong = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [query, setQuery] = useState("");
  const [popular, setPopular] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [searching, setSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [token, setToken] = useState("");

  // Obtiene token y carga populares al montar
  useEffect(() => {
    async function load() {
      setLoadingPopular(true);
      try {
        const t = await getSpotifyToken();
        setToken(t);
        const tracks = await getChileTopTracks(t, 10);
        setPopular(tracks);
      } catch {
        // silently fail
      }
      setLoadingPopular(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      setNoResults(false);
      setSearching(false);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      return;
    }
    setSearching(true);
    setNoResults(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const t = token || (await getSpotifyToken());
        const tracks = await searchSpotifyTracks(q.trim(), t, { limit: 10, market: "CL" });
        setResults(tracks);
        setNoResults(tracks.length === 0);
      } catch {
        setResults([]);
        setNoResults(true);
      }
      setSearching(false);
    }, 120);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setNoResults(false);
    setSearching(false);
    inputRef.current?.focus();
  };

  const handleSelect = (track: any) => {
    const selectedVenue = JSON.parse(localStorage.getItem("selectedVenue") || "null");
    const playlistKey = selectedVenue ? `playlist_${selectedVenue.id}` : "playlist_default";
    const saved = localStorage.getItem(playlistKey);
    const current = saved ? JSON.parse(saved) : [];
    const isFree = !localStorage.getItem("hasUsedFreeSong");

    navigate("/confirmation", {
      state: {
        song: {
          id: track.id,
          title: track.name,
          artist: track.artists?.map((a: any) => a.name).join(", "),
          image: track.album?.images?.[0]?.url,
        },
        position: current.length + 1,
        isFree,
      },
    });
  };

  const showPopular = !query.trim();
  const displayList = showPopular ? popular : results;

  const SongItem = ({ track, q = "" }: { track: any; q?: string }) => (
    <li className="song-item" onClick={() => handleSelect(track)}>
      <div
        className="song-item__cover"
        style={track.album?.images?.[0]?.url
          ? { backgroundImage: `url(${track.album.images[0].url})` }
          : { background: coverGradient(track.id) }}
      >
        {!track.album?.images?.[0]?.url && <Music size={16} />}
      </div>
      <div className="song-item__info">
        <div className="song-item__title">{q ? highlight(track.name, q) : track.name}</div>
        <div className="song-item__artist">{q ? highlight(track.artists?.map((a: any) => a.name).join(", "), q) : track.artists?.map((a: any) => a.name).join(", ")}</div>
      </div>
      <span className="song-item__action">
        <Plus size={14} />
      </span>
    </li>
  );

  return (
    <div className="screen screen--search">
      {/* Header con buscador */}
      <header className="search-header">
        <button className="icon-btn" onClick={() => navigate("/")} aria-label="Volver">
          <ArrowLeft size={18} />
        </button>
        <div className="search-bar">
          <Search size={14} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Busca canción o artista"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <button
            className={`search-clear ${query ? "visible" : ""}`}
            onClick={handleClear}
            aria-label="Limpiar"
          >
            <X size={10} />
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="search-body">
        {/* Populares (estado por defecto) */}
        {showPopular && (
          <div>
            <span className="section-eyebrow">
              <Flame size={12} /> Populares esta noche
            </span>
            {loadingPopular ? (
              <ul className="song-list">
                {Array.from({ length: 6 }).map((_, i) => (
                  <li key={i} className="song-item" style={{ opacity: 0.4, pointerEvents: "none" }}>
                    <div className="song-item__cover" style={{ background: "var(--bg-3)" }} />
                    <div className="song-item__info">
                      <div style={{ height: 14, width: "60%", background: "var(--bg-3)", borderRadius: 6, marginBottom: 6 }} />
                      <div style={{ height: 11, width: "40%", background: "var(--bg-3)", borderRadius: 6 }} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="song-list">
                {popular.map((t) => <SongItem key={t.id} track={t} />)}
              </ul>
            )}
          </div>
        )}

        {/* Resultados de búsqueda */}
        {!showPopular && !searching && !noResults && results.length > 0 && (
          <ul className="song-list">
            {results.map((t) => <SongItem key={t.id} track={t} q={query.trim().toLowerCase()} />)}
          </ul>
        )}

        {/* Buscando… */}
        {!showPopular && searching && (
          <ul className="song-list">
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="song-item" style={{ opacity: 0.4, pointerEvents: "none" }}>
                <div className="song-item__cover" style={{ background: "var(--bg-3)" }} />
                <div className="song-item__info">
                  <div style={{ height: 14, width: "55%", background: "var(--bg-3)", borderRadius: 6, marginBottom: 6 }} />
                  <div style={{ height: 11, width: "35%", background: "var(--bg-3)", borderRadius: 6 }} />
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Sin resultados */}
        {!showPopular && !searching && noResults && (
          <div className="search-empty">
            <Frown size={40} />
            <p>No encontramos nada con <strong>"{query}"</strong></p>
            <span>Prueba con otro nombre o artista</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddSong;
