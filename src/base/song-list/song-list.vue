<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song,index)" v-for="(song,index) in songs" class="item">
        <!--扩展一个排行样式-->
        <div class="rank" v-show="rank">
          <span :class="getRankCla(index)">{{getRankText(index)}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
    export default {
      props: {
        songs:{
          type: Array,
          default: []
        },
        rank: { // 接收一个prop为rank，是否开启排行
          type: Boolean,
          default: false
        }
      },
      methods: {
        getDesc(song) {
          return `${song.singer}·${song.album}`
        },
        selectItem(song,index) {  // 该组件是基础组件，不是业务组件，所以该方法里不写业务逻辑，而只是派发事件给其父组件(业务组件)去处理业务逻辑
          this.$emit('select', song, index)
        },

        /********扩展排行图标********/

          // 获取排行图标的样式class值
        getRankCla(index) {
          if(index<=2) {  // 如果是前三名，增加图标样式
            return `icon icon${index}`;  // 返回的样式名与css代码相对应
          }else {  // 否则是文本样式
            return 'text'
          }
        },
        /**
         * 获取排行文本
         * @param index 排行位置
         * @returns {*}
         */
        getRankText(index) {
          if(index>2) {  // 如果是前三名之后
            return index + 1;
          }else {
            return ''
          }
        },
      },
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .rank
        flex: 0 0 25px
        width: 25px
        margin-right: 30px
        text-align: center
        .icon
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px
          &.icon0
            bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
</style>
