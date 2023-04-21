import { Dispatch, SetStateAction } from "react";

interface Props {
  setNewContractType: Dispatch<SetStateAction<string | null>>;
  editMode?: boolean;
  placeholder: string;
  maxLength: number;
}

export default function ContractTypeInput({ setNewContractType, editMode, placeholder, maxLength }: Props) {
  return (
    <>
      <label htmlFor="userContractType">Contrat :</label>
      <input
        id="userContractType"
        type="text"
        placeholder={placeholder}
        onChange={(e) => {
          e.target.value.length > 0 ? setNewContractType(e.target.value) : setNewContractType(null);
        }}
        autoComplete="off"
        disabled={editMode === undefined ? false : !editMode}
        maxLength={maxLength}
      />
    </>
  );
}
