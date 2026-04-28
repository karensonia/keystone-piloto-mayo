import { useNavigate } from "react-router-dom";
import { Key, Zap, Music, Heart } from "lucide-react";

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
            <Key size={16} />
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
