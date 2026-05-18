// lib/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const socketInstance = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      transports: ["websocket"],
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
    });

    socket.on("connect", () => {
      // console.log("Socket connected:", socket?.id);
    });
  }
  return socket;
};


