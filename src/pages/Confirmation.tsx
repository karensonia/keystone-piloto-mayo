import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Music2, Clock, DollarSign, Receipt, List } from "lucide-react";
import { toast } from "sonner";

interface LocationState {
  song: {
    id: string;
    title: string;
    artist: string;
    genre: string;
  };
  position: number;
  isFree?: boolean;
}

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const [showReceipt, setShowReceipt] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  // El botón de comprobante solo se muestra después de agregar otra canción
  const [canShowReceipt, setCanShowReceipt] = useState(false);
  // Estado para mostrar el mensaje de confirmación solo después de agregar la canción
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (!state?.song) {
      navigate("/home");
      return;
    }

    // Cargar playlist existente
    const savedPlaylist = localStorage.getItem("playlist");
    if (savedPlaylist) {
      setPlaylist(JSON.parse(savedPlaylist));
    }
  }, [state, navigate]);

  // Actualizar playlist si cambia en localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem("playlist");
      setPlaylist(saved ? JSON.parse(saved) : []);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddToPlaylist = () => {
    const newSong = {
      ...state.song,
      addedAt: new Date().toISOString(),
      isFree: state.isFree
    };
    const updatedPlaylist = [...playlist, newSong];
    localStorage.setItem("playlist", JSON.stringify(updatedPlaylist));
    setPlaylist(updatedPlaylist);
    toast.success("¡Canción agregada a la playlist!");
    setShowPlaylist(true);
    setCanShowReceipt(true);
    setShowConfirmation(true); // Mostrar mensaje de confirmación
  };

  if (!state?.song) return null;

  const estimatedWaitTime = Math.ceil(state.position * 3.5);
  const transactionId = `TRX-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const amount = state.isFree ? 0 : 500;

  // El reproductor embebido solo muestra la última canción agregada
  const currentSong = playlist.length > 0 ? playlist[playlist.length - 1] : null;

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-up">
        {/* Columna izquierda: reproductor y detalles */}
        <div className="space-y-6">
          {/* Success Icon y Main Message solo si showConfirmation es true */}
          {showConfirmation && (
            <>
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse-glow">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gradient">¡Listo!</h1>
                <p className="text-lg text-foreground">Tu canción ya es parte de la playlist de la noche</p>
              </div>
            </>
          )}
          {/* Reproductor embebido de Spotify y detalles de compra solo si showConfirmation es false */}
          {!showConfirmation && (
            <>
              {/* Reproductor embebido de Spotify con preview de la canción seleccionada */}
              {state.song?.id && (
                <div className="mb-4">
                  <iframe
                    src={`https://open.spotify.com/embed/track/${state.song.id}`}
                    width="100%"
                    height="80"
                    frameBorder="0"
                    allow="encrypted-media"
                    title={`Spotify player for ${state.song.title}`}
                    style={{ borderRadius: 8 }}
                  ></iframe>
                </div>
              )}
              {/* Song Info Card y detalles de compra */}
              <div className="glass-card p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                    <Music2 className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-foreground truncate">{state.song.title}</h3>
                    <p className="text-muted-foreground truncate">{state.song.artist}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Posición en fila</span>
                    </div>
                    <span className="font-bold text-foreground">#{state.position}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Tiempo estimado</span>
                    </div>
                    <span className="font-bold text-foreground">~{estimatedWaitTime} min</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="w-4 h-4" />
                      <span>Monto pagado</span>
                    </div>
                    <span className="font-bold text-foreground">
                      {amount === 0 ? "Gratis" : `$${amount}`}
                    </span>
                  </div>
                </div>

                {/* Transaction Message */}
                {amount === 0 ? (
                  <div className="p-3 rounded-lg bg-accent/20 border border-accent/30">
                    <p className="text-sm text-center text-accent-foreground">
                      🎁 Regalo para nuevo usuario
                    </p>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-xs text-center text-muted-foreground">
                      Con esta acción aseguras el uso legal de la música y apoyo directo al artista
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
          {/* Actions */}
          <div className="space-y-3">
            {/* Botón Cancelar visible antes de la confirmación */}
            {!showConfirmation && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/home")}
              >
                Cancelar
              </Button>
            )}
            {/* Botón para volver a /home después de la confirmación */}
            {showConfirmation && (
              <Button
                variant="gradient"
                size="lg"
                className="w-full"
                onClick={() => navigate("/home")}
              >
                Volver al catálogo
              </Button>
            )}
            {/* Botón comprobante digital solo si corresponde */}
            {canShowReceipt && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowReceipt(!showReceipt)}
              >
                <Receipt className="w-4 h-4 mr-2" />
                {showReceipt ? "Ocultar" : "Ver"} Comprobante Digital
              </Button>
            )}

            {showReceipt && (
              <div className="glass-card p-4 rounded-xl space-y-2 text-sm animate-slide-up">
                <h3 className="font-bold text-foreground mb-3">Comprobante de Transacción</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID Transacción:</span>
                    <span className="font-mono text-xs text-foreground">{transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fecha:</span>
                    <span className="text-foreground">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hora:</span>
                    <span className="text-foreground">{new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Local:</span>
                    <span className="text-foreground">Siete Negronis</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Canción:</span>
                    <span className="text-foreground">{state.song.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Artista:</span>
                    <span className="text-foreground">{state.song.artist}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t border-border">
                    <span className="text-foreground">Total:</span>
                    <span className="text-foreground">${amount}</span>
                  </div>
                </div>
              </div>
            )}

            {!showPlaylist ? (
              <Button
                variant="gradient"
                size="lg"
                className="w-full"
                onClick={handleAddToPlaylist}
              >
                Agregar otra canción
              </Button>
            ) : null}
          </div>
        </div>
        {/* Columna derecha: playlist visualizada */}
        <div className="glass-card p-6 rounded-2xl space-y-4 animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <List className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Playlist del Local</h3>
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
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">#{index + 1}</span>
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
      </div>
    </div>
  );
};

export default Confirmation;
