// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import pool from "../../utils/database";
import { verifyAuthApiRoutes } from "../../utils/verifyAuthApiRoutes";
import { UserData } from "@/utils/interfaces";

export default async function getUserData(req: NextApiRequest, res: NextApiResponse) {
  const uid = req.query.userId as string | undefined;
  const userId = uid ? parseInt(uid) : undefined;
  const token = req.headers?.authorization?.split(" ")[1];

  return new Promise((resolve, reject) => {
    if (verifyAuthApiRoutes({ userId, token }, res) === false) {
      resolve(res.status(401).json({ error: "Not Authorized" }));
      return;
    }
    
    pool.query(`SELECT * FROM user WHERE id = "${userId}";`, (err, rows) => {
      const usersInDb = rows as Array<UserData>;
      const userInDb = usersInDb[0] as UserData | undefined;
      delete userInDb?.passwordHash;
      delete userInDb?.id;
      resolve(res.status(200).json({ userData: userInDb }));
    });
  });
}
