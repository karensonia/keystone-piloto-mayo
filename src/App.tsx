import { useEffect, useState } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Signal, Wifi, Battery } from "lucide-react";
import Welcome from "./pages/Welcome";
import Venues from "./pages/Venues";
import Home from "./pages/Home";
import Confirmation from "./pages/Confirmation";
import NotFound from "./pages/NotFound";
import AddSong from "./pages/AddSong";

const queryClient = new QueryClient();

function StatusBar() {
  const [time, setTime] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const d = new Date();
      setTime(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="status-bar">
      <span className="status-time">{time}</span>
      <div className="status-icons">
        <Signal size={13} />
        <Wifi size={13} />
        <Battery size={13} />
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Sonner />
    <BrowserRouter>
      <div className="device-shell">
        <div className="device-frame">
          <div className="device-notch" />
          <StatusBar />
          <main className="app">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/venues" element={<Venues />} />
              <Route path="/home" element={<Home />} />
              <Route path="/add-song" element={<AddSong />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
