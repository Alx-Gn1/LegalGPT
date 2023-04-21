import { API_ROUTES } from "../constants";

export const signupUser = async (username: string | null, password: string | null, profilePicture: Blob | null) => {
  const userData = new FormData();

  if (username && password) {
    userData.append("username", username);
    userData.append("password", password);
    profilePicture ? userData.append("profilePicture", profilePicture, `${username}_profile_picture`) : null;
    const response = await fetch(API_ROUTES.signup, { method: "POST", body: userData }).then((res) => res.json());
    return response;
  } else {
    console.log("incomplet")
    console.log(username + " - - - " + password)
    return { status: 400, error: "Veuillez remplir tous les champs du formulaire" };
  }
};

export const loginUser = async (username: string | null, password: string | null) => {
  const userData = { username: username, password: password };
  const JSONdata = JSON.stringify(userData);
  const response = await fetch(API_ROUTES.login, { method: "POST", body: JSONdata }).then((res) => res.json());
  return response;
};
