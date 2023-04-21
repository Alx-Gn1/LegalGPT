import jwt from "jsonwebtoken";
import pool from "./database";
import { NextApiResponse } from "next";

interface User {
  userId: number | undefined;
  token: string | undefined;
}

export const verifyAuthApiRoutes = (user: User, res: NextApiResponse) => {

  if (!user || !user.token || !user.userId) {
    return false;
  } else {
    const verifiedToken = jwt.verify(user.token!, process.env.JWT_PRIVATE_TOKEN!);

    if (verifiedToken) return true;
  }
};
