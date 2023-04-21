import { UserAuthObj } from "../interfaces";

export const disconnectUser = () => {
  const saveUserInRecentLoginString = localStorage.getItem("saveUserInRecentLoginWhenDisconnect");
  const saveUserInRecentLogin = saveUserInRecentLoginString ? JSON.parse(saveUserInRecentLoginString) : false;

  if (saveUserInRecentLogin) {
    localStorage.setItem("saveUserInRecentLoginWhenDisconnect", "false");
    const userAuth = localStorage.getItem("userAuth");
    const userAuthObj: UserAuthObj = JSON.parse(userAuth!);
    const recentLogin = localStorage.getItem("recentLogin");
    const recentLoginList: Array<UserAuthObj> = recentLogin ? JSON.parse(recentLogin) : [];

    const listWithNewUserAtTheEnd = [
      ...recentLoginList.filter((user) => user.userId !== userAuthObj.userId),
      userAuthObj,
    ];

    localStorage.setItem(
      "recentLogin",
      JSON.stringify(
        listWithNewUserAtTheEnd.length > 4 ? listWithNewUserAtTheEnd.slice(-4) : listWithNewUserAtTheEnd
      )
    );

    localStorage.removeItem("userAuth");

    return userAuthObj;
  } else {
    localStorage.removeItem("userAuth");
    return null;
  }
};

export const deleteAccountFromRecentLogin = (id: number) => {
  const recentLogin = localStorage.getItem("recentLogin");
  const recentLoginList: Array<UserAuthObj> = recentLogin ? JSON.parse(recentLogin) : [];

  localStorage.setItem("recentLogin", JSON.stringify(recentLoginList.filter((user) => user.userId !== id)));
};
