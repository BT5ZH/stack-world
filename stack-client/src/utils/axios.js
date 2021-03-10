import axios from "axios";
const token = localStorage.getItem("tk");
const devURL = "http://localhost:3050/api";
// const devURL = "http://localhost:5000";
const innerURL = "http://10.8.51.45/api";
const proURLS = "https://test.w-click.cn/api";
export default axios.create({
  baseURL: innerURL,
  headers: { Authorization: "Bearer " + token },
  timeout: 10000,
});
