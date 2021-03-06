const mutation = {
    updatePatrolMessage(state, params) {
        state.patrolMessage = params;
    },
    updatePatrolTree(state, params) {
        state.patrolTree = params;
    },
    updatePatrolSchedule(state, params) {
        if (state.patrolSchedule) state.patrolSchedule = [];
        state.patrolSchedule = params;
    },
    updateMenuSelect(state,params){
        state.menuSelect = params;
    },
};

export default mutation;
