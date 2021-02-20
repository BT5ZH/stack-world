<template>
    <div style="padding: 2rem">
        <a-empty v-if="quesList.length == null" description="暂无试题" />
        <a-list v-else item-layout="vertical" size="large">
            <a-list-item v-for='(item,index) in quesList' :key='index'>
                <multi-ques @submitExam="submitAnswer" :index="index+1" :submited="is_submited" :disabled="is_finished||is_submited" v-if="item.answer.length!=1" :item="item" >
                </multi-ques>
                <single-ques @submitExam="submitAnswer" :index="index+1" :submited="is_submited" :disabled="is_finished||is_submited" v-else :item="item" ></single-ques >
            </a-list-item>
        </a-list>
        <div>
            <a-button 
            type="danger" 
            :disabled="is_submited"
            style="width: 100%; margin-top: 20px"
            @click="finishExam"> {{ btText }}</a-button>
        </div>
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
                score:0,
                is_finished:false,
                is_submited:false,
                refresh:0,
                title:'',
                btText:"提 交 试 卷"
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
            let paper_id = this.$route.params.id;//get the exam paper id which was clicked in the exam paper list in previous page
            this.quesList = this.examList[this.examList.findIndex((item) => item.id===paper_id)].questions;//choose the clicked exam paper from the array examList
            this.is_submited = this.examList[this.examList.findIndex((item) => item.id===paper_id)].isFinish;
            this.score = this.examList[this.examList.findIndex((item) => item.id===paper_id)].score;
            this.title = this.examList[this.examList.findIndex((item) => item.id===paper_id)].title;
            if(this.is_submited) this.btText=`试卷成绩：${this.score}`
        },
        watch: {
          refresh(val) {
            this.is_submited=true;
            this.is_finished=true;
          },
        },
        computed: {
            ...mapState({
                examList: (state) => state.student.examList,
                student_id: (state) => state.public.uid,
            }),
        },
        methods: {
            submitAnswer(ques){
               //console.log(ques);
               if(ques.answer===ques.right_answer){
                 this.score=this.score+100/this.quesList.length;
                 //console.log(this.score);
               }
               //else
                 //console.log("wrong ->"+ques.answer);
           
               let paper_id = this.$route.params.id;
               let student_id = this.student_id;
               let ques_id = ques.id;
               let student_answer = ques.answer;
               let score = Math.round(this.score);
               this.$store.dispatch("student/updateStudentPaper", { paper_id, student_id, ques_id,student_answer,score});
            },
            finishExam(){
               let paper_id = this.$route.params.id;
               let student_id = this.student_id;
               let is_finished=true;
               this.$store.dispatch("student/updateExamPaperStatus", { paper_id, student_id, is_finished});
               this.refresh++;
               this.btText=`试卷成绩：${this.score}`;
            }
        },
    };
</script>