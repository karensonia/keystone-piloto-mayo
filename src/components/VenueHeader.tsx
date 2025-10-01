import { Users, Music } from "lucide-react";

interface VenueHeaderProps {
  venueName: string;
  visitors: number;
  songsInQueue: number;
}

export const VenueHeader = ({ venueName, visitors, songsInQueue }: VenueHeaderProps) => {
  return (
    <div className="glass-card p-6 rounded-2xl animate-slide-up">
      <h1 className="text-3xl font-bold text-gradient mb-4">{venueName}</h1>
      
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
  );
};
