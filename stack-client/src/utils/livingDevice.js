import axios from "@/utils/axios2";

class livingDevice {
    token = ""
    fileList = []
    async login() {
        // 登录
        const requestData = { userName: "admin", password: "admin", md5Flag: 0 };
        const url = "/sdk/LoginSystem";
        const { data } = await axios.post(url, requestData);
        this.token = data.data.token;
    }
    async startRecord() {
        await this.login();
        // 开始录像
        const url = "/sdk/StartRecord?token=" + this.token;
        const { data } = await axios.get(url)
        console.log("🚀 ~ file: livingDevice.js ~ line 17 ~ livingDevice ~ startRecord ~ data", data)
    }
    async endRecord() {
        // 停止直播
        const url = "/sdk/StopRecord?token=" + this.token;
        const { data } = await axios.get(url)
        console.log("🚀 ~ file: livingDevice.js ~ line 22 ~ livingDevice ~ endRecord ~ data", data)
    }
    async getDownLoadUrl() {
        // 获取下载连接
        let url = "/file/fileList";
        let payload = {
            token: this.token,
            fileName: "PGM.mp4",
            type: 1,
        };
        let queryString = ""
        Object.keys(payload).forEach((key) => {
            queryString += key + "=" + payload[key] + "&";
        });
        queryString = "?" + queryString.slice(0, -1);
        url = url + queryString;
        const data = await axios.get(url);
        this.fileList = data.data.data.fileList;
        let downLoadUrl =
            "http://" +
            "192.168.1.109/file/download/" +
            this.fileList[0].filePath +
            "/" +
            this.fileList[0].fileName +
            "?token=" +
            this.token;
        return downLoadUrl;
    }
    async deleteFile() {
        let url = "/file/delete/" + this.fileList[0].filePath+"/" + this.fileList[0].fileName + "?token=" + this.token;
        console.log("🚀 ~ file: livingDevice.js ~ line 54 ~ livingDevice ~ deleteFile ~ url", url)
        const { data } = await axios.get(url)
        console.log("🚀 ~ file: livingDevice.js ~ line 55 ~ livingDevice ~ deleteFile ~ data", data)
    }
}

export default new livingDevice();