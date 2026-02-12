import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { setupSocket } from "./socket/handler";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

setupSocket(io);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io };
