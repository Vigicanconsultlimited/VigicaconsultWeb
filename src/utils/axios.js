import axios from "axios";

const apiInstance = axios.create({
  baseURL: "https://vigica-001-site1.qtempurl.com/api/",
  //baseURL: "http://127.0.0.1:8000/api/v1/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default apiInstance;
