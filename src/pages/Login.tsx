import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    toast.success(isLogin ? "¡Bienvenido de vuelta!" : "¡Cuenta creada exitosamente!");
    navigate("/venues");
  };

  return (
    <div className="min-h-screen flex flex-col p-6 relative overflow-hidden">
      {/* Background Image con capa negra */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(/welcome.jpg)` }}
      />
      <div className="absolute inset-0 bg-black/60" />
      <Button
        variant="ghost"
        size="icon"
        className="self-start mb-8 z-10"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>
      <div className="flex-1 flex flex-col items-center justify-center z-10" style={{ justifyContent: 'flex-start', minHeight: '70vh' }}>
        <div className="max-w-md w-full space-y-8 animate-slide-up">
          {/* Logo */}
          <div className="flex justify-center mt-8 mb-4">
            <div className="w-28 h-28 rounded-2xl flex items-center justify-center overflow-hidden">
              <img src="/keystone.png" alt="Keystone logo" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              {isLogin ? "Ingresa a tu cuenta" : "Crea tu cuenta"}
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-card/50 border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-card/50 border-border"
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirma tu contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-card/50 border-border"
                />
              </div>
            )}

            <Button type="submit" variant="gradient" size="lg" className="w-full">
              {isLogin ? "Ingresar" : "Crear cuenta"}
            </Button>
          </form>

          {/* Toggle */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
