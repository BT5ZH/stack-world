const getter = {
  lessonIdList(state) {
    return state.courseList.map((item) => item.lesson_id);
  },
  resList(state) {
    // test 因为老师上传资源无视频，故而用于测试。如果我没删除，帮我删了
    state.resList.push({
      _id: "r02",
      rsType: "mp4",
      isFinish: false,
      title: "MP4",
      url: "https://www.runoob.com/try/demo_source/mov_bbb.mp4",
    })
    console.log("🚀 ~ file: getter.js ~ line 8 ~ resList ~  state.resList",  state.resList)
    // test
    // 转换为学生端要求的资源写法
    if (state.resList) {
      state.resList.forEach((source) => {
        if (source.rsType == "mp4") {
          source.rsType = 2
        }
        else {
          source.rsType = 0
        }
      });
      return state.resList.map((item) => ({
        ...item,
        id: item._id,
        title: item.title,
        // 数据库还没有这个，但我觉得需要,表示资源完成情况。
        isFinish: false,
        resType: item.rsType,
        url: item.url||item.attachment_url,
      }));
    } else {
      throw "state.sources 空"
    }
  },
};

export default getter;
