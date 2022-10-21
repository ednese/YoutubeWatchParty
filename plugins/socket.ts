import { io as socketIo } from 'socket.io-client'

export default defineNuxtPlugin(() => {
  const io = socketIo();
  return {
    provide: {
      io,
    },
  };
});