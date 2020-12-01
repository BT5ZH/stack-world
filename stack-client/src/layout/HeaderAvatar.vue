<template>
    <div>
        <a-page-header style="display: flex; justify-content: space-between; align-items: center;" :ghost="false"
            title="User Name" sub-title='welcome' :avatar='{ props:{ user } }'>
        </a-page-header>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                user: '../../src/assets/img/favicon.jpg',
            };
        },
        methods: {
            handleClick(e) {
                console.log('click', e);
            },
            titleClick(e) {
                console.log('titleClick', e);
            },
        },
    };
</script>

<style>
    tr:last-child td {
        padding-bottom: 0;
    }
</style>