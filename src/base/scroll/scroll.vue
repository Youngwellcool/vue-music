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
        },
        listenScroll: {
          type: Boolean,
          default: true
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
          if(this.listenScroll) {
            let me = this;
            this.scroll.on('scroll', (pos) => {
//              console.log(pos) // {x:0,y:0} 注意：垂直方向滚动时，y值是负的
              me.$emit('scroll', pos)
            })
          }
        },
          // 启用 better-scroll
        enable() {
          this.scroll && this.scroll.enable();
        },
          // 禁用 better-scroll
        disable() {
          this.scroll && this.scroll.disable()
        },
          // 重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
        refresh() {
          this.scroll && this.scroll.refresh()
        },
          // 滚动到指定的位置
          // 之所以调用apply方法是为了给scrollTo()方法传arguments参数(绝妙),因为listview.vue组件在调用该方法的时候，传递的参数个数是不确定的，用函数的arguments属性就可以很好的解决参数个数不确定的情况，又因为arguments是类数组，如果直接把该类数组传入this.scroll.srollTo(arguments)，就会出错(srollTo不接受数组参数)，因为apply方法第二个参数是可以接受数组的，所以apply就很好的解决了这个问题。  【当然上面的这个问题，用ES6 ...扩展运算符，就可以简单的解决了，如下的scrollToElement方法中】
        scrollTo() {
          this.scroll && this.scroll.srollTo.apply(this.scroll, arguments);
        },
          // 滚动到指定的目标元素。
        scrollToElement() {
//          console.log(arguments)
          this.scroll && this.scroll.scrollToElement(...arguments)
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
