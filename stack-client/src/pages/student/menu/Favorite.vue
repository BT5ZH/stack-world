<template>
  <div class="course_content">
    <a-empty v-if="FavResList.length == 0" />
    <leftSlider
      v-else
      v-for="item in FavResList"
      :key="item.id"
      :item="item"
      :isClick="0"
      :courseId="courseId"
    ></leftSlider>
  </div>
</template>

<script>
import leftSlider from "../../../components/LeftSlider.vue";

import { mapState } from "vuex";

export default {
  name: "Favorite",
  components: {
    leftSlider,
  },
  data() {
    return {
      courseId: "1",
    };
  },
  mounted() {},
  methods: {},
  computed: {
    ...mapState({
      FavResList: (state) => state.student.favResList,
    }),
  },
};
</script>
