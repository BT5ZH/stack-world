<template>
    <div class="course_content">
        <leftSlider v-for='item in FavResList' :key='item.id' :item='item' :isClick=0 :courseId='courseId'></leftSlider>
        <!-- <resCard v-for='item in ResList' :key='item.id' :item='item' :isClick='isClick'></resCard> -->
    </div>
</template>

<script>
    import leftSlider from '../../../components/LeftSlider.vue';
    // import resCard from '../../../components/student/ResCard.vue';

    import { mapState } from "vuex";

    export default {
        name: 'Favorite',
        components: {
            leftSlider,
            // resCard,
        },
        data() {
            return {
                courseId:'1',
            }
        },
        mounted() {
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