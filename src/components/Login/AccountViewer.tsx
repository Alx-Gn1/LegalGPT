import styles from "@/styles/Login.module.css";
import Link from "next/link";
import defaultProfilePic from "@/assets/profile.jpg";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { UserAuthObj, UserData } from "@/utils/interfaces";
import { useEffect, useState } from "react";
import { API_ROUTES } from "@/utils/constants";
import Spinner from "../Spinner";
import { deleteAccountFromRecentLogin } from "@/utils/functions/disconnectUser";

interface Props {
  userAuth: UserAuthObj;
}

export default function AccountViewer({ userAuth }: Props) {
  const [userData, setUserData] = useState<null | UserData>(null);
  const [hasBeenDeleted, setHasBeenDeleted] = useState(false);

  useEffect(() => {
    fetch(`${API_ROUTES.getUserData}/${userAuth.userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${userAuth.token}` },
    }).then((res) => res.json().then((userData) => setUserData(userData.userData)));
  }, [userAuth.token, userAuth.userId]);

  return (
    <div className={`${styles.accountContainer} ${hasBeenDeleted ? styles.hide : null}`}>
      <FontAwesomeIcon
        icon={faTrash}
        fixedWidth
        className={styles.trashIcon}
        onClick={() => {
          deleteAccountFromRecentLogin(userAuth.userId);
          setHasBeenDeleted(true);
        }}
      />
      <Link
        href={"/"}
        className={styles.userCard}
        onClick={() => {
          localStorage.setItem("saveUserInRecentLoginWhenDisconnect", "true");
          localStorage.setItem("userAuth", JSON.stringify(userAuth));
        }}
      >
        {!userData ? (
          <Spinner width="48px" dotWidth="6px" />
        ) : (
          <>
            <Image
              src={`/images/${userData.profilePicture}`}
              alt="photo de profil"
              priority
              width={64}
              height={64}
              style={{ objectFit: "cover" }}
            />
            <p className={styles.username}>{userData.username}</p>
          </>
        )}
      </Link>
    </div>
  );
}
