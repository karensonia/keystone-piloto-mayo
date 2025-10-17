import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SongCard } from "@/components/SongCard";
import { getSpotifyToken, searchSpotifyTracks } from "@/lib/spotify";

const AddSong = () => {
  const navigate = useNavigate();
  const [songs, setSongs] = useState<any[]>([]); // tracks precargados
  const [results, setResults] = useState<any[]>([]); // resultados de búsqueda final
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  // estados para búsqueda

  useEffect(() => {
    // Carga inicial para tener sugerencias mientras se escribe
    async function fetchSongs() {
      setLoading(true);
      setError("");
      try {
        const token = await getSpotifyToken();
        const tracks = await searchSpotifyTracks("pop", token); // precarga
        setSongs(tracks);
      } catch (err) {
        setError("No se pudieron cargar las canciones de Spotify.");
        setSongs([]);
      }
      setLoading(false);
    }
    fetchSongs();
  }, []);

  const performSearch = async () => {
    const q = query.trim();
    if (!q) return;
    setSearching(true);
    setError("");
    try {
      const token = await getSpotifyToken();
      const tracks = await searchSpotifyTracks(q, token);
      setResults((tracks || []).slice(0, 10)); // máximo 10 resultados
    } catch (err) {
      setError("Error al buscar en Spotify.");
      setResults([]);
    }
    setSearching(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Calcula la posición real en la playlist leyendo localStorage (por local)
  const computePosition = () => {
    const selectedVenue = JSON.parse(localStorage.getItem("selectedVenue") || "null");
    const playlistKey = selectedVenue ? `playlist_${selectedVenue.id}` : "playlist_default";
    const saved = localStorage.getItem(playlistKey);
    const curr = saved ? JSON.parse(saved) : [];
    return curr.length + 1;
  };

  const handleAddSong = (song: any) => {
    const newSong = {
      id: song.id,
      title: song.name,
      artist: song.artists?.map((a: any) => a.name).join(", "),
      genre: song.album?.name,
      image: song.album?.images?.[0]?.url,
    };

    navigate("/confirmation", {
      state: {
        song: newSong,
        position: computePosition(),
      },
    });
  };

  const displayed = results.length > 0 ? results : songs;

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">Agregar una canción a la Playlist</h1>

      <div className="max-w-2xl w-full space-y-4">
        {/* Barra de búsqueda con botón de lupa dentro */}
        <div className="relative mb-3">
          <input
            value={query}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                performSearch();
              }
            }}
            placeholder="Busca por canción o artista..."
            className="w-full rounded-full border border-border px-4 py-3 pr-12 focus:outline-none bg-card text-foreground"
            aria-label="Buscar canciones"
          />
          <button
            onClick={performSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-muted/20 transition"
            aria-label="Buscar"
          >
            {/* Icono lupa simple */}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
        </div>

        {/* Resultados / Lista final (máx 10) */}
        {searching ? (
          <div className="space-y-3">
            <p className="text-center text-muted-foreground">Buscando...</p>
            {/* Mostrar 3 placeholders para carga */}
            <div className="animate-pulse space-y-2">
              <div className="h-16 bg-muted/20 rounded-lg" />
              <div className="h-16 bg-muted/20 rounded-lg" />
              <div className="h-16 bg-muted/20 rounded-lg" />
            </div>
          </div>
        ) : loading ? (
          <p className="text-center text-muted-foreground">Cargando canciones...</p>
        ) : error ? (
          <p className="text-center text-destructive">{error}</p>
        ) : displayed.length === 0 ? (
          <p className="text-center text-muted-foreground">No hay canciones disponibles para agregar.</p>
        ) : (
          displayed.slice(0, 10).map((song, idx) => (
            <SongCard
              key={song.id}
              title={song.name}
              artist={song.artists?.map((a: any) => a.name).join(", ")}
              genre={song.album?.name}
              image={song.album?.images?.[0]?.url}
              onAdd={() => handleAddSong(song)}
            />
          ))
        )}
      </div>

      <Button variant="outline" className="mt-8" onClick={() => navigate("/home")}>Volver</Button>
    </div>
  );
};

export default AddSong;
