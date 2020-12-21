const getter = {
  getHomeworkInfo(state, id) {
    let index = this.checkedList.findIndex((item) => {
      return item.hid === id;
    });
    return state.homeworkList[index];
  },
};

export default getter;
