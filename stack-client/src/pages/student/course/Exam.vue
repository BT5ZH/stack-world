<template>
    <div style="padding: 2rem">
        <a-empty v-if="quesList.length == null" description="暂无提问" />
        <a-list v-else item-layout="vertical" size="large">
            <a-list-item v-for='(item,index) in quesList' :key='index'>
                <multi-ques v-if="item.answer.length!=1" :item="item">
                </multi-ques>
                <single-ques v-else :item="item"></single-ques>
            </a-list-item>
        </a-list>
    </div>
</template>

<script>
    import singleQues from "../../../components/SingleQues.vue";
    import multiQues from "../../../components/MultiQues.vue";
    import { mapState } from "vuex";

    export default {
        data() {
            return {
                radioStyle: {
                    display: "block",
                    height: "30px",
                    lineHeight: "30px",
                },
                quesList:[],
            };
        },
        components: {
            singleQues,
            multiQues,
        },
        onChange(val) {
            if (!val.length) return;
            this.value = [val.pop()];
        },
        mounted() {
            let id = this.$route.params.id;
            this.quesList = this.examList[this.examList.findIndex((item) => item.id)].questions;
            console.log(this.quesList)
        },
        computed: {
            ...mapState({
                examList: (state) => state.student.examList,
            }),
        },
        methods: {
        },
    };
</script>