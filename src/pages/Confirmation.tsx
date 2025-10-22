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
  // Estado para controlar qué sección mostrar
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);

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

  // Cargar script de Typeform dinámicamente para que el embed funcione
  useEffect(() => {
    const liveId = "01K854WFNWZZSC8D42GBMZMJZS";
    const selector = `div[data-tf-live="${liveId}"]`;
    const container = document.querySelector(selector);
    if (!container) return;

    const scriptId = 'typeform-embed-script';
    const existing = document.getElementById(scriptId);
    if (!existing) {
      const s = document.createElement('script');
      s.src = '//embed.typeform.com/next/embed.js';
      s.id = scriptId;
      s.async = true;
      document.body.appendChild(s);
      return;
    }

    // Si el script ya está presente, intentar re-inicializar el embed si la API existe
    const win = window as any;
    try {
      if (win.tf && typeof win.tf.init === 'function') {
        win.tf.init();
      } else if (win.tf && typeof win.tf.load === 'function') {
        win.tf.load();
      }
    } catch (e) {
      // ignore
    }
  }, []);

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
      setShowTransactionDetails(true); // Mostrar detalles de la transacción después de la confirmación
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
        {/* Columna izquierda */}
        <div className="space-y-6">
          {showConfirmation && showTransactionDetails ? (
            // Estado post-confirmación: Detalles de la transacción
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
              
              {/* Formulario de transacción solo después de la confirmación */}
              <div className="mt-6 space-y-4">
                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="text-lg font-semibold mb-4">Detalles de la Transacción</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID de Transacción:</span>
                      <span className="font-mono">{transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Canción:</span>
                      <span>{state.song.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Artista:</span>
                      <span>{state.song.artist}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t border-border">
                      <span>Total:</span>
                      <span>${amount}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <Button 
                    variant="gradient" 
                    size="lg"
                    className="w-full" 
                    onClick={() => navigate("/add-song")}
                  >
                    Agregar otra canción
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full" 
                    onClick={() => navigate("/home")}
                  >
                    Volver al local
                  </Button>
                </div>
              </div>
            </>
          ) : (
            // Estado pre-confirmación
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

                {/* Details - emphasize these so the user reads before confirming */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="grid grid-cols-1 gap-2">
                    <div className="p-3 rounded-md bg-primary/6 border border-primary/12 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">Posición en fila</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-extrabold text-foreground">#{state.position}</div>
                        <div className="text-xs text-muted-foreground">Tu lugar actual</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-md bg-primary/6 border border-primary/12 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">Tiempo estimado</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-extrabold text-foreground">~{estimatedWaitTime} min</div>
                        <div className="text-xs text-muted-foreground">Tiempo aproximado hasta su reproducción</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-md bg-primary/6 border border-primary/12 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">Monto a Pagar</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-extrabold text-foreground">{amount === 0 ? "Gratis" : `$${amount}`}</div>
                        <div className="text-xs text-muted-foreground">Pago único para asegurar la canción</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirm button placed above the transaction message so the user sees details first */}
                {!showPlaylist ? (
                  <div className="pt-3">
                    <Button
                      variant="gradient"
                      size="lg"
                      className="w-full"
                      onClick={handleAddToPlaylist}
                    >
                      Confirmar Canción
                    </Button>
                  </div>
                ) : null}

                {/* Transaction Message for pre-confirmation */}
                {!showConfirmation && amount === 0 ? (
                  <div className="p-3 rounded-lg bg-accent/20 border border-accent/30">
                    <p className="text-sm text-center text-accent-foreground">
                      🎁 Regalo para nuevo usuario
                    </p>
                  </div>
                ) : !showConfirmation ? (
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-xs text-center text-muted-foreground">
                      El monto será cargado a tu cuenta al finalizar la noche
                    </p>
                  </div>
                ) : null}
              </div>
            </>
          )}

          {/* Botón comprobante digital */}
          {showConfirmation && showTransactionDetails && (
            <>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowReceipt(!showReceipt)}
              >
                <Receipt className="w-4 h-4 mr-2" />
                {showReceipt ? "Ocultar" : "Ver"} Comprobante Digital
              </Button>

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
                      <span className="text-foreground">{selectedVenue?.name || "Local"}</span>
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
            </>
          )}

          {/* Botón volver (pre-confirmación) */}
          {!showConfirmation && !showPlaylist && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/add-song")}
            >
              Volver
            </Button>
          )}
        </div>

        {/* Columna derecha: playlist o typeform según el estado */}
        <div className="glass-card p-6 rounded-2xl space-y-4 animate-slide-up">
          {showConfirmation ? (
            // Mostrar Typeform después de la confirmación
            <div>
              <h3 className="text-xl font-bold text-foreground mb-6">Tu opinión nos ayuda a mejorar</h3>
              <div style={{ minHeight: '400px' }}>
<div data-tf-live="01K854WFNWZZSC8D42GBMZMJZS"></div><script src="//embed.typeform.com/next/embed.js"></script>              </div>
            </div>
          ) : (
            // Mostrar playlist antes de la confirmación
            <>
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
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted/40 flex-shrink-0">
                        {song.image ? (
                          <img src={song.image} alt={song.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">♪</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">{song.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                      </div>
                      {song.isFree && (
                        <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent-foreground">
                          Gratis
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
