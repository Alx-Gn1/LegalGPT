import type { NextApiRequest, NextApiResponse } from "next";
// const bcrypt = require("bcrypt");
import bcrypt from "bcrypt";
const path = require("path");
import formidable from "formidable";
import { mkdir, stat } from "fs/promises";
import mime from "mime";
import pool from "./utils/database";
import { userAuthSchema, userSchema } from "@/utils/schemas/userSchema";
import validatePassword, { PasswordValidatorErrorMessage } from "@/utils/schemas/passwordSchema";

export default async function signup(req: NextApiRequest, res: NextApiResponse) {
  return new Promise(async (resolve, reject) => {
    const uploadDir = path.join(process.cwd(), `/public/images`);

    try {
      await stat(uploadDir);
    } catch (e: any) {
      if (e.code === "ENOENT") {
        await mkdir(uploadDir, { recursive: true });
      } else {
        console.error(e);
        return;
      }
    }

    const form = formidable({
      maxFiles: 1,
      maxFileSize: 1024 * 1024 * 4, // 4mb
      uploadDir,
      filename: (_name, _ext, part) => {
        const uniqueSuffix = `${new Date(Date.now())
          .toLocaleString("fr-FR")
          .replace(/[\/\\]/g, "-")
          .replace(" ", "_")
          .replace(":", "h")
          .replace(":", "min")}s`;
        const filename = `${part.name || "unknown"}-${uniqueSuffix}.${
          mime.getExtension(part.mimetype || "") || "unknown"
        }`;
        return filename;
      },
      filter: (part) => {
        return part.mimetype?.includes("image") || false;
      },
    });

    form.parse(req, async (err, fields, files) => {
      const username = fields.username as string;
      const password = fields.password as string;

      if (!username || !password) {
        resolve(
          res
            .status(400)
            .json({ status: 400, error: `Veuillez rentrer un nom d'utilisateur et un mot de passe valide` })
        );
        return;
      }
      // Envoie un message personnalisé en fonction de s'il manque une majuscule dans le mdp, une minuscule, un chiffre etc
      const passwordIsValid = validatePassword(password);
      if (passwordIsValid.length > 0) {
        resolve(res.status(400).json({ status: 400, error: passwordIsValid[0].message }));
        return;
      }

      // profilePic doit être de type formidable.File et non pas formidable.File[]
      let profilePic: formidable.File | null;
      const { profilePicture } = files;
      profilePic = profilePicture ? (profilePicture as formidable.File) : null;

      bcrypt
        .hash(password, 10)
        .then((hash: string) => {
          pool.query(
            `INSERT INTO user (username, passwordHash, profilePicture) VALUES ('${username}', '${hash}', '${
              profilePic ? profilePic.newFilename : "default-profile-picture.webp"
            }');`,
            (err) => {
              if (err && err.code === "ER_DUP_ENTRY") {
                resolve(
                  res.status(400).json({ status: 400, error: `Le nom d'utilisateur "${username}" est déjà pris` })
                );
              } else if (err) {
                console.log(err);
                resolve(res.status(500).json({ status: 500, error: "Une erreur inconnue est survenue" }));
              } else {
                // resolve(res.status(200).json({ status: 200, message: "L'utilisateur a bien été créé" }));
                resolve(res.status(500).json({ status: 200, message: "L'utilisateur a bien été créé" }));
              }
            }
          );
        })
        .catch(() => {
          resolve(res.status(500).json({ status: 500, error: "Une erreur inconnue est survenue" }));
        });
    });
  });
}

export const config = {
  api: { bodyParser: false },
};
