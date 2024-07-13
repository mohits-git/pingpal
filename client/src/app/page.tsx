'use client';
import { useEffect } from "react";
import { io } from "socket.io-client";

export default function Ping() {
  useEffect(() => {
    const socketConnection = io('http://localhost:8080');
    socketConnection.on('connect', () => {
      console.log('Connected to the server');
    });
    socketConnection.on('disconnect', () => {
      console.log('Disconnected from the server');
    });
    return () => {
      socketConnection.disconnect();
    }
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Hemlo this page will connect to the websocket server at localhost:8080
    </main>
  );
}
