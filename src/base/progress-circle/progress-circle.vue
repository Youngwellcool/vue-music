<template>
  <div class="progress-circle">
    <!--
      svg: viewBox: svg视口从坐标为(0,0)到(100,100)
            stroke-dasharray: circle的周长
            stroke-dashoffset: circle的周长填充量(比如周长stroke-dasharray是314，周长填充量stroke-dashoffset是314，就表示完全填充，stroke-dashoffset是157，就表示填充了半圆)
            TODO 圆形进度条的关键点是：同过动态改变stroke-dashoffset的值，来改变进度条的进度
    -->
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2001/svg">
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"></circle>
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"></circle>
    </svg>
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
    export default {
      props: {
        radius: {
          type: Number,
          default: 100
        },
        percent: {
          type: Number,
          default: 0
        }
      },
      data() {
        return {
          dashArray: 2 * Math.PI * 50
        }
      },
      computed: {
        dashOffset() {
          return (1 - this.percent) * this.dashArray
        },
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~common/stylus/variable"

  .progress-circle
    position relative
    circle
      stroke-width 8px
      transform-origin center
      &.progress-background
        transform scale(0.9)
        stroke: $color-theme-d
      &.progress-bar
        transform scale(0.9) rotate(-90deg)
        stroke: #e6f63e
</style>
