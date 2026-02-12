import { useState, useEffect } from "react";
import { signOut } from "aws-amplify/auth";
import { useNavigate } from "react-router";
import { useSocket } from "../hooks/useSocket";

const CITIES = ["Sydney", "Melbourne", "Brisbane"];

interface WeatherData {
  city: string;
  temperature_2m: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
}

export default function HomePage() {
  const navigate = useNavigate();
  const { socket, connected } = useSocket();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // Listen for weather updates
  useEffect(() => {
    if (!socket) return;

    socket.on("weather_update", (data: WeatherData) => {
      setWeather(data);
    });

    return () => {
      socket.off("weather_update");
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
  }

  async function handleLogout() {
    await signOut();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Weather App</h1>
        <div className="flex items-center gap-4">
          <span className={`text-sm ${connected ? "text-green-400" : "text-red-400"}`}>
            {connected ? "Connected" : "Disconnected"}
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-sm cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

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

      {/* Weather Display */}
      {selectedCity && (
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">{selectedCity}</h2>
          {weather ? (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold">{weather.temperature_2m}°C</div>
                <div className="text-gray-400 text-sm mt-1">Temperature</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold">{weather.wind_speed_10m}</div>
                <div className="text-gray-400 text-sm mt-1">Wind Speed (km/h)</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold">{weather.wind_direction_10m}°</div>
                <div className="text-gray-400 text-sm mt-1">Wind Direction</div>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Waiting for weather data...</p>
          )}
        </div>
      )}
    </div>
  );
}
