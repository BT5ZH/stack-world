<template>
    <div style="width: 95%; margin: 1.2rem auto;">
        <div>
            <p>作业内容:{{homeworkItem.content}}</p>
            <p>截止日期:</p>
            <a-button type="primary" icon="download" v-if='homeworkItem.attachment_url'>
                教师附件
            </a-button>
        </div>
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item label="作业描述" prop="desc">
                <a-input v-model="form.desc" type="textarea" />
            </a-form-model-item>
            <a-upload name="file" :multiple="true" action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                @change="handleChange">
                <a-button>
                    <a-icon type="upload" /> 点击提交附件
                </a-button>
            </a-upload>
            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }" style="margin: 5rem 5rem 0;">
                <a-button type="primary" @click="resetForm">
                    保存
                </a-button>
                <a-button type="danger" style="margin-left: 10px;" @click="onSubmit">
                    提交
                </a-button>
            </a-form-model-item>
        </a-form-model>
    </div>
</template>
<script>
    import { mapState } from "vuex";
    import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
                labelCol: { span: 4 },
                wrapperCol: { span: 14 },
                other: '',
                form: {
                    name: '',
                    resource: '',
                    desc: '',
                },
                rules: {
                    resource: [
                        { required: true, message: 'Please select activity resource', trigger: 'change' },
                    ],
                    desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }],
                },
            };
        },
        methods: {
            handleChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    this.$message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    this.$message.error(`${info.file.name} file upload failed.`);
                }
            },
            onSubmit() {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm() {
                this.$refs.ruleForm.resetFields();
            },
        },
        computed: {
            ...mapState({
                homeworkList: (state) => state.student.homeworkList,
            }),
            homeworkItem() {
                let index = this.homeworkList.findIndex((item) => {
                    return item.hid === this.$route.query.id;
                });
                return this.homeworkList[index];
            },
        }
    };
</script>