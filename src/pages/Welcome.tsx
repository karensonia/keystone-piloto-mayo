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
          <p className="text-sm text-foreground">Confirma el bar en el que te encuentras, selecciona una canción del catálogo y agrégala a la playlist del local</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="gradient"
            size="lg"
            className="w-full text-lg"
            onClick={() => navigate("/venues")}
          >
            INGRESAR
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
