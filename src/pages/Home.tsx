import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SongCard } from "@/components/SongCard";
import { VenueHeader } from "@/components/VenueHeader";
import { Button } from "@/components/ui/button";
import { mockSongs, topSongs, mockVenue } from "@/data/mockData";
import { Plus } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [addedSongs, setAddedSongs] = useState<Set<string>>(new Set());
  const [hasFreeSong] = useState(() => {
    // Simular que usuarios invitados tienen 1 canción gratis
    return !localStorage.getItem("hasUsedFreeSong");
  });

  const handleAddSong = (songId: string, isFree: boolean = false) => {
    const song = [...mockSongs, ...topSongs].find(s => s.id === songId);
    if (!song) return;

    if (isFree && hasFreeSong) {
      localStorage.setItem("hasUsedFreeSong", "true");
    }

    setAddedSongs(prev => new Set(prev).add(songId));
    navigate("/confirmation", { 
      state: { 
        song, 
        position: mockVenue.songsInQueue + 1,
        isFree 
      } 
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

        {/* New Songs Section */}
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Nuevas canciones</h2>
          </div>
          
          <div className="space-y-3">
            {mockSongs.slice(0, 5).map((song) => (
              <SongCard
                key={song.id}
                title={song.title}
                artist={song.artist}
                genre={song.genre}
                onAdd={() => handleAddSong(song.id)}
                isAdded={addedSongs.has(song.id)}
              />
            ))}
          </div>
        </div>

        {/* Top Songs Section */}
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Top 5 Santiago</h2>
          </div>
          
          <div className="space-y-3">
            {topSongs.map((song, index) => (
              <SongCard
                key={song.id}
                title={song.title}
                artist={song.artist}
                genre={song.genre}
                onAdd={() => handleAddSong(song.id)}
                isAdded={addedSongs.has(song.id)}
              />
            ))}
          </div>
        </div>

        {/* Free Song Banner for Guest Users */}
        {hasFreeSong && (
          <div className="fixed bottom-6 left-6 right-6 max-w-2xl mx-auto">
            <div className="glass-card p-4 rounded-2xl border-2 border-primary/50 animate-pulse-glow">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-foreground">¡Agregar gratis!</p>
                  <p className="text-sm text-muted-foreground">Regalo para nuevo usuario</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
