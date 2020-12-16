<template>
    <div class="userContainer">
        <a-card class="userCard">
            <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout">
                <a-form-model-item has-feedback label="新密码" prop="pass">
                    <a-input v-model="ruleForm.pass" type="password" autocomplete="off" />
                </a-form-model-item>
                <a-form-model-item has-feedback label="确认密码" prop="checkPass">
                    <a-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
                </a-form-model-item>
                <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
                    <a-button type="primary" @click="submitForm('ruleForm')">
                        确认修改
                    </a-button>
                    <a-button style="margin-left: 10px" @click="resetForm('ruleForm')">
                        清空
                    </a-button>
                </a-form-model-item>
            </a-form-model>
        </a-card>
    </div>
</template>
<script>
    export default {
        data() {
            let validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新密码'));
                } else {
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            let validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入新密码'));
                } else if (value !== this.ruleForm.pass) {
                    callback(new Error("两次密码不一致!"));
                } else {
                    callback();
                }
            };
            return {
                ruleForm: {
                    pass: '',
                    checkPass: '',
                },
                rules: {
                    pass: [{ validator: validatePass, trigger: 'change' }],
                    checkPass: [{ validator: validatePass2, trigger: 'change' }],
                },
                layout: {
                    labelCol: { span: 4 },
                    wrapperCol: { span: 14 },
                },
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        //post new password
                        alert('修改成功!');
                    } else {
                        console.log('修改失败!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        },
    };
</script>