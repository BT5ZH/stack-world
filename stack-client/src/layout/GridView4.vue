<template>
  <div>
    <a-row type="flex" justify="start" :gutter="[0, 18]">
      <a-col
        :span="6"
        :key="item.id"
        v-for="item in gridItems"
        style="display: flex; flex-direction: column; align-items: center"
      >
        <a-badge :dot="item.badge">
          <a-button
            type="primary"
            :icon="item.icon"
            :style="item.style"
            style="width: 8rem; height: 8rem; margin-bottom: 1.5rem; font-size: 3rem"
            @click="jmpRoute(item)"
          />
        </a-badge>
        <span>{{ item.name }}</span>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "GridView4",
  props: {
    gridItems: Array,
  },
  data() {
    return {
      // badge: {
      //   sign: true,
      // },
    };
  },
  // computed: {
  //   ...mapState({
  //     badge: (state) => state.student.badge,
  //   }),
  //   courseStart() {
  //     return this.openRooms.some((item) => item === this.lessonId);
  //   },
  // },
  mounted() {},
  methods: {
    jmpRoute(item) {
      // 未开放按钮提示
      // if (item.id == 2 || item.id == 3) {
      // 禁止名单
      let disabledName = ["我的收藏", "学情分析", "个人资料"];
      if (disabledName.indexOf(item.name) > -1) {
        this.$message.error("未开放");
        return;
      }
      if (this.$route.params.id != null) {
        this.$emit(`update:itemFlag`, item.id);
      } else {
        this.$router.push({ path: item.route, query: { title: item.name } });
      }
    },
  },
};
</script>
