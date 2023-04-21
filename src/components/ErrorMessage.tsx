import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "@/styles/components/ErrorMessage.module.css";
import { CSSProperties } from "react";

export default function ErrorMessage(props: { errorMessage: string | null | undefined; style?: CSSProperties }) {
  const { errorMessage, style } = props;
  return (
    <div className={errorMessage ? styles.errorContainer : `${styles.errorContainer} ${styles.hide}`} style={style}>
      <FontAwesomeIcon icon={faCircleExclamation} width={24} height={24} />
      {errorMessage?.split("").map((char, index) => {
        return (
          <span key={char + index} style={{ ["--index" as any]: index }}>
            {/* "\xa0" = non breaking space = &nbsp; */}
            {char === " " ? "\xa0" : char}
          </span>
        );
      })}
    </div>
  );
}
