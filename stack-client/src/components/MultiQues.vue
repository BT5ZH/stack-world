<template>
    <div>
        <p>{{item.content}}</p>
        <a-checkbox-group @change="onChange">
            <a-checkbox class='checkStyle' :key="opt.value" v-for="opt in item.options" :value="opt.value">
                {{opt.text}}
            </a-checkbox>
        </a-checkbox-group>
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
            };
        },
        methods: {
            onChange(checkedValues) {
                console.log('checked = ', checkedValues);
            },
        },
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