import styles from "@/styles/components/Message.module.css";
import { GptMessage, UserAuthObj, UserData } from "@/utils/interfaces";
import Image from "next/image";
import React, { Fragment, useRef } from "react";
import gptLawyerImage from "@/assets/gpt-lawyer-small.jpg";

const Message = (props: { message: GptMessage }) => {
  const { message } = props;

  return (
    <p className={styles.message}>
      {message.content.split(/\n/g).map((paragraph, index) => (
        <Fragment key={index}>
          {paragraph}
          <br />
        </Fragment>
      ))}
    </p>
  );
};
export default Message;
