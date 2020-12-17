const mutation = {
  updateIdList(state, params) {
    if (typeof params !== "object" || Array.isArray(params)) return;
    Object.keys(params).forEach((param) => {
      state[param] = params[param];
    });
  },
  clearStorage(state) {
    Object.keys(state).forEach((key) => {
      if (Array.isArray(state[key])) {
        state[key] = [];
      } else if (typeof state[key] === "object") {
        state[key] = {};
      } else if (typeof state[key] === "number") {
        state[key] = 0;
      } else if (typeof state[key] === "boolean") {
        state[key] = false;
      } else if (typeof state[key] === "string") {
        state[key] = "";
      }
    });
  },
};

export default mutation;
