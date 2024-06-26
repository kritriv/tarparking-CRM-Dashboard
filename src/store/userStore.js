import { notification, message } from "antd";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { create } from "zustand";

import { AuthServicesAPI } from "../apis";
import { getItem, removeItem, setItem } from "../utils/storage";
import { StorageEnum } from "../utils/enum";

const useUserStore = create((set) => ({
  userInfo: getItem(StorageEnum.User) || {},
  userToken: getItem(StorageEnum.Token) || {},
  actions: {
    setUserInfo: (userInfo) => {
      set({ userInfo });
      setItem(StorageEnum.User, userInfo);
    },
    setUserToken: (userToken) => {
      set({ userToken });
      setItem(StorageEnum.Token, userToken);
    },
    clearUserInfoAndToken() {
      set({ userInfo: {}, userToken: {} });
      removeItem(StorageEnum.User);
      removeItem(StorageEnum.Token);
    },
  },
}));

export const useUserInfo = () => {
  const userInfo = useUserStore((state) => state.userInfo);
  return userInfo;
};
export const useUserData = () => useUserStore((state) => state.userInfo);
export const useUserToken = () => useUserStore((state) => state.userToken);
export const useUserActions = () => useUserStore((state) => state.actions);

export const useSignIn = () => {
  const navigate = useNavigate();
  const { setUserToken, setUserInfo } = useUserActions();

  const signIn = async (data) => {
    try {
      const res = await AuthServicesAPI.signin(data);
      const { email, id, accessToken, role, username, name } = res.data;
      setUserToken({ accessToken });
      setUserInfo({
        userID: id,
        userEmail: email,
        userRole: role,
        userName: username,
        userFullName: name,
      });
      navigate("/", { replace: true });

      notification.success({
        message: "Login Successful",
        description: `Welcome Back : ${name}`,
        duration: 3,
      });
    } catch (err) {
      message.warning({
        content: err.message,
        duration: 3,
      });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(signIn, []);
};

export const useSignOut = () => {
  const navigate = useNavigate();
  const { clearUserInfoAndToken } = useUserActions();

  const signOut = () => {
    clearUserInfoAndToken();
    navigate("/");
  };

  return signOut;
};
