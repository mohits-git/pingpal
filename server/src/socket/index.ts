import { Server } from 'socket.io';
import { createServer, get } from 'http';
import express from "express";
import { validateUser } from '../helpers/validate-user.js';

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }
});

const users = new Map<string, { name: string, description: string }>();

io.on('connection', async (socket) => {
  console.log('a user connected');

  const token = socket.handshake?.auth?.token;

  const user = await validateUser(token);

  if (!user?.username) {
    socket.disconnect();
    console.log("Kicked user");
    return;
  }

  socket.join(user.username);

  users.set(user.username, {
    name: user.name,
    description: user.description
  });

  const getUserInfo = (username: string) => {
    const { name, description } = users.get(username);
    return { username, name, description };
  }

  const updateUsers = () => {
    io.emit('update-users', {
      users: Array
        .from(users)
        .map(([username, { name, description }]) => ({
          username,
          name,
          description
        })),
    });
  }

  updateUsers();

  socket.on('disconnect', () => {
    users.delete(user.username);
    updateUsers();
    console.log('user disconnected');
  });

  socket.on('ping', () => {
    io.emit('ping', getUserInfo(user.username));
  });

  socket.on('ping-user', (data: { username: string }) => {
    io.to(data.username)
      .emit('ping-user', getUserInfo(user.username));
  });
});

export {
  app,
  server
};
