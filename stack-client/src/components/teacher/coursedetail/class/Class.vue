<template>
  <div>
  
       <div>
    <a-row type="flex">
      <a-col :span="1" :order="1">
      </a-col>
      <a-col :span="6" :order="2">
       <a-cascader :options="options" placeholder="全部上课时间" @change="onChange" />
      </a-col>
      <br>
      <a-col :span="6" :order="3">
        <a-input-search
          placeholder="课程名称"
          @search="onSearch"
        />
      </a-col>
      <br>
      <a-col :span="4" :order="4">
       <a-button type="primary">
      查询
    </a-button>
      </a-col>
    </a-row>
  </div>
   
    <br>
   
      <a-row type="flex">
      <a-col :span="1" :order="1"/>
      <a-col :span="23" :order="2" class="classlist">
      <class-list></class-list>
      </a-col>
      </a-row>

  </div>
</template>

<script>
import ClassList from "./classlist"

export default {
  components:{ClassList},

  data() {
    return {
      options: [
        {
          value: '周一',
          label: '周一',
          children: [
            {
              value: '上午',
              label: '上午',
              children: [
                {
                  value: '一二节',
                  label: '一二节',
                },
              ],
            },
          ],
        },
        {
          value: '周五',
          label: '周五',
          children: [
            {
              value: '下午',
              label: '下午',
              children: [
                {
                  value: '三四节',
                  label: '三四节',
                },
              ],
            },
          ],
        },
      ],
    };
  },
  methods: {
    onChange(value) {
      console.log(value);
    },

onSearch(){},
},
};
</script>