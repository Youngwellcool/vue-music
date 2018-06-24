<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,index) in dots" :class="{active:currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    import {addClass} from 'common/js/dom'
    export default {
      data() {
        return {
          dots: [],
          currentPageIndex: 0,
        }
      },
      props: {
        loop: {
          type: Boolean,
          default: true
        },
        autoPlay: {
          type: Boolean,
          default: true
        },
        click: {
          type: Boolean,
          default: true
        },
        interval: {
          type: Number,
          default: 1000
        },
        threshold: {
          type: Number,
          default: 0.3
        },
        speed: {
          type: Number,
          default: 400
        }
      },
      mounted() {
        setTimeout(() => {
          this._setSliderWidth();
          this._initDots();
          this._initSlider();

          if(this.autoPlay){
            this._play()
          }

        }, 20) // 浏览器刷新需要17ms，这里设置20ms是经验值

        window.addEventListener('resize',() => {
          if(!this.slider){
            return
          }
          clearTimeout(this.resizeTimer);
          clearTimeout(this.timer); // 屏幕尺寸在改变时，停止自动轮播
          this.resizeTimer = setTimeout(() => {
            if (this.slider.isInTransition) { // 是否处于滚动动画过程中。
              this._onScrollEnd()
            } else {
              if (this.autoPlay) {
                this._play()
              }
            }
            this._setSliderWidth(true); // 屏幕尺寸改变完成后，重新初始化slider容器宽度
            this.slider.refresh();
          },60)
        })
      },
      methods: {
          // 初始化轮播图宽度
        _setSliderWidth(isResize) {
          this.children = this.$refs.sliderGroup.children;
          let width = 0;
          let sliderWidth = this.$refs.slider.clientWidth; // slider容器宽度，也就是div默认的100%宽度，全屏宽度
//          console.log(this.children)
          for(let child of this.children){
//            console.log(child);
            addClass(child,'slider-item');
            child.style.width = sliderWidth + 'px'; // 设置每张轮播图为全屏宽度
            width += sliderWidth; // 有多少张轮播图，width的宽度就为所有轮播图的总宽度和
          }
          if(this.loop && !isResize){ // 同时判断是不是屏幕尺寸改变后进入初始化轮播图宽度的，如果是，总宽度就不需要加两倍轮播图宽度了
            width += 2 * sliderWidth // 如果开启了循环滚动，则需要前后各补一张轮播图，所以，slider容器的总宽度需要加两个轮播图的宽度
          }
          this.$refs.sliderGroup.style.width = width + 'px'; // 设置sliderGroup容器的总宽度(所有轮播图宽度之和)
        },
        // 初始化轮播图滚动
        _initSlider() {
          this.slider = new BScroll(this.$refs.slider, {
            scrollX: true,
            scrollY: false,
            momentum: false, // 惯性
            snap: {
              loop: this.loop, // 是否循环
              threshold: this.threshold,
              speed: this.speed
            },
            click: this.click  // 可点击
          })

          this.slider.on('scrollEnd', this._onScrollEnd);
          this.slider.on('touchEnd',()=>{
            if(this.autoPlay){
              this._play()
            }
          })
        },
        // 初始化轮播图定位点
        _initDots() {
          this.dots = new Array(this.children.length) // 点的数量要与轮播图图片(this.children)数量一致
        },
          // 滚动结束时设置 currentPageIndex 当前点的值
        _onScrollEnd() {
            let pageIndex = this.slider.getCurrentPage().pageX;
//            console.log(pageIndex);
            this.currentPageIndex = pageIndex;
            if (this.autoPlay) {
              this._play()
            }
        },
        _play() {
          clearTimeout(this.timer);
          this.timer = setTimeout(()=>{
            this.slider.next()
          },this.interval)
        }
      },
      // keep-alive组件激活(切到该路由时)时调用。
      activated() {
        console.log('激活')
        if (this.autoPlay) {
          this._play()
        }
      },
       // keep-alive组件停用(切走该路由时)时调用。
      deactivated() {
        console.log('禁用')
        clearTimeout(this.timer)
      },
      destroyed() {
        console.log('销毁')
        clearTimeout(this.timer)
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
