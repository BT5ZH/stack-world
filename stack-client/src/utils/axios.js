import axios from "axios";

export default axios.create({
    baseURL: "http://localhost:3050/api",
    timeout: 1500
});