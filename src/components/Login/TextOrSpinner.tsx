import Spinner, { SpinnerProps } from "../Spinner";

interface Props {
  conditionToDisplaySpinner: boolean;
  spinnerConfig: SpinnerProps;
  text: string;
}

export default function TextOrSpinner({ conditionToDisplaySpinner, spinnerConfig, text }: Props) {
  return conditionToDisplaySpinner ? (
    <>
      <Spinner {...spinnerConfig} />
    </>
  ) : (
    <>{text}</>
  );
}
