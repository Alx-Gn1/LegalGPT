import styles from "@/styles/Login.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import AccountViewer from "@/components/Login/AccountViewer";
import { UserAuthObj } from "@/utils/interfaces";
import { Dispatch, SetStateAction } from "react";

interface Props {
  recentLoginList: UserAuthObj[] | null;
  setSignupInsteadOfLogin: Dispatch<SetStateAction<boolean>>;
}

export default function RecentLoginViewer({ recentLoginList, setSignupInsteadOfLogin }: Props) {
  return (
    <article className={styles.savedLogin}>
      <h3>Connections récentes</h3>
      <div className={styles.savedLoginContainer}>
        {recentLoginList &&
          recentLoginList.map((recentUser, index) => <AccountViewer key={index} userAuth={recentUser} />)}
        <button
          className={styles.createAccountButton}
          onClick={() => {
            setSignupInsteadOfLogin(true);
          }}
        >
          <div className={styles.circle}>
            <FontAwesomeIcon icon={faUserPlus} width={32} height={32} className={styles.addUserIcon} />
          </div>
          <p>S&apos;inscrire</p>
        </button>
      </div>
    </article>
  );
}
