export interface UserAuthObj {
  userId: number;
  token: string;
}

export interface UserData {
  id?: number;
  username: string;
  passwordHash?: string;
  profilePicture: string;
  currentJob: string;
  contractType: string;
  fullOrPartTime: "Temps plein" | "Temps partiel";
}

export interface GptMessage {
  role: "user" | "assistant";
  content: string;
}
