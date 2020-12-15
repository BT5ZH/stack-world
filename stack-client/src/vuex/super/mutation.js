const mutation = {
  updateSchoolList(state, params) {
    if (Array.isArray(params)) {
      state.schoolList = params;
      return null;
    }
    throw "[vuex-super-mutation] schoolList type error!";
  },
};

export default mutation;
