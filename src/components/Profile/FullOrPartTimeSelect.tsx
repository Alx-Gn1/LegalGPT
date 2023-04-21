import { Dispatch, SetStateAction } from "react";

interface Props {
  setNewFullOrPartTime: Dispatch<SetStateAction<"Temps plein" | "Temps partiel" | null>>;
  editMode?: boolean;
  defaultValue: string;
  newFullOrPartTime: "Temps plein" | "Temps partiel" | null;
}

export default function FullOrPartTimeSelect({
  newFullOrPartTime,
  setNewFullOrPartTime,
  editMode,
  defaultValue,
}: Props) {
  // lorsque l'utilisateur édite son profil, enregistre, et revient en mode édition
  // Il faut que l'option qu'il avait sélectionné devienne l'option par défaut
  const defaultSelectedFullOrPartTime = () => {
    if (newFullOrPartTime) {
      return newFullOrPartTime;
    } else return defaultValue;
  };

  return (
    <select
      value={defaultSelectedFullOrPartTime()}
      onChange={(e) => {
        setNewFullOrPartTime(e.target.value as "Temps plein" | "Temps partiel");
      }}
      disabled={editMode === undefined ? false : !editMode}
    >
      <option value={defaultValue === "Temps plein" ? "Temps plein" : "Temps partiel"}>
        {defaultValue === "Temps plein" ? "Temps plein" : "Temps partiel"}
      </option>
      <option value={defaultValue === "Temps plein" ? "Temps partiel" : "Temps plein"}>
        {defaultValue === "Temps plein" ? "Temps partiel" : "Temps plein"}
      </option>
    </select>
  );
}
