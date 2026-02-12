import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const s = io(SERVER_URL);

    s.on("connect", () => {
      setSocket(s);
      setConnected(true);
    });

    s.on("disconnect", () => setConnected(false));

    return () => {
      s.disconnect();
    };
  }, []);

  return { socket, connected };
}
