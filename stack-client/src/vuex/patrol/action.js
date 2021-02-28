import axios from "@/utils/axios";

const action = {
    async getPatrolMessage({ commit }, orgName) {
        // 获取当前时间
        var myDate = new Date();
        let year = myDate.getFullYear();
        // 测试
        year = 2020;
        // 测试
        year = year + "" + `-${year + 1}`
        let Day = myDate.getDay();
        // // 测试
        // Day = 2;
        // // 测试
        switch (Day) {
            case 0: Day = "Sun"; break;
            case 1: Day = "Mon"; break;
            case 2: Day = "Tue"; break;
            case 3: Day = "Wed"; break;
            case 4: Day = "Thu"; break;
            case 5: Day = "Fri"; break;
            case 6: Day = "Sat"; break;
        }
        let time = myDate.getHours();
        // // 测试
        // time = 9;
        // // 测试
        if (time >= 8 && time <= 10) time = ["1", "2"];
        else if (time >= 10 && time < 12) time = ["3", "4"];
        else if (time >= 14 && time < 16) time = ["5", "6"];
        else if (time >= 16 && time < 18) time = ["7", "8"];
        else if (time >= 19 && time < 21) time = ["9", "10"];
        else time = [];
        // let semester //之后加，测试时不建议加
        const timeData = { year: year, Day: Day, time: time }
        // 获取patrol信息
        let queryString = orgName;
        const url = "/pc/v1/timetables/patrol/" + queryString;
        try {
            let { data } = await axios.post(url, timeData);
            // 数据处理
            data.data = data.data.filter(course => {
                let status = false;
                course.curriculum.forEach(item => {
                    if (item.date == timeData.Day && item.order.toString() == timeData.time.toString()) {
                        status = true;
                    }
                })
                return status;
            })
            // 巡课数据
            data = data.data.map(item => {
                return {
                    subOrg: item.course_id.subOrg_name,
                    major: item.course_id.major_name,
                    course: { _id: item.course_id._id, name: item.course_id.name },
                    timeTable_id: item._id,
                    lesson_id: item.lesson_id,
                    teacher: item.teacher_id,
                    class: item.curriculum[0].class_id,
                    room: item.curriculum[0].room_id
                }
            })
            console.log("🚀 ~ file: action.js ~ line 65 ~ getPatrolMessage ~ data", data)
            commit("updatePatrolMessage", data);
            // 数据处理
            // 选择树
            // let treeData = [];
            // data.data.forEach(item1 => {
            //     if (!treeData || treeData.length === 0) {
            //         treeData.push({ showName: item1.course_id.subOrg_name, childMenu: [] })
            //     }
            //     treeData.forEach((item2, index, array) => {
            //         if (item1.course_id.subOrg_name == item2.showName) {
            //             item2.childMenu.push({ showName: item1.course_id.major_name })
            //         }
            //         else {
            //             array.push({ showName: item1.course_id.subOrg_name, childMenu: [] })
            //         }
            //     })
            // })
            // commit("updatePatrolTree", treeData)
        } catch (err) {
            // 如果报错为巡课信息为空，则将巡课信息与巡课树改为空
            // 存在出错信息判断问题
            commit("updatePatrolMessage", [])
            // commit("updatePatrolTree", [])
            console.error(err);
        }
    },
    async getPatrolTree({ commit }, oid) {
        const url = `/pc/v1/organizations/${oid}/tree`;
        try {
            const { data } = await axios.get(url);
            commit("updatePatrolTree", data.tree)
        } catch (err) {
            commit("updatePatrolTree", [])
            console.log(err);
        }
    }
};

export default action;
