import { useNavigate } from "react-router-dom";
import { Zap, Music, Heart } from "lucide-react";

const GemIcon = () => (
  <svg width="16" height="15" viewBox="0 0 16 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">
    <polygon points="8,14 1,5.5 4,1 12,1 15,5.5" />
    <line x1="1" y1="5.5" x2="15" y2="5.5" />
    <polyline points="4,1 8,5.5 12,1" />
  </svg>
);

const Welcome = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    const venue = { id: "siete-negronis", name: "Siete Negronis", address: "Av. Vitacura 3520, Santiago" };
    localStorage.setItem("selectedVenue", JSON.stringify(venue));
    if (!localStorage.getItem(`playlist_${venue.id}`)) {
      localStorage.setItem(`playlist_${venue.id}`, JSON.stringify([]));
    }
    navigate("/add-song");
  };

  return (
    <div className="screen screen--home">
      {/* Orbs de fondo */}
      <div className="home-bg">
        <div className="orb orb--cyan" />
        <div className="orb orb--blue" />
      </div>

      {/* Header */}
      <header className="home-header">
        <div className="logo">
          <span className="logo-mark">
            <GemIcon />
          </span>
          <span className="logo-text">Keystone</span>
        </div>
        <span className="badge badge--ghost">
          <Zap size={12} className="badge-accent" />
          Sin registro
        </span>
      </header>

      {/* Body */}
      <div className="home-body">
        <div className="equalizer" aria-hidden="true">
          <span /><span /><span /><span /><span />
        </div>
        <h1 className="display-title">
          ¿Quieres poner una canción{" "}
          <span className="accent">aquí y ahora</span>?
        </h1>
        <p className="display-sub">
          Elige tu canción y hazla sonar en el bar.
        </p>
        <span className="emotional-tag">
          <Heart size={13} />
          Apoya a los artistas
        </span>
      </div>

      {/* Footer */}
      <div className="home-footer">
        <button
          className="btn btn--primary btn--xl"
          onClick={handleStart}
        >
          <Music size={16} />
          Elegir canción
        </button>
        <p className="micro-copy">
          No necesitas crear cuenta · Listo en 10 segundos
        </p>
      </div>
    </div>
  );
};

export default Welcome;
