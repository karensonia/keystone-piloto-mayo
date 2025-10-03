import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const venues = [
	{
		id: "siete-negronis",
		name: "Siete Negronis",
		address: "Av. Vitacura 3520, Santiago",
		image: "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nqrK6Yq3vKX0zYWoEL1Fw6LVixOMEfDnA2GA-bY790-bSKoB22riOpgTR-hXYbZjDck8oZROkOuZEJNPw60jhht_Fbqtdy5nBHFAGbY7xhckeVl3aHDKorhT2U7cZDnOKTZZjXg=w243-h406-n-k-no-nu",
	},
	{
		id: "bar-candelaria",
		name: "Bar Candelaria",
		address: "Av. Providencia 1234, Santiago",
		image: "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nolHNTGFTu3ao646XFg8jXR1YAjOZI1E3NEyWBAveKQDHJn2LyUZNVUdiT_xkGffkBfY3Mc048hIpXsnvc9PamrO8HwwOdr-_zKbkmdxwklPb7S4kLFM5csIRr1pE_flIijLE8s=s1360-w1360-h1020-rw",
	},
	{
		id: "resto-milano",
		name: "Resto Milano",
		address: "Av. Italia 567, Santiago",
		image: "https://lh3.googleusercontent.com/p/AF1QipMQM84GCmEM6Jn2Rt3SbTpCh5Yx2H9piy6XEuF9=s1360-w1360-h1020-rw",
	},
];

const Venues = () => {
	const navigate = useNavigate();

	const handleEnter = (venue: any) => {
		localStorage.setItem("selectedVenue", JSON.stringify(venue));
		// Inicializa playlist del local si no existe
		const playlistKey = `playlist_${venue.id}`;
		if (!localStorage.getItem(playlistKey)) {
			localStorage.setItem(playlistKey, JSON.stringify([]));
		}
		navigate("/home");
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-6">
			<h1 className="text-3xl font-bold mb-8 text-gradient">
				Elige tu local
			</h1>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
				{venues.map((venue) => (
					<Card
						key={venue.id}
						className="p-0 overflow-hidden shadow-lg group"
					>
						<img
							src={venue.image}
							alt={venue.name}
							className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
						/>
						<div className="p-6 flex flex-col gap-3">
							<h2 className="font-bold text-xl text-foreground">
								{venue.name}
							</h2>
							<p className="text-muted-foreground text-sm">
								{venue.address}
							</p>
							<Button
								className="mt-2 w-full"
								onClick={() => handleEnter(venue)}
							>
								Entrar
							</Button>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
};

export default Venues;
