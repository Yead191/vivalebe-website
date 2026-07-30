// hooks/useSocket.ts
"use client";

import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { socketInstance } from "./socket";

export default function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(socketInstance());
  }, []);

  return socket;
}
