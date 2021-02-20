import axios from "axios";
const token = localStorage.getItem("tk");
const devURL = "http://localhost:3050/api";
// const devURL = "http://localhost:5000";
const proURL =
  "https://stacksdocker-env-ysbhkejxhp.cn-northwest-1.eb.amazonaws.com.cn/api";
const proURLS = "https://test.w-click.cn/api";
export default axios.create({
  baseURL: devURL,
  headers: { Authorization: "Bearer " + token },
  timeout: 10000,
});
