import { useEffect, useRef } from "react";
import { API_ROUTES } from "../constants";

interface User {
  userId: number;
  token: string;
}

export default async function useFetchUserData(user: User | undefined, setUserData: Function) {
  useEffect(() => {
    if (!user) {
      return;
    }
    fetch(`${API_ROUTES.getUserData}/${user.userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${user.token}` },
    }).then((res) => res.json().then((userData) => setUserData(userData.userData)));
  }, [setUserData, user]);
}
