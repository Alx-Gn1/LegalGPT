import styles from "@/styles/components/ProfileViewer.module.css";
import { Dispatch, SetStateAction } from "react";

interface Props {
  setNewCurrentJob: Dispatch<SetStateAction<string | null>>;
  editMode?: boolean;
  placeholder: string;
}

export default function UserInfoFieldset({ setNewCurrentJob, editMode, placeholder }: Props) {
  return (
    <fieldset className={styles.userInfo}>
      <label htmlFor="userCurrentJob">Poste actuel :</label>
      <input
        id="userCurrentJob"
        type="text"
        placeholder={placeholder}
        onChange={(e) => {
          e.target.value.length > 0 ? setNewCurrentJob(e.target.value) : setNewCurrentJob(null);
        }}
        autoComplete="off"
        disabled={editMode === undefined ? false : !editMode}
      />
    </fieldset>
  );
}
