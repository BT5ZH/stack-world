<template>
  <div>
    <p>{{index}}.&nbsp;{{ item.content }}</p>
    <a-checkbox-group @change="onChange" :value="value">
      <a-checkbox
        class="checkStyle"
        :key="opt.value"
        v-for="opt in item.options"
        :value="opt.value"
      >
        {{ opt.text }}
      </a-checkbox>
    </a-checkbox-group>
    <br />
    <a-button
      :disabled="disabled"
      @click="submitAnswer"
      style="margin-top: 20px"
      type="primary"
    >
      {{ btnText }}
    </a-button> 
    <!-- <p v-show="answerVisible">正确答案：{{rightAnswer}}&nbsp;&nbsp;|&nbsp;&nbsp;提交答案：{{item.student_answer}}</p> -->
   
    <div style="margin-top: 10px" v-show="answerVisible" > 
      正确答案：{{rightAnswer}}&nbsp;&nbsp;|&nbsp;&nbsp;提交答案：{{item.student_answer==='Z'?"未选":item.student_answer}}
    </div> 
  </div>
</template>
<script>
export default {
  props: {
    item: Object,
    disabled: {
      type: Boolean,
      default: false,
    },
    btnText: {
      type: String,
      default: "确 定",
    },
    //////added the index by qichao//////
    index:{
      type:Number,
      default: 0,
    },
    submited:{
      type:Boolean,
      default:false,
    }
    ////////////////////////////////////
  },
  data() {
    return {
      value: [],
     // answerVisible:false,
      rightAnswer:''
    };
  },
  methods: {
    onChange(val) {
      if (!val.length) return;
      this.value = val;
    },
    submitAnswer() {
      this.$emit("submit", {
        id: this.item.id,
        answer: this.value.sort().join(""),
      });

      ///////////////////////////////////
      this.stuDoQuestion();// added by qichao
      ///////////////////////////////////
    },
    ///////////added by qichao/////////////
    stuDoQuestion(){
      if(this.value!=""){
        this.$emit("submitExam", {
         id: this.item.id,
         answer: this.value.sort().join(""),
         right_answer:this.rightAnswer
        });
        this.disabled=true;
        this.item.student_answer=this.value.sort().join("");
      }else
        this.$message.error("请先选择选项");
    }
    ///////////added by qichao/////////////
  },
  computed:{
    answerVisible() {
      if(this.submited) return true;
      else return false;
    },
  },
   mounted(){
    for(let i=0;i<this.item.answer.length;i++){
        this.rightAnswer = `${this.rightAnswer}${this.item.answer[i]}`
    }
    //if(this.disabled) this.answerVisible=true;
    if (this.item.student_answer!='Z') this.disabled= true;
    
  }
};
</script>

<style>
.checkStyle {
  display: block;
  height: 30px;
  line-height: 30px;
}
.checkStyle:first-child {
  margin-left: 8px;
}
</style>