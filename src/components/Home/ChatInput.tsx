import styles from "@/styles/Home.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";

interface Props {
  sendMessage: Function;
  responseIsPending: boolean;
}

const ChatInput = (props: Props) => {
  const { sendMessage, responseIsPending } = props;
  const [userPrompt, setUserPrompt] = useState<null | string>("");
  const [textAreaValue, setTextAreaValue] = useState<undefined | string>(undefined);

  useEffect(() => {
    // Permet de reset l'input textarea en faisant setTextAreaValue("")
    if (textAreaValue === "") setTextAreaValue(undefined);
  }, [textAreaValue]);

  const textAreaRef = useRef<null | any>(null);
  const resizeTextArea = () => {
    const maxHeight = 400;
    const textAreaHeight = textAreaRef.current?.scrollHeight;

    if (textAreaRef.current && textAreaHeight <= maxHeight) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
    }
  };

  useEffect(resizeTextArea, [userPrompt]);

  return (
    <div className={styles.chatInputContainer}>
      <textarea
        rows={1}
        cols={100}
        className={styles.chatInput}
        onChange={(e) => {
          setUserPrompt(e.target.value);
        }}
        ref={textAreaRef}
        placeholder="Envoyez un message"
        maxLength={2000}
        onKeyDown={(e) => {
          if (responseIsPending) {
            setTextAreaValue("");
            return;
          }
          if (textAreaValue === "" || (userPrompt && userPrompt.length <= 1) || !userPrompt) {
            if (e.code === "Enter") {
              setTextAreaValue("");
            }
            return;
          }
          if (e.code === "Enter" && !e.shiftKey && userPrompt && userPrompt.length > 1) {
            sendMessage({ role: "user", content: userPrompt });
            setTextAreaValue("");
          }
        }}
        value={textAreaValue}
      ></textarea>
      <button
        className={styles.sendChatButton}
        onClick={() => {
          sendMessage({ role: "user", content: userPrompt });
          setTextAreaValue("");
        }}
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </div>
  );
};
export default ChatInput;
