<template>
    <a-card :bordered="false" :style="item.style" @click='jmpRoute(item)'>
        <h2 style="color: #fff;">{{item.course_name}}</h2>
        <h3 style="color: #fff;">{{item.teacher}}</h3>
        <p>{{item.time}}</p>
        <p>{{item.classroom}}</p>
    </a-card>
</template>

<script>
    export default {
        name: 'CourseCard',
        props: {
            item: Object,
        },
        data() {
            return {
            }
        },
        mounted() {
        },
        methods: {
            jmpRoute(item){
                this.$router.push({ path: '/student/course/' + item.course_id,query: { title: item.course_name } });
            }
        }
    }
</script>