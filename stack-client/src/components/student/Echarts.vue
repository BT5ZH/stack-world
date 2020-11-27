<template>
    <div class="Echarts container__item">
        <div id="main" style="width: 100%;height: 25rem; "></div>
    </div>
</template>

<script>
    export default {
        name: 'Echarts',
        data() {
            return {
                chart_data:[{
                    name: 'Apples',
                    value: 70
                }, {
                    name: 'Strawberries',
                    value: 68
                }, {
                    name: 'Bananas',
                    value: 48
                }, {
                    name: 'Oranges',
                    value: 40
                }, {
                    name: 'Pears',
                    value: 32
                }, {
                    name: 'Pineapples',
                    value: 27
                }, {
                    name: 'Grapes',
                    value: 18
                }],
            };
        },
        methods: {
            myEcharts() {
                // 基于准备好的dom，初始化echarts实例
                var myChart = this.$echarts.init(document.getElementById('main'),'light');

                // 指定图表的配置项和数据
                var option = {
                    series: [{
                        type: 'pie',
                        radius: '55%',
                        center: ['80%', '50%'],
                        data: this.chart_data,
                        animation: false,
                        label: {
                            position: 'outer',
                            alignTo: 'none',
                            bleedMargin: 5
                        },
                        right: '50%',
                    }, ]
                };

                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            }
        },
        mounted() {
            this.myEcharts();
        }
    }
</script>

<style>

</style>