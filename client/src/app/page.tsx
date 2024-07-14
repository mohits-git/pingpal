'use client';
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import UserCard from "@/components/user-card";

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
          description: "Click here to ping back",
          action: {
            label: 'Ping Back 👀',
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

  const handleSendPingUser = (targetUsername: string) => {
    if (!socketConnection) {
      toast.error('Not connected to the server');
      return;
    }
    if (username === targetUsername) {
      toast.error('You cannot ping yourself');
      return;
    }
    socketConnection.emit('ping-user', {
      username: targetUsername
    });

  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users?.map(user => (
          <UserCard
            key={user.username}
            username={user.username}
            name={user.name}
            description={user.description}
            handlePingUser={handleSendPingUser}
          />
        ))}
      </div>
      <div className="absolute bottom-16 left-0 right-0 w-full flex items-center justify-center">
        <Button
          onClick={handleSendPing}
          className="px-8 py-6 text-xl rounded-full"
        >
          Ping Everyone 📡
        </Button>
      </div>
    </main>
  );
}
