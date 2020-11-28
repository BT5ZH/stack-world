<template>
    <div class="delete">
        <div class="slider">
            <div class="slider-content" @touchstart='touchStart'
                @touchmove.prevent='touchMove' @touchend='touchEnd' :style="deleteSlider">
                <!--  插槽中放具体项目中需要内容     -->
                <slot>
                    <resCard :item='item' :isClick='isClick' :courseId='courseId'></resCard>
                </slot>
            </div>
            <!--  左滑之后右侧显示的内容按钮     -->
            <div class="remove" ref='remove'>
                <a-icon :style="{ fontSize: '20px', marginTop:'1.5rem',marginBottom:'1rem'}"
                 type="heart" :theme="item.isFav?'filled':'outlined'"/>
                <p @click="saveToFav(item)">{{item.isFav?'取消':'收藏'}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    import resCard from './cards/ResCard.vue'

    export default {
        props: {
            courseId: String,
            item: Object,
            isClick: Number,
        },
        components: {
            resCard,
        },
        data() {
            return {
                startX: 0,  //触摸位置
                endX: 0,   //结束位置
                moveX: 0,  //滑动时的位置
                disX: 0,  //移动距离
                deleteSlider: '',//滑动时的效果
            }
        },
        // mounted: {
        //     ready() {
        //         document.addEventListener('click', (e) => {
        //             if (!this.$el.contains(e.target) && this.disX !== 0) {
        //                 this.deleteSlider = "transform:translateX(-" + "0px)";
        //             }
        //         },{passive:false})
        //     },
        // },
        methods: {
            // 按钮方法
            saveToFav(item) {
                console.log(item);
                item.isFav = !item.isFav;
                //update state
                //post cancelFav(id)
            },
            // 向左滚动代码
            touchStart(ev) {
                console.log(ev)
                ev = ev || event
                //tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕
                if (ev.touches.length == 1) {
                    // 记录开始位置
                    this.startX = ev.touches[0].clientX;
                }
            },
            touchMove(ev) {
                ev = ev || event;
                //获取删除按钮的宽度，此宽度为滑块左滑的最大距离
                let wd = this.$refs.remove.offsetWidth;
                if (ev.touches.length == 1) {
                    // 滑动时距离浏览器左侧实时距离
                    this.moveX = ev.touches[0].clientX
                    //起始位置减去 实时的滑动的距离，得到手指实时偏移距离
                    this.disX = this.startX - this.moveX;
                    // 如果是向右滑动或者不滑动，不改变滑块的位置
                    if (this.disX < 0 || this.disX == 0) {
                        this.deleteSlider = "transform:translateX(0px)";
                        // 大于0，表示左滑了，此时滑块开始滑动 
                    } else if (this.disX > 0) {
                        //this.$store.state.left_tuoch_uid = this._uid  //滑动的时候改变vuex里的已滑动组件id

                        //具体滑动距离我取的是 手指偏移距离*5。
                        this.deleteSlider = "transform:translateX(-" + this.disX * 5 + "px)";

                        // 最大也只能等于删除按钮宽度 
                        if (this.disX * 5 >= wd) {
                            this.deleteSlider = "transform:translateX(-" + wd + "px)";
                        }
                    }
                }
            },
            touchEnd(ev) {
                ev = ev || event;
                let wd = this.$refs.remove.offsetWidth;
                if (ev.changedTouches.length == 1) {
                    let endX = ev.changedTouches[0].clientX;
                    this.disX = this.startX - endX;
                    // console.log(this.disX)
                    //如果距离小于删除按钮一半,强行回到起点
                    if ((this.disX * 5) < (wd / 2)) {
                        this.deleteSlider = "transform:translateX(0px)";
                    } else {
                        //大于一半 滑动到最大值
                        this.deleteSlider = "transform:translateX(-" + wd + "px)";
                    }
                }
            }
        }
    }
</script>

<style>
    .slider {
        width: 100%;
        min-height: 11.5rem;
        position: relative;
        user-select: none;
        display: flex;
        align-items: center;
    }

    .slider-content {
        margin-top: -1.5rem;
        min-height: 11.5rem;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: #fff;
        z-index: 100;
        transition: 0.3s;
    }

    .remove {
        display: flex;
        flex-direction: column;
        align-content: center;
        position: absolute;
        width: 8rem;
        height: 9rem;
        background: #ff9f7f;
        right: 0;
        top: .1rem;
        color: #fff;
        text-align: center;
        line-height: 100px;
    }
    .remove p {
        line-height: 3rem;
        letter-spacing: .5rem;
    }
</style>