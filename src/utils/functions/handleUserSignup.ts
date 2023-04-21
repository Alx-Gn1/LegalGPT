import { Dispatch, SetStateAction } from "react";
import { signupUser } from "./auth";
import { ParamsForUserLogin, handleUserLogin } from "./handleUserLogin";

interface Params {
  paramsForUserLoginFunction: ParamsForUserLogin;
  profilePicture: Blob | null;
}

export const handleUserSignup = ({ paramsForUserLoginFunction, profilePicture }: Params) => {
  const params = paramsForUserLoginFunction;

  params.setConnectionLoading("signup");
  params.setErrorMessage(null);

  signupUser(params.username, params.password, profilePicture).then((res) => {
    params.setConnectionLoading(false);
    if (res.status >= 400 && res.status < 600) {
      params.setErrorMessage(res.error);
    } else if (res.status === 200) {
      handleUserLogin(paramsForUserLoginFunction);
      params.setSignupInsteadOfLogin(false);
    } else {
      params.setErrorMessage("Erreur inconnue");
    }
  });
};
