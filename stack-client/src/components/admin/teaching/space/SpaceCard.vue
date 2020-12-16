<template>
  <div>
    <a-modal v-model="bulkImport_visible" title="批量导入" @ok="bulkimportSubmit">
      <a-upload name="file" :multiple="true" :action="upload_url" @change="handleChange">
        <a-button type='primary'>
          <a-icon type="upload" /> 上传文件
        </a-button>
      </a-upload>
      <br />
      <br />
      <a-button @click='download'>下载模板</a-button>
    </a-modal>

    <div class="btn-area">
      <a-col>
        <a-input-search placeholder="教室关键词" enter-button v-model='searchContent' @search="onSearch" />
      </a-col>

      <a-col class="btn">
        <a-button type="primary" @click='bulkImport_visible=true'>批量添加教室</a-button>
        <!-- <a-button type="primary">添加教室</a-button> -->
        <a-button type="primary" @click="showDeleteConfirm(checkedList)">批量删除</a-button>
      </a-col>
    </div>

    <a-row :gutter="8">
      <a-col v-for="(room, index) in classList" :key="index" :span="4" class="card-container">
        <a-card>
          <a-checkbox @change="onChange($event,room.name)">{{ room.name }}</a-checkbox>
        </a-card>
      </a-col>
      <!-- <a-checkbox-group v-model="checkedList" :options="classList.name" @change="onChange" /> -->
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
        bulkImport_visible: false,
        upload_url: '',
        searchContent:'',

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
        checkedList: [],
      };
    },
    methods: {
      onSearch(value) {
        console.log(value);
        //调后台接口传value
      },
      showDeleteConfirm(deleteList) {
        console.log(deleteList)
        deleteList.length == 0 ?
          this.$message.info('请选中要删除的项')
          : this.$confirm({
            title: '确认删除吗',
            content: '数据删除后不可恢复',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
              console.log(deleteList);
              //post deleteList
            },
            onCancel() {
              console.log('Cancel');
            },
          });
      },
      //选择
      onChange(e, value) {
        if (e.target.checked) {
          this.checkedList.push(value);
        } else {
          let index = this.checkedList.findIndex((item) => {
            return item === value;
          });
          //删除元素
          this.checkedList.splice(index, 1);
        }
        console.log(this.checkedList);
      },
      //bulk import
      download() {
        let url = '';//输入模板下载url
        window.open(url);
      },
      //上传批量导入表格
      handleChange(info) {
        this.upload_url = '';//上传地址
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          this.$message.success(`${info.file.name} 上传成功`);
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} 上传失败.`);
        }
      },
      //点击上传文件
      bulkimportSubmit() {
      }
    },
  };
</script>

<style scoped>
  .btn-area {
    padding: 20px 0 20px;
    display: flex;
    justify-content: space-between;
  }

  .check-all {
    padding-bottom: 20px;
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