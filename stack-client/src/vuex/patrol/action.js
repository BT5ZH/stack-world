import axios from "@/utils/axios";

const action = {
    async getPatrolMessage({ commit }, orgName) {
        // 获取patrol信息
        let queryString = orgName;
        const url = "/pc/v1/timetables/patrol/" + queryString;
        try {
            let { data } = await axios.get(url);
            // 数据处理
            // 选择树
            let treeData = [];
            data.data.forEach(item1 => {
                if (!treeData || treeData.length === 0) {
                    treeData.push({ showName: item1.course_id.subOrg_name, childMenu: [] })
                }
                treeData.forEach((item2, index, array) => {
                    if (item1.course_id.subOrg_name == item2.showName) {
                        item2.childMenu.push({ showName: item1.course_id.major_name })
                    }
                    else {
                        array.push({ showName: item1.course_id.subOrg_name, childMenu: [] })
                    }
                })
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
            commit("updatePatrolTree", treeData)
            commit("updatePatrolMessage", data);
        } catch (err) {
            console.log(err);
        }
    }
};

export default action;
