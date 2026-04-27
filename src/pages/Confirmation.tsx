import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Instagram, Lock, Heart, Check, List, Music } from "lucide-react";

const COVER_GRADIENTS = [
  "linear-gradient(135deg, #ff6a88, #ff99ac)",
  "linear-gradient(135deg, #00d4ff, #2b7fff)",
  "linear-gradient(135deg, #b67bff, #7b5bff)",
  "linear-gradient(135deg, #22e58a, #0ea571)",
  "linear-gradient(135deg, #ffb547, #ff6a4d)",
];

function coverGradient(id: string) {
  const n = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return COVER_GRADIENTS[n % COVER_GRADIENTS.length];
}

interface LocationState {
  song: { id: string; title: string; artist: string; image?: string };
  position: number;
  isFree?: boolean;
}

type Phase = "confirm" | "paying" | "success";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const confettiRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<Phase>("confirm");
  const [instagram, setInstagram] = useState("");
  const [queuePosition, setQueuePosition] = useState(state?.position ?? 1);

  useEffect(() => {
    if (!state?.song) navigate("/home");
  }, [state, navigate]);

  const handlePay = () => {
    setPhase("paying");
    setTimeout(() => {
      // Agregar canción al localStorage
      const selectedVenue = JSON.parse(localStorage.getItem("selectedVenue") || "null");
      const playlistKey = selectedVenue ? `playlist_${selectedVenue.id}` : "playlist_default";
      const saved = localStorage.getItem(playlistKey);
      const current: any[] = saved ? JSON.parse(saved) : [];

      if (state.isFree) localStorage.setItem("hasUsedFreeSong", "true");

      const newSong = {
        id: state.song.id,
        title: state.song.title,
        artist: state.song.artist,
        image: state.song.image,
        durationMs: 210000,
        addedAt: new Date().toISOString(),
        isFree: state.isFree,
        instagram: instagram.trim() || null,
      };
      const updated = [...current, newSong];
      localStorage.setItem(playlistKey, JSON.stringify(updated));

      const visitorsKey = selectedVenue ? `visitors_${selectedVenue.id}` : "visitors_default";
      const v = parseInt(localStorage.getItem(visitorsKey) || "0") + 1;
      localStorage.setItem(visitorsKey, String(v));

      setQueuePosition(updated.length);
      setPhase("success");
    }, 1500);
  };

  // Confetti al entrar en success
  useEffect(() => {
    if (phase !== "success" || !confettiRef.current) return;
    const container = confettiRef.current;
    container.innerHTML = "";
    const colors = ["#00d4ff", "#2b7fff", "#ff5577", "#22e58a", "#ffb547", "#b67bff"];
    for (let i = 0; i < 40; i++) {
      const span = document.createElement("span");
      span.className = "confetti-piece";
      span.style.left = `${Math.random() * 100}%`;
      span.style.background = colors[Math.floor(Math.random() * colors.length)];
      span.style.animationDelay = `${Math.random() * 0.8}s`;
      span.style.animationDuration = `${2.5 + Math.random() * 2}s`;
      span.style.width = `${6 + Math.random() * 6}px`;
      span.style.height = `${10 + Math.random() * 10}px`;
      container.appendChild(span);
    }
  }, [phase]);

  if (!state?.song) return null;

  const amount = state.isFree ? 0 : 700;
  const etaMin = Math.max(1, Math.floor((queuePosition - 1) * 3.5));
  const coverStyle = state.song.image
    ? { backgroundImage: `url(${state.song.image})` }
    : { background: coverGradient(state.song.id) };

  /* ── ÉXITO ── */
  if (phase === "success") {
    return (
      <div className="screen screen--success" style={{ position: "relative" }}>
        <div className="success-bg">
          <div ref={confettiRef} />
        </div>

        <div className="success-body">
          <div className="success-check">
            <div className="success-check__ring" />
            <div className="success-check__circle">
              <Check size={42} />
            </div>
          </div>

          <h2 className="success-title">¡Tu canción fue agregada!</h2>
          <span className="success-sub">
            <Heart size={13} />
            Estás apoyando a los artistas
          </span>

          <div className="success-song">
            <div className="success-song__cover" style={coverStyle}>
              {!state.song.image && <Music size={18} />}
            </div>
            <div className="success-song__info">
              <h3>{state.song.title}</h3>
              <p>{state.song.artist}</p>
            </div>
          </div>

          <div className="queue-position">
            <div>
              <span className="queue-position__label">Tu posición en la cola</span>
            </div>
            <span className="queue-position__value">#{queuePosition}</span>
            <span className="queue-position__eta">Suena en ~{etaMin} min</span>
          </div>
        </div>

        <div className="screen-footer">
          <button className="btn btn--primary btn--xl" onClick={() => navigate("/home")}>
            <List size={16} />
            Ver playlist
          </button>
          <button className="btn btn--ghost" onClick={() => navigate("/")}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  /* ── CONFIRM / PAYING ── */
  return (
    <div className="screen screen--confirm" style={{ position: "relative" }}>
      {/* Paying overlay */}
      {phase === "paying" && (
        <div className="paying-overlay">
          <div className="paying-spinner" />
          <p>Procesando pago…</p>
        </div>
      )}

      <header className="app-header">
        <button
          className="icon-btn"
          onClick={() => navigate("/add-song")}
          aria-label="Volver"
          disabled={phase === "paying"}
        >
          <ArrowLeft size={18} />
        </button>
        <span className="app-header__title">Confirmar canción</span>
        <span className="icon-btn icon-btn--placeholder" />
      </header>

      <div className="confirm-body">
        <span className="section-eyebrow center">
          <Music size={12} /> Tu canción
        </span>

        <div className="selected-song">
          <div className="selected-song__cover" style={coverStyle}>
            {!state.song.image && <Music size={34} />}
          </div>
          <h2 className="selected-song__title">{state.song.title}</h2>
          <p className="selected-song__artist">{state.song.artist}</p>
          <span className="selected-song__hint">
            <Info size={12} />
            Se agregará a la cola del bar
          </span>
        </div>

        <div className="form-field">
          <label htmlFor="ig-input">
            Tu Instagram <span className="optional">(opcional)</span>
          </label>
          <div className="input-wrap">
            <Instagram size={16} />
            <input
              id="ig-input"
              type="text"
              placeholder="@tu_usuario"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              autoComplete="off"
              onKeyDown={(e) => e.key === "Enter" && handlePay()}
            />
          </div>
          <span className="field-hint">Para que vean quién puso el tema 🎵</span>
        </div>

        <div className="price-box">
          <div>
            <span className="price-label">Total</span>
            <span className="price-sub">Un pago único</span>
          </div>
          <div className="price-amount">
            <span className="price-currency">$</span>
            {amount.toLocaleString("es-CL")}
            <span className="price-clp">CLP</span>
          </div>
        </div>
      </div>

      <div className="screen-footer">
        <button
          className="btn btn--primary btn--xl"
          onClick={handlePay}
          disabled={phase === "paying"}
        >
          <Lock size={14} />
          Pagar y agregar
        </button>
        <p className="micro-copy">
          <Lock size={11} />
          Pago seguro · Tu canción suena garantizada
        </p>
      </div>
    </div>
  );
};

export default Confirmation;
