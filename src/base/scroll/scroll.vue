<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll'
    export default {
      props: {
        probeType: {
          type: Number,
          default: 1
        },
        click: {
          type: Boolean,
          default: true
        },
        data: {
          type: Array,
          default: null
        }
      },
      mounted() {
        setTimeout(() => {
          this._initScroll();
        },20)
      },
      methods: {
        _initScroll() {
          this.scroll = new BScroll(this.$refs.wrapper, {
            probeType: this.probeType,
            click: this.click
          })
        },
        enable() {
          this.scroll && this.scroll.enable();
        },
        disable() {
          this.scroll && this.scroll.disable()
        },
        refresh() {
          this.scroll && this.scroll.refresh()
        }
      },
      watch: {
        /**
         * 这里监听data数据的变化非常的关键(绝妙)
         * 只要其他组件在调用该组件时，传入的数据data发生改变时，就会主动调用该组件中的refresh方法，使better-scroll重新计算页面dom的宽高，而不需要调用者自己手动来调用该组件的refresh方法
         */
        data() {
          setTimeout(() => {
            this.refresh()
          },20)
        }
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">

</style>
