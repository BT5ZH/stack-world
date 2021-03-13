import axios from "axios";
const token = localStorage.getItem("tk");

export default axios.create({
    // baseURL: "http://192.168.1.109",
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Accept: "*/*"
    },
    timeout: 10000,
});

// axios.interceptors.response.use(res => {
//     console.log("🚀 ~ file: axios2.js ~ line 16 ~ res", res)
// }, err => {
//     console.log("🚀 ~ file: axios2.js ~ line 18 ~ err", err)
// })
