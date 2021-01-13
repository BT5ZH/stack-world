<template>
  <div class="course_content" style="padding-top: 2rem">
    <a-empty v-if="fileData.fileList.length == 0" />
    <div v-else>
      <a-list size="small" bordered :data-source="fileData.fileList">
        <template #renderItem="item">
          <a-list-item>
            <a :href="item.url" target="_blink">{{ item.title }}</a>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Favorite",
  components: {},
  data() {
    return {};
  },
  mounted() {},
  methods: {},
  computed: {
    ...mapState({
      fileData: (state) => state.student.interaction.file,
    }),
  },
};
</script>