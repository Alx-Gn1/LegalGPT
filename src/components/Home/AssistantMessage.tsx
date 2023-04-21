import styles from "@/styles/components/Message.module.css";
import { GptMessage, UserAuthObj, UserData } from "@/utils/interfaces";
import Image from "next/image";
import { Fragment } from "react";
import gptLawyerImage from "@/assets/gpt-lawyer-small.jpg";

const AssistantMessage = (props: { buffer: Array<string>; userData: UserData }) => {
  const { buffer, userData } = props;
  const { profilePicture } = userData;

  return (
    <div
      className={`${styles.messageContainer} ${styles.assistantMessage}`}
    >
      <p className={styles.message}>
        {buffer.map((chunk, index) => (
          <Fragment key={index}>{chunk}</Fragment>
        ))}
      </p>
      <Image
        src={gptLawyerImage}
        alt="Photo de profil"
        width={64}
        height={64}
        className={styles.profilePic}
      />
    </div>
  );
};
export default AssistantMessage;
