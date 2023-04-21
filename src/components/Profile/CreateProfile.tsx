import styles from "@/styles/components/ProfileViewer.module.css";
import { UserData } from "@/utils/interfaces";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { LegacyRef, useEffect, useRef, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import RoundFileDragAndDrop from "./RoundFileDragAndDrop";
import { updateUserProfile } from "@/utils/functions/updateUserProfile";
import ErrorMessage from "../ErrorMessage";
import { useRouter } from "next/router";
import UserInfoFieldset from "./UserInfoFieldset";
import ContractTypeInput from "./ContractTypeInput";
import FullOrPartTimeSelect from "./FullOrPartTimeSelect";

const CreateProfile = (props: { user: UserData }) => {
  const router = useRouter();
  const { user } = props;
  const [newCurrentJob, setNewCurrentJob] = useState<null | string>(null);
  const [newContractType, setNewContractType] = useState<null | string>(null);
  const [newFullOrPartTime, setNewFullOrPartTime] = useState<null | "Temps plein" | "Temps partiel">("Temps plein");
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  // Ref pour reset le formulaire avec le bouton reset

  return (
    <main className={styles.main}>
      <h1>Finalisez la création de votre profil</h1>
      <form
        className={styles.profileContainer}
        onSubmit={(e) => {
          e.preventDefault();
          if (!newContractType || !newCurrentJob || !newFullOrPartTime) {
            setErrorMessage("Veuillez remplir tous les champs du formulaire");
            return;
          } else {
            setErrorMessage(null);
            updateUserProfile({ user, newContractType, newCurrentJob, newFullOrPartTime }).then((res) => {
              if (res.status === 200) {
                router.push("/");
              } else {
                // error
                setErrorMessage("Une erreur inconnue est survenue");
              }
            });
          }
        }}
      >
        <Image
          src={`/images/${user.profilePicture}`}
          alt="User profile picture"
          width={128}
          height={128}
          className={styles.profilePicture}
          priority
        />
        <h2>{user.username}</h2>
        <div className={styles.separator}></div>
        <UserInfoFieldset
          setNewCurrentJob={setNewCurrentJob}
          placeholder="Développeur, Employé de mise en rayon, etc..."
        />
        <fieldset className={styles.userInfo}>
          <ContractTypeInput
            setNewContractType={setNewContractType}
            placeholder="CDI, CDD, Indépendant, etc..."
            maxLength={32}
          />
          <FullOrPartTimeSelect
            setNewFullOrPartTime={setNewFullOrPartTime}
            newFullOrPartTime={newFullOrPartTime}
            defaultValue={"Temps plein"}
          />
        </fieldset>
        <ErrorMessage
          errorMessage={errorMessage}
          style={errorMessage ? { marginTop: "8px", borderRadius: "10px" } : {}}
        />
        <fieldset className={styles.confirmButtonsContainer}>
          <button className={`${styles.confirmButton} ${styles.goToEditModeButton}`} type="submit">
            Confirmer la création du profil
          </button>
        </fieldset>
      </form>
    </main>
  );
};
export default CreateProfile;
