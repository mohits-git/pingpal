import { Request, Response } from "express";
import loginSchema from "../schemas/login-schema.js";
import { prisma } from "../db/index.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (req: Request, res: Response) => {
  try {
    const validate = loginSchema.safeParse(req.body);

    if (!validate.success) {
      return res.status(400).json(validate.error);
    }

    const { email, password } = validate.data;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const validPassword = await bcryptjs.compare(password, user.pass);

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      token,
      message: "Login successful"
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
