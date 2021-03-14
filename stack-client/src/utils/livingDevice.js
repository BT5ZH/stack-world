import axios from "@/utils/axios2";

class livingDevice {
    token = ""
    fileList = []
    constructor() {
        this.login();
    }
    async login() {
        // 登录
        const requestData = { userName: "admin", password: "admin", md5Flag: 0 };
        const url = "/sdk/LoginSystem";
        const { data } = await axios.post(url, requestData);
        this.token = data.data.token;
    }
    async startRecord() {
        // await this.login();
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
    async getFileList() {
        //  获取所有文件名为PGM的文件
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
        console.log("🚀 ~ file: livingDevice.js ~ line 42 ~ livingDevice ~ getDownLoadUrl ~ this.fileList", this.fileList)
    }
    async getDownLoadUrl() {
        // 获取文件
        await this.getFileList();
        // 获取下载连接
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
    async deleteFile(index) {
        let url = "/file/delete/" + this.fileList[index].filePath + "/" + this.fileList[index].fileName + "?token=" + this.token;
        const { data } = await axios.get(url)
        console.log("🚀 ~ file: livingDevice.js ~ line 55 ~ livingDevice ~ deleteFile ~ data", data)
    }
    async deleteAllFiles() {
        // 获取文件
        await this.getFileList();
        let url = ""
        let data;
        await this.fileList.forEach(file => {
            url = "/file/delete/" + file.filePath + "/" + file.fileName + "?token=" + this.token;
            data = axios.get(url)
        })
    }
}

export default new livingDevice();