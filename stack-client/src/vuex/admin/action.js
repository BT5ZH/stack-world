import axios from "@/utils/axios";
const action = {
    async change_spin_status({commit},status){
        commit("change_spin_status",status)
    },
    async change_Tree_spin_status({commit},status) {
        // console.log(status)
        commit("change_Tree_spin_status",status)
    },
    getResourcesOfOneCollege({ commit }, { org_name, subOrg_name }) {
        return new Promise((resolve,reject)=>{
            const requestData = { org_name, subOrg_name};
            const url = "/pc/v1/resources/getLessonResourceOfSubOrg";
            axios.post(url, requestData)
            .then((res ) => {
                console.log(res)
                resolve( res )
              })
              .catch((err) => {
                reject('error-----')
              });
        })
       
      },
    
};

export default action;
