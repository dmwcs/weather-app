import { Server } from "socket.io";
import { CITIES } from "../config/cities.js";

export function setupSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_city", (cityName: string) => {
      const city = CITIES.find((c) => c.name === cityName);
      if (!city) return;

      // Leave all city rooms before joining a new one
      CITIES.forEach((c) => socket.leave(c.name));

      // Join the new city room
      socket.join(cityName);
      console.log(`${socket.id} joined ${cityName}`);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}
