import styles from "@/styles/components/LoginForm.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faFingerprint, faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { Dispatch, MutableRefObject, SetStateAction, useState } from "react";

interface Props {
  setUsername: Dispatch<SetStateAction<string | null>>;
  setPassword: Dispatch<SetStateAction<string | null>>;
}

const CredentialsFieldset = ({ setUsername, setPassword }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <fieldset className={styles.credentials}>
      <label htmlFor="usernameInput">
        <FontAwesomeIcon icon={faUser} />
      </label>
      <input
        id="usernameInput"
        type="text"
        placeholder="Nom d'utilisateur"
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <label htmlFor="passwordInput">
        <FontAwesomeIcon icon={faFingerprint} />
      </label>
      <input
        id="passwordInput"
        type={showPassword ? "text" : "password"}
        placeholder="Mot de passe"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <button
        type="button"
        className={styles.showHidePassword}
        onClick={() => {
          setShowPassword(!showPassword);
        }}
      >
        <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
      </button>
    </fieldset>
  );
};
export default CredentialsFieldset;
