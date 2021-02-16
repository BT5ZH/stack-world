const mutation = {
    updatePatrolMessage(state, params) {
        state.patrolMessage = params;
    },
    updatePatrolTree(state, params) {
        state.patrolTree = params;
    }
};

export default mutation;
