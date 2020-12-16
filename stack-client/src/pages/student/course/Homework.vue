<template>
    <div style="width: 95%; margin: 1.2rem auto;">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item ref="name" label="Activity name" prop="name">
                <a-input v-model="form.name" @blur="
                () => {
                  $refs.name.onFieldBlur();
                }
              " />
            </a-form-model-item>
            <a-form-model-item label="Activity form" prop="desc">
                <a-input v-model="form.desc" type="textarea" />
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary" style="margin-left: 30px;" @click="onSave">
                    暂存
                </a-button>
                <a-button type="danger" style="margin-left: 10px;" @click="onSubmit">
                    提交
                </a-button>
            </a-form-model-item>
        </a-form-model>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                labelCol: { span: 4 },
                wrapperCol: { span: 14 },
                other: '',
                form: {
                    name: '',
                    region: undefined,
                    date1: undefined,
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: '',
                },
                rules: {
                    name: [
                        { required: true, message: 'Please input Activity name', trigger: 'blur' },
                        { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
                    ],
                    region: [{ required: true, message: 'Please select Activity zone', trigger: 'change' }],
                    date1: [{ required: true, message: 'Please pick a date', trigger: 'change' }],
                    type: [
                        {
                            type: 'array',
                            required: true,
                            message: 'Please select at least one activity type',
                            trigger: 'change',
                        },
                    ],
                    resource: [
                        { required: true, message: 'Please select activity resource', trigger: 'change' },
                    ],
                    desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }],
                },
            };
        },
        methods: {
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
            onSave() {
                
            },
        },
    };
</script>