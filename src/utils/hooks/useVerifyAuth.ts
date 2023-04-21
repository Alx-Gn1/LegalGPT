import { NextRouter, useRouter } from "next/router";
import { UserAuthObj } from "../interfaces";

/**
 * Redirige l'utilisateur vers la page login si user = null
 * Lorsque user = undefined (en attente d'une réponse du serveur) la fonction ne fait rien
 * Return true quand il y a un user avec id & token
 * @param user
 * @returns
 */

type User = UserAuthObj | null | undefined;

export async function useVerifyAuth(user: User, router: NextRouter) {
  if (user === null) {
    router.push("/login");
    return false;
  }
  // Wait while user === undefined
  if (user?.userId && user.token) {
    return true;
  }
}
