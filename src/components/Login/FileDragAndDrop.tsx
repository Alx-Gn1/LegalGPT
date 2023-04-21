import styles from "@/styles/components/LoginForm.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faFingerprint,
  faEyeSlash,
  faEye,
  faImage,
  faPlus,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { use, useEffect, useRef, useState } from "react";
import { API_ROUTES } from "@/utils/constants";
import { FileUploader } from "react-drag-drop-files";
import Image from "next/image";
import CredentialsFieldset from "./CredentialsFieldset";
import DragAndDropBackground from "./DragAndDropBackground";

const dropMessageStyles = {
  default: {
    backgroundColor: "var(--background-dark)",
    fontSize: "1.4em",
    fontWeight: "600",

    color: "var(--primary)",
    borderRadius: "12px",
    border: "unset",
    width: "calc(100% - 8px)",
    height: "calc(100% - 8px)",
    transform: "translate(4px, 4px)",
    zIndex: 10,
  },
};

const FileDragAndDrop = (props: {
  profilePicture: Blob | null;
  signupInsteadOfLogin: boolean;
  setProfilePicture: Function;
}) => {
  const { profilePicture, signupInsteadOfLogin, setProfilePicture } = props;
  const [profilePicAsURL, setProfilePicAsURL] = useState<null | string>(null);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [minifyErrorMessage, setMinifyErrorMessage] = useState(false);

  // Reset l'input lorsqu'on passe de formulaire de login à signup et vice versa
  useEffect(() => {
    setHasError(false);
    setError(null);
    setProfilePicAsURL(null);
    setProfilePicture(null);
  }, [signupInsteadOfLogin, setProfilePicture]);

  // Met la photo de profil en background de l'input
  useEffect(() => {
    if (profilePicture) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target!.result === "string") setProfilePicAsURL(event.target!.result);
      };
      reader.readAsDataURL(profilePicture);
    }
  }, [profilePicture]);

  // Rend le message d'erreur plus petit après un petit délai
  useEffect(() => {
    setMinifyErrorMessage(false);
    if (hasError) {
      setTimeout(() => {
        setMinifyErrorMessage(true);
      }, 2000);
    }
  }, [hasError]);

  return (
    <fieldset className={styles.imageUpload}>
      {signupInsteadOfLogin ? <h3 className={styles.profilePictureTitle}>Photo de profil :</h3> : null}
      <FileUploader
        handleChange={(profilePicture: Blob) => {
          setHasError(false);
          setProfilePicture(profilePicture);
        }}
        types={["JPEG", "JPG", "PNG", "GIF"]}
        maxSize={4.1943}
        hoverTitle={profilePicture ? "Remplacer l'image" : "Déposer une image"}
        dropMessageStyle={{ ...dropMessageStyles.default, opacity: profilePicture ? "0.7" : "0.95" }}
        onTypeError={() => {
          setHasError(true);
          setError("type");
        }}
        onSizeError={() => {
          setHasError(true);
          setError("size");
        }}
      >
        <span
          className={
            signupInsteadOfLogin
              ? `${styles.dragAndDrop} ${minifyErrorMessage ? styles.hasError : null}`
              : `${styles.dragAndDrop} ${styles.hide}`
          }
          style={
            profilePicAsURL || hasError
              ? {
                  transition: "padding 0s",
                  position: "relative",
                }
              : {}
          }
        >
          <DragAndDropBackground
            profilePicAsURL={profilePicAsURL}
            signupInsteadOfLogin={signupInsteadOfLogin}
            minifyErrorMessage={minifyErrorMessage}
          />
          {hasError ? (
            <span className={minifyErrorMessage ? `${styles.errorMessage} ${styles.mini}` : styles.errorMessage}>
              <FontAwesomeIcon icon={faCircleExclamation} className={styles.errorIcon} />
              {error === "size"
                ? "La taille de votre image doit être inférieure à 4mo"
                : "Votre image doit être au format jpg, png, ou gif"}
            </span>
          ) : null}
        </span>
      </FileUploader>
    </fieldset>
  );
};
export default FileDragAndDrop;
