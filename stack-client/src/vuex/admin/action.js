const action = {
    async change_spin_status({commit},status){
        commit("change_spin_status",status)
    },
    async change_Tree_spin_status({commit},status) {
        // console.log(status)
        commit("change_Tree_spin_status",status)
    }
};

export default action;
