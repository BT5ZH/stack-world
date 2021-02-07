<template>
    <div class="card_rectangle" @click.stop='handleRes(item)'>
        <div class="card_rectangle--row">
            <!-- <a-tag :color="item.resType==0?'blue':(item.resType==1?'red':'purple')">
                {{item.resType==0?'文件':(item.resType==1?'试卷':'视频')}}
            </a-tag> -->
            <a-tag v-if='item.task_type' :color="item.task_type=='preview'?'cyan':'pink'">
                {{item.task_type=='preview'?'课前预习':'课后作业'}}
            </a-tag>
            <a-tag v-else :color="item.resType==0?'blue':(item.resType==1?'red':'purple')">
                {{item.resType==0?'文件':(item.resType==1?'试卷':'视频')}}
            </a-tag>
            <h4 style="margin-bottom: 0;color: #4d4d4d;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{item.title}}</h4>
            <a-icon type="right-circle" />
        </div>
        <div class="card_rectangle--row">
            <a-tag :color="item.isFinish?'green':'orange'">
                <!-- {{item.isFinish?'已完成':'未完成'}} -->
                {{finished}}
            </a-tag>
            <span>请在{{item.deadline}}之前完成</span>
        </div>
    </div>
</template>

<script>
    export default {
        props:{
            item:Object,
            isClick:Number,
            courseId:String,
        },
        data() {
            return {
            }
        },
        mounted() {
        },
        computed: {
          finished() {
            let temp = this.item.isFinish?'已完成':'未完成'
            if(this.item.task_type==='preview')
                temp = '点击下载预习资料'
           
            return temp
               
            },
        },
        methods: {
            handleRes(item){
                if(item.resType==1){
                    this.jmpTest(item);
                }else if(item.resType==2){
                    this.jmpVideo(item);
                }else{
                    this.isClick==0? this.download(item.attachment_url): this.jmpHomework(item);
                }
            },
            jmpTest(item){
                this.$router.push({ path: this.$route.path + '/test',query: { title: item.title } });
            },
            jmpVideo(item){
                this.$router.push({ path: '/student/course/'+ this.courseId + '/video/'+ item.id,query: { title: item.id } });
            },
            jmpHomework(item){
                this.$router.push({ path: this.$route.path + '/homework',query: { title: item.title,id: item.hid } });
            },
            download(url){
                window.open(url);
            }
        }
    }
</script>