const SERVICE_ID = "service_obbd775";
const TEMPLATE_ID = "template_vt9kbck";
const PUBLIC_KEY = "QugU4WjkNqq-7Q_YE";

export async function sendSongNotification(params: {
  songTitle: string;
  songArtist: string;
  instagram: string;
  isFree: boolean;
  trackId?: string;
}) {
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: SERVICE_ID,
      template_id: TEMPLATE_ID,
      user_id: PUBLIC_KEY,
      template_params: {
        to_email: "keystonemusicbox@gmail.com",
        song_title: params.songTitle,
        song_artist: params.songArtist,
        instagram: params.instagram || "anónimo",
        price: params.isFree ? "Gratis (primera canción)" : "$1.000 CLP",
        spotify_link: params.trackId
          ? `https://open.spotify.com/track/${params.trackId}`
          : "",
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`EmailJS ${res.status}: ${text}`);
  }
}
