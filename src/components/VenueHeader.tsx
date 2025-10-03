import { useState } from "react";
import { Users, Music, PartyPopper } from "lucide-react";

interface VenueHeaderProps {
  venueName: string;
  visitors: number;
  songsInQueue: number;
}

export const VenueHeader = ({ venueName, visitors, songsInQueue }: VenueHeaderProps) => {
  const [showCongrats, setShowCongrats] = useState(false);

  const handleFollow = () => {
    setShowCongrats(true);
    setTimeout(() => setShowCongrats(false), 2500);
  };

  return (
    <>
      {/* Efecto de celebración centrado y cubriendo todo el body */}
      {showCongrats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="relative flex flex-col items-center justify-center gap-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pop shadow-xl">
              <PartyPopper className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white drop-shadow-lg text-center">¡Ahora sigues a {venueName}!</h2>
          </div>
        </div>
      )}
      <div className="glass-card p-6 rounded-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gradient">{venueName}</h1>
          <button
            className="px-4 py-2 rounded-md bg-gradient-to-r from-primary to-secondary text-white font-bold shadow hover:opacity-90 transition-all"
            onClick={handleFollow}
          >
            Seguir
          </button>
        </div>
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground">Visitantes</p>
              <p className="font-bold text-foreground">{visitors}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
              <Music className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-muted-foreground">Canciones en fila</p>
              <p className="font-bold text-foreground">{songsInQueue}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
