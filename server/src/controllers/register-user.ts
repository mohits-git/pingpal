import { Request, Response } from "express";
import registerSchema from "../schemas/register-schema.js";
import { prisma } from "../db/index.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const valid = registerSchema.safeParse(req.body);
    if (!valid.success) {
      res.status(400).json(valid.error);
    }

    const { name, username, email, password, description } = valid.data;

    const userWithEmail = await prisma.user.findUnique({
      where: {
        email,
      }
    });
    if (userWithEmail) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    const userWithUsername = await prisma.user.findUnique({
      where: {
        username,
      }
    });
    if (userWithUsername) {
      return res.status(400).json({ error: "User already exists with this username" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        description,
        email,
        pass: hashedPassword,
      }
    });

    if (!user) {
      throw new Error("Something went wrong while creating user");
    }

    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d", }
    );

    return res.status(201).json({ token });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
