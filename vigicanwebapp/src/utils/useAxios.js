import axios from "axios";
import { isAccessTokenExpired, setAuthUser, getRefreshToken } from "./auth";
import { BASE_URL } from "./constant";
import Cookies from "js-cookie";

const useAxios = () => {
  const access_Token = Cookies.get("access_token");
  const refresh_Token = Cookies.get("refresh_token");
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${access_Token}`,
    },
  });
  axiosInstance.interceptors.request.use(async (req) => {
    if (!isAccessTokenExpired()) {
      return req;
    }
    const response = await getRefreshToken(refresh_Token);
    setAuthUser(response.data.access, response.data.refresh);
    req.headers.Authorization = `Bearer ${response.data.access}`;
    return req;
  });
  return axiosInstance;
};

export default useAxios;
