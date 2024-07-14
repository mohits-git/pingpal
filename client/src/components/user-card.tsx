import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";

type Props = {
  username: string;
  name: string;
  description: string;
  handlePingUser: (username: string) => void;
}

const UserCard: React.FC<Props> = ({ username, name, description, handlePingUser }) => {
  return (
    <Card className="col-span-1 h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <CardTitle>
              {name}
            </CardTitle>
            <CardDescription>
              @{username}
            </CardDescription>
          </div>
          <div>
            <Button
              onClick={() => {
                handlePingUser(username);
              }}
              className="rounded-full"
            >
              Ping User 📡
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {description}
      </CardContent>
    </Card>
  )
}

export default UserCard
