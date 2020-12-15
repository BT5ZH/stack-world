<template>
    <a-layout style="background: #ffffff;">
        <a-layout-content :style="{ minHeight: '280px'}">
            <div class="Submitted">
                <div class="item">
                    <a-row type="flex" align="top">
                        <a-col><p>41812113  刘莞姝</p></a-col>
                        <a-col><p>10分</p></a-col>
                    </a-row>
                    
                    <p>作业内容:
                        <span class="attachment">
                            <a href="./网络工程实验报告模板.docx" download="网络工程实验报告模板.docx">《名单》下载</a>
                        </span>
                    </p>
                    <a-space>
                        <div>
                            <a-button type="primary" @click="addFormVisible = true">
                                重新评阅
                            </a-button>  
                            <a-modal
                                v-model="addFormVisible"
                                 @ok="addcomment"
                                :maskClosable="false"
                            >
                                <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" >
                                    <a-form-model-item label="评分" prop="grade">
                            
                                        <a-select default-value="0分" style="width: 120px">
                                            <div slot="dropdownRender" slot-scope="menu">
                                            <v-nodes :vnodes="menu" />
                                            <a-divider style="margin: 4px 0;" />
                                            <div
                                                style="padding: 4px 8px; cursor: pointer;"
                                                @mousedown="e => e.preventDefault()"
                                            >
                                            </div>
                                            </div>
                                            <a-select-option v-for="item in items" :key="item" :value="item">
                                            {{ item }}
                                            </a-select-option>
                                        </a-select>
                                    </a-form-model-item>
                                    <a-form-model-item label="评语" prop="comment">
                                         <a-textarea
                                            placeholder="请输入评语"
                                            :auto-size="{ minRows: 3, maxRows: 8 }"
                                            v-model="form.comment"
                                        ></a-textarea>
                                    </a-form-model-item>
                                </a-form-model> 
                            </a-modal>          
                        </div>   
                    </a-space>
                     <a-divider style="margin-bottom: 15px;color: cyan;"/>
                </div> 
            </div>
            <div style="margin-top: 20px;">
                    <a-pagination
                      show-size-changer
                      :default-current="3"
                      :total="500"
                      @showSizeChange="onShowSizeChange"
                    />
            </div>
        </a-layout-content>
    </a-layout>
    
</template>
<script>

    export default{
        name:"Notapproved",
        components: {
            
            VNodes: {
                functional: true,
                render: (h, ctx) => ctx.props.vnodes,
            },
        },
        data(){
            return{
                items:[
                '0分', '1分','2分','3分','4分','5分','6分','7分','8分','9分','10分'
                ],
                pageSize: 20,
                current: 4,
                labelCol: { span: 4 },
                wrapperCol: { span: 14 },
                addFormVisible: false,
                 form: {
                        grade: "",
                        comment: "",
                    },
                
            };
        },
        watch: {
            pageSize(val) {
            console.log('pageSize', val);
            },
            current(val) {
            console.log('current', val);
            },
        },
        methods: {
          
            onShowSizeChange(current, pageSize) {
                console.log(current, pageSize);
            },
             addcomment() {},
        }, 
    };
</script>
<style>

    .Submitted{
        border: 3px solid cornsilk;
        border-radius: 5px;
    }
    .item{
        padding: 15px;
    }
</style>