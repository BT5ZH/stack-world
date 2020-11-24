<template>
  <div>
    <a-row class="btn-area">
      <a-col :span="5">
        <a-input-search
          placeholder="教室关键词"
          enter-button
          @search="onSearch"
        />
      </a-col>  
      <a-col :span="13"></a-col>
      <a-col :span="6" class="btn">
        <a-button type="primary">批量添加教室</a-button>
        <a-button type="primary">添加教室</a-button>
        <a-button type="primary">批量删除</a-button>
      </a-col>
    </a-row>

    <a-row class="check-all">
      <a-checkbox :checked="true">全选</a-checkbox>
    </a-row>

    <a-row :gutter="16">
      <a-col
        v-for="(room, index) in classList"
        :key="index"
        :span="4"
        class="card-container"
      >
        <a-card>
          <template #title>
            <a-checkbox :checked="true">{{ room.name }}</a-checkbox>
          </template>
          <p>{{ "文津楼1段" }}</p>
        </a-card>
      </a-col>
    </a-row>

    <a-row>
      <a-pagination :total="50" show-size-changer show-quick-jumper />
    </a-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      classList: [
        { name: "文津3624" },
        { name: "文津1116" },
        { name: "文津3624" },
        { name: "文津1116" },
        { name: "文津3624" },
        { name: "文津1116" },
        { name: "文津3624" },
        { name: "文津1116" },
        { name: "文津3624" },
        { name: "文津1116" },
      ],
      checkList: [],
    };
  },
  methods: {
    onSearch() {},
  },
};
</script>

<style scoped>
.btn-area,
.check-all {
  padding-bottom: 10px;
}

.btn .ant-btn {
  margin: 0 5px;
}

.card-container {
  padding-bottom: 20px;
}

.ant-card-bordered {
  border: 1px solid #ccc;
}

.ant-card-head {
  border-bottom: 1px solid #ccc !important;
}

</style>