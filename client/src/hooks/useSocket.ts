import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { fetchAuthSession } from "aws-amplify/auth";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let s: Socket;

    async function connect() {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      s = io(SERVER_URL, {
        auth: { token },
      });

      s.on("connect", () => {
        setSocket(s);
        setConnected(true);
      });

      s.on("disconnect", () => setConnected(false));
    }

    connect();

    return () => {
      if (s) s.disconnect();
    };
  }, []);

  return { socket, connected };
}
