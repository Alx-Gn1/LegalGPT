import styles from "@/styles/Login.module.css";
import Image from "next/image";
import lawyerIllustration from "@/assets/Lawyer-Illustration.png";
import LoginForm from "@/components/Login/LoginForm";
import { CSSProperties, useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/router";
import DefaultPageHead from "@/components/DefaultPageHead";
import { UserAuthObj } from "@/utils/interfaces";
import { disconnectUser } from "@/utils/functions/disconnectUser";
import RecentLoginViewer from "@/components/Login/RecentLoginViewer";

// Loading Spinner lors de la connexion réussie, pendant la redirection vers la page profil/page d'acceuil
const loadingSpinnerStyle: CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  transition: "all 1s ease-in-out",
};

export default function Login() {
  const router = useRouter();
  const [signupInsteadOfLogin, setSignupInsteadOfLogin] = useState(false);
  const [startLoginAnimation, setStartLoginAnimation] = useState(false);
  const [hideLoadingSpinner, setHideLoadingSpinner] = useState(false);
  const [userAuth, setUserAuth] = useState<null | { userId: number | undefined; token: string | undefined }>(null);
  const [LoginAnimFinished, setLoginAnimFinished] = useState(false);
  const [recentLoginList, setRecentLoginList] = useState<null | Array<UserAuthObj>>(null);

  // Lance l'animation de chargement & transition avant de rediriger l'utilisateur
  // une fois le login effectué
  useEffect(() => {
    if (startLoginAnimation) {
      setTimeout(() => {
        setHideLoadingSpinner(true);
        setLoginAnimFinished(true);
      }, 600);
      setTimeout(() => {
        setHideLoadingSpinner(false);
      }, 1600);
    }
  }, [startLoginAnimation]);

  // Attends que l'animation soit terminée avant de sauvegarder le token dans le localStorage
  // et de rediriger l'utilisateur
  // Si le login n'a pas fonctionné, annule l'animation (les messages d'erreurs sont gérés par le component formulaire)
  useEffect(() => {
    if (userAuth?.token === undefined || userAuth?.userId === undefined) {
      setStartLoginAnimation(false);
    } else {
      setTimeout(
        () => {
          localStorage.setItem("userAuth", JSON.stringify(userAuth));
          router.push("/");
        },
        LoginAnimFinished ? 0 : 1000
      );
    }
  }, [userAuth, LoginAnimFinished, router]);

  // Récupère les connexions récentes dans le local storage,
  useEffect(() => {
    const recentLogin = localStorage.getItem("recentLogin");
    if (!recentLogin || recentLogin === "[null]") {
      return;
    }
    const recentLogins: Array<UserAuthObj> = JSON.parse(recentLogin);
    setRecentLoginList(recentLogins);
    const newUserToAddToRecentLogin = disconnectUser();
    if (newUserToAddToRecentLogin && recentLogins) {
      setRecentLoginList([...recentLogins, newUserToAddToRecentLogin]);
    } else if (newUserToAddToRecentLogin && recentLogins) {
      setRecentLoginList([newUserToAddToRecentLogin]);
    }
  }, [setRecentLoginList]);

  return (
    <>
      <DefaultPageHead title="Connexion / Inscription" description="Se connecter ou créer un compte" />
      {startLoginAnimation ? (
        <Spinner
          width="128px"
          dotWidth="8px"
          color="var(--primary)"
          style={{ ...loadingSpinnerStyle, opacity: hideLoadingSpinner ? "0" : "1" }}
        />
      ) : null}
      <section className={startLoginAnimation ? `${styles.mainContainer} ${styles.hideOnLogin}` : styles.mainContainer}>
        <h1 className={styles.loginTitle}>Bienvenue</h1>
        <h2 className={styles.loginSubtitle}>Connectez vous ou créez un compte pour continuer</h2>
        <section
          className={
            signupInsteadOfLogin || startLoginAnimation ? `${styles.mainSection} ${styles.hide}` : styles.mainSection
          }
        >
          <RecentLoginViewer setSignupInsteadOfLogin={setSignupInsteadOfLogin} recentLoginList={recentLoginList} />
          <Image
            src={lawyerIllustration}
            alt="Illustration d'un avocat"
            className={styles.lawyerIllustration}
            priority
          />
        </section>
        <div className={styles.titleSeparator}>
          <h2>{signupInsteadOfLogin ? "S'inscrire" : "Connection"}</h2>
        </div>
        <LoginForm
          setSignupInsteadOfLogin={setSignupInsteadOfLogin}
          signupInsteadOfLogin={signupInsteadOfLogin}
          setStartLoginAnimation={setStartLoginAnimation}
          setUserAuth={setUserAuth}
        />
      </section>
    </>
  );
}
