import { Router } from "express";
import { Server } from "socket.io";
import { requireAuth } from "../middleware/auth";

export function createMessageRouter(io: Server) {
  const router = Router();

  router.post("/", requireAuth, (req, res) => {
    const { title, body } = req.body;

    if (!title || !body) {
      res.status(400).json({ error: "title and body are required" });
      return;
    }

    const message = {
      title,
      body,
      sender: (req as any).user["cognito:username"],
      timestamp: new Date().toISOString(),
    };

    io.emit("new_message", message);
    res.status(201).json(message);
  });

  return router;
}
