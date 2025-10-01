import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center space-y-6 animate-slide-up">
        <h1 className="mb-4 text-6xl font-bold text-gradient">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Página no encontrada</p>
        <a 
          href="/" 
          className="inline-block text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default NotFound;
