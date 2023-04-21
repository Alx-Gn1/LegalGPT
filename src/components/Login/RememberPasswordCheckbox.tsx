import { Dispatch, SetStateAction } from "react";
import styles from "@/styles/components/LoginForm.module.css";

interface Props {
  rememberPassword: boolean;
  setRememberPassword: Dispatch<SetStateAction<boolean>>;
}

export default function RememberPasswordCheckbox({ rememberPassword, setRememberPassword }: Props) {
  return (
    <fieldset className={styles.rememberPassword}>
      <label htmlFor="RememberPassword">
        Enregistrer le mot de passe
        <input
          id="RememberPassword"
          type="checkbox"
          defaultChecked={rememberPassword}
          onChange={(e) => {
            setRememberPassword(!rememberPassword);
          }}
        />
        <span className={styles.checkmark}></span>
      </label>
    </fieldset>
  );
}
