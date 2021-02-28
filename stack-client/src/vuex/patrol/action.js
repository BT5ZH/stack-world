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
            commit("updatePatrolMessage", data);
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
            const {data} = await axios.get(url);
            commit("updatePatrolTree", data.tree)
        } catch (err) {
            commit("updatePatrolTree", [])
            console.log(err);
        }
    }
};

export default action;
