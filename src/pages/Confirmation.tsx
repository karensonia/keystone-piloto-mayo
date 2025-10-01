import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Music2, Clock, DollarSign, Receipt } from "lucide-react";
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

  useEffect(() => {
    if (!state?.song) {
      navigate("/home");
      return;
    }

    toast.success("¡Canción agregada exitosamente!");
  }, [state, navigate]);

  if (!state?.song) return null;

  const estimatedWaitTime = Math.ceil(state.position * 3.5);
  const transactionId = `TRX-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const amount = state.isFree ? 0 : 500;

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-6 animate-slide-up">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse-glow">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Main Message */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gradient">¡Listo!</h1>
          <p className="text-lg text-foreground">
            Tu canción ya es parte de la playlist de la noche
          </p>
        </div>

        {/* Song Info Card */}
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

        {/* Actions */}
        <div className="space-y-3">
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

          <Button
            variant="gradient"
            size="lg"
            className="w-full"
            onClick={() => navigate("/home")}
          >
            Agregar otra canción
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
