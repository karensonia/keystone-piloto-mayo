import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VenueHeader } from "@/components/VenueHeader";
import { mockVenue } from "@/data/mockData";
import { getSpotifyToken, searchSpotifyTracks } from "@/lib/spotify";

const Home = () => {
  const navigate = useNavigate();
  const [addedSongs, setAddedSongs] = useState<Set<string>>(new Set());
  const [hasFreeSong] = useState(() => {
    return !localStorage.getItem("hasUsedFreeSong");
  });
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    async function fetchSongs() {
      setLoading(true);
      try {
        const token = await getSpotifyToken();
        // Puedes cambiar el query por el género/artista que prefieras
        const tracks = await searchSpotifyTracks("pop", token);
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
            addedAt: new Date().toISOString(),
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
    const newSong = {
      id: song.id,
      title: song.name,
      artist: song.artists?.map((a: any) => a.name).join(", "),
      genre: song.album?.name,
      image: song.album?.images?.[0]?.url,
      addedAt: new Date().toISOString(),
      isFree,
    };
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
              {playlist.map((song, index) => (
                <div
                  key={`${song.id}-${song.addedAt}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border"
                >
                  <div className="w-10 h-10 rounded-md bg-muted/12 flex items-center justify-center flex-shrink-0 border border-muted/20">
                    <span className="text-muted-foreground font-semibold">#{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{song.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                  </div>
                  {song.isFree && (
                    <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent-foreground">Gratis</span>
                  )}
                </div>
              ))}
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
