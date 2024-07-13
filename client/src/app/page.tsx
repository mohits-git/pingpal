'use client';
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Ping() {
  const [connect, setConnect] = useState(false);
  useEffect(() => {
    if (!connect) return;
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
  }, [connect]);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Hemlo this page will connect to the websocket server at localhost:8080
      <Button
        onClick={() => setConnect((c) => !c)}
      >
        {connect ? 'Disconnect' : 'Connect'}
      </Button>
    </main>
  );
}
