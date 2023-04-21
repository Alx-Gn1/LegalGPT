import styles from "@/styles/components/ProfileViewer.module.css";
import { UserData } from "@/utils/interfaces";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { LegacyRef, useEffect, useRef, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import RoundFileDragAndDrop from "./RoundFileDragAndDrop";
import { updateUserProfile } from "@/utils/functions/updateUserProfile";
import UserInfoFieldset from "./UserInfoFieldset";
import ContractTypeInput from "./ContractTypeInput";
import FullOrPartTimeSelect from "./FullOrPartTimeSelect";

const ProfileViewer = (props: { user: UserData }) => {
  const { user } = props;
  const [editMode, setEditMode] = useState(false);
  const [newProfilePicture, setNewProfilePicture] = useState<null | Blob>(null);
  const [newCurrentJob, setNewCurrentJob] = useState<null | string>(null);
  const [newContractType, setNewContractType] = useState<null | string>(null);
  const [newFullOrPartTime, setNewFullOrPartTime] = useState<null | "Temps plein" | "Temps partiel">(null);
  const [newProfilePictureLink, setNewProfilePictureLink] = useState<null | string>(null);
  // Ref pour reset le formulaire avec le bouton reset
  const formRef: LegacyRef<HTMLFormElement> = useRef(null);

  if (!user) return null;
  return (
    <main className={styles.main}>
      <h1>Profil</h1>
      <form
        className={styles.profileContainer}
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          updateUserProfile({
            user,
            newProfilePicture,
            newCurrentJob: newCurrentJob || user.currentJob,
            newContractType: newContractType || user.contractType,
            newFullOrPartTime: newFullOrPartTime || user.fullOrPartTime,
          }).then((res) => {
            if (res.newProfilePictureFilename) setNewProfilePictureLink(res.newProfilePictureFilename);
            if (res.status === 200) {
              user.currentJob = newCurrentJob! || user.currentJob;
              user.contractType = newContractType! || user.contractType;
              user.fullOrPartTime = newFullOrPartTime! || user.fullOrPartTime;
              setEditMode(false);
            } else {
              // error
            }
          });
        }}
      >
        <RoundFileDragAndDrop
          newProfilePicture={newProfilePicture}
          setNewProfilePicture={setNewProfilePicture}
          currentProfilePicture={newProfilePictureLink || user.profilePicture}
          disabled={editMode ? false : true}
        />
        <h2>{user.username}</h2>
        <div className={styles.separator}></div>
        <UserInfoFieldset setNewCurrentJob={setNewCurrentJob} placeholder={user.currentJob} editMode={editMode} />

        <fieldset className={styles.userInfo}>
          <ContractTypeInput
            setNewContractType={setNewContractType}
            placeholder={user.contractType}
            maxLength={32}
            editMode={editMode}
          />
          <FullOrPartTimeSelect
            setNewFullOrPartTime={setNewFullOrPartTime}
            newFullOrPartTime={newFullOrPartTime}
            editMode={editMode}
            defaultValue={user.fullOrPartTime}
          />
        </fieldset>
        <fieldset className={styles.confirmButtonsContainer}>
          <button
            className={`${styles.cancelButton} ${editMode ? null : styles.hide}`}
            type="button"
            onClick={() => {
              setNewProfilePicture(null);
              setNewCurrentJob(null);
              setNewContractType(null);
              setNewFullOrPartTime(null);
              setEditMode(false);
              formRef.current!.reset();
            }}
          >
            Annuler
          </button>
          <button
            className={`${styles.confirmButton} ${editMode ? null : styles.goToEditModeButton}`}
            type="button"
            onClick={() => {
              editMode ? formRef.current!.requestSubmit() : setEditMode(true);
            }}
          >
            {editMode ? "Confirmer" : "Éditer le profil"}
          </button>
        </fieldset>
      </form>
    </main>
  );
};
export default ProfileViewer;
