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
    <Card className="relative overflow-hidden glass-card p-4 hover:shadow-[0_8px_32px_hsl(var(--primary)/0.2)] transition-all group">
      {/* background image layer (appears when active/hover) */}
      {image && (
        <div
          className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
      )}
      {/* overlay mask using app background color at 80% to mute the image */}
      {image && (
        <div
          className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: "color-mix(in srgb, hsl(var(--background)) 80%, transparent)" }}
        />
      )}

      <div className="relative z-20 flex items-center gap-4">
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
          size="default"
          variant={isAdded ? "outline" : "default"}
          onClick={onAdd}
          disabled={isAdded}
          className="flex-shrink-0 whitespace-nowrap px-3 hover:bg-[hsl(var(--primary-hover))]"
          aria-label={isAdded ? "Agregada" : "Agregar canción"}
        >
          {isAdded ? "Agregada" : "Agregar canción"}
        </Button>
      </div>
    </Card>
  );
};
