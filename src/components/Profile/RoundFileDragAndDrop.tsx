import styles from "@/styles/components/ProfileViewer.module.css";
import { UserData } from "@/utils/interfaces";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";

interface Props {
  newProfilePicture: null | Blob;
  setNewProfilePicture: Function;
  currentProfilePicture: string;
  disabled?: boolean;
}

export default function RoundFileDragAndDrop(props: Props) {
  const [newProfilePicAsUrl, setNewProfilePicAsUrl] = useState<null | string>(null);
  const { newProfilePicture, setNewProfilePicture, currentProfilePicture, disabled } = props;
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  useEffect(() => {
    if (newProfilePicture) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target!.result === "string") setNewProfilePicAsUrl(event.target!.result);
      };
      reader.readAsDataURL(newProfilePicture);
    } else {
      setNewProfilePicAsUrl(null);
    }
  }, [newProfilePicture]);

  return (
    <>
      <FileUploader
        handleChange={(picture: Blob) => {
          setErrorMessage(null);
          setNewProfilePicture(picture);
        }}
        types={["JPEG", "JPG", "PNG", "GIF"]}
        maxSize={4}
        hoverTitle={"Changer votre photo de profil"}
        dropMessageStyle={{
          borderRadius: "50%",
          width: 128,
          height: 128,
          backgroundColor: "var(--background-dark)",
          opacity: 0.95,
          color: "#fff !important",
          textAlign: "center",
        }}
        onTypeError={() => {
          setErrorMessage("L'image doit être au format jpg/png/gif");
        }}
        onSizeError={() => {
          setErrorMessage("La taille de l'image doit être inférieure à 4Mo");
        }}
        disabled={disabled}
      >
        <div className={`${styles.imageHoverMessage} ${disabled ? styles.hide : null}`}>
          <p>Changer votre photo de profil</p>
          <FontAwesomeIcon icon={faCamera} width={24} height={24} className={styles.imageIcon} />
        </div>
        <Image
          src={newProfilePicAsUrl || `/images/${currentProfilePicture}`}
          alt="User profile picture"
          width={128}
          height={128}
          className={styles.profilePicture}
          priority
        />
      </FileUploader>
      {errorMessage ? <span className={styles.imageErrorMessage}>{errorMessage}</span> : null}
    </>
  );
}
