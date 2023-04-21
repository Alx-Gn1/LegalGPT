import styles from "@/styles/components/Spinner.module.css";
import { CSSProperties } from "react";

export interface SpinnerProps {
  width: string;
  dotWidth: string;
  color?: string;
  style?: CSSProperties | undefined;
}

const Spinner = (props: SpinnerProps) => {
  const { width, dotWidth, style, color } = props;
  return (
    <div className={styles.loaderContainer} style={style}>
      <div
        className={styles.loading}
        style={{ ["--width" as any]: width, ["--dotWidth" as any]: dotWidth, ["--color" as any]: color || "#fff" }}
      >
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>{" "}
    </div>
  );
};
export default Spinner;
