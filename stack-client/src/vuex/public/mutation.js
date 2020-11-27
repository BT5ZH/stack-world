const mutation = {
  updateIdList(state, params) {
    if (typeof params !== "object" || Array.isArray(params)) return;
    Object.keys(params).forEach((param) => {
      state[param] = params[param];
    });
  },
};

export default mutation;
