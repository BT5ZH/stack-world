const mutation = {
  updateSessionStorage(key, value) {
    if (typeof key === "object") {
      let obj = key;
      Object.keys().forEach((item) => {
        sessionStorage.setItem(item, obj[item]);
      });
    }
    if (typeof key === "string") {
      sessionStorage.setItem(key, value);
    }
  },
  changeState(state, params) {
    state.temp = params;
  },
};

export default mutation;
