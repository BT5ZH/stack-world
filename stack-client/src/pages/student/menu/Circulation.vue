<!-- <template>
    <div :style="{
          display: 'inline-block',
          width: '100%',
        }">
        <a-calendar v-model="value" />
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        data() {
            return {
                value: moment(null),
            };
        },
        methods: {
            onSelect(value) {
                this.value = value;
            },
            onPanelChange(value) {
                this.value = value;
            },
        },
        created: function () {
            var date = new Date();
            console.log(date)
            date =
                date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            this.value = moment(date);
        }
    };
</script> -->


<template>
    <div id="draggable">
        <div id="webId">
            <div>你的web页面</div>
            <!-- 如果碰到滑动问题，1.1 请检查这里是否属于同一点。 -->
            <!-- 悬浮的HTML -->
            <div class="xuanfu" id="moveDiv" @mousedown="down" @touchstart="down" @mousemove="move"
                @touchmove.prevent="move" @mouseup="end" @touchend="end">
            </div>
        </div>
        <div>position.x:{{position.x}} -- position.y{{position.y}}</div>
        <div>dx:{{dx}} --dy:{{dy}}</div>
        <div>nx:{{nx}}--ny:{{ny}}</div>
        <div>xPum:{{xPum}} --yPum:{{yPum}}</div>
        <div>pageX:{{pageX}} --pagey:{{pagey}}</div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                flags: false,
                position: { x: 0, y: 0 }, //鼠标的横纵坐标
                pageX: "", //页面可视区域的宽
                pagey: "", //页面可视区域的高
                nx: "",
                ny: "",
                dx: "",
                dy: "",
                xPum: "",
                yPum: ""
            };
        },
        mounted() {
            this.pageX = document.body.offsetWidth;
            this.pagey = document.body.offsetHeight;
        },
        computed: {
            moveDiv(){
                return document.querySelector("#moveDiv");
            } 
        },
        methods: {
            // 实现移动端拖拽
            down() {
                this.flags = true; //是否开启拖拽
                var touch;
                if (event.touches) {
                    touch = event.touches[0];
                } else {
                    touch = event;
                }
                this.position.x = touch.clientX;
                this.position.y = touch.clientY;
                this.dx = this.moveDiv.offsetLeft;
                this.dy = this.moveDiv.offsetTop;
            },
            move() {
                if (this.flags) {
                    var touch;
                    if (event.touches) {
                        touch = event.touches[0];
                    } else {
                        touch = event;
                    }
                    this.nx = touch.clientX - this.position.x;
                    this.ny = touch.clientY - this.position.y;

                    this.yPum = this.dy + this.ny;
                    if (this.dx + this.nx <= 0) {
                        this.xPum = 0;
                    } else if (this.dx + this.nx >= this.pageX - 100) {
                        this.xPum = this.pageX - 100;
                    } else {
                        this.xPum = this.dx + this.nx;
                    }
                    if (this.dy + this.ny <= 0) {
                        this.yPum = 0;
                    } else if (this.dy + this.ny >= this.pagey - 100) {
                        this.yPum = this.pagey - 100;
                    } else {
                        this.yPum = this.dy + this.ny;
                    }
                    this.moveDiv.style.left = this.xPum + "px";
                    this.moveDiv.style.top = this.yPum + "px";
                    //阻止页面的滑动默认事件；如果碰到滑动问题，1.2 请注意是否获取到 touchmove
                    document.addEventListener(
                        "touchmove",
                        function () {
                            event.preventDefault();
                        },
                        false
                    );
                }
            },
            //鼠标释放时候的函数
            end() {
                this.flags = false;
            }
        }
    };
</script>
<style>
    .xuanfu {
        /* 如果页面报错 [Intervention] Unable to preventDefault inside passive event listener due to target being treated as passive. See <URL>；   请添加样式 touch-action: none; */
        touch-action: none;
        height: 100px;
        width: 100px;
        /* 如果碰到滑动问题，1.3 请检查 z-index。z-index需比web大一级*/
        z-index: 999;
        position: fixed;
        top: 4.2rem;
        right: 3.2rem;
        border-radius: 0.8rem;
        background-color: rgba(0, 0, 0, 0.55);
    }
</style>