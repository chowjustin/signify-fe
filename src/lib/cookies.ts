import Cookies from "universal-cookie";

const cookies = new Cookies();

export const getToken = (): string => cookies.get("@signify/token");

export const setToken = (token: string) => {
  cookies.set("@signify/token", token, { path: "/" });
};

export const removeToken = () =>
  cookies.remove("@signify/token", { path: "/" });
