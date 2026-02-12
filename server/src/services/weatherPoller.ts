import { Server } from "socket.io";
import { CITIES } from "../config/cities";

const POLL_INTERVAL = 60_000; // 60 seconds

async function fetchWeather(lat: number, lon: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m`;
  const res = await fetch(url);
  const data = await res.json();
  return data.current;
}

export function startWeatherPoller(io: Server) {
  setInterval(async () => {
    for (const city of CITIES) {
      // Skip cities with no active users
      const room = io.sockets.adapter.rooms.get(city.name);
      if (!room || room.size === 0) continue;

      try {
        const weather = await fetchWeather(city.lat, city.lon);
        io.to(city.name).emit("weather_update", {
          city: city.name,
          ...weather,
        });
        console.log(`Weather sent to ${city.name} (${room.size} users)`);
      } catch (err) {
        console.error(`Failed to fetch weather for ${city.name}:`, err);
      }
    }
  }, POLL_INTERVAL);
}
