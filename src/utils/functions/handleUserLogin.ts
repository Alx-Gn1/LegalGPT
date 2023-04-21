import { Dispatch, SetStateAction } from "react";
import { loginUser } from "./auth";

export interface ParamsForUserLogin {
  username: string | null;
  password: string | null;
  setErrorMessage: Dispatch<SetStateAction<string | null>>;
  setConnectionLoading: Dispatch<SetStateAction<false | "login" | "signup">>;
  setUserAuth: Dispatch<
    SetStateAction<{
      userId: number | undefined;
      token: string | undefined;
    } | null>
  >;
  rememberPassword: boolean;
  setStartLoginAnimation: Dispatch<SetStateAction<boolean>>;
  setSignupInsteadOfLogin: Dispatch<SetStateAction<boolean>>;
}

export const handleUserLogin = ({
  username,
  password,
  setErrorMessage,
  setConnectionLoading,
  setUserAuth,
  setStartLoginAnimation,
  setSignupInsteadOfLogin,
  rememberPassword,
}: ParamsForUserLogin) => {
  //
  setErrorMessage(null);
  if (!username || !password) {
    setErrorMessage("Veuillez remplir tous les champs du formulaire");
    setConnectionLoading(false);
    return;
  } else
    loginUser(username, password).then((res) => {
      localStorage.setItem("saveUserInRecentLoginWhenDisconnect", `${rememberPassword}`);

      setConnectionLoading(false);

      if (res.status >= 400 && res.status < 600) {
        setErrorMessage(res.error || "Mauvais nom d'utilisateur / mot de passe");
      } else if (res.status === 200) {
        const user = { userId: res?.userId, token: res?.token };
        setUserAuth(user);
        setStartLoginAnimation(true);
        setSignupInsteadOfLogin(false);
      } else {
        setErrorMessage("Erreur inconnue");
      }
    });
};
