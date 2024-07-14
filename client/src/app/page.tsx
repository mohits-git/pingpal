'use client';
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";

export default function Ping() {
  const [connect, setConnect] = useState(false);
  const navigate = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate.push('/login');
    }

    const verifyLogin = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/verify-login`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log(response);

      if (!response.ok) {
        navigate.push('/login');
      }
    }

    verifyLogin();
  }, []);

  useEffect(() => {
    if (!connect) return;
    const socketConnection = io(process.env.NEXT_PUBLIC_BACKEND_URL as string, {
      auth: {
        token: localStorage.getItem('token')
      }
    });
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
      <p>
        Hemlo this page will connect to the websocket server at localhost:8080
      </p>
      <Button
        onClick={() => setConnect((c) => !c)}
      >
        {connect ? 'Disconnect' : 'Connect'}
      </Button>
    </main>
  );
}
