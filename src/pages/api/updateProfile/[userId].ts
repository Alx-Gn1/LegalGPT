import type { NextApiRequest, NextApiResponse } from "next";
// const bcrypt = require("bcrypt");
import bcrypt from "bcrypt";
const path = require("path");
import formidable from "formidable";
import { mkdir, stat } from "fs/promises";
import mime from "mime";
import pool from "../utils/database";
import { verifyAuthApiRoutes } from "../utils/verifyAuthApiRoutes";

export default async function updateProfile(req: NextApiRequest, res: NextApiResponse) {
  return new Promise(async (resolve, reject) => {
    // Obligé d'utiliser les raw Headers car j'utilise formidable
    // Cependant je veux vérifier l'authentification utilisateur avant
    // de recevoir les fichiers, d'examiner la requête, et avant de laisser
    // formidable parser le body et headers de la requête
    const UserAuthIndex = req.rawHeaders.findIndex((value) => value === "Authorization") + 1;
    const Bearer = req.rawHeaders[UserAuthIndex];
    const token = Bearer.split(" ")[1];
    const userId = parseInt(Bearer.split(" ")[2]);
    if (verifyAuthApiRoutes({ userId, token }, res) === false) {
      resolve(res.status(401).json({ error: "Not Authorized" }));
      return;
    }
    //
    //

    const uploadDir = path.join(process.cwd(), `/public/images`);
    try {
      await stat(uploadDir);
    } catch (e: any) {
      if (e.code === "ENOENT") {
        await mkdir(uploadDir, { recursive: true });
      } else {
        reject(e);
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

    form.parse(req, (err, fields, files) => {
      const { newProfilePicture } = files;
      let profilePictureFilename: string | undefined;
      if (newProfilePicture) {
        const picture = newProfilePicture as formidable.File;
        profilePictureFilename = picture.newFilename;
      }
      const newCurrentJob = fields?.newCurrentJob;
      const newContractType = fields?.newContractType;
      const newFullOrPartTime = fields?.newFullOrPartTime;
      const uid = req.query.userId as string | undefined;
      const userId = uid ? parseInt(uid) : undefined;

      // Il y a une virgule à la fin de chaque ligne
      const profilePicture = profilePictureFilename ? `profilePicture = "${profilePictureFilename}",` : "";
      const currentJob = newCurrentJob ? `currentJob = "${newCurrentJob}",` : "";
      const contractType = newContractType ? `contractType = "${newContractType}",` : "";
      // ATTENTION, il n'y a pas de virgule "," à la fin de cette ligne, elle doit être placée en dernier argument d'update
      const fullOrPartTime = newFullOrPartTime ? `fullOrPartTime= "${newFullOrPartTime}"` : "";

      pool.query(
        `UPDATE user SET
          ${profilePicture}
          ${currentJob}
          ${contractType}
          ${fullOrPartTime}
        WHERE id = ${userId};`,
        ``,
        (err) => {
          if (err) {
            reject(err);
            resolve(res.status(500).json({ status: 500, error: "Une erreur inconnue est survenue" }));
          } else {
            resolve(
              res.status(200).json({
                status: 200,
                message: "Votre profil a été mis à jour",
                newProfilePictureFilename: profilePictureFilename,
              })
            );
          }
        }
      );
    });
  });
}

export const config = {
  api: { bodyParser: false },
};
