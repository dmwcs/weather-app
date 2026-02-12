import { useState, useEffect } from "react";
import { signOut } from "aws-amplify/auth";
import { useNavigate } from "react-router";
import { useSocket } from "../hooks/useSocket";
import Header from "../components/Header";
import WeatherDisplay from "../components/WeatherDisplay";
import Chat from "../components/Chat";

const CITIES = ["Sydney", "Melbourne", "Brisbane"];

interface WeatherData {
  city: string;
  temperature_2m: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
}

interface Message {
  city: string;
  body: string;
  sender: string;
  timestamp: string;
}

export default function HomePage() {
  const navigate = useNavigate();
  const { socket, connected } = useSocket();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!socket) return;

    socket.on("weather_update", (data: WeatherData) => {
      setWeather(data);
    });

    socket.on("new_message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("weather_update");
      socket.off("new_message");
    };
  }, [socket]);

  function handleCitySelect(city: string) {
    if (!socket) return;

    if (selectedCity) {
      socket.emit("leave", selectedCity);
    }
    socket.emit("join", city);
    setSelectedCity(city);
    setWeather(null);
    setMessages([]);
  }

  function handleSendMessage(body: string) {
    if (!socket || !selectedCity) return;
    socket.emit("send_message", { city: selectedCity, body });
  }

  async function handleLogout() {
    await signOut();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Header connected={connected} onLogout={handleLogout} />

      {/* City Selection */}
      <div className="flex gap-3 mb-8">
        {CITIES.map((city) => (
          <button
            key={city}
            onClick={() => handleCitySelect(city)}
            className={`px-6 py-3 rounded-lg font-medium cursor-pointer ${
              selectedCity === city
                ? "bg-blue-600 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-gray-200"
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {selectedCity && (
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">{selectedCity}</h2>
          <WeatherDisplay weather={weather} />
          <Chat messages={messages} onSend={handleSendMessage} />
        </div>
      )}
    </div>
  );
}
