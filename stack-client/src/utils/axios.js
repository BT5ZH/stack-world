import axios from "axios";
const token = localStorage.getItem("tk");
const devURL = "http://localhost:3050/api";
const proURL =
  "http://stacksdocker-env-ysbhkejxhp.cn-northwest-1.eb.amazonaws.com.cn/api";
export default axios.create({
  baseURL: devURL,
  headers: { Authorization: "Bearer " + token },
  timeout: 5000,
});
