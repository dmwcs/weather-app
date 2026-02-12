import { Server } from "socket.io";
import { CITIES } from "../config/cities";
import { fetchWeather } from "../services/weatherPoller";

export function setupSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join", async (cityName: string) => {
      const city = CITIES.find((c) => c.name === cityName);
      if (!city) return;

      // Leave all city rooms before joining a new one
      CITIES.forEach((c) => socket.leave(c.name));

      // Join the new city room
      socket.join(cityName);
      console.log(`${socket.id} joined ${cityName}`);

      // Immediately send weather data
      try {
        console.log(`Fetching weather for ${cityName}...`);
        const weather = await fetchWeather(city.lat, city.lon);
        console.log(`Weather fetched for ${cityName}:`, weather);
        socket.emit("weather_update", { city: city.name, ...weather });
        console.log(`Weather sent to ${socket.id} for ${cityName}`);
      } catch (err) {
        console.error(`Failed to fetch weather for ${cityName}:`, err);
      }
    });

    socket.on("leave", (cityName: string) => {
      socket.leave(cityName);
      console.log(`${socket.id} left ${cityName}`);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}
