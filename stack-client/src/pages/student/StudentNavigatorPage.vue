<template>
    <div>
        <Header></Header>
        <router-view></router-view>
    </div>
</template>

<script>
    import Header from "../../layout/HeaderTitle.vue";

    export default {
        name: 'StudentNavigatorPage',
        components: {
            Header,
        },
    }
</script>

