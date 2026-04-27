import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, GlassWater } from "lucide-react";
import { toast } from "sonner";

const VENUE = {
  id: "siete-negronis",
  name: "Siete Negronis",
  address: "Av. Vitacura 3520, Santiago",
};

const Venues = () => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    localStorage.setItem("selectedVenue", JSON.stringify(VENUE));
    const playlistKey = `playlist_${VENUE.id}`;
    if (!localStorage.getItem(playlistKey)) {
      localStorage.setItem(playlistKey, JSON.stringify([]));
    }
    navigate("/home");
  };

  const handleWrongBar = () => {
    toast("Escanea el QR del bar donde te encuentras");
  };

  return (
    <div className="screen screen--validate">
      <header className="app-header">
        <button className="icon-btn" onClick={() => navigate("/")} aria-label="Volver">
          <ArrowLeft size={18} />
        </button>
        <span className="app-header__title">Confirmar ubicación</span>
        <span className="icon-btn icon-btn--placeholder" />
      </header>

      <div className="validate-body">
        <div className="bar-card">
          <div className="bar-card__glow" />
          <div className="bar-card__logo">
            <GlassWater size={32} />
          </div>
          <span className="bar-card__label">
            <MapPin size={12} /> Estás en
          </span>
          <h2 className="bar-card__name">{VENUE.name}</h2>
          <p className="bar-card__meta">{VENUE.address}</p>
          <div className="bar-card__live">
            <span className="pulse-dot" />
            Keystone activo ahora
          </div>
        </div>

        <p className="help-text">
          Verifica que estás en el bar correcto antes de continuar.
        </p>
      </div>

      <div className="screen-footer">
        <button className="btn btn--primary btn--xl" onClick={handleConfirm}>
          Sí, estoy aquí
        </button>
        <button className="btn btn--ghost" onClick={handleWrongBar}>
          No es este bar
        </button>
      </div>
    </div>
  );
};

export default Venues;
