import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SongCard } from "@/components/SongCard";
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

  useEffect(() => {
    async function fetchSongs() {
      setLoading(true);
      try {
        const token = await getSpotifyToken();
        // Puedes cambiar el query por el género/artista que prefieras
        const tracks = await searchSpotifyTracks("pop", token);
        setSongs(tracks);
      } catch (err) {
        setSongs([]);
      }
      setLoading(false);
    }
    fetchSongs();
  }, []);

  const handleAddSong = (songId: string, isFree: boolean = false) => {
    const song = songs.find(s => s.id === songId);
    if (!song) return;
    if (isFree && hasFreeSong) {
      localStorage.setItem("hasUsedFreeSong", "true");
    }
    navigate("/confirmation", {
      state: {
        song: {
          id: song.id,
          title: song.name,
          artist: song.artists?.map((a: any) => a.name).join(", "),
          genre: song.album?.name,
          image: song.album?.images?.[0]?.url,
        },
        position: mockVenue.songsInQueue + 1,
        isFree,
      },
    });
  };

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <VenueHeader
          venueName={mockVenue.name}
          visitors={mockVenue.visitors}
          songsInQueue={mockVenue.songsInQueue}
        />
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Canciones de Spotify</h2>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center text-muted-foreground">Cargando canciones...</div>
            ) : (
              songs.map((song) => (
                <SongCard
                  key={song.id}
                  title={song.name}
                  artist={song.artists?.map((a: any) => a.name).join(", ")}
                  genre={song.album?.name}
                  onAdd={() => handleAddSong(song.id)}
                  isAdded={addedSongs.has(song.id)}
                  image={song.album?.images?.[0]?.url}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
