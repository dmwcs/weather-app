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
  const [msgInput, setMsgInput] = useState("");

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

  function handleSendMessage() {
    if (!socket || !selectedCity || !msgInput.trim()) return;
    socket.emit("send_message", { city: selectedCity, body: msgInput });
    setMsgInput("");
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

          {/* Chat */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Chat</h3>
            <div className="bg-gray-700 rounded-lg p-4 h-48 overflow-y-auto mb-3 flex flex-col gap-2">
              {messages.length === 0 ? (
                <p className="text-gray-400 text-sm">No messages yet</p>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className="text-sm">
                    <span className="text-blue-400 font-medium">{msg.sender}</span>
                    <span className="text-gray-500 text-xs ml-2">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                    <p className="text-gray-200">{msg.body}</p>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 outline-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!msgInput.trim()}
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
