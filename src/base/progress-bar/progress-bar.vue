<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick"> <!--轨道-->
    <div class="bar-inner">
      <div class="progress" ref="progress"></div> <!--移动的进度条-->
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart="progressTouchStart"
           @touchmove="progressTouchMove"
           @touchend="progressTouchEnd"
      > <!--进度条按钮-->
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {prefixStyle} from 'common/js/dom'

    const transform = prefixStyle('transform');
    const progressBtnWidth = 16; // 进度条按钮宽度

    export default {
      props: {
        percent: {
          type: Number,
          default: 0
        }
      },
      created() {
        this.touch = {}
      },
      methods: {
        progressTouchStart(e) {
          this.touch.initate = true; // 拖动初始化标记
          this.touch.startX = e.touches[0].pageX; // 记录开始拖动的x坐标
          this.touch.left = this.$refs.progress.clientWidth; // 记录开始拖动时，进度条按钮的偏移量，也就是进度条的宽度

        },
        progressTouchMove(e) {
          if(!this.touch.initate) { // 如果没有经过progressTouchStart函数直接进入该函数，就return掉，因为该函数极度依赖progressTouchStart函数！！
            return
          }
          let deltaX = e.touches[0].pageX - this.touch.startX; // 计算拖动的距离
          let offset = Math.max(0, Math.min(this.touch.left + deltaX,this.$refs.progressBar.clientWidth - progressBtnWidth)); // 根据拖动距离deltaX和拖动开始时的进度条按钮偏移量this.touch.left来计算现在按钮的偏移量offset(该偏移量必须介于0到滚动条有效宽度之间，不然就会拖到滚动条外面去了，TODO 这里巧妙运用了Math.min和Math.max函数)
//          this.$refs.progress.style.width = `${offset}px`;
//          this.$refs.progressBtn.style[transform] = `translate3d(${offset}px,0,0)`;
          this._offset(offset);
        },
        progressTouchEnd(e) {
          this.touch.initate = false;
          this._triggerPercent();
        },
        progressClick(e) {
          console.log(e)
          let progressBarLeft = this.$refs.progressBar.getBoundingClientRect().left;
          let deltaX = e.pageX - progressBarLeft;
          let offset = Math.abs(deltaX - this.$refs.progress.clientWidth);
          this._offset(deltaX);
//          this._offset(e.offsetX);
          this._triggerPercent();
        },
          /**
           * 拖动进度条结束后，计算当前进度条的宽度占总进度条的百分比
           * 派发percentChange事件给父组件play.vue
           */
        _triggerPercent() {
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth; // 进度条的有效宽度(这里需要减去进度条按钮的宽度)
          const percent = this.$refs.progress.clientWidth / barWidth;
          this.$emit('percentChange', percent);
        },
          /**
           * 把设置滚动条的宽度和滚动条按钮的偏移量 抽象出来
           * 因为有多处使用了该逻辑
           */
        _offset(offset) {
          this.$refs.progress.style.width = `${offset}px`;
          this.$refs.progressBtn.style[transform] = `translate3d(${offset}px,0,0)`;
        }
      },
      watch: {
        /**
         * 观察父组件play.vue中传来的percent属性，动态改变进度条的宽度和进度条按钮的偏移量
         * @param newPercent
         */
        percent(newPercent) {
          if(newPercent >= 0 && !this.touch.initate){ // 加上!this.touch.initate的目的是：当在拖动时，this.touch.initate=true，就不执行该if条件下的语句，否则拖动时执行了this._offset()方法，该if下也执行了，就会有冲突，滚动条拖动位置就不能确定了， 加上此限制条件，就是将拖动时执行的this._offset()方法优先级最高
            const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth; // 进度条的有效宽度(这里需要减去进度条按钮的宽度)
            const offset = barWidth * newPercent;
//            this.$refs.progress.style.width = `${offset}px`;
//            this.$refs.progressBtn.style[transform] = `translate3d(${offset}px,0,0)`;
            this._offset(offset);
          }
        }
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
