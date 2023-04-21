import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { UserAuthObj } from "../interfaces";

/**
 * Récupère et renvoie l'objet avec le token & uid
 * S'il n'y a pas d'utilisateur connecté, return null
 * @param setUserToken SetState
 */
export default async function useGetUserAuth(setUserToken: Dispatch<SetStateAction<UserAuthObj | null | undefined>>) {
  const [userObj, setUserObj] = useState<undefined | null | UserAuthObj>();
  useEffect(() => {
    const userAuth = localStorage.getItem("userAuth");

    if (userAuth) {
      const userAuthObj = JSON.parse(userAuth);
      userAuthObj.token && userAuthObj.userId ? setUserObj(userAuthObj) : setUserObj(null);
    } else {
      setUserObj(null);
    }
  }, [setUserObj]);

  useEffect(() => {
    if (userObj) {
      setUserToken(userObj);
    } else if (userObj === null) {
      setUserToken(null);
    }
  }, [userObj, setUserToken]);
}
