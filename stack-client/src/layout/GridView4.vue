<template>
  <div>
    <a-row type="flex" justify="start" :gutter="[0, 18]">
      <a-col
        :span="6"
        :key="item.id"
        v-for="item in gridItems"
        style="display: flex; flex-direction: column; align-items: center"
      >
        <a-button
          type="primary"
          :icon="item.icon"
          :style="item.style"
          style="
            width: 8rem;
            height: 8rem;
            margin-bottom: 1.5rem;
            font-size: 3rem;
          "
          @click="jmpRoute(item)"
        />
        <span>{{ item.name }}</span>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: "GridView4",
  props: {
    gridItems: Array,
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    jmpRoute(item) {
      if (this.$route.params.id != null) {
        this.$emit(`update:itemFlag`, item.id);
      } else {
        this.$router.push({ path: item.route, query: { title: item.name } });
      }
    },
  },
};
</script>
