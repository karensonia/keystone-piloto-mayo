import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Music4, Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
      
      {/* Content */}
      <div className="max-w-md w-full space-y-8 animate-slide-up relative z-10">
        {/* Logo/Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse-glow">
              <Music4 className="w-12 h-12 text-white" />
            </div>
            <Sparkles className="w-6 h-6 text-accent absolute -top-2 -right-2" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold text-gradient">Keystone</h1>
          <p className="text-xl text-foreground font-semibold">
            El soundtrack de tu noche
          </p>
          <p className="text-muted-foreground">
            también construye futuro para los artistas
          </p>
        </div>

        {/* Steps */}
        <div className="glass-card p-6 rounded-2xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold">1</span>
            </div>
            <p className="text-sm text-foreground">Revisa la lista</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold">2</span>
            </div>
            <p className="text-sm text-foreground">Confirma la canción</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold">3</span>
            </div>
            <p className="text-sm text-foreground">Agrega a la playlist</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="gradient"
            size="lg"
            className="w-full text-lg"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full text-lg"
            onClick={() => navigate("/venues")}
          >
            Continuar como Invitado
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
