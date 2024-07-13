import jwt from "jsonwebtoken";
import tokenSchema from "../schemas/token-schema.js";

export const validateUser = async (token: string) => {
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET as string);

    const decoded = tokenSchema.safeParse(decode);

    if (!decoded.success)
      throw new Error("Invalid token schema. Please login again.");

    return decoded.data.username;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError)
      console.log("Invalid token");
    else console.log("Unexpected Error", error);
    return null;
  }
}
