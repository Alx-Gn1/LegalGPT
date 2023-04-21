import { object, string, number, date, InferType } from "yup";

export const userSchema = object({
  id: number().positive().integer(),
  username: string().max(100).required(),
  password: string().max(100),
  passwordHash: string(),
  profilePicture: string().max(100),
  currentJob: string().max(64).required(),
  contractType: string().max(32).required(),
  fullOrPartTime: string().max(32).required(),
});

export const userAuthSchema = object({
  id: number().positive().integer(),
  username: string().max(100).required(),
});
