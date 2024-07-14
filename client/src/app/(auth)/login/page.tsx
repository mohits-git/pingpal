"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { LoginSchema } from "@/lib/schemas/login-schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Login: React.FC = () => {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const navigate = useRouter();

  async function onSubmit(data: z.infer<typeof LoginSchema>) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (!response.ok)
        throw new Error(
          responseData.email
          || responseData.password
          || responseData.error
        );

      const token: string = responseData.token;
      localStorage.setItem("token", token);
      form.reset();
      navigate.push("/");
    } catch (error: any) {
      form.setError("root", {
        message: error?.error || error?.message || "Oopsy!! :( Something went wrong ;-;"
      });
      toast('Oopsy!! :( Something went wrong ;-;', {
        description: error?.error || error?.message || "Please try again later.",
      });
      console.log(error);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-xl">Login</CardTitle>
            <CardDescription>Login to Ping your Pals.</CardDescription>
            {form.formState.errors.root && (
              <div className="text-red-500 text-sm">{form.formState.errors.root.message}</div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button className="w-full" type="submit">Login</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

export default Login
