import http from "http";
import { Server, Socket } from "socket.io";

export let socket: Socket;

export const initSocket = (server: http.Server) => {
  const socketIo = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  socketIo.on("connection", (_socket) => {
    socket = _socket;
    const userId = socket.handshake.query?.userId as string;
    if (userId && userId !== "undefined") {
      socket.join(userId);
      setTimeout(() => {
        console.log({ userId });
        socket.emit("message", { data: "test message" });
      }, 3000);
      console.log("User connected:", userId);
    } else {
      console.warn("Connection attempt without valid userId.");
    }

    socket.on("disconnect", () => {
      console.log("User disconnected:", userId);
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });

    socket.on("ping", (data) => {
      socket.emit("pong", data);
    });
  });
};
