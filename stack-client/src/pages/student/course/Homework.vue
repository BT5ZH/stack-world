<template>
    <div style="width: 95%; margin: 1.2rem auto;">
        <div>
            <p>作业内容:{{homeworkItem.content}}</p>
            <p>截止日期:{{homeworkItem.deadline}}</p>
            <a-button type="primary" icon="download" @click='download(homeworkItem.attachment_url)'>
                下载
            </a-button>
        </div>
        <!-- <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item label="作业描述" prop="desc">
                <a-input v-model="form.desc" type="textarea" />
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary" @click="resetForm">
                    保存
                </a-button>
                <a-button type="danger" style="margin-left: 10px;" @click="onSubmit">
                    提交
                </a-button>
            </a-form-model-item>
        </a-form-model> -->
    </div>
</template>
<script>
    import { mapState } from "vuex";
    import { mapGetters } from 'vuex'

    export default {
        data() {
            return {
                homeworkItem: {},

                // labelCol: { span: 4 },
                // wrapperCol: { span: 14 },
                // other: '',
                // form: {
                //     name: '',
                //     region: undefined,
                //     date1: undefined,
                //     delivery: false,
                //     type: [],
                //     resource: '',
                //     desc: '',
                // },
                // rules: {
                //     name: [
                //         { required: true, message: 'Please input Activity name', trigger: 'blur' },
                //         { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
                //     ],
                //     region: [{ required: true, message: 'Please select Activity zone', trigger: 'change' }],
                //     date1: [{ required: true, message: 'Please pick a date', trigger: 'change' }],
                //     type: [
                //         {
                //             type: 'array',
                //             required: true,
                //             message: 'Please select at least one activity type',
                //             trigger: 'change',
                //         },
                //     ],
                //     resource: [
                //         { required: true, message: 'Please select activity resource', trigger: 'change' },
                //     ],
                //     desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }],
                // },
            };
        },
        methods: {
            download(url){
                window.open(url);
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
        created: function () {
            // this.getCourse();
            let index = this.homeworkList.findIndex((item) => {
                return item.hid === this.$route.query.id;
            });
            this.homeworkItem = this.homeworkList[index];
        },
        computed: {
            ...mapState({
                homeworkList: (state) => state.student.homeworkList,
            })
        }
    };
</script>