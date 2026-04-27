import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_obbd775";
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_vt9kbck";
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "QugU4WjkNqq-7Q_YE";

export async function sendSongNotification(params: {
  songTitle: string;
  songArtist: string;
  instagram: string;
  isFree: boolean;
}) {
  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      to_email: "keystonemusicbox@gmail.com",
      song_title: params.songTitle,
      song_artist: params.songArtist,
      instagram: params.instagram || "anónimo",
      price: params.isFree ? "Gratis (primera canción)" : "$1.000 CLP",
    },
    { publicKey: PUBLIC_KEY }
  );
}
