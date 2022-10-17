import { Server, Socket } from "socket.io";

export default function (io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("socket connected", socket.id);
    socket.on("join room", (room) => {
      socket.join(room);
      const players = io.sockets.adapter.rooms.get(room).size
      io.emit("new player", players);
      // console.log('values', socket.rooms.values())
      // console.log('socket', socket.id)
    });
    socket.on("start party", ({ room, videos }) => {
      // socket.to(room).emit("start party")
      io.in(room).emit("start party", { room, videos })
    });
    socket.on("display video", ({ room, index }) => {
      io.in(room).emit("display video", index )
      // socket.to(params.room).emit("display video", params)
    });
    socket.on("disconnect", (reason) => {
      console.log("socket disconnected");
      io.emit("user disconnected", socket.id);
    });
  });
}