<template>
    <div class="course_content">
        <empty v-if='FavResList.length==0'></empty>
        <leftSlider v-else v-for='item in FavResList' :key='item.id' :item='item' :isClick=0 :courseId='courseId'></leftSlider>
    </div>
</template>

<script>
    import leftSlider from '../../../components/LeftSlider.vue';
    import empty from '../../../components/Empty.vue'

    import { mapState } from "vuex";

    export default {
        name: 'Favorite',
        components: {
            leftSlider,
            empty,
        },
        data() {
            return {
                courseId:'1',
            }
        },
        mounted() {
            //get favResList
        },
        methods: {
        },
        computed: {
            ...mapState({
                FavResList:  state => state.student.favResList,
            })
        }
    }
</script>