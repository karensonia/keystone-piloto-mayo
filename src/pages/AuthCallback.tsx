import { useEffect, useState } from "react";

const AuthCallback = () => {
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get("code");
    const e = params.get("error");
    if (c) setCode(c);
    if (e) setError(e);
  }, []);

  const copy = () => code && navigator.clipboard.writeText(code);

  return (
    <div style={{
      padding: "32px 24px",
      fontFamily: "monospace",
      background: "#05070d",
      color: "#e5e9f5",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    }}>
      {error && (
        <p style={{ color: "#ff5577" }}>Error: {error}</p>
      )}
      {code && (
        <>
          <p style={{ color: "#22e58a", fontWeight: 700 }}>✓ Código recibido</p>
          <p style={{ fontSize: "12px", color: "#9aa3bd" }}>Copiá este código y pegalo donde te indiquen:</p>
          <code style={{
            display: "block",
            background: "#0b1020",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
            padding: "16px",
            fontSize: "11px",
            wordBreak: "break-all",
            lineHeight: 1.6,
            color: "#00d4ff",
          }}>
            {code}
          </code>
          <button
            onClick={copy}
            style={{
              background: "linear-gradient(135deg,#00d4ff,#2b7fff)",
              border: "none",
              borderRadius: "12px",
              color: "#001020",
              fontWeight: 700,
              padding: "12px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Copiar código
          </button>
        </>
      )}
      {!code && !error && (
        <p style={{ color: "#606a86" }}>Esperando código…</p>
      )}
    </div>
  );
};

export default AuthCallback;
