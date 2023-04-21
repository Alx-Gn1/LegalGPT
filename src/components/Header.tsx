import styles from "@/styles/components/Header.module.css";
import { Lora } from "next/font/google";
const linkFont = Lora({ subsets: ["latin"] });
import logo from "@/assets/header-logo.png";
import legalGPTText from "@/assets/header-text-logo.png";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { disconnectUser } from "@/utils/functions/disconnectUser";
import { useEffect } from "react";

export default function Header() {
  const router = useRouter();

  return (
    <header className={`${styles.container} ${router.pathname === "/login" ? styles.hide : null}`}>
      <Link href={"/"} className={`${linkFont.className} ${styles.logoLink} ${linkFont.className}`}>
        <Image src={logo} alt="logo du site" priority width={24} height={24} />
        <Image src={legalGPTText} alt="texte du logo du site : LegalGPT" priority width={114} height={16} />
      </Link>
      <nav className={styles.navContainer}>
        {router.pathname !== "/" ? (
          <Link href={"/"} className={styles.link}>
            Acceuil
          </Link>
        ) : null}
        <Link href={"/profile"} className={`${styles.link} ${router.pathname === "/profile" ? styles.active : null}`}>
          Profil
        </Link>
        <Link
          href={"/login"}
          className={styles.link}
          onClick={() => {
            disconnectUser();
          }}
        >
          Se déconnecter
        </Link>
      </nav>
    </header>
  );
}
