<template>
    <a-page-header style="border: 1px solid rgb(235, 237, 240)" :title="this.$route.query.title" @back="$router.go(-1)" />
</template>