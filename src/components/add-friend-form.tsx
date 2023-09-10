"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { addFriendValidator } from "@/lib/validations";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type FormData = z.infer<typeof addFriendValidator>;

export default function AddFriendForm() {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(addFriendValidator) });

  async function onSubmit({ email }: FormData) {
    try {
      const validatedEmail = addFriendValidator.parse({ email });

      const response = await fetch("/api/friends/add", {
        method: "POST",
        body: JSON.stringify(validatedEmail),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setSuccess(true);
    } catch (error) {
      /* Handle Zod Errors */
      if (error instanceof z.ZodError) {
        setError("email", { message: error.message });
        return;
      }

      /* Handle Fetch Errors */
      if (error instanceof Error) {
        setError("email", { message: error.message });
        return;
      }

      /* Handle Unknown Errors */
      setError("email", { message: "Something went wrong" });
    }
  }

  return (
    <form className="max-w-sm" onSubmit={handleSubmit(onSubmit)}>
      <Label htmlFor="email">Add Friend by E-Mail</Label>

      <div className="mt-2 flex gap-4">
        <Input placeholder="you@example.com" {...register("email")} />

        <Button>Add</Button>
      </div>

      <p className="mt-1 text-sm text-destructive">{errors.email?.message}</p>

      {success && (
        <p className="mt-1 text-sm text-green-500">Friend Request Sent!</p>
      )}
    </form>
  );
}
