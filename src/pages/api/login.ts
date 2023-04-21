import type { NextApiRequest, NextApiResponse } from "next";
import pool from "./utils/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserData } from "@/utils/interfaces";
import validatePassword from "@/utils/schemas/passwordSchema";

interface UserCredentials {
  username: string;
  password: string;
}

export default function login(req: NextApiRequest, res: NextApiResponse) {
  return new Promise((resolve, reject) => {
    if (!req.body) {
      resolve(res.status(401).json({ error: "Not Authorized" }));
    }
    const credentials: UserCredentials = JSON.parse(req.body);
    // Si le mdp ne répond pas aux critères fixés lors de l'inscription, pas la peine de vérifier si c'est le bon mdp ou non
    const passwordIsValid = validatePassword(credentials.password);
    if (passwordIsValid.length > 0) {
      resolve(res.status(400).json({ status: 400, error: "identifiant/mot de passe incorrect" }));
      return;
    }
    // Recup l'utilisateur dans sql, compare le mdp de la requête avec le hash de la base de données
    pool.query(`SELECT * FROM user WHERE username = "${credentials.username}";`, (err, rows, fields) => {
      const users = rows as Array<UserData>;
      if (!users || !users[0]) {
        resolve(res.status(401).json({ status: 401, message: "identifiant/mot de passe incorrect" }));
        return;
      }
      const user = users[0] as UserData | undefined;
      const userId = user?.id;
      if (user) {
        bcrypt
          .compare(credentials.password, user.passwordHash!)
          .then((valid) => {
            if (valid === false) {
              resolve(res.status(401).json({ status: 401, message: "identifiant/mot de passe incorrect" }));
            } else {
              const token = jwt.sign({ userId }, process.env.JWT_PRIVATE_TOKEN!, {});
              resolve(res.status(200).json({ status: 200, userId, token }));
            }
          })
          .catch((error) => {
            console.log(error);
            resolve(res.status(500).json({ status: 500, error: "Une erreur est survenue" }));
          });
      } else {
        resolve(res.status(400).json({ status: 400, message: "identifiant/mot de passe incorrect" }));
      }
    });
  });
}
