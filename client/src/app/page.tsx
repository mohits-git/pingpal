'use client';
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type UsersOnline = {
  name: string;
  username: string;
  description: string;
}[];

export default function Ping() {
  const navigate = useRouter();
  const [socketConnection, setSocketConnection] = useState<Socket | null>(null);
  const [users, setUsers] = useState<UsersOnline | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate.push('/login');
      return;
    }

    const verifyLogin = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/verify-login`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        navigate.push('/login');
      }

      const responseData = await response.json();
      setUsername(responseData.username);
    }

    verifyLogin();
  }, []);

  useEffect(() => {
    const socketConnection = io(process.env.NEXT_PUBLIC_BACKEND_URL as string, {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    const handleUpdateUsers = (data: { users: UsersOnline }) => {
      setUsers(data.users.map(user => {
        if (user.username === username)
          return { ...user, name: 'You' }
        return user;
      }));
    }

    const sendToast = (user: UsersOnline[number], target: string) => {
      toast(
        `${user.name} pinged ${target}!`,
        {
          description: "Click here to see user's card and ping back",
          action: {
            label: 'Profile 👀',
            onClick: () => {
              socketConnection.emit('ping-user', {
                username: user.username
              });
            }
          }
        }
      );
    };

    const handlePing = (user: UsersOnline[number]) => {
      if (user.username === username) return;
      sendToast(user, 'everyone');
    }

    const handlePingUser = (user: UsersOnline[number]) => {
      sendToast(user, 'you');
    }

    socketConnection.on('connect', () => {
      console.log('Connected to the server');
    });
    socketConnection.on('disconnect', () => {
      console.log('Disconnected from the server');
    });

    socketConnection.on('update-users', handleUpdateUsers);

    socketConnection.on('ping', handlePing);

    socketConnection.on('ping-user', handlePingUser);

    setSocketConnection(socketConnection);

    return () => {
      socketConnection.disconnect();
      socketConnection.off('update-users', handleUpdateUsers);
      socketConnection.off('ping', handlePing);
      socketConnection.off('ping-user', handlePingUser);
      setSocketConnection(null);
    }
  }, [username]);

  const handleSendPing = () => {
    if (!socketConnection) {
      toast.error('Not connected to the server');
      return;
    }
    socketConnection.emit('ping');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button
        onClick={handleSendPing}
      >
        Ping Everyone
      </Button>
    </main>
  );
}
