import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VenueHeader } from "@/components/VenueHeader";
import { mockVenue } from "@/data/mockData";
import { getSpotifyToken, getChileTopTracks } from "@/lib/spotify";
import { Plus, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Home = () => {
  const navigate = useNavigate();

  const selectedVenue = JSON.parse(localStorage.getItem("selectedVenue") || "null");
  const playlistKey = selectedVenue ? `playlist_${selectedVenue.id}` : "playlist_default";

  const [playlist, setPlaylist] = useState<any[]>(() => {
    const saved = localStorage.getItem(playlistKey);
    return saved ? JSON.parse(saved) : [];
  });

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Sincroniza playlist entre tabs cada segundo (para el contador del header)
  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem(playlistKey);
      setPlaylist(saved ? JSON.parse(saved) : []);
    }, 1000);
    return () => clearInterval(interval);
  }, [playlistKey]);

  // Carga Top Chile como sugerencias e inicializa playlist si está vacía
  useEffect(() => {
    async function loadSuggestions() {
      setLoading(true);
      try {
        const token = await getSpotifyToken();
        const tracks = await getChileTopTracks(token, 10, (track, index) => {
          if (index === 0) setLoading(false);
          setSuggestions((prev) => {
            if (prev.find((t) => t.id === track.id)) return prev;
            return [...prev, track];
          });
        });

        // Inicializa playlist con la primera canción si está vacía
        const saved = localStorage.getItem(playlistKey);
        const current = saved ? JSON.parse(saved) : [];
        if (current.length === 0 && tracks.length > 0) {
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
          localStorage.setItem(playlistKey, JSON.stringify([defaultSong]));
          setPlaylist([defaultSong]);
        }
      } catch {
        // suggestions permanece vacío
      }
      setLoading(false);
    }
    loadSuggestions();
  }, [playlistKey]);

  const visitorsKey = selectedVenue ? `visitors_${selectedVenue.id}` : "visitors_default";
  const [visitors] = useState(() => {
    const saved = localStorage.getItem(visitorsKey);
    if (saved) return parseInt(saved);
    const initial = Math.floor(Math.random() * (500 - 10 + 1)) + 10;
    localStorage.setItem(visitorsKey, initial.toString());
    return initial;
  });

  const handleAddSuggestion = (track: any) => {
    const isFree = !localStorage.getItem("hasUsedFreeSong");
    const savedPlaylist = localStorage.getItem(playlistKey);
    const current = savedPlaylist ? JSON.parse(savedPlaylist) : [];
    const song = {
      id: track.id,
      title: track.name,
      artist: track.artists?.map((a: any) => a.name).join(", "),
      genre: track.album?.name,
      image: track.album?.images?.[0]?.url,
    };
    navigate("/confirmation", {
      state: { song, position: current.length + 1, isFree },
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

        <div className="glass-card p-6 rounded-2xl space-y-4 animate-slide-up">
          <div className="flex items-center gap-2 mb-2">
            <Music2 className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Sugerencias para esta noche</h3>
          </div>

          {loading && suggestions.length === 0 ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-3 p-3 rounded-lg bg-card/50">
                  <div className="w-12 h-12 rounded-lg bg-muted/40 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted/40 rounded w-2/3" />
                    <div className="h-3 bg-muted/40 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {suggestions.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted/40 flex-shrink-0">
                    {track.album?.images?.[0]?.url ? (
                      <img
                        src={track.album.images[0].url}
                        alt={track.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">♪</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{track.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {track.artists?.map((a: any) => a.name).join(", ")}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="gradient"
                    className="flex-shrink-0"
                    onClick={() => handleAddSuggestion(track)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
