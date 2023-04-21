import styles from "@/styles/components/LoginForm.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import CredentialsFieldset from "./CredentialsFieldset";
import FileDragAndDrop from "./FileDragAndDrop";
import { loginUser, signupUser } from "@/utils/functions/auth";
import Spinner from "../Spinner";
import { handleUserLogin } from "@/utils/functions/handleUserLogin";
import { handleUserSignup } from "@/utils/functions/handleUserSignup";
import RememberPasswordCheckbox from "./RememberPasswordCheckbox";
import ErrorMessage from "../ErrorMessage";
import TextOrSpinner from "./TextOrSpinner";

interface Props {
  setSignupInsteadOfLogin: Dispatch<SetStateAction<boolean>>;
  signupInsteadOfLogin: boolean;
  setStartLoginAnimation: Dispatch<SetStateAction<boolean>>;
  setUserAuth: Dispatch<
    SetStateAction<{
      userId: number | undefined;
      token: string | undefined;
    } | null>
  >;
}

export default function LoginForm(props: Props) {
  const [username, setUsername] = useState<null | string>(null);
  const [password, setPassword] = useState<null | string>(null);
  const [profilePicture, setProfilePicture] = useState<null | Blob>(null);
  const { setSignupInsteadOfLogin, signupInsteadOfLogin, setStartLoginAnimation, setUserAuth } = props;
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [connectionLoading, setConnectionLoading] = useState<false | "login" | "signup">(false);
  const [rememberPassword, setRememberPassword] = useState(true);

  useEffect(() => {
    // Reset l'input de photo de profil et les messages d'erreur
    setProfilePicture(null);
    setErrorMessage(null);
  }, [signupInsteadOfLogin]);

  const paramsForUserLoginFunction = {
    username: username,
    password: password,
    setErrorMessage,
    setConnectionLoading,
    setUserAuth,
    setStartLoginAnimation,
    setSignupInsteadOfLogin,
    rememberPassword,
  };

  return (
    <form id="loginForm" method="POST" className={styles.loginForm} onSubmit={(e) => e.preventDefault()}>
      <CredentialsFieldset setUsername={setUsername} setPassword={setPassword} />
      <FileDragAndDrop
        profilePicture={profilePicture}
        signupInsteadOfLogin={signupInsteadOfLogin}
        setProfilePicture={setProfilePicture}
      />
      <RememberPasswordCheckbox rememberPassword setRememberPassword={setRememberPassword} />
      <ErrorMessage errorMessage={errorMessage} style={signupInsteadOfLogin ? {} : { top: "1.5em" }} />
      {/* Login button */}
      <button
        type="submit"
        className={signupInsteadOfLogin ? `${styles.loginButton} ${styles.hide}` : styles.loginButton}
        onClick={() => {
          setConnectionLoading("login");
          handleUserLogin(paramsForUserLoginFunction);
        }}
        style={connectionLoading && connectionLoading === "login" ? { transition: "all 0s", padding: "8px" } : {}}
      >
        <TextOrSpinner
          conditionToDisplaySpinner={connectionLoading && connectionLoading === "login"}
          spinnerConfig={{ width: "33px", dotWidth: "0.18em" }}
          text="Se connecter"
        />
      </button>
      {/* Go to signup button & then become a signup button */}
      <button
        type="button"
        className={styles.createAccountButton}
        onClick={() => {
          signupInsteadOfLogin
            ? handleUserSignup({ paramsForUserLoginFunction, profilePicture: profilePicture })
            : setSignupInsteadOfLogin(true);
        }}
        style={connectionLoading && connectionLoading === "signup" ? { transition: "all 0s", padding: "8px" } : {}}
      >
        <TextOrSpinner
          conditionToDisplaySpinner={connectionLoading && connectionLoading === "login"}
          spinnerConfig={{ width: "33px", dotWidth: "0.18em" }}
          text={`${signupInsteadOfLogin ? "Confirmer l'inscription" : "Créer un compte"}`}
        />
      </button>
      {/* Button to go back to login when user is on signup form */}
      <button
        type="button"
        className={signupInsteadOfLogin ? styles.goToLoginButton : `${styles.goToLoginButton} ${styles.hide}`}
        onClick={() => {
          setSignupInsteadOfLogin(false);
        }}
      >
        Vous avez déjà un compte ? (Se connecter)
      </button>
    </form>
  );
}
