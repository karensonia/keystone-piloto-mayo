import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SongCard } from "@/components/SongCard";
import { getSpotifyToken, searchSpotifyTracks } from "@/lib/spotify";

const AddSong = () => {
  const navigate = useNavigate();
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSongs() {
      setLoading(true);
      setError("");
      try {
        const token = await getSpotifyToken();
        const tracks = await searchSpotifyTracks("pop", token); // Puedes cambiar el query
        setSongs(tracks);
      } catch (err) {
        setError("No se pudieron cargar las canciones de Spotify.");
        setSongs([]);
      }
      setLoading(false);
    }
    fetchSongs();
  }, []);

  const handleAddSong = (song: any, index: number) => {
    navigate("/confirmation", {
      state: {
        song: {
          id: song.id,
          title: song.name,
          artist: song.artists?.map((a: any) => a.name).join(", "),
          genre: song.album?.name,
          image: song.album?.images?.[0]?.url,
        },
        position: index + 1,
      },
    });
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">Agregar una canción a la Playlist</h1>
      <div className="max-w-2xl w-full space-y-4">
        {loading ? (
          <p className="text-center text-muted-foreground">Cargando canciones...</p>
        ) : error ? (
          <p className="text-center text-destructive">{error}</p>
        ) : songs.length === 0 ? (
          <p className="text-center text-muted-foreground">No hay canciones disponibles para agregar.</p>
        ) : (
          songs.map((song, idx) => (
            <SongCard
              key={song.id}
              title={song.name}
              artist={song.artists?.map((a: any) => a.name).join(", ")}
              genre={song.album?.name}
              image={song.album?.images?.[0]?.url}
              onAdd={() => handleAddSong(song, idx)}
            />
          ))
        )}
      </div>
      <Button variant="outline" className="mt-8" onClick={() => navigate("/home")}>Volver</Button>
    </div>
  );
};

export default AddSong;
