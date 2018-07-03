<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title" ref="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length>0" ref="playBtn">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll @scroll="scroll"
            :probe-type="probeType"
            :listen-scroll="listenScroll"
            :data="songs"
            class="list"
            ref="list">
      <div class="song-list-wrapper">
        <song-list @select="selectItem" :songs="songs"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import {prefixStyle} from 'common/js/dom'
  import Loading from 'base/loading/loading'
  import {mapActions} from 'vuex'

  const RESERVED_HEIGHT = 40; // 歌曲滚动的偏移量，也就是class=title的高度
  const transform = prefixStyle('transform');
  const backdrop = prefixStyle('backdrop-filter');

    export default {
      props: {
        bgImg: {
          type: String,
          default: ''
        },
        songs: {
          type: Array,
          default: []
        },
        title: {
          type: String,
          default: ''
        }
      },
      data() {
        return {
          scrollY: 0
        }
      },
      created() {
        this.probeType = 3;
        this.listenScroll = true;
      },
      mounted() {
//        console.log(this.$refs.bgImage.clientHeight)
//        console.log(this.$refs.list.$el)
        this.bgImageHeight = this.$refs.bgImage.clientHeight; // 背景图片容器的高度
        this.$refs.list.$el.style.top = this.bgImageHeight + 'px';
      },
      computed: {
        bgStyle() {
          return `background-image:url(${this.bgImg})`
        }
      },
      methods: {
        scroll(pos) {
          this.scrollY = pos.y;
        },
        back() {
          this.$router.back();
        },
        selectItem(song, index) {
          this.selectPlay({
            list: this.songs,
            index: index
          })
        },
        // 使用对象展开运算符将 actions 混入 methods 对象中
        ...mapActions(['selectPlay']),  // 将this.selectPlay()方法映射为store/actions.js中的selectPlay()方法，等于在该组件中挂载了selectPlay()方法
      },
      watch: {
        scrollY(newY) {
          let zIndex = 0;
          let scale = 1;
          let blur = 0;
          let percent = Math.abs(newY / this.bgImageHeight); // 背景图片缩放百分比
          this.maxScrollHeight = -(this.bgImageHeight - RESERVED_HEIGHT); // ref=layer能往上滚动的最大距离
          let translateY = Math.max(this.maxScrollHeight, newY); // 这两个值都是负值
          if(translateY==this.maxScrollHeight){ // 往上滚动到最大距离了
            zIndex = 10; // 设置背景图片的z-index 目的是为了让图片盖住歌曲列表，就好像是给歌曲列表设置了overflow:hidden一样
            this.$refs.bgImage.style.paddingTop = `${RESERVED_HEIGHT}px`; // 设置背景图片的padding-top，其实就相当于设置height
            this.$refs.playBtn.style.display = 'none';
          }else {
            this.$refs.bgImage.style.paddingTop = '70%';
            this.$refs.playBtn.style.display = '';
          }
          if(newY > 0) { // 如果往下拉歌曲列表，设置背景图片的z-index和缩放比例
            zIndex = 10;
            scale = 1 + percent; // 背景图片缩放比例 (由来：用this.bgImageHeight*scale = newY+this.bgImageHeight,根据计算结果可以看出，newY等于多少，背景图片的高度就增加了多少，这样就实现了背景图片根据下拉的距离无缝缩放)
          }else { // 如果往上滚动
            blur = Math.min(20 * percent, 20);
          }
          this.$refs.bgImage.style.zIndex = zIndex; // bgImage的z-index的值根据上面的几个if和else条件，变化频繁，所以不要把此句放置在上面的if，else中，只把需要改变的z-index放置在if、else中就可以了，减少了代码量
          this.$refs.filter.style[backdrop] = `blur(${blur}px)`;
          this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`;
          this.$refs.bgImage.style[transform] = `scale(${scale})`;
        }
      },
      components: {
        SongList,
        Scroll,
        Loading
      }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
