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
  // Estado para mostrar el efecto de felicitaciones
  const [showCongrats, setShowCongrats] = useState(false);

  // Obtener el local seleccionado y la clave de playlist
  const selectedVenue = JSON.parse(localStorage.getItem("selectedVenue") || "null");
  const playlistKey = selectedVenue ? `playlist_${selectedVenue.id}` : "playlist_default";

  useEffect(() => {
    if (!state?.song) {
      navigate("/home");
      return;
    }
    // Cargar playlist existente del local
    const savedPlaylist = localStorage.getItem(playlistKey);
    if (savedPlaylist) {
      setPlaylist(JSON.parse(savedPlaylist));
    }
  }, [state, navigate, playlistKey]);

  // Actualizar playlist si cambia en localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem(playlistKey);
      setPlaylist(saved ? JSON.parse(saved) : []);
    }, 1000);
    return () => clearInterval(interval);
  }, [playlistKey]);

  const handleAddToPlaylist = () => {
    const newSong = {
      ...state.song,
      addedAt: new Date().toISOString(),
      isFree: state.isFree
    };
    const updatedPlaylist = [...playlist, newSong];
    localStorage.setItem(playlistKey, JSON.stringify(updatedPlaylist));
    setPlaylist(updatedPlaylist);
    toast.success("¡Canción agregada a la playlist!");
    setShowPlaylist(true);
    setCanShowReceipt(true);
    setShowCongrats(true); // Mostrar felicitaciones
    setTimeout(() => {
      setShowCongrats(false);
      setShowConfirmation(true); // Mostrar mensaje de confirmación después del efecto
    }, 3000);
  };

  if (!state?.song) return null;

  const estimatedWaitTime = Math.ceil(state.position * 3.5);
  const transactionId = `TRX-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const amount = state.isFree ? 0 : 500;

  // El reproductor embebido solo muestra la última canción agregada
  const currentSong = playlist.length > 0 ? playlist[playlist.length - 1] : null;

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center relative">
      {/* Efecto de felicitaciones sobre todas las capas */}
      {showCongrats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
          <img src="/felicitaciones.png" alt="Felicitaciones" className="max-w-xs w-full drop-shadow-2xl animate-pop" />
        </div>
      )}
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
                      <span>Monto a Pagar</span>
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
            {/* Botón para volver a /home después de la confirmación */}
            {showConfirmation && (
              <Button
                variant="gradient"
                size="lg"
                className="w-full"
                onClick={() => navigate("/home")}
              >
                Volver al local
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

            {/* Confirmar canción (visible cuando no se ha agregado aún) */}
            {!showPlaylist ? (
              <Button
                variant="gradient"
                size="lg"
                className="w-full"
                onClick={handleAddToPlaylist}
              >
                Confirmar  Canción
              </Button>
            ) : null}

            {/* Botón Cancelar visible antes de la confirmación: ahora debajo del botón Confirmar */}
            {!showConfirmation && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/add-song")}
              >
                Volver
              </Button>
            )}
          </div>
        </div>
        {/* Columna derecha: Google Form */}
        <div className="glass-card p-6 rounded-2xl space-y-4 animate-slide-up">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSdsQClWa-PKN0fQn4YFUNsGOdCKt07FFacqJQeS328krAI_bA/viewform?embedded=true"
            width="100%"
            height={600}
            style={{ border: 'none' }}
            className="w-full"
          >
            Cargando…
          </iframe>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
