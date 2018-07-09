<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right"  :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :class="cdCls" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i @click.stop="togglePlaying" class="icon-mini" :class="playIconMini"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error" @timeupdate="timeUpdate" @ended="end"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
    import {mapGetters, mapMutations} from 'vuex'
    import animations from 'create-keyframe-animation'
    import {prefixStyle} from 'common/js/dom'
    import progressBar from 'base/progress-bar/progress-bar'
    import progressCircle from 'base/progress-circle/progress-circle'
    import {playMode} from "common/js/config";
    import {shuffle} from 'common/js/util'

    const transform = prefixStyle('transform');
    const transition = prefixStyle('transition');
    const animation = prefixStyle('animation');
    export default {
      data() {
        return {
          songReady: false, // audio元素是否准备就绪 标志位
          currentTime: 0,
          radius: 32,  // 迷你播放器圆形精度条的半径
        }
      },
      computed: {
          // 全屏播放界面：如果播放状态，就显示暂停icon，反之，播放icon
        playIcon() {
          return this.playing ? 'icon-pause' : 'icon-play';
        },
        // mini播放界面：如果播放状态，就显示暂停icon，反之，播放icon
        playIconMini() {
          return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
        },
        cdCls() {
          return this.playing ? 'play' : 'play pause'; // 暂停play和pause样式都要加上，如果没有加上play样式，暂停时就回到初始旋转角度了
        },
        disableCls() {
          return this.songReady ? '' : 'disable';
        },
          /**
           * 进度条的百分比
           * 用计算属性获取极为方便
           *  通过当前歌曲的时间除以歌曲总时间可以获取到歌曲播放的百分比
           */
        percent() {
          return this.currentTime / this.currentSong.duration;
        },
        iconMode() {
          return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
        },
        ...mapGetters([
          'playlist',
          'fullScreen',
          'currentSong',
          'playing',
          'currentIndex',
          'mode',
          'sequenceList'
        ])
      },
      methods: {
        back() {
          // this.fullScreen = false;  // state中的变量不能这样直接修改，否则会报警告
          this.setFullScreen(false) // 通过mutations中的方法去修改
        },
        open() {
          this.setFullScreen(true)
        },
          // 绑定audio元素的canplay事件，避免了当用户频繁快速的切歌时，歌曲没有准备就绪就开始执行audio元素的play()方法而导致的报错
        ready() {
          this.songReady = true;
        },
          // 绑定audio元素的error事件
        error() {
          this.songReady = true;  // 当这首歌曲加载失败或者这首歌曲url错误，会触发audio的error事件，导致这首歌曲不能播放，就不能触发canplay事件，this.songReady就一直等于false，用户切歌，就无法执行pre()和 next()和 togglePlaying()方法，所以这里需要将this.songReady=true，目的是这首歌出错了，不影响下一首上一首歌切换
        },
        next() {
          if(!this.songReady) {  // 如果audio元素没有准备好，就不能点击下一首
            return
          }
          let index = (this.currentIndex === (this.playlist.length - 1)) ? 0 : this.currentIndex + 1;
          this.setCurrentIndex(index);
          if(!this.playing) {
            this.togglePlaying()
          }
          this.songReady = false;  // 切歌成功后要把songReady置为false
        },
        prev() {
          if(!this.songReady) { // 如果audio元素没有准备好，就不能点击上一首
            return
          }
          let index = this.currentIndex === 0 ? (this.playlist.length - 1) : (this.currentIndex -1);
          this.setCurrentIndex(index);
          if(!this.playing) {
            this.togglePlaying()
          }
          this.songReady = false;  // 切歌成功后要把songReady置为false
        },
        timeUpdate(e) {
          this.currentTime = e.target.currentTime; // 取到的值形如：2.770613s，不能直接使用需要格式化
        },
        end() {
          if(this.mode === playMode.loop) { // 单曲循环播放模式
            this.loop();
          }else {
            this.next();
          }
        },
          /**
           * 单曲循环模式
           * 设置audio元素的currentTime=0即可实现
           */
        loop() {
          this.$refs.audio.currentTime = 0;
          this.$refs.audio.play();
        },
          /**
           * 拖动结束后派发的事件回调函数
           * 根据子组件progress-bar.vue传过来的percent设置audio元素的currentTime值
           * 拖动结束后，设置为播放状态
           */
        onProgressBarChange(percent) {
          this.$refs.audio.currentTime = this.currentSong.duration * percent; // audio元素的currentTime属性是可读性的
          if(!this.playing) {  // 拖动结束后，设置为播放状态
            this.togglePlaying();
          }
        },
          /**
           * 时间戳格式化为分和秒
           * @param interval 需要格式化的时间戳，单位为秒
           */
        format(interval) {
          interval = interval | 0; // 下取整
          let minute = interval/60 | 0;
          let second = this._pad(interval%60, 0); // 秒补位
          return `${minute}:${second}`
        },
        /**
         * 不够位数，补位格式化函数
         * @param num 需格式化补位的数字
         * @param str 指定的补位字符
         * @param n 指定当num少于n位时，才需要补位，一直补到num的位数等于n位
         */
        _pad(num, str, n = 2) {
          str = str.toString();
          let len = num.toString().length;
          while(len < n) {
            num = str + num;
            len++
          }
          return num;
        },

        enter(el, done) {
          let {x,y,scale} = this._getPosAndScale();
          let animation = {
            0: {
              transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})` // 设置大唱片在动画开始时初始位置x,y和初始状态scale。。(这个初始位置和初始状态是相对于动画结束后大唱片的正常位置【translate3d(0, 0, 0) scale(1)】的偏移量和缩放量，这个初始位置和初始状态就是小唱片的正常位置和缩放大小，相对于大唱片是往左偏移了x、往下偏移了y、缩放了scale。所以偏移量x是负值，y是正值，scale是小于1的)
            },
            60: {
              transform: 'translate3d(0, 0, 0) scale(1.1)'
            },
            100: {
              transform: 'translate3d(0, 0, 0) scale(1)'
            }
          };
          animations.registerAnimation({
            name: 'move',
            animation,
            presets: {
              duration: 400,
              easing: 'linear'
            }
          });
          animations.runAnimation(this.$refs.cdWrapper, 'move', done)
        },
        afterEnter() {
          animations.unregisterAnimation('move');
          this.$refs.cdWrapper.style[animation] = '';
        },
        leave(el, done) {
          let {x,y,scale} = this._getPosAndScale();
          this.$refs.cdWrapper.style[transition] = 'all 0.4s';
          this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
          this.$refs.cdWrapper.addEventListener('transitionend', done)
        },
        afterLeave() {
          this.$refs.cdWrapper.style[transition] = '';
          this.$refs.cdWrapper.style[transform] = '';
        },
        /**
         * 获取大唱片位置偏移到小唱片位置，x轴和y轴方向上的偏移量x、y，缩放比例scale
         * TODO 为什么会想到要获取这些值呢？因为做css3动画，都是要先获取动画的初始位置，初始状态
         * @returns {{x: number, y: number, scale: number}}
         * @private
         */
        _getPosAndScale() {
          const targetWidth = 40; // 小唱片图片的宽度 1
          const paddingLeft = 40; // 小唱片图片的中心点到屏幕左测的距离 2
          const paddingBottom = 30; // 小唱片图片的中心点到屏幕底部的距离 3
          const paddingTop = 80;  // 大唱片图片的顶部到屏幕顶部的距离 4
          const width = window.innerWidth * 0.8;  // 大唱片图片的宽度 (css中 width:80%)
          const scale = targetWidth / width; // 大唱片图片到小唱片图片的缩小比例
          const x = -(window.innerWidth/2 - paddingLeft); // 大唱片图片中心点与小唱片图片中心点在x轴方向上的距离 (负值：是因为大唱片偏移到小唱片的位置，x轴方向上需要往左移)
          const y = window.innerHeight - paddingTop - window.innerWidth/2 - paddingBottom; // 大唱片图片中心点与小唱片图片中心点在y轴方向上的距离 (也就是大唱片位置到小唱片位置，y轴的偏移量)
          return {
            x,
            y,
            scale
          }
        },
          /**
           * 切换播放和暂停
           * 调用mutations中的SET_PLAYING_STATE方法，传入playing状态的取反，如果播放就暂停，如果暂停就播放
           */
        togglePlaying() {
          if(!this.songReady) {
            return
          }
          this.setPlayingState(!this.playing)
        },
        changeMode() {
          let mode = (this.mode + 1) % 3; //this.mode值为0,1,2;加1就等于是切换到下一个模式，%3就能把结果限制在0,1,2这三个数
          this.setPlayMode(mode);
          let list = null;
          if(this.mode === playMode.random){
            list = shuffle(this.playlist)
          }else {
            list = this.sequenceList;
          }
          this.resetCurrentIndex(list);
          this.setPlayList(list);
        },
        /**
         * 根据当前正在播放的歌曲在新的播放列表中的位置来重置state中的currentIndex
         * 因为播放模式改变了，而state中的currentIndex是当前正在播放的歌曲在默认播放列表中的位置，所以需要找到当前正在播放的歌曲在新的歌曲列表中的位置来确定state中的currentIndex的值
         * findIndex 是ES6中的新语法
         */
        resetCurrentIndex(list) {
          let index = list.findIndex((item) => {
            return item.id === this.currentSong.id // 返回当前播放的歌曲在新的歌曲列表list中的位置index
          });
          this.setCurrentIndex(index);
        },
        ...mapMutations({
          setFullScreen: 'SET_FULL_SCREEN', // 将this.setFullScreen方法映射到mutations中的SET_FULL_SCREEN方法
          setPlayingState: 'SET_PLAYING_STATE',
          setCurrentIndex: 'SET_CURRENT_INDEX',
          setPlayMode: 'SET_PLAY_MODE',
          setPlayList: 'SET_PLAY_LIST'
        })
      },
      watch: {
        // 当song-list.vue组件中的歌曲被点击，会emit  music-list.vue组件中的select事件，触发selectItem()方法，该方法执行store/actions.js中的selectPlay()方法，该方法会改变store/state.js中的playing状态和currentSong状态，所以，当歌曲被点击时，会同时触发该watch对象的currentSong()和playing()，而这时播放页面也刚刚加载，audio DOM元素还没有准备就绪，就开始执行audio的播放或者暂停，就会报错，所以需要延时执行，使用下一帧执行

        /**
         * watch当前歌曲currentSong变化，就执行音乐的播放
         */
        currentSong(newSong, oldSong) {
          if(newSong.id === oldSong.id) { // 当切换播放模式执行changeMode函数时，会触发resetCurrentIndex改变当前播放歌曲的位置，就会改变currentSong，就会触发该currentSong的watch函数，不return的话，就会执行下面的语句，使原本暂停状态的歌曲开始播放了
            return;
          }
          this.$nextTick(() => { // audio DOM元素还没有准备好就执行play()方法会报错，所以这里给个延时，下一帧
            this.$refs.audio.play();
          })
        },
        playing(newPlaying) {
          const audio = this.$refs.audio;
          this.$nextTick(() => {
            newPlaying ? audio.play() : audio.pause()
          })
        },
      },
      components: {
        progressBar,
        progressCircle
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                box-sizing: border-box
                border: 10px solid rgba(255, 255, 255, 0.1)
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          width: 100%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
