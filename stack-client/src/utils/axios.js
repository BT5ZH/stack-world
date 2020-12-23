import axios from "axios";
const token = localStorage.getItem("tk");
const devURL = "http://localhost:3050/api";
const proURL = "http://dajun.w-click.cn/api";
export default axios.create({
  baseURL: proURL,
  headers: { Authorization: "Bearer " + token },
  timeout: 5000,
});
