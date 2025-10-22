import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VenueHeader } from "@/components/VenueHeader";
import { mockVenue } from "@/data/mockData";
import { getSpotifyToken, getChileTopTracks } from "@/lib/spotify";

const Home = () => {
  const navigate = useNavigate();
  const [addedSongs, setAddedSongs] = useState<Set<string>>(new Set());
  const [hasFreeSong] = useState(() => {
    return !localStorage.getItem("hasUsedFreeSong");
  });
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => Date.now());

  // Obtener el local seleccionado
  const selectedVenue = JSON.parse(localStorage.getItem("selectedVenue") || "null");
  const playlistKey = selectedVenue ? `playlist_${selectedVenue.id}` : "playlist_default";
  // Playlist del local específico
  const [playlist, setPlaylist] = useState<any[]>(() => {
    const saved = localStorage.getItem(playlistKey);
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem(playlistKey);
      setPlaylist(saved ? JSON.parse(saved) : []);
    }, 1000);
    return () => clearInterval(interval);
  }, [playlistKey]);
  const songsInQueue = playlist.length;

  useEffect(() => {
    const ticker = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(ticker);
  }, []);

  useEffect(() => {
    async function fetchSongs() {
      setLoading(true);
      try {
        const token = await getSpotifyToken();
        // Precargamos con el Top 10 Chile de Spotify para tener contexto local
        const tracks = await getChileTopTracks(token);
        setSongs(tracks);

        // Si la playlist del local está vacía, inicializarla con la primera canción
        const saved = localStorage.getItem(playlistKey);
        const currentPlaylist = saved ? JSON.parse(saved) : [];
        if ((currentPlaylist.length === 0) && tracks && tracks.length > 0) {
          const first = tracks[0];
          const defaultSong = {
            id: first.id,
            title: first.name,
            artist: first.artists?.map((a: any) => a.name).join(", "),
            genre: first.album?.name,
            image: first.album?.images?.[0]?.url,
            durationMs: first.duration_ms ?? 180000,
            addedAt: new Date().toISOString(),
            startedAt: new Date().toISOString(),
            isDefault: true,
          };
          const updated = [defaultSong];
          localStorage.setItem(playlistKey, JSON.stringify(updated));
          setPlaylist(updated);
        }
      } catch (err) {
        setSongs([]);
      }
      setLoading(false);
    }
    fetchSongs();
  }, []);

  // Visitantes: random entre 10 y 500, y aumenta con interacción, por local
  const visitorsKey = selectedVenue ? `visitors_${selectedVenue.id}` : "visitors_default";
  const [visitors, setVisitors] = useState(() => {
    const saved = localStorage.getItem(visitorsKey);
    if (saved) return parseInt(saved);
    const initial = Math.floor(Math.random() * (500 - 10 + 1)) + 10;
    localStorage.setItem(visitorsKey, initial.toString());
    return initial;
  });

  // Aumenta visitantes cada vez que se agrega una canción
  const handleAddSong = (songId: string, isFree: boolean = false) => {
    const song = songs.find(s => s.id === songId);
    if (!song) return;
    if (isFree && hasFreeSong) {
      localStorage.setItem("hasUsedFreeSong", "true");
    }
    setVisitors((prev) => {
      const next = prev + 1;
      localStorage.setItem(visitorsKey, next.toString());
      return next;
    });
    // Actualiza la playlist del local
    const isFirstSong = playlist.length === 0;
    const newSong: any = {
      id: song.id,
      title: song.name,
      artist: song.artists?.map((a: any) => a.name).join(", "),
      genre: song.album?.name,
      image: song.album?.images?.[0]?.url,
      durationMs: song.duration_ms ?? song.durationMs ?? 180000,
      addedAt: new Date().toISOString(),
      isFree,
    };
    if (isFirstSong) {
      newSong.startedAt = new Date().toISOString();
    }
    const updatedPlaylist = [...playlist, newSong];
    localStorage.setItem(playlistKey, JSON.stringify(updatedPlaylist));
    setPlaylist(updatedPlaylist);
    navigate("/confirmation", {
      state: {
        song: newSong,
        position: updatedPlaylist.length,
        isFree,
      },
    });
  };

  useEffect(() => {
    if (playlist.length === 0) return;
    const first = playlist[0];
    if (first.startedAt) return;
    const updated = [
      { ...first, startedAt: new Date().toISOString() },
      ...playlist.slice(1),
    ];
    localStorage.setItem(playlistKey, JSON.stringify(updated));
    setPlaylist(updated);
  }, [playlist, playlistKey]);

  useEffect(() => {
    if (playlist.length === 0) return;
    const first = playlist[0];
    const durationMs = first.durationMs ?? first.duration_ms ?? 180000;
    const startedAtMs = first.startedAt || first.addedAt ? new Date(first.startedAt || first.addedAt).getTime() : null;
    if (!durationMs || !startedAtMs) return;
    if (now - startedAtMs < durationMs) return;
    const remaining = playlist.slice(1);
    if (remaining.length > 0) {
      const next = { ...remaining[0] };
      if (!next.startedAt) {
        next.startedAt = new Date(startedAtMs + durationMs).toISOString();
        remaining[0] = next;
      }
    }
    localStorage.setItem(playlistKey, JSON.stringify(remaining));
    setPlaylist(remaining);
  }, [now, playlist, playlistKey]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <VenueHeader
          venueName={selectedVenue?.name || mockVenue.name}
          visitors={visitors}
          songsInQueue={playlist.length}
        />
        {/* Playlist del Local visible */}
        <div className="glass-card p-6 rounded-2xl space-y-4 animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-5 h-5 text-primary font-bold">🎵</span>
            <h3 className="text-xl font-bold text-foreground">Fila de Reproducción</h3>
          </div>
          {playlist.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No hay canciones en la playlist todavía</p>
          ) : (
            <div className="space-y-3">
              {playlist.map((song, index) => {
                const durationMs = song.durationMs ?? song.duration_ms ?? 180000;
                const startedAt = song.startedAt || song.addedAt;
                const startedAtMs = startedAt ? new Date(startedAt).getTime() : null;
                const elapsedMs = startedAtMs ? Math.max(0, now - startedAtMs) : 0;
                const progress = durationMs ? Math.min(1, elapsedMs / durationMs) : 0;
                return (
                  <div
                    key={`${song.id}-${song.addedAt}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted/40 flex-shrink-0">
                      {song.image ? (
                        <img src={song.image} alt={song.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">♪</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{song.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                      {index === 0 && (
                        <div className="mt-2">
                          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-500"
                              style={{ width: `${Math.min(progress * 100, 100)}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Reproduciendo • {formatTime(Math.min(elapsedMs, durationMs))} / {formatTime(durationMs)}
                          </p>
                        </div>
                      )}
                    </div>
                    {song.isFree && (
                      <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent-foreground">Gratis</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* Primary action moved to header */}
        {/* Botón para salir del local y volver a /venues al final de la vista */}
        {/* <div className="mt-10">
          <button
            className="px-4 py-2 rounded-md bg-gradient-to-r from-primary to-secondary text-white font-bold shadow hover:opacity-90 transition-all w-full"
            onClick={() => {
              localStorage.removeItem("selectedVenue");
              localStorage.removeItem("venueVisitors");
              localStorage.removeItem("playlist");
              navigate("/venues");
            }}
          >
            Salir del local
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Home;
