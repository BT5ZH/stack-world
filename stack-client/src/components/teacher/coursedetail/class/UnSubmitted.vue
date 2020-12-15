<template>
    <div class="UnSubmitted">
        <a-list bordered v-for="(stuList,index) in stuLists" :key="index">
            <a-list-item  >
                <p>{{stuList.number}} &nbsp;&nbsp;&nbsp;&nbsp;{{stuList.stuName}}</p>
            </a-list-item>
          </a-list>
    </div>
</template>
<script>
    export default{
        data() {
            return {
            stuLists:[
                {
                    number:'41812122',
                    stuName:'张三'
                },
                {
                    number:'41812122',
                    stuName:'张四'
                },
                {
                    number:'41812122',
                    stuName:'张五'
                },
                {
                    number:'41812122',
                    stuName:'张六'
                },
                {
                    number:'41812122',
                    stuName:'张七'
                }
            ],
            };
        },
    };
</script>