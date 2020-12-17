<template>
    <div>
        <p>{{item.content}}</p>
        <a-radio-group v-model="value" @change="onChange">
            <a-radio :style="radioStyle" :key="opt.value" v-for="opt in item.options" :value="opt.value">
                {{opt.text}}
            </a-radio>
        </a-radio-group>
    </div>
</template>

<script>
    export default {
        props: {
            item: Object,
        },
        data() {
            return {
                value: '',
                radioStyle: {
                    display: 'block',
                    height: '30px',
                    lineHeight: '30px',
                },
            };
        },
        methods: {
            onChange(e) {
                console.log('radio checked', e.target.value);
            },
        },
    };
</script>