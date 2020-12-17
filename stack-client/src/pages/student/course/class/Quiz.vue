<template>
    <div style="padding: 2rem;">
        <empty v-if='QuesData.length==0'></empty>
        <!-- <a-switch :checked="!loading" @change="onChange" /> -->
        <a-list v-else item-layout="vertical" size="large">
            <a-list-item v-for='(item,index) in QuesData' :key='index'>
                <!-- <a-skeleton :loading="loading" active> -->
                    <single-ques v-if='item.answer.length==1' :item='item'></single-ques>
                    <multi-ques v-else :item='item'></multi-ques>
                <!-- </a-skeleton> -->
            </a-list-item>
        </a-list>
    </div>
</template>
<script>
    import singleQues from '../../../../components/SingleQues.vue'
    import multiQues from '../../../../components/MultiQues.vue'
    import empty from '../../../../components/Empty.vue'

    const QuesData = [];
    for (let i = 0; i < 3; i++) {
        QuesData.push({
            answer:['A','C'],
            content:
                'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
            options: [
                {
                    value: 'A',
                    text: 'aaa'
                },
                {
                    value: 'B',
                    text: 'bbb'
                },
                {
                    value: 'C',
                    text: 'ccc'
                },
                {
                    value: 'D',
                    text: 'ddd'
                },
            ]
        });
    }
    export default {
        components: {
            singleQues,
            multiQues,
            empty,
        },
        data() {
            return {
                loading: true,
                QuesData,
            };
        },
        methods: {
            onChange(checked) {
                this.loading = !checked;
            },
        },
    };
</script>
<style>
    .skeleton-demo {
        border: 1px solid #f4f4f4;
    }
</style>