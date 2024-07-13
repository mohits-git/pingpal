import { Request, Response } from "express";
import { validateUser } from "../helpers/validate-user.js";

const verifyLogin = async (req: Request, res: Response) => {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const valid = await validateUser(token);

    if (!valid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    return res.status(200).json({ message: "Authorized" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

export default verifyLogin;
