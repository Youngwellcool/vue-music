<template>
  <scroll
    class="listview"
    :data="data"
    :listenScroll="listenScroll"
    :probeType="probeType"
    ref="listView"
    @scroll="scroll"
  >
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li class="list-group-item" v-for="item in group.items" @click="selectItem(item)">
            <img class="avatar" v-lazy="item.avatar" alt="">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut">
      <ul>
        <li
          v-for="(item,index) in shortcutList"
          class="item"
          :class="{'current':currentIndex===index}"
          :data-index="index"
          @touchstart="onShortCutTouch"
          @touchmove.stop.prevent="onShortCutMove"
        >
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <h2 class="fixed-title">{{fixedTitle}}</h2>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading text="玩命加载中……"></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
    import Scroll from 'base/scroll/scroll'
    import {getDataProp} from 'common/js/dom'
    import Loading from 'base/loading/loading'


    const SHORTCUT_HEIGHT = 18; // 每个索引计算后的高度
    const TITLE_HEIGHT = 30; // .list-group-title的高度 列表组标题的高度

    export default {

      props: {
        data: {
          type: Array,
          default: []
        },
      },
      data() {
        return {
          scrollY: 0,
          probeType: 3, // better-scroll的属性，3表示开启实时监控滚动
          currentIndex: 0, // 当前滚动到的区域 的位置(也就是在'热门 A ~ Z'的哪个区域)
          diff: -1
        }
      },
      created() {
        this.touches = {} // 因为this.touches在onShortCutTouch方法和onShortCutMove方法中都用到了，所以需要将touches声明为一个全局变量。 为什么不在data或者props或者computed中定义这touches呢？因为在data、props、computed中定义的变量，vue会自动给变量加上get和set方法，监听变量的改变，而touches这个变量的改变是不需要被监听
        this.listenScroll = true;
        this.listHeight = [];
      },
      mounted() {
        setTimeout(()=> {
          console.log(this.$refs.listGroup)
        },2000)

      },
      computed: {
        shortcutList() {
          return this.data.map((group) => {
            return group.title.substring(0, 1)
          })
        },
        fixedTitle() {
          if(this.scrollY > 0){ // 滚动到顶，还在下拉的情况即this.scrollY > 0，这时fixedTitle为空
            return ''
          }
          return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
        },
      },
      methods: {
        refresh() {
          this.$refs.listView.refresh();
        },
        selectItem(item) {
          this.$emit('select', item)
        },
        onShortCutTouch(e) {
          let index = getDataProp(e.target, 'index'); // 获取被点击索引的data-index值
          this.touches.y1 = e.touches[0].pageY;
          this.touches.index = index;
          this._scrollToElement(index);
        },
        onShortCutMove(e) {
          this.touches.y2 = e.touches[0].pageY;
          let delta = (this.touches.y2 - this.touches.y1) / SHORTCUT_HEIGHT | 0;// 计算滑动时经过了多少个索引项，'| 0'是下取整
          let index = (+this.touches.index) + delta; // 计算滑动时经过的索引项的位置
          this._scrollToElement(index);
        },
        scroll(pos) {
          this.scrollY = pos.y; // 页面垂直方向滚动的y值 【注意：该y值为负】
        },
        _scrollToElement(index) {
          if(index < 0) { // 当滚动超过了顶部
            index = 0;
          }else if(index > this.listHeight.length - 2) { // 当滚动超过了底部
            index = this.listHeight.length - 2
          }
          this.scrollY = -this.listHeight[index];
          this.$refs.listView.scrollToElement(this.$refs.listGroup[index], 0) // 滚动到与被点击索引index对应的位置 【this.$refs.listGroup[index]--与被点击索引index对应的listGroup DOM】
        },
        /**
         * 计算每一个ref=listGroup的元素距离父容器顶部的高度，把这些高度值存放在listHeight数组中
         * @private
         */
        _calculateHeight() {
          this.listHeight = [];
          let list = this.$refs.listGroup;
          let height = 0;
          this.listHeight.push(height);
          for(let i = 0;i<list.length;i++){
            let item = list[i];
            height += item.clientHeight; // 每一个listGroup距离父容器顶部的距离 等于 上一个元素距离父容器顶部距离 加上 该元素的高度
            this.listHeight.push(height);
          }
          console.log(this.listHeight)
        }
      },
      watch: {
        data() {
          setTimeout(() => {  // 数据变动到页面渲染延时20ms，能保证页面渲染完成再执行dom的操作，不用$nextTick()方法，是为了兼容性
            this._calculateHeight();
          }, 20)
        },
        scrollY(newY) {
          const listHeight = this.listHeight;
          // 当滚动到顶部，但仍然还在往下拉的时候，newY是大于0的
          if(newY >= 0) {
            this.currentIndex = 0;
            return
          }
          // 当在中间部位滚动
          for(let i = 0; i < listHeight.length - 1; i++){
            let height1 = listHeight[i]; // 当前列表组区域的下边界 比如热门组：0 (热门组区域在0~760)
            let height2 = listHeight[i+1]; // 当前列表组区域的上边界 比如热门组：760
            if(-newY >= height1 && -newY < height2){
              this.currentIndex = i;
              this.diff = height2 + newY;  // 计算diff的值 (newY是负值)
              return
            }
          }
          // 当滚动到底部，且-newY大于最后一个元素的上限
          this.currentIndex = listHeight.length - 2

        },
        diff(newDiff) {
//          console.log(newDiff)
          let fixedTop = (newDiff < TITLE_HEIGHT) ? newDiff - TITLE_HEIGHT : 0; // (newDiff < TITLE_HEIGHT)表示当前列表组的diff小于列表组标题的高度了，也就是下一个列表组的标题栏开始与fixedTitle标题栏重合了
//          console.log(fixedTop);
          if(this.fixedTop === fixedTop){ // 当fixedTop没有发生改变时(也就是fixedTop=0),return掉，以减少下面的translate的操作频次，优化
            return
          }
          this.fixedTop = fixedTop;
          this.$refs.fixed.style.transform = `translate3D(0,${fixedTop}px,0)`; // fixedTitle向上偏移(效果就是下一个列表组的标题栏推着fixedTitle标题栏向上移动)
        }
      },
      components: {
        Scroll,
        Loading
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
