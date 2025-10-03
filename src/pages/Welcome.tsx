import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Image con capa negra */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(/welcome.jpg)` }}
      />
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Content */}
      <div className="max-w-md w-full space-y-8 animate-slide-up relative z-10">
        {/* Logo/Icon personalizado */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center overflow-hidden">
              <img src="/keystone.png" alt="Keystone logo" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold text-white">El soundtrack de tu noche también construye futuro para los artistas</h1>
        </div>

        {/* Steps */}
        <div className="glass-card p-6 rounded-2xl space-y-3">
          <div className="flex items-center gap-3" style={{ marginLeft: 0 }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FF7A8A' }}>
              <span className="text-white font-bold">1</span>
            </div>
            <p className="text-sm text-foreground">Revisa la lista</p>
          </div>
          <div className="flex items-center gap-3" style={{ marginLeft: '1.5rem' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FF7A8A' }}>
              <span className="text-white font-bold">2</span>
            </div>
            <p className="text-sm text-foreground">Confirma la canción</p>
          </div>
          <div className="flex items-center gap-3" style={{ marginLeft: '3rem' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FF7A8A' }}>
              <span className="text-white font-bold">3</span>
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
