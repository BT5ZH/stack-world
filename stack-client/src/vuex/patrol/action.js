import axios from "@/utils/axios";

const action = {
    async getPatrolMessage({ commit, state }, orgName) {
        // 获取当前时间
        var myDate = new Date();
        let year = myDate.getFullYear();
        // 测试
        year = 2020;
        // 
        year = year + "" + `-${year + 1}`
        let Day = myDate.getDay();
        // let semester //之后加，测试时不建议加
        const timeData = { year: year }
        // 获取patrol信息
        let queryString = orgName;
        const url = "/pc/v1/timetables/patrol/" + queryString;
        try {
            let { data } = await axios.post(url, timeData);
            // 模糊查询
            if (state.menuSelect.subOrg) {
                data.data = data.data.filter(item => {
                    return item.course_id.subOrg_name == state.menuSelect.subOrg;
                })
            }
            // 数据处理 排巡课前的课表
            let patrolScheduleTable = [];
            data.data.forEach(course => {
                course.curriculum.forEach(item => {
                    for (let index = 1; index <= 10; index++) {
                        if (patrolScheduleTable[index - 1] == undefined) {
                            patrolScheduleTable[index - 1] = [];
                        }
                        if (item.order.indexOf(index + "") > -1) {
                            // 分周定三维数组
                            switch (item.date) {
                                case "Mon":
                                    assignScheduleDate(patrolScheduleTable, 0, index, course, item);
                                    break;
                                case "Tue":
                                    assignScheduleDate(patrolScheduleTable, 1, index, course, item);
                                    break;
                                case "Wed":
                                    assignScheduleDate(patrolScheduleTable, 2, index, course, item);
                                    break;
                                case "Thu":
                                    assignScheduleDate(patrolScheduleTable, 3, index, course, item);
                                    break;
                                case "Fri":
                                    assignScheduleDate(patrolScheduleTable, 4, index, course, item);
                                    break;
                                case "Sat":
                                    assignScheduleDate(patrolScheduleTable, 5, index, course, item);
                                    break;
                                case "Sun":
                                    assignScheduleDate(patrolScheduleTable, 6, index, course, item);
                                    break;

                            }
                        }
                    }
                })
            });
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
            commit("updatePatrolSchedule", patrolScheduleTable);
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
    },
};

function assignScheduleDate(patrolScheduleTable, date, index, course, item) {
    if (patrolScheduleTable[index - 1][date] == undefined) {
        patrolScheduleTable[index - 1][date] = [];
    }
    patrolScheduleTable[index - 1][date].push({
        date: item.date,
        lesson_id: course.lesson_id,
        course: { _id: course.course_id._id, name: course.course_id.name, course_type: course.course_id.course_type },
        teacher: { _id: course.teacher_id.id, name: course.teacher_id.name },
        room: item.room_id
    })
}

export default action;
