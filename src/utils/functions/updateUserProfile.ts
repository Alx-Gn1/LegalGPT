import { UserAuthObj, UserData } from "./../interfaces";
import { API_ROUTES } from "../constants";

interface Parameters {
  user: UserData;
  newProfilePicture?: null | Blob;
  newCurrentJob: string;
  newContractType: string;
  newFullOrPartTime: string;
}

export const updateUserProfile = async ({
  user,
  newProfilePicture,
  newCurrentJob,
  newContractType,
  newFullOrPartTime,
}: Parameters) => {
  const requestBody = new FormData();
  const userAuth = localStorage.getItem("userAuth");
  const userAuthObj: UserAuthObj = userAuth ? JSON.parse(userAuth) : null;

  if (newProfilePicture) {
    requestBody.append("newProfilePicture", newProfilePicture, `${user.username}_profile_picture`);
  }
  requestBody.append("newCurrentJob", newCurrentJob);
  requestBody.append("newContractType", newContractType);
  requestBody.append("newFullOrPartTime", newFullOrPartTime);
  const auth = localStorage.getItem("userAuth");
  if (!auth) return { status: 400 };

  const response = await fetch(`${API_ROUTES.updateProfile}/${JSON.parse(auth).userId}`, {
    method: "POST",
    body: requestBody,
    headers: {
      Authorization: `Bearer ${userAuthObj.token} ${userAuthObj.userId}`,
    },
  }).then((res) => res.json());

  return response;
};
