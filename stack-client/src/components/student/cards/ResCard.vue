<template>
    <div class="card_rectangle" @click.stop='handleRes(item)'>
        <div class="card_rectangle--row">
            <a-tag :color="item.resType==0?'blue':(item.resType==1?'red':'purple')">
                {{item.resType==0?'文件':(item.resType==1?'试卷':'视频')}}
            </a-tag>
            <h4 style="margin-bottom: 0;">{{item.title}}</h4>
            <a-icon type="right-circle" />
        </div>
        <div class="card_rectangle--row">
            <a-tag :color="item.isFinish?'green':'orange'">
                {{item.isFinish?'已完成':'未完成'}}
            </a-tag>
            <span>2020-7-19 10:26</span>
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
        methods: {
            handleRes(item){
                if(item.resType==1){
                    this.jmpTest(item);
                }else if(item.resType==2){
                    this.jmpVideo(item);
                }else{
                    this.isClick==0? this.download(item): this.jmpHomework(item);
                }
            },
            jmpTest(){
                console.log('testttttttttt')
            },
            jmpVideo(item){
                this.$router.push({ path: '/student/course/'+ this.courseId + '/video/'+ item.id,query: { title: item.id } });
            },
            jmpHomework(item){
                this.$router.push({ path: this.$route.path + '/homework',query: { title: item.title } });
            },
            download(){
                window.open("https://tse1-mm.cn.bing.net/th?id=OIP.cbZhKMlh-W8pVvfypGmqJwAAAA&w=208&h=160&c=8&rs=1&qlt=90&dpr=2&pid=3.1&rm=2");
            }
        }
    }
</script>