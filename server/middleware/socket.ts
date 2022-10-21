import type { IncomingMessage, ServerResponse } from 'http'
import { Server } from 'socket.io'

let server: any = null

export default (req: IncomingMessage, res: ServerResponse) => {
  if (!server) {
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    if (typeof ip === 'string') {
      if (ip.split(',').length > 0) ip = ip.split(',')[0]
      ip = ip.slice(ip.lastIndexOf(':') + 1, ip.length);
    }

    // @ts-expect-error: Nuxt3
    server = res.socket?.server
    const io = new Server(server);

    io.on('connection', (socket) => {
      console.log("socket connected", socket.id);


      socket.on("join room", (room) => {
        socket.join(room);
        const players = io.sockets.adapter.rooms.get(room).size
        io.emit("new player", players);
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
    })
  }
}
