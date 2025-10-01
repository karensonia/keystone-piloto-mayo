import { Music2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SongCardProps {
  title: string;
  artist: string;
  genre?: string;
  onAdd: () => void;
  isAdded?: boolean;
  image?: string; // Nueva prop para mostrar imagen del álbum
}

export const SongCard = ({ title, artist, genre, onAdd, isAdded, image }: SongCardProps) => {
  return (
    <Card className="glass-card p-4 hover:shadow-[0_8px_32px_hsl(var(--primary)/0.2)] transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform overflow-hidden">
          {image ? (
            <img src={image} alt={title} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <Music2 className="w-7 h-7 text-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground truncate">{title}</h3>
          <p className="text-sm text-muted-foreground truncate">{artist}</p>
          {genre && (
            <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
              {genre}
            </span>
          )}
        </div>
        <Button
          size="icon"
          variant={isAdded ? "outline" : "default"}
          onClick={onAdd}
          disabled={isAdded}
          className="flex-shrink-0"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
};
