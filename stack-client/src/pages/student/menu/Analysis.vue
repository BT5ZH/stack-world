<template>
    <div style="background-color:#f7f7f7; min-height: 90vh;">
        <a-select style="width: 100%;margin: 0 auto; padding: 2rem 2rem 0;" :default-value="courseList[0].course_name">
            <a-select-option v-for='item in courseList' :key='item.id' :value="item.course_name">{{item.course_name}}
            </a-select-option>
        </a-select>
        <a-divider orientation="left" style="padding: 2rem .8rem 0;margin: .8rem 0;">
            课堂参与度
        </a-divider>
        <div class="grid_statistic">
            <a-card class="grid_statistic__item grid_statistic__item--1">
                <a-statistic title="出勤率" :value="11.28" :precision="2" suffix="%"
                    :value-style="{ color: '#9FE6B8' }" style="margin-right: 50px">
                    <template #prefix>
                        <!-- <a-icon type="arrow-up" /> -->
                    </template>
                </a-statistic>
            </a-card>
            <a-card class="grid_statistic__item grid_statistic__item--2">
                <a-statistic title="提问率" :value="9.3" :precision="2" suffix="%" class="demo-class"
                    :value-style="{ color: '#ff9f7f' }">
                    <template #prefix>
                        <!-- <a-icon type="arrow-up" /> -->
                    </template>
                </a-statistic>
            </a-card>
            <a-card class="grid_statistic__item grid_statistic__item--3">
                <a-statistic title="问卷投票参与率" :value="9.3" :precision="2" suffix="%" class="demo-class"
                    :value-style="{ color: '#8378EA' }">
                    <template #prefix>
                        <!-- <a-icon type="arrow-up" /> -->
                    </template>
                </a-statistic>
            </a-card>
            <a-card class="grid_statistic__item grid_statistic__item--4">
                <a-statistic title="随堂测试准确率" :value="11.28" :precision="2" suffix="%"
                    :value-style="{ color: '#FFDB5C' }" style="margin-right: 50px;">
                    <template #prefix>
                        <!-- <a-icon type="arrow-up" /> -->
                    </template>
                </a-statistic>
            </a-card>
        </div>
        <a-divider orientation="left" style="padding: 2rem .8rem 0;margin: .8rem 0;">
            课后成绩分析
        </a-divider>
        <div class="grid_statistic">
            <a-card class="grid_statistic__item grid_statistic__item--1">
                <a-statistic title="考试及格率" :value="100" :precision="2" suffix="%"
                    :value-style="{ color: '#9FE6B8' }" style="margin-right: 50px">
                    <template #prefix>
                        <!-- <a-icon type="arrow-up" /> -->
                    </template>
                </a-statistic>
            </a-card>
            <a-card class="grid_statistic__item grid_statistic__item--2">
                <a-statistic title="考试平均成绩" :value="85" :precision="2" suffix="分" class="demo-class"
                    :value-style="{ color: '#ff9f7f' }">
                    <template #prefix>
                        <!-- <a-icon type="arrow-up" /> -->
                    </template>
                </a-statistic>
            </a-card>
            <a-card class="grid_statistic__item grid_statistic__item--3">
                <a-statistic title="作业平均成绩" :value="86.7" :precision="2" suffix="分" class="demo-class"
                    :value-style="{ color: '#8378EA' }">
                    <template #prefix>
                        <!-- <a-icon type="arrow-up" /> -->
                    </template>
                </a-statistic>
            </a-card>
            <a-card class="grid_statistic__item grid_statistic__item--4">
                <a-statistic title="资源下载率" :value="100" :precision="2" suffix="%"
                    :value-style="{ color: '#FFDB5C' }" style="margin-right: 50px;">
                    <template #prefix>
                        <!-- <a-icon type="arrow-up" /> -->
                    </template>
                </a-statistic>
            </a-card>
        </div>
    </div>
</template>

<script>
    import { mapState } from "vuex";

    export default {
        name: 'Analysis',
        data() {
            return {
            };
        },
        methods: {
        },
        mounted() {
        },
        computed: {
            ...mapState({
                courseList: state => state.student.courseList
            })
        }
    }
</script>

<style>
.ant-statistic-title{
    white-space: nowrap;
    margin-bottom: 1rem;
}
</style>