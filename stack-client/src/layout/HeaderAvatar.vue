<template>
    <div>
        <a-page-header style="position: relative;" :ghost="false" :title="user.name" sub-title='welcome'
            :avatar='{ props:{ avatar } }'>
            <a-avatar style="position: absolute; top: 2rem;left: 3rem;background-color: #ffbf00;vertical-align: middle">
                {{ avatarValue }}
            </a-avatar>
        </a-page-header>
    </div>
</template>

<script>
    import { mapState } from "vuex";

    export default {
        data() {
            return {
                avatarValue: '',

                avatar:'',//占地儿的不用管
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
        mounted() {
            let name = new String(this.user.name)
            this.avatarValue = name.substring(0, 1);
        },
        computed: {
            ...mapState({
                user: state => state.student.user,
            })
        }
    };
</script>

<style>
    tr:last-child td {
        padding-bottom: 0;
    }

    .ant-page-header-content {
        padding: 0;
    }
</style>