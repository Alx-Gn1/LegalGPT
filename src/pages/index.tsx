import styles from "@/styles/Home.module.css";
import DefaultPageHead from "@/components/DefaultPageHead";
import { LegacyRef, useEffect, useReducer, useRef, useState } from "react";
import { GptMessage, UserAuthObj, UserData } from "@/utils/interfaces";
import { useRouter } from "next/router";
import useGetUserAuth from "@/utils/hooks/useGetUserAuth";
import { useVerifyAuth } from "@/utils/hooks/useVerifyAuth";
import useFetchUserData from "@/utils/hooks/useFetchUserData";
import { userSchema } from "@/utils/schemas/userSchema";
import Spinner from "@/components/Spinner";
import ChatInput from "@/components/Home/ChatInput";
import ChatExchange from "@/components/Home/ChatExchange";

export default function Home() {
  const router = useRouter();
  const [userAuth, setUserAuth] = useState<undefined | null | UserAuthObj>(undefined);
  const [userData, setUserData] = useState<null | UserData>(null);
  const [userMessageList, setUserMessageList] = useState<null | Array<GptMessage>>(null);
  const [gptMessageList, setGptMessageList] = useState<null | Array<GptMessage>>(null);
  const [responseIsPending, setResponseIsPending] = useState(false);

  useGetUserAuth(setUserAuth);
  useVerifyAuth(userAuth, router);
  useFetchUserData(userAuth as UserAuthObj | undefined, setUserData);

  // Si le profil est incomplet, redirige l'utilisateur vers la page pour finaliser la création du profil
  // S'il y a une autre erreur de validation, redirige vers le login
  useEffect(() => {
    if (userData) {
      userSchema.validate(userData).catch((err) => {
        if (err.type === "optionality" || err.type === "nullable") {
          router.push("/profile");
        } else router.push("/login");
      });
    }
  }, [userData, router]);
  

  const sendMessage = async (message: GptMessage) => {
    if (responseIsPending) {
      return;
    }
    setResponseIsPending(true);
    const completeConversation = userMessageList ? [...userMessageList, message] : [message];
    setUserMessageList(completeConversation);
  };

  // Permet de scroller vers le bas quand il y a un message en cours de réception/écriture par le bot
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const scrollToMaxRef = useRef<number | NodeJS.Timer | null>(null);
  useEffect(() => {
    if (responseIsPending && messageContainerRef.current) {
      const container = messageContainerRef.current;
      const maxScroll = Math.max(container.scrollHeight, container.offsetHeight, container.clientHeight);

      scrollToMaxRef.current = setInterval(() => {
        container.scrollTo(0, maxScroll);
      }, 300);
    }
    if (!responseIsPending && scrollToMaxRef.current) {
      clearInterval(scrollToMaxRef.current);
    }
  }, [responseIsPending]);

  if (!userData || !userAuth) {
    return (
      <>
        <DefaultPageHead title="Chargement" description="Ecran de chagement" />
        <Spinner width="33px" dotWidth="0.18em" />
      </>
    );
  } else
    return (
      <>
        <DefaultPageHead title="Home" description="Page d'acceuil du site GPT-Lawyer" />
        <main className={styles.main}>
          <div className={styles.messageContainer} ref={messageContainerRef}>
            {userMessageList?.map((message, index) => {
              const last2MessagesOfConversation = gptMessageList
                ? [userMessageList[index > 1 ? index - 1 : 0], gptMessageList[index > 1 ? index - 1 : 0]]
                : null;

              return (
                <ChatExchange
                  key={index}
                  userAuth={userAuth}
                  userData={userData}
                  userMessage={message}
                  last2MessagesOfConversation={last2MessagesOfConversation}
                  setResponseIsPending={setResponseIsPending}
                  gptMessageList={gptMessageList}
                  setGptMessageList={setGptMessageList}
                />
              );
            })}
          </div>
          <div className={styles.fadeAtInBottom}></div>
          <ChatInput sendMessage={sendMessage} responseIsPending={responseIsPending} />
        </main>
      </>
    );
}
