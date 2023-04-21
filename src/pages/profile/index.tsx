import Head from "next/head";
import styles from "./css/Profile.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useGetUserAuth from "@/utils/hooks/useGetUserAuth";
import { useVerifyAuth } from "@/utils/hooks/useVerifyAuth";
import useFetchUserData from "@/utils/hooks/useFetchUserData";
import { userSchema } from "@/utils/schemas/userSchema";
import { UserAuthObj, UserData } from "@/utils/interfaces";
import ProfileViewer from "@/components/Profile/ProfileViewer";
import Spinner from "@/components/Spinner";
import DefaultPageHead from "@/components/DefaultPageHead";
import CreateProfile from "@/components/Profile/CreateProfile";

export default function Profile() {
  const [userAuth, setUserAuth] = useState<undefined | null | UserAuthObj>(undefined);
  const [userData, setUserData] = useState<null | UserData>(null);
  const [loading, setLoading] = useState(true);
  const [profileIsIncomplete, setProfileIsIncomplete] = useState(false);
  const router = useRouter();
  useGetUserAuth(setUserAuth);
  useVerifyAuth(userAuth, router);
  useFetchUserData(userAuth as UserAuthObj | undefined, setUserData);

  useEffect(() => {
    if (userData) {
      userSchema
        .validate(userData)
        .then(() => setLoading(false))
        .catch((err) => {
          if (err.type === "optionality" || err.type === "nullable") {
            setProfileIsIncomplete(true);
            setLoading(false);
          } else {
            console.log(err);
          }
        });
    }
  }, [userData]);

  if (!userData || loading) {
    return (
      <>
        <DefaultPageHead title="Chargement" description="Ecran de chagement" />
        <Spinner width="33px" dotWidth="0.18em" />
      </>
    );
  }
  return (
    <>
      <DefaultPageHead title="Profil" description="Visualisez votre profil gpt-lawyer" />
      <>{profileIsIncomplete ? <CreateProfile user={userData} /> : <ProfileViewer user={userData} />}</>
    </>
  );
}
