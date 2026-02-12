import { Server } from "socket.io";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { CITIES } from "../config/cities";
import { fetchWeather } from "../services/weatherPoller";

let verifier: ReturnType<typeof CognitoJwtVerifier.create>;

function getVerifier() {
  if (!verifier) {
    verifier = CognitoJwtVerifier.create({
      userPoolId: process.env.COGNITO_USER_POOL_ID!,
      clientId: process.env.COGNITO_CLIENT_ID!,
      tokenUse: "id",
    });
  }
  return verifier;
}

export function setupSocket(io: Server) {
  // Verify JWT token on connection
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("No token provided"));
    }
    try {
      const payload = await getVerifier().verify(token);
      socket.data.username = payload["cognito:username"];
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id} (${socket.data.username})`);

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

    socket.on("send_message", (data: { city: string; body: string }) => {
      const message = {
        city: data.city,
        body: data.body,
        sender: socket.data.username,
        timestamp: new Date().toISOString(),
      };
      io.to(data.city).emit("new_message", message);
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
