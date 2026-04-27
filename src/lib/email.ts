import emailjs from "@emailjs/browser";

export async function sendSongNotification(params: {
  songTitle: string;
  songArtist: string;
  instagram: string;
  isFree: boolean;
}) {
  return emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    {
      song_title: params.songTitle,
      song_artist: params.songArtist,
      instagram: params.instagram || "anónimo",
      price: params.isFree ? "Gratis (primera canción)" : "$1.000 CLP",
    },
    { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
  );
}
