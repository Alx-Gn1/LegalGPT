import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { GptMessage, UserAuthObj, UserData } from "@/utils/interfaces";
import Message from "@/components/Home/Message";
import { useTextBuffer } from "nextjs-openai";
import Image from "next/image";
import styles from "@/styles/components/Message.module.css";
import gptLawyerImage from "@/assets/gpt-lawyer-small.jpg";

interface Props {
  userAuth: UserAuthObj;
  userData: UserData;
  userMessage: GptMessage;
  setResponseIsPending: Dispatch<SetStateAction<boolean>>;
  gptMessageList: GptMessage[] | null;
  setGptMessageList: Dispatch<SetStateAction<GptMessage[] | null>>;
  last2MessagesOfConversation: Array<GptMessage> | null;
}

export default function ChatExchange(props: Props) {
  const {
    userAuth,
    userData,
    userMessage,
    setResponseIsPending,
    last2MessagesOfConversation,
    setGptMessageList,
    gptMessageList,
  } = props;
  const [currentExchange, setCurrentExchange] = useState([userMessage]);

  const { buffer, refresh, cancel, done } = useTextBuffer({
    url: "/api/gptApi",
    throttle: 20,
    body: JSON.stringify({
      userId: userAuth.userId,
      userData,
      completeConversation: last2MessagesOfConversation ? [...last2MessagesOfConversation, userMessage] : [userMessage],
    }),
    headers: { Authorization: `Bearer ${userAuth.token}` },
  });

  // Gère la réception de message
  const currentExchangeRef = useRef(currentExchange);
  const incomingMessageRef = useRef<null | GptMessage>();
  useEffect(() => {
    if (done) {
      gptMessageList
        ? setGptMessageList([...gptMessageList, currentExchange[1]])
        : setGptMessageList([currentExchange[1]]);
      setResponseIsPending(false);
      return;
    }
    if (buffer.length > 1) {
      // Un message est en cours de réception, on garde la conversation actuelle en Ref
      // pour insérer petit à petit la réponse au state de la conversation
      if (buffer.join("") !== incomingMessageRef.current?.content) {
        incomingMessageRef.current = { role: "assistant", content: buffer.join("") };

        setCurrentExchange([...currentExchangeRef.current, incomingMessageRef.current]);
      }
    }
    // Ne pas ajouter la liste de gpt Message aux dependecy car cela créer une infinit loop
  }, [buffer, currentExchange, setCurrentExchange, done, setResponseIsPending]);

  return (
    <>
      <div className={`${styles.messageContainer} ${styles.userMessage}`}>
        <Message message={userMessage} />
        <Image
          src={`/images/${userData.profilePicture}`}
          alt="Photo de profil"
          width={64}
          height={64}
          className={styles.profilePic}
        />
      </div>
      {currentExchange.length > 1 ? (
        <div className={`${styles.messageContainer} ${styles.assistantMessage}`}>
          <Message message={currentExchange[1]} />
          <Image src={gptLawyerImage} alt="Photo de profil gpt" width={64} height={64} className={styles.profilePic} />
        </div>
      ) : null}
    </>
  );
}
