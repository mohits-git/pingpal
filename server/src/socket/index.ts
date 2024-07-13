import { Server } from 'socket.io';
import { createServer } from 'http';
import express from "express";
import { validateUser } from '../helpers/validate-user.js';

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  }
});

const users = new Set<string>();

io.on('connection', async (socket) => {
  console.log('a user connected');

  const token = socket.handshake.auth.token;

  const username = await validateUser(token);

  if (!username) {
    socket.disconnect();
    return;
  }

  socket.join(username);
  users.add(username);

  socket.emit('update-users', {
    users: Array.from(users)
  });

  socket.on('disconnect', () => {
    users.delete(username);
    socket.emit('update-users', {
      users: Array.from(users)
    });
    console.log('user disconnected');
  });

  socket.on('ping', () => {
    io.emit('ping', {
      username
    });
  });

  socket.on('ping-user', (data: { username: string }) => {
    io.to(data.username).emit('ping', {
      username
    });
  });
});

export {
  app,
  server
};
