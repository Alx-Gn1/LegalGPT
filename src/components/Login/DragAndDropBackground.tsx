import styles from "@/styles/components/LoginForm.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import React from "react";

const DragAndDropBackground = React.memo(
  (props: { profilePicAsURL: string | null; signupInsteadOfLogin: boolean; minifyErrorMessage: boolean }) => {
    const { profilePicAsURL, signupInsteadOfLogin, minifyErrorMessage } = props;

    const ProfilePictureBox = (props: { className: string; style?: object }) => {
      const { className, style } = props;
      return (
        <Image
          src={profilePicAsURL!}
          alt="photo de profil"
          className={signupInsteadOfLogin ? className : `${className} ${styles.hide}`}
          width={0}
          height={0}
          style={style}
        />
      );
    };

    return profilePicAsURL ? (
      <>
        <ProfilePictureBox
          className={styles.profilePictureBackground}
          style={minifyErrorMessage ? { clipPath: "inset(14% 8.3% round 7px)" } : {}}
        />
        <ProfilePictureBox className={styles.profilePicture} />
      </>
    ) : (
      <>
        <FontAwesomeIcon icon={faImage} className={styles.imgIcon} />
        <p className={styles.label}>
          Déposez une image ici <br />
          ou <strong>cliquez pour sélectionner</strong>
        </p>
        <p className={styles.imgFormat}>Formats : jpg, png, gif, 4mo maximum</p>
      </>
    );
  }
);
DragAndDropBackground.displayName = "DragAndDropBackground";

export default DragAndDropBackground;
